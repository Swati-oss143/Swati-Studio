-- Run this once in Supabase SQL Editor.
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'user' check (role in ('user','admin')),
  created_at timestamptz default now()
);
alter table public.profiles enable row level security;
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public
as $$ begin
  insert into public.profiles (id, role) values (new.id, 'user') on conflict (id) do nothing;
  return new;
end; $$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
for each row execute procedure public.handle_new_user();
create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public
as $$ select exists(select 1 from public.profiles where id=auth.uid() and role='admin'); $$;
drop policy if exists "Users can read own profile" on public.profiles;
create policy "Users can read own profile" on public.profiles for select to authenticated using (id=auth.uid() or public.is_admin());
drop policy if exists "Admins can manage profiles" on public.profiles;
create policy "Admins can manage profiles" on public.profiles for all to authenticated using (public.is_admin()) with check (public.is_admin());
insert into public.profiles (id, role) select id,'admin' from auth.users where email='swatiniteshkhobragade@gmail.com' on conflict(id) do update set role='admin';
