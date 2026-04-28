-- Enable RLS (Row Level Security)
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Create custom types
CREATE TYPE property_source AS ENUM ('LEBONCOIN', 'SELOGER', 'PAP', 'PARUVENDU');
CREATE TYPE subscription_status AS ENUM ('TRIAL', 'ACTIVE', 'PAST_DUE', 'CANCELED', 'UNPAID');
CREATE TYPE alert_type AS ENUM ('NEW_MATCH', 'PRICE_DROP', 'PROPERTY_AVAILABLE');

-- Create users table (extends Supabase auth.users)
CREATE TABLE public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  stripe_customer_id TEXT UNIQUE,
  subscription_status subscription_status DEFAULT 'TRIAL'::subscription_status,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create clients table
CREATE TABLE public.clients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create search_criteria table
CREATE TABLE public.search_criteria (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE NOT NULL,
  budget_min INTEGER,
  budget_max INTEGER,
  cities TEXT[] DEFAULT '{}',
  surface_min INTEGER,
  surface_max INTEGER,
  rooms_min INTEGER,
  rooms_max INTEGER,
  must_have TEXT[] DEFAULT '{}',
  must_not_have TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create properties table
CREATE TABLE public.properties (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  source property_source NOT NULL,
  url TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  price INTEGER NOT NULL,
  city TEXT NOT NULL,
  surface INTEGER,
  rooms INTEGER,
  description TEXT,
  images TEXT[] DEFAULT '{}',
  raw_json JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create matches table
CREATE TABLE public.matches (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE NOT NULL,
  property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE NOT NULL,
  score REAL NOT NULL CHECK (score >= 0 AND score <= 100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(client_id, property_id)
);

-- Create alerts table
CREATE TABLE public.alerts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE NOT NULL,
  property_id UUID REFERENCES public.properties(id),
  type alert_type NOT NULL,
  message TEXT NOT NULL,
  sent BOOLEAN DEFAULT FALSE,
  sent_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create indexes for better performance
CREATE INDEX idx_properties_city ON public.properties(city);
CREATE INDEX idx_properties_price ON public.properties(price);
CREATE INDEX idx_properties_surface ON public.properties(surface);
CREATE INDEX idx_properties_rooms ON public.properties(rooms);
CREATE INDEX idx_properties_created_at ON public.properties(created_at);

CREATE INDEX idx_matches_score ON public.matches(score);
CREATE INDEX idx_matches_created_at ON public.matches(created_at);

CREATE INDEX idx_alerts_client_id ON public.alerts(client_id);
CREATE INDEX idx_alerts_sent ON public.alerts(sent);
CREATE INDEX idx_alerts_created_at ON public.alerts(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.search_criteria ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Users can only see their own data
CREATE POLICY "Users can view own user data" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own user data" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- Clients policies
CREATE POLICY "Users can view own clients" ON public.clients
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own clients" ON public.clients
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own clients" ON public.clients
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own clients" ON public.clients
  FOR DELETE USING (auth.uid() = user_id);

-- Search criteria policies
CREATE POLICY "Users can view search criteria for own clients" ON public.search_criteria
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.clients
      WHERE clients.id = search_criteria.client_id
      AND clients.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage search criteria for own clients" ON public.search_criteria
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.clients
      WHERE clients.id = search_criteria.client_id
      AND clients.user_id = auth.uid()
    )
  );

-- Properties are public (for scraping)
CREATE POLICY "Properties are viewable by everyone" ON public.properties
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert properties" ON public.properties
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Matches policies
CREATE POLICY "Users can view matches for own clients" ON public.matches
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.clients
      WHERE clients.id = matches.client_id
      AND clients.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage matches for own clients" ON public.matches
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.clients
      WHERE clients.id = matches.client_id
      AND clients.user_id = auth.uid()
    )
  );

-- Alerts policies
CREATE POLICY "Users can view alerts for own clients" ON public.alerts
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.clients
      WHERE clients.id = alerts.client_id
      AND clients.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage alerts for own clients" ON public.alerts
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.clients
      WHERE clients.id = alerts.client_id
      AND clients.user_id = auth.uid()
    )
  );

-- Create function to handle user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, name, email)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'name', NEW.email), NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create user profile
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();

CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON public.clients
  FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();

CREATE TRIGGER update_search_criteria_updated_at BEFORE UPDATE ON public.search_criteria
  FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();
