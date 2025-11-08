-- RLS, Realtime, and Storage Configuration
-- This migration ensures RLS is enabled, Realtime is configured, and Storage buckets exist

-- ============================================================================
-- EXTENSIONS
-- ============================================================================
-- Enable required extensions (idempotent)
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- ============================================================================
-- API LOGS TABLE (for webhook ingestion)
-- ============================================================================
create table if not exists public.api_logs (
  id uuid primary key default gen_random_uuid(),
  method text not null,
  path text not null,
  status_code integer,
  response_time_ms integer,
  user_id uuid references auth.users(id) on delete set null,
  ip_address inet,
  user_agent text,
  request_body jsonb,
  response_body jsonb,
  error_message text,
  created_at timestamptz default now()
);

create index if not exists idx_api_logs_created_at on public.api_logs(created_at desc);
create index if not exists idx_api_logs_user_id on public.api_logs(user_id) where user_id is not null;

-- ============================================================================
-- APP EVENTS TABLE (for telemetry/events)
-- ============================================================================
create table if not exists public.app_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  session_id text,
  app text default 'web',
  type text not null,
  path text,
  meta jsonb,
  created_at timestamptz default now()
);

create index if not exists idx_app_events_user_id on public.app_events(user_id) where user_id is not null;
create index if not exists idx_app_events_type on public.app_events(type);
create index if not exists idx_app_events_created_at on public.app_events(created_at desc);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS on all app tables
alter table public.api_logs enable row level security;
alter table public.app_events enable row level security;

-- API Logs: Users can only see their own logs, service role can see all
create policy "own_api_logs_read" on public.api_logs
  for select
  using (
    auth.uid() = user_id or
    (current_setting('request.jwt.claims', true)::json->>'role')::text = 'service_role'
  );

create policy "service_role_api_logs_write" on public.api_logs
  for insert
  with check (
    (current_setting('request.jwt.claims', true)::json->>'role')::text = 'service_role'
  );

-- App Events: Users can only see their own events, service role can see all
create policy "own_app_events_read" on public.app_events
  for select
  using (
    auth.uid() = user_id or
    (current_setting('request.jwt.claims', true)::json->>'role')::text = 'service_role'
  );

create policy "own_app_events_write" on public.app_events
  for insert
  with check (
    auth.uid() = user_id or
    (current_setting('request.jwt.claims', true)::json->>'role')::text = 'service_role'
  );

-- Ensure existing tables have RLS enabled (idempotent)
-- Profiles (from gamify migration)
do $$
begin
  if exists (select 1 from information_schema.tables where table_schema = 'public' and table_name = 'profiles') then
    alter table public.profiles enable row level security;
  end if;
end $$;

-- Journal entries
do $$
begin
  if exists (select 1 from information_schema.tables where table_schema = 'public' and table_name = 'journal_entries') then
    alter table public.journal_entries enable row level security;
  end if;
end $$;

-- Posts
do $$
begin
  if exists (select 1 from information_schema.tables where table_schema = 'public' and table_name = 'posts') then
    alter table public.posts enable row level security;
  end if;
end $$;

-- ============================================================================
-- REALTIME PUBLICATION
-- ============================================================================
-- Create publication if it doesn't exist
do $$
begin
  if not exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
    create publication supabase_realtime;
  end if;
end $$;

-- Add tables to realtime publication (idempotent)
-- Note: Only add tables that should broadcast changes
alter publication supabase_realtime add table if exists public.profiles;
alter publication supabase_realtime add table if exists public.posts;
alter publication supabase_realtime add table if exists public.journal_entries;
alter publication supabase_realtime add table if exists public.app_events;

-- ============================================================================
-- STORAGE BUCKETS
-- ============================================================================
-- Create public bucket (idempotent)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('public', 'public', true, 52428800, array['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf'])
on conflict (id) do nothing;

-- Create private bucket (idempotent)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('private', 'private', false, 52428800, array['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf', 'application/json'])
on conflict (id) do nothing;

-- ============================================================================
-- STORAGE POLICIES
-- ============================================================================

-- Public bucket: Anyone can read, authenticated users can upload
create policy "public_read" on storage.objects
  for select
  using (bucket_id = 'public');

create policy "public_upload" on storage.objects
  for insert
  with check (
    bucket_id = 'public' and
    auth.role() = 'authenticated'
  );

create policy "public_update_own" on storage.objects
  for update
  using (
    bucket_id = 'public' and
    auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "public_delete_own" on storage.objects
  for delete
  using (
    bucket_id = 'public' and
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Private bucket: Only owner can read/write
create policy "private_read_own" on storage.objects
  for select
  using (
    bucket_id = 'private' and
    auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "private_upload_own" on storage.objects
  for insert
  with check (
    bucket_id = 'private' and
    auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "private_update_own" on storage.objects
  for update
  using (
    bucket_id = 'private' and
    auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "private_delete_own" on storage.objects
  for delete
  using (
    bucket_id = 'private' and
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- ============================================================================
-- UPDATED_AT TRIGGERS
-- ============================================================================
-- Create function for updated_at trigger
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Add updated_at triggers to tables that need them (idempotent)
do $$
declare
  tbl record;
begin
  for tbl in
    select tablename from pg_tables
    where schemaname = 'public'
    and tablename in ('api_logs', 'app_events')
  loop
    execute format('
      drop trigger if exists set_updated_at_%I on public.%I;
      create trigger set_updated_at_%I
        before update on public.%I
        for each row
        execute function public.handle_updated_at();
    ', tbl.tablename, tbl.tablename, tbl.tablename, tbl.tablename);
  end loop;
end $$;
