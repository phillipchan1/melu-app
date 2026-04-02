-- INFRA-07: meal_plans table
-- Run in Supabase SQL Editor or via: supabase db push

CREATE TABLE IF NOT EXISTS public.meal_plans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved')),
  meals JSONB NOT NULL,
  generated_at TIMESTAMPTZ DEFAULT now(),
  approved_at TIMESTAMPTZ,
  week_start DATE NOT NULL
);

CREATE INDEX IF NOT EXISTS meal_plans_user_id_idx ON meal_plans(user_id);
CREATE INDEX IF NOT EXISTS meal_plans_week_start_idx ON meal_plans(week_start);
