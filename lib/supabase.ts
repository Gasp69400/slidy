import { createClient } from '@supabase/supabase-js'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// Client pour le navigateur (client-side)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Client pour le serveur (server-side) avec cookies
export function createServerSupabaseClient() {
  const cookieStore = cookies()

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options)
          })
        } catch {
          /* Server Component ou lecture seule */
        }
      },
    },
  })
}

// Client admin (seed, jobs) — absent si SUPABASE_SERVICE_ROLE_KEY n’est pas défini
export const supabaseAdmin = supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  : null

// Types pour TypeScript (générés automatiquement avec supabase gen types)
export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          name: string
          email: string
          stripe_customer_id: string | null
          subscription_status: 'TRIAL' | 'ACTIVE' | 'PAST_DUE' | 'CANCELED' | 'UNPAID'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          name: string
          email: string
          stripe_customer_id?: string | null
          subscription_status?: 'TRIAL' | 'ACTIVE' | 'PAST_DUE' | 'CANCELED' | 'UNPAID'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          stripe_customer_id?: string | null
          subscription_status?: 'TRIAL' | 'ACTIVE' | 'PAST_DUE' | 'CANCELED' | 'UNPAID'
          created_at?: string
          updated_at?: string
        }
      }
      clients: {
        Row: {
          id: string
          user_id: string
          first_name: string
          last_name: string
          email: string
          phone: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          first_name: string
          last_name: string
          email: string
          phone?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          first_name?: string
          last_name?: string
          email?: string
          phone?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      search_criteria: {
        Row: {
          id: string
          client_id: string
          budget_min: number | null
          budget_max: number | null
          cities: string[]
          surface_min: number | null
          surface_max: number | null
          rooms_min: number | null
          rooms_max: number | null
          must_have: string[]
          must_not_have: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          client_id: string
          budget_min?: number | null
          budget_max?: number | null
          cities?: string[]
          surface_min?: number | null
          surface_max?: number | null
          rooms_min?: number | null
          rooms_max?: number | null
          must_have?: string[]
          must_not_have?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          client_id?: string
          budget_min?: number | null
          budget_max?: number | null
          cities?: string[]
          surface_min?: number | null
          surface_max?: number | null
          rooms_min?: number | null
          rooms_max?: number | null
          must_have?: string[]
          must_not_have?: string[]
          created_at?: string
          updated_at?: string
        }
      }
      properties: {
        Row: {
          id: string
          source: 'LEBONCOIN' | 'SELOGER' | 'PAP' | 'PARUVENDU'
          url: string
          title: string
          price: number
          city: string
          surface: number | null
          rooms: number | null
          description: string | null
          images: string[]
          raw_json: any | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          source: 'LEBONCOIN' | 'SELOGER' | 'PAP' | 'PARUVENDU'
          url: string
          title: string
          price: number
          city: string
          surface?: number | null
          rooms?: number | null
          description?: string | null
          images?: string[]
          raw_json?: any | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          source?: 'LEBONCOIN' | 'SELOGER' | 'PAP' | 'PARUVENDU'
          url?: string
          title?: string
          price?: number
          city?: string
          surface?: number | null
          rooms?: number | null
          description?: string | null
          images?: string[]
          raw_json?: any | null
          created_at?: string
          updated_at?: string
        }
      }
      matches: {
        Row: {
          id: string
          client_id: string
          property_id: string
          score: number
          created_at: string
        }
        Insert: {
          id?: string
          client_id: string
          property_id: string
          score: number
          created_at?: string
        }
        Update: {
          id?: string
          client_id?: string
          property_id?: string
          score?: number
          created_at?: string
        }
      }
      alerts: {
        Row: {
          id: string
          client_id: string
          property_id: string | null
          type: 'NEW_MATCH' | 'PRICE_DROP' | 'PROPERTY_AVAILABLE'
          message: string
          sent: boolean
          sent_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          client_id: string
          property_id?: string | null
          type: 'NEW_MATCH' | 'PRICE_DROP' | 'PROPERTY_AVAILABLE'
          message: string
          sent?: boolean
          sent_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          client_id?: string
          property_id?: string | null
          type?: 'NEW_MATCH' | 'PRICE_DROP' | 'PROPERTY_AVAILABLE'
          message?: string
          sent?: boolean
          sent_at?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      property_source: 'LEBONCOIN' | 'SELOGER' | 'PAP' | 'PARUVENDU'
      subscription_status: 'TRIAL' | 'ACTIVE' | 'PAST_DUE' | 'CANCELED' | 'UNPAID'
      alert_type: 'NEW_MATCH' | 'PRICE_DROP' | 'PROPERTY_AVAILABLE'
    }
  }
}
