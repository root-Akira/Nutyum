ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "is_coming_soon" boolean DEFAULT false;
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "launch_date" text;
