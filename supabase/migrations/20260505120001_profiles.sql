create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  username text unique not null,
  email text not null
);

alter table public.profiles enable row level security;

-- Users can view their own profile
create policy "Users can view own profile" on public.profiles
for select using (auth.uid() = id);

-- Function to look up email by username for login
create or replace function public.get_email_by_username(p_username text)
returns text as $$
declare
  v_email text;
begin
  select email into v_email from public.profiles where username = p_username;
  return v_email;
end;
$$ language plpgsql security definer set search_path = public;

-- Trigger to sync profiles
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'username', 'user_' || split_part(new.id::text, '-', 1)),
    new.email
  );
  return new;
end;
$$ language plpgsql security definer set search_path = public;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
