-- User dinner staples (first-class list; synced from onboarding and editable in-app)

create table if not exists public.staples (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  cuisine text not null,
  library_meal_id text,
  complexity_tier text,
  is_custom boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists staples_user_id_idx on public.staples (user_id);
create index if not exists staples_user_sort_idx on public.staples (user_id, sort_order);

alter table public.staples enable row level security;

drop policy if exists "Users can read own staples" on public.staples;
drop policy if exists "Users can insert own staples" on public.staples;
drop policy if exists "Users can update own staples" on public.staples;
drop policy if exists "Users can delete own staples" on public.staples;

create policy "Users can read own staples"
  on public.staples for select
  using (auth.uid() = user_id);

create policy "Users can insert own staples"
  on public.staples for insert
  with check (auth.uid() = user_id);

create policy "Users can update own staples"
  on public.staples for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete own staples"
  on public.staples for delete
  using (auth.uid() = user_id);
