-- Badges table for admin-managed product badges
CREATE TABLE IF NOT EXISTS badges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  label text NOT NULL,
  slug text NOT NULL UNIQUE,
  color text DEFAULT '#173D22',
  is_active boolean DEFAULT true,
  created_at timestamp DEFAULT now()
);

-- Seed default badges
INSERT INTO badges (label, slug, color, is_active) VALUES
  ('NEW', 'new', '#173D22', true),
  ('BESTSELLER', 'bestseller', '#173D22', true),
  ('COMING SOON', 'coming-soon', '#4C5A48', true)
ON CONFLICT (slug) DO NOTHING;
