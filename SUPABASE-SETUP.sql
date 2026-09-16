-- Required tables/role setup for Swati Studio.
create table if not exists public.profiles (id uuid primary key references auth.users(id) on delete cascade, display_name text, role text not null default 'user' check (role in ('user','admin')), created_at timestamptz default now());
create table if not exists public.projects (id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade, title text not null, created_at timestamptz default now());
alter table public.profiles enable row level security; alter table public.projects enable row level security;
create policy "Users read own profile" on public.profiles for select using (auth.uid()=id);
create policy "Users read own projects" on public.projects for select using (auth.uid()=user_id);
create policy "Users insert own projects" on public.projects for insert with check (auth.uid()=user_id);
-- After creating your own account, promote it manually in Supabase SQL editor:
-- update public.profiles set role='admin' where id=(select id from auth.users where email='YOUR_ADMIN_EMAIL');

-- Extended module starter tables. Review policies before production use.
create table if not exists public.staff (id uuid primary key default gen_random_uuid(), user_id uuid references auth.users(id) on delete cascade, role text not null check (role in ('manager','operator','support')), created_at timestamptz default now());
create table if not exists public.services (id uuid primary key default gen_random_uuid(), name text not null, category text, description text, active boolean not null default true, created_at timestamptz default now());
create table if not exists public.wallet_transactions (id uuid primary key default gen_random_uuid(), user_id uuid references auth.users(id) on delete cascade, amount numeric not null default 0, kind text not null, created_at timestamptz default now());
create table if not exists public.support_tickets (id uuid primary key default gen_random_uuid(), user_id uuid references auth.users(id) on delete cascade, subject text not null, status text not null default 'open', created_at timestamptz default now());
create table if not exists public.audit_logs (id uuid primary key default gen_random_uuid(), actor_id uuid references auth.users(id), action text not null, target text, created_at timestamptz default now());
