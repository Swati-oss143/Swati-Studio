-- Required tables/role setup for Swati Studio.
create table if not exists public.profiles (id uuid primary key references auth.users(id) on delete cascade, display_name text, role text not null default 'user' check (role in ('user','admin')), created_at timestamptz default now());
create table if not exists public.projects (id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade, title text not null, created_at timestamptz default now());
alter table public.profiles enable row level security; alter table public.projects enable row level security;
create policy "Users read own profile" on public.profiles for select using (auth.uid()=id);
create policy "Users read own projects" on public.projects for select using (auth.uid()=user_id);
create policy "Users insert own projects" on public.projects for insert with check (auth.uid()=user_id);
-- After creating your own account, promote it manually in Supabase SQL editor:
-- update public.profiles set role='admin' where id=(select id from auth.users where email='YOUR_ADMIN_EMAIL');
