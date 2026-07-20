-- Migration 002: Add payment and shipping columns to orders + order_status_logs

ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS email text,
  ADD COLUMN IF NOT EXISTS phone text,
  ADD COLUMN IF NOT EXISTS discount_amount integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS coupon_code text,
  ADD COLUMN IF NOT EXISTS shipping_address jsonb,
  ADD COLUMN IF NOT EXISTS razorpay_order_id text,
  ADD COLUMN IF NOT EXISTS razorpay_payment_id text,
  ADD COLUMN IF NOT EXISTS razorpay_signature text;

ALTER TABLE order_items
  ADD COLUMN IF NOT EXISTS variant_id text,
  ADD COLUMN IF NOT EXISTS variant_name text,
  ADD COLUMN IF NOT EXISTS product_name text,
  ADD COLUMN IF NOT EXISTS product_image text;

CREATE TABLE IF NOT EXISTS order_status_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id),
  status text NOT NULL,
  note text,
  created_at timestamp DEFAULT now()
);
