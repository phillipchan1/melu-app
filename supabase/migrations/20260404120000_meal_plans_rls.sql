-- Client reads approved plan count on MeluSnapshot (profile mode).
ALTER TABLE public.meal_plans ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own meal_plans" ON public.meal_plans;

CREATE POLICY "Users can read own meal_plans"
  ON public.meal_plans FOR SELECT
  USING (auth.uid() = user_id);
