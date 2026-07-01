CREATE TABLE IF NOT EXISTS "wishlist" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"product_id" text NOT NULL,
	"product_data" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now(),
	UNIQUE("user_id", "product_id")
);

ALTER TABLE "addresses" ADD COLUMN IF NOT EXISTS "is_default" boolean DEFAULT false;
