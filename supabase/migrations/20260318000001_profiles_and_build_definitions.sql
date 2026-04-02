-- INFRA-04: Profiles table + Build definitions seed
-- Run in Supabase SQL Editor or via: supabase db push

-- profiles: one row per user, stores latest chef card (replace on retake)
create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  chef_card jsonb not null default '{}',
  onboarding_answers jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id)
);

-- RLS: users can only read/write their own profile
alter table public.profiles enable row level security;

drop policy if exists "Users can read own profile" on public.profiles;
drop policy if exists "Users can insert own profile" on public.profiles;
drop policy if exists "Users can update own profile" on public.profiles;

create policy "Users can read own profile"
  on public.profiles for select
  using (auth.uid() = user_id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = user_id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- build_definitions: static reference for 20 Chef Card combos (from spec)
create table if not exists public.build_definitions (
  build_name text primary key,
  primary_dimension text not null,
  secondary_dimension text not null,
  description text,
  comp_1 jsonb,
  comp_2 jsonb,
  comp_3 jsonb,
  header_theme text,
  skill_signal text
);

alter table public.build_definitions enable row level security;

drop policy if exists "Build definitions are readable by all" on public.build_definitions;

create policy "Build definitions are readable by all"
  on public.build_definitions for select
  using (true);

-- Seed build_definitions (from onboardingScoring BUILD_NAMES)
insert into public.build_definitions (build_name, primary_dimension, secondary_dimension, description, skill_signal) values
  ('The Dependable Dash', 'Comfort', 'Speed', 'You balance comfort with reliability. Weeknight dinners are your strength.', 'Weeknight Warrior'),
  ('The Safe Bet with a Kick', 'Comfort', 'Boldness', 'You stick to what works but aren''t afraid of flavor. Comfort with a twist.', 'Home Cook'),
  ('The Homebody Who Wanders', 'Comfort', 'Discovery', 'You love home cooking but enjoy exploring new dishes when the mood strikes.', 'Home Cook'),
  ('The Clean Plate Keeper', 'Comfort', 'Nourishment', 'You prioritize wholesome, familiar meals that everyone enjoys.', 'Home Cook'),
  ('The Fast Lane Regular', 'Speed', 'Comfort', 'You get dinner on the table quickly without sacrificing taste.', 'Weeknight Warrior'),
  ('The Quick Fire', 'Speed', 'Boldness', 'You bring bold flavors to the table in record time.', 'Weeknight Warrior'),
  ('The Speedy Adventurer', 'Speed', 'Discovery', 'You love trying new things and doing it fast.', 'Weeknight Warrior'),
  ('The Efficient Nourisher', 'Speed', 'Nourishment', 'You make healthy meals happen even on busy nights.', 'Weeknight Warrior'),
  ('The Spicy Traditionalist', 'Boldness', 'Comfort', 'You love bold flavors rooted in familiar traditions.', 'Home Cook'),
  ('The Wok Boss', 'Boldness', 'Speed', 'You bring restaurant-quality flavor to weeknight dinners.', 'Aspiring Chef'),
  ('The Flavor Explorer', 'Boldness', 'Discovery', 'You chase bold, new flavors and aren''t afraid to experiment.', 'Aspiring Chef'),
  ('The Conscious Heat Seeker', 'Boldness', 'Nourishment', 'You balance bold flavors with mindful eating.', 'Home Cook'),
  ('The Curious Homecook', 'Discovery', 'Comfort', 'You love learning new recipes while keeping comfort close.', 'Home Cook'),
  ('The Full Send', 'Discovery', 'Boldness', 'You go all in on new, bold flavors. Adventure is the goal.', 'Aspiring Chef'),
  ('The Fast Curious', 'Discovery', 'Speed', 'You explore new dishes without spending hours in the kitchen.', 'Weeknight Warrior'),
  ('The Intentional Explorer', 'Discovery', 'Nourishment', 'You seek out new, wholesome recipes that nourish and inspire.', 'Home Cook'),
  ('The Wholesome Regular', 'Nourishment', 'Comfort', 'You prioritize healthy, familiar meals that feel good.', 'Home Cook'),
  ('The Mindful Flavor Chaser', 'Nourishment', 'Boldness', 'You combine nutrition with bold, satisfying flavors.', 'Home Cook'),
  ('The Clean Plate Adventurer', 'Nourishment', 'Discovery', 'You explore new healthy recipes and love the journey.', 'Aspiring Chef')
on conflict (build_name) do nothing;
