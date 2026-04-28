-- Ensure CV storage table exists in public schema.
-- This migration is safe to run multiple times.

do $$
begin
  if to_regclass('public.cv_documents') is null
     and to_regclass('public.cv_document') is not null then
    execute 'alter table public.cv_document rename to cv_documents';
  end if;
end $$;

create table if not exists public.cv_documents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  content jsonb not null default '{}'::jsonb,
  title text not null default '',
  topic text not null default '',
  template_slug text,
  design_options jsonb not null default '{}'::jsonb,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.cv_documents
  add column if not exists content jsonb not null default '{}'::jsonb;
alter table public.cv_documents
  add column if not exists title text not null default '';
alter table public.cv_documents
  add column if not exists topic text not null default '';
alter table public.cv_documents
  add column if not exists template_slug text;
alter table public.cv_documents
  add column if not exists design_options jsonb not null default '{}'::jsonb;
alter table public.cv_documents
  add column if not exists metadata jsonb not null default '{}'::jsonb;
alter table public.cv_documents
  add column if not exists created_at timestamptz not null default now();
alter table public.cv_documents
  add column if not exists updated_at timestamptz not null default now();

create index if not exists cv_documents_user_created_idx
  on public.cv_documents (user_id, created_at desc);

alter table public.cv_documents enable row level security;

drop policy if exists "cv_documents_select_own" on public.cv_documents;
create policy "cv_documents_select_own"
  on public.cv_documents for select
  using (auth.uid() = user_id);

drop policy if exists "cv_documents_insert_own" on public.cv_documents;
create policy "cv_documents_insert_own"
  on public.cv_documents for insert
  with check (auth.uid() = user_id);

drop policy if exists "cv_documents_update_own" on public.cv_documents;
create policy "cv_documents_update_own"
  on public.cv_documents for update
  using (auth.uid() = user_id);

drop policy if exists "cv_documents_delete_own" on public.cv_documents;
create policy "cv_documents_delete_own"
  on public.cv_documents for delete
  using (auth.uid() = user_id);

grant select, insert, update, delete on public.cv_documents to authenticated;
