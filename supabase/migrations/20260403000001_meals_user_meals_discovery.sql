-- Catalog meals (aligns with rotation-meal-library.json slugs). IDs are uuid v5 in namespace 6ba7b811-9dad-11d1-80b4-00c04fd430c8.
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS public.meals (
  id UUID PRIMARY KEY,
  catalog_slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  cuisine TEXT NOT NULL
);

ALTER TABLE public.meals ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Meals catalog readable by authenticated users" ON public.meals;
CREATE POLICY "Meals catalog readable by authenticated users"
  ON public.meals FOR SELECT
  TO authenticated
  USING (true);

INSERT INTO public.meals (id, catalog_slug, name, cuisine)
SELECT uuid_generate_v5('6ba7b811-9dad-11d1-80b4-00c04fd430c8'::uuid, 'tacos'), 'tacos', 'Tacos', 'Mexican'
UNION ALL
SELECT uuid_generate_v5('6ba7b811-9dad-11d1-80b4-00c04fd430c8'::uuid, 'enchiladas'), 'enchiladas', 'Enchiladas', 'Mexican'
UNION ALL
SELECT uuid_generate_v5('6ba7b811-9dad-11d1-80b4-00c04fd430c8'::uuid, 'burrito-bowl'), 'burrito-bowl', 'Burrito bowl', 'Mexican'
UNION ALL
SELECT uuid_generate_v5('6ba7b811-9dad-11d1-80b4-00c04fd430c8'::uuid, 'quesadillas'), 'quesadillas', 'Quesadillas', 'Mexican'
UNION ALL
SELECT uuid_generate_v5('6ba7b811-9dad-11d1-80b4-00c04fd430c8'::uuid, 'spaghetti-marinara'), 'spaghetti-marinara', 'Spaghetti marinara', 'Italian'
UNION ALL
SELECT uuid_generate_v5('6ba7b811-9dad-11d1-80b4-00c04fd430c8'::uuid, 'penne-arrabbiata'), 'penne-arrabbiata', 'Penne arrabbiata', 'Italian'
UNION ALL
SELECT uuid_generate_v5('6ba7b811-9dad-11d1-80b4-00c04fd430c8'::uuid, 'cacio-e-pepe'), 'cacio-e-pepe', 'Cacio e pepe', 'Italian'
UNION ALL
SELECT uuid_generate_v5('6ba7b811-9dad-11d1-80b4-00c04fd430c8'::uuid, 'chicken-parm'), 'chicken-parm', 'Chicken parmesan', 'Italian'
UNION ALL
SELECT uuid_generate_v5('6ba7b811-9dad-11d1-80b4-00c04fd430c8'::uuid, 'lasagna'), 'lasagna', 'Lasagna', 'Italian'
UNION ALL
SELECT uuid_generate_v5('6ba7b811-9dad-11d1-80b4-00c04fd430c8'::uuid, 'pizza-homemade'), 'pizza-homemade', 'Homemade pizza', 'Italian'
UNION ALL
SELECT uuid_generate_v5('6ba7b811-9dad-11d1-80b4-00c04fd430c8'::uuid, 'grilled-cheese'), 'grilled-cheese', 'Grilled cheese', 'American'
UNION ALL
SELECT uuid_generate_v5('6ba7b811-9dad-11d1-80b4-00c04fd430c8'::uuid, 'burgers'), 'burgers', 'Burgers', 'American'
UNION ALL
SELECT uuid_generate_v5('6ba7b811-9dad-11d1-80b4-00c04fd430c8'::uuid, 'mac-cheese'), 'mac-cheese', 'Mac and cheese', 'American'
UNION ALL
SELECT uuid_generate_v5('6ba7b811-9dad-11d1-80b4-00c04fd430c8'::uuid, 'fried-chicken'), 'fried-chicken', 'Fried chicken', 'American'
UNION ALL
SELECT uuid_generate_v5('6ba7b811-9dad-11d1-80b4-00c04fd430c8'::uuid, 'bbq-ribs'), 'bbq-ribs', 'BBQ ribs', 'American'
UNION ALL
SELECT uuid_generate_v5('6ba7b811-9dad-11d1-80b4-00c04fd430c8'::uuid, 'meatloaf'), 'meatloaf', 'Meatloaf', 'American'
UNION ALL
SELECT uuid_generate_v5('6ba7b811-9dad-11d1-80b4-00c04fd430c8'::uuid, 'pot-roast'), 'pot-roast', 'Pot roast', 'American'
UNION ALL
SELECT uuid_generate_v5('6ba7b811-9dad-11d1-80b4-00c04fd430c8'::uuid, 'salmon-baked'), 'salmon-baked', 'Baked salmon', 'American'
UNION ALL
SELECT uuid_generate_v5('6ba7b811-9dad-11d1-80b4-00c04fd430c8'::uuid, 'tuna-casserole'), 'tuna-casserole', 'Tuna casserole', 'American'
UNION ALL
SELECT uuid_generate_v5('6ba7b811-9dad-11d1-80b4-00c04fd430c8'::uuid, 'stir-fry'), 'stir-fry', 'Chicken stir-fry', 'Asian'
UNION ALL
SELECT uuid_generate_v5('6ba7b811-9dad-11d1-80b4-00c04fd430c8'::uuid, 'fried-rice'), 'fried-rice', 'Fried rice', 'Asian'
UNION ALL
SELECT uuid_generate_v5('6ba7b811-9dad-11d1-80b4-00c04fd430c8'::uuid, 'teriyaki-chicken'), 'teriyaki-chicken', 'Teriyaki chicken', 'Asian'
UNION ALL
SELECT uuid_generate_v5('6ba7b811-9dad-11d1-80b4-00c04fd430c8'::uuid, 'beef-broccoli'), 'beef-broccoli', 'Beef and broccoli', 'Asian'
UNION ALL
SELECT uuid_generate_v5('6ba7b811-9dad-11d1-80b4-00c04fd430c8'::uuid, 'pad-thai'), 'pad-thai', 'Pad Thai', 'Asian'
UNION ALL
SELECT uuid_generate_v5('6ba7b811-9dad-11d1-80b4-00c04fd430c8'::uuid, 'thai-green-curry'), 'thai-green-curry', 'Thai green curry', 'Asian'
UNION ALL
SELECT uuid_generate_v5('6ba7b811-9dad-11d1-80b4-00c04fd430c8'::uuid, 'ramen'), 'ramen', 'Ramen', 'Asian'
UNION ALL
SELECT uuid_generate_v5('6ba7b811-9dad-11d1-80b4-00c04fd430c8'::uuid, 'sushi-night'), 'sushi-night', 'Sushi night', 'Asian'
UNION ALL
SELECT uuid_generate_v5('6ba7b811-9dad-11d1-80b4-00c04fd430c8'::uuid, 'bibimbap'), 'bibimbap', 'Bibimbap', 'Asian'
UNION ALL
SELECT uuid_generate_v5('6ba7b811-9dad-11d1-80b4-00c04fd430c8'::uuid, 'korean-bbq'), 'korean-bbq', 'Korean BBQ', 'Asian'
UNION ALL
SELECT uuid_generate_v5('6ba7b811-9dad-11d1-80b4-00c04fd430c8'::uuid, 'butter-chicken'), 'butter-chicken', 'Butter chicken', 'Indian'
UNION ALL
SELECT uuid_generate_v5('6ba7b811-9dad-11d1-80b4-00c04fd430c8'::uuid, 'chicken-tikka'), 'chicken-tikka', 'Chicken tikka masala', 'Indian'
UNION ALL
SELECT uuid_generate_v5('6ba7b811-9dad-11d1-80b4-00c04fd430c8'::uuid, 'dal'), 'dal', 'Dal with rice', 'Indian'
UNION ALL
SELECT uuid_generate_v5('6ba7b811-9dad-11d1-80b4-00c04fd430c8'::uuid, 'chana-masala'), 'chana-masala', 'Chana masala', 'Indian'
UNION ALL
SELECT uuid_generate_v5('6ba7b811-9dad-11d1-80b4-00c04fd430c8'::uuid, 'falafel-bowl'), 'falafel-bowl', 'Falafel bowl', 'Middle Eastern'
UNION ALL
SELECT uuid_generate_v5('6ba7b811-9dad-11d1-80b4-00c04fd430c8'::uuid, 'shawarma'), 'shawarma', 'Chicken shawarma', 'Middle Eastern'
UNION ALL
SELECT uuid_generate_v5('6ba7b811-9dad-11d1-80b4-00c04fd430c8'::uuid, 'greek-salad'), 'greek-salad', 'Greek salad with chicken', 'Greek'
UNION ALL
SELECT uuid_generate_v5('6ba7b811-9dad-11d1-80b4-00c04fd430c8'::uuid, 'moussaka'), 'moussaka', 'Moussaka', 'Greek'
UNION ALL
SELECT uuid_generate_v5('6ba7b811-9dad-11d1-80b4-00c04fd430c8'::uuid, 'fish-tacos'), 'fish-tacos', 'Fish tacos', 'Mexican'
UNION ALL
SELECT uuid_generate_v5('6ba7b811-9dad-11d1-80b4-00c04fd430c8'::uuid, 'carnitas'), 'carnitas', 'Carnitas', 'Mexican'
UNION ALL
SELECT uuid_generate_v5('6ba7b811-9dad-11d1-80b4-00c04fd430c8'::uuid, 'fajitas'), 'fajitas', 'Chicken fajitas', 'Mexican'
UNION ALL
SELECT uuid_generate_v5('6ba7b811-9dad-11d1-80b4-00c04fd430c8'::uuid, 'chili'), 'chili', 'Chili', 'American'
UNION ALL
SELECT uuid_generate_v5('6ba7b811-9dad-11d1-80b4-00c04fd430c8'::uuid, 'soup-sandwich'), 'soup-sandwich', 'Soup and sandwich', 'American'
UNION ALL
SELECT uuid_generate_v5('6ba7b811-9dad-11d1-80b4-00c04fd430c8'::uuid, 'breakfast-dinner'), 'breakfast-dinner', 'Breakfast for dinner', 'American'
UNION ALL
SELECT uuid_generate_v5('6ba7b811-9dad-11d1-80b4-00c04fd430c8'::uuid, 'sheet-pan-chicken'), 'sheet-pan-chicken', 'Sheet pan chicken and veggies', 'Mediterranean'
UNION ALL
SELECT uuid_generate_v5('6ba7b811-9dad-11d1-80b4-00c04fd430c8'::uuid, 'med-bowl'), 'med-bowl', 'Mediterranean grain bowl', 'Mediterranean'
UNION ALL
SELECT uuid_generate_v5('6ba7b811-9dad-11d1-80b4-00c04fd430c8'::uuid, 'salmon-pesto'), 'salmon-pesto', 'Salmon with pesto', 'Mediterranean'
UNION ALL
SELECT uuid_generate_v5('6ba7b811-9dad-11d1-80b4-00c04fd430c8'::uuid, 'roast-chicken'), 'roast-chicken', 'Roast chicken', 'French'
UNION ALL
SELECT uuid_generate_v5('6ba7b811-9dad-11d1-80b4-00c04fd430c8'::uuid, 'coq-au-vin'), 'coq-au-vin', 'Coq au vin', 'French'
UNION ALL
SELECT uuid_generate_v5('6ba7b811-9dad-11d1-80b4-00c04fd430c8'::uuid, 'steak-frites'), 'steak-frites', 'Steak frites', 'French'
UNION ALL
SELECT uuid_generate_v5('6ba7b811-9dad-11d1-80b4-00c04fd430c8'::uuid, 'pho'), 'pho', 'Pho', 'Asian'
UNION ALL
SELECT uuid_generate_v5('6ba7b811-9dad-11d1-80b4-00c04fd430c8'::uuid, 'banh-mi'), 'banh-mi', 'Banh mi bowls', 'Asian'
UNION ALL
SELECT uuid_generate_v5('6ba7b811-9dad-11d1-80b4-00c04fd430c8'::uuid, 'jambalaya'), 'jambalaya', 'Jambalaya', 'American'
UNION ALL
SELECT uuid_generate_v5('6ba7b811-9dad-11d1-80b4-00c04fd430c8'::uuid, 'gumbo'), 'gumbo', 'Gumbo', 'American'
UNION ALL
SELECT uuid_generate_v5('6ba7b811-9dad-11d1-80b4-00c04fd430c8'::uuid, 'tofu-stirfry'), 'tofu-stirfry', 'Tofu stir-fry', 'Asian'
UNION ALL
SELECT uuid_generate_v5('6ba7b811-9dad-11d1-80b4-00c04fd430c8'::uuid, 'veggie-tacos'), 'veggie-tacos', 'Veggie tacos', 'Mexican'
UNION ALL
SELECT uuid_generate_v5('6ba7b811-9dad-11d1-80b4-00c04fd430c8'::uuid, 'caesar-salad'), 'caesar-salad', 'Caesar salad with protein', 'American'
UNION ALL
SELECT uuid_generate_v5('6ba7b811-9dad-11d1-80b4-00c04fd430c8'::uuid, 'cobb-salad'), 'cobb-salad', 'Cobb salad', 'American'
UNION ALL
SELECT uuid_generate_v5('6ba7b811-9dad-11d1-80b4-00c04fd430c8'::uuid, 'hot-dogs'), 'hot-dogs', 'Hot dogs and sides', 'American'
UNION ALL
SELECT uuid_generate_v5('6ba7b811-9dad-11d1-80b4-00c04fd430c8'::uuid, 'sloppy-joes'), 'sloppy-joes', 'Sloppy Joes', 'American'
UNION ALL
SELECT uuid_generate_v5('6ba7b811-9dad-11d1-80b4-00c04fd430c8'::uuid, 'shepherds-pie'), 'shepherds-pie', 'Shepherd''s pie', 'American'
UNION ALL
SELECT uuid_generate_v5('6ba7b811-9dad-11d1-80b4-00c04fd430c8'::uuid, 'tikka-veggie'), 'tikka-veggie', 'Vegetable tikka masala', 'Indian'
UNION ALL
SELECT uuid_generate_v5('6ba7b811-9dad-11d1-80b4-00c04fd430c8'::uuid, 'poke-bowl'), 'poke-bowl', 'Poke bowl', 'Asian'
UNION ALL
SELECT uuid_generate_v5('6ba7b811-9dad-11d1-80b4-00c04fd430c8'::uuid, 'hawaiian-plate'), 'hawaiian-plate', 'Hawaiian plate lunch', 'American'
ON CONFLICT (catalog_slug) DO NOTHING;

-- user_meals: rotation staples vs aspirations (single table, type discriminant)
CREATE TABLE IF NOT EXISTS public.user_meals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  meal_id UUID NOT NULL REFERENCES public.meals(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('rotation', 'aspiration')),
  source TEXT NOT NULL CHECK (source IN ('onboarding', 'manual', 'approved_plan')),
  added_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, meal_id, type)
);

CREATE INDEX IF NOT EXISTS idx_user_meals_user_id ON public.user_meals(user_id);
CREATE INDEX IF NOT EXISTS idx_user_meals_type ON public.user_meals(type);

ALTER TABLE public.user_meals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own user_meals"
  ON public.user_meals FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own user_meals"
  ON public.user_meals FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own user_meals"
  ON public.user_meals FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own user_meals"
  ON public.user_meals FOR DELETE
  USING (auth.uid() = user_id);

-- profiles.discovery_pace: 1–5 how aggressively aspiration meals enter the weekly plan
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS discovery_pace INTEGER DEFAULT 3 CHECK (discovery_pace BETWEEN 1 AND 5);

-- meal_plans.meals JSONB: each object must include source_type "rotation" | "aspiration" (enforced in app / middleware).
COMMENT ON COLUMN public.meal_plans.meals IS 'JSON array of plan meals. Each object must include source_type: rotation | aspiration (PG-01).';
