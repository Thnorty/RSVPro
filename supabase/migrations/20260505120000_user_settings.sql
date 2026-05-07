create table public.user_settings (
  user_id uuid references auth.users on delete cascade not null primary key,
  wpm integer default 400
);

-- Enable RLS
alter table public.user_settings enable row level security;

-- Create Policies
create policy "Users can view own settings" 
on public.user_settings for select 
using (auth.uid() = user_id);

create policy "Users can insert own settings" 
on public.user_settings for insert 
with check (auth.uid() = user_id);

create policy "Users can update own settings" 
on public.user_settings for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
