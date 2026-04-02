-- Runs after 20260403000001_meals_user_meals_discovery.sql (user_meals + type check).
ALTER TABLE public.user_meals
  DROP CONSTRAINT IF EXISTS user_meals_type_check;

UPDATE public.user_meals
  SET type = 'staple' WHERE type = 'rotation';

ALTER TABLE public.user_meals
  ADD CONSTRAINT user_meals_type_check
  CHECK (type IN ('staple', 'aspiration'));
