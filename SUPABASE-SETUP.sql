-- Run this in Supabase SQL Editor if you need a basic profile table.
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  role text not null default 'user' check (role in ('user','admin')),
  created_at timestamptz not null default now()
);
alter table public.profiles enable row level security;
create policy if not exists "Users can read own profile" on public.profiles for select using (auth.uid() = id);
create policy if not exists "Users can insert own profile" on public.profiles for insert with check (auth.uid() = id);
