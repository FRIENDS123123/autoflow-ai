create table if not exists public.automations (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  description text default '',
  prompt text not null,
  nodes jsonb not null default '[]',
  apps text[] not null default '{}',
  steps_count integer not null default 0,
  status text not null default 'active',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.automations enable row level security;

create policy "Users can view own automations" on public.automations
  for select using (auth.uid() = user_id);

create policy "Users can insert own automations" on public.automations
  for insert with check (auth.uid() = user_id);

create policy "Users can update own automations" on public.automations
  for update using (auth.uid() = user_id);

create policy "Users can delete own automations" on public.automations
  for delete using (auth.uid() = user_id);
