-- Seed data for the baby ecommerce store (Adjusted & simplified)
-- Run AFTER running schema script in database/pgadmin-setup.sql
-- This version is idempotent (safe to re-run). Schema differences fixed:
--   * categories has column "image" (NOT image_url)
--   * products does NOT have safety_certifications, materials arrays
--   * products has column material (singular) and optional cost_price, etc.
--   * product_images table has no is_primary column
--   * coupons.type only allows 'percentage' | 'fixed'

-- Simpler approach: rely on default UUID. If you want fixed UUIDs, add '::uuid' casts explicitly.
INSERT INTO categories (name, slug, description, image, parent_id, sort_order)
VALUES
  ('Baby Toys', 'baby-toys', 'Safe and educational toys for babies and toddlers', '/images/categories/baby-toys.jpg', NULL, 1),
  ('Feeding', 'feeding', 'Bottles, bibs, and feeding accessories', '/images/categories/feeding.jpg', NULL, 2),
  ('Clothing', 'clothing', 'Comfortable and cute baby clothing', '/images/categories/clothing.jpg', NULL, 3),
  ('Bath & Care', 'bath-care', 'Bath time essentials and baby care products', '/images/categories/bath-care.jpg', NULL, 4),
  ('Nursery', 'nursery', 'Furniture and decor for baby nursery', '/images/categories/nursery.jpg', NULL, 5)
ON CONFLICT (slug) DO NOTHING;

-- Child categories referencing parent by slug (insert only if parent exists)
INSERT INTO categories (name, slug, description, image, parent_id, sort_order)
SELECT 'Soft Toys', 'soft-toys', 'Cuddly and safe soft toys', '/images/categories/soft-toys.jpg', c.id, 1
FROM categories c WHERE c.slug = 'baby-toys'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO categories (name, slug, description, image, parent_id, sort_order)
SELECT 'Educational Toys', 'educational-toys', 'Learning and development toys', '/images/categories/educational-toys.jpg', c.id, 2
FROM categories c WHERE c.slug = 'baby-toys'
ON CONFLICT (slug) DO NOTHING;

-- Products: use category slug lookups; let UUID default generate.
INSERT INTO products (name, slug, description, short_description, price, compare_price, cost_price, sku, quantity, category_id, brand, age_range, material, is_active, is_featured)
SELECT 'Organic Cotton Teddy Bear', 'organic-cotton-teddy-bear',
       'Super soft organic cotton teddy bear perfect for newborns and toddlers. Certifications: CE, CPSIA. Materials: Organic Cotton, Polyester Filling.',
       'Soft organic cotton teddy bear for babies', 24.99, 29.99, 15.00, 'TOY-TEDDY-001', 50,
       c.id, 'BabyLove', '0-3 years', 'Organic Cotton / Polyester', true, true
FROM categories c WHERE c.slug = 'soft-toys'
ON CONFLICT DO NOTHING;

INSERT INTO products (name, slug, description, short_description, price, compare_price, cost_price, sku, quantity, category_id, brand, age_range, material, is_active, is_featured)
SELECT 'Wooden Stacking Rings', 'wooden-stacking-rings',
       'Classic wooden stacking toy. Certifications: CE, ASTM. Materials: Sustainable Wood, Non-toxic Paint.',
       'Educational wooden stacking toy', 18.99, NULL, 10.00, 'TOY-STACK-001', 120,
       c.id, 'EcoPlay', '6 months - 2 years', 'Wood / Non-toxic Paint', true, true
FROM categories c WHERE c.slug = 'educational-toys'
ON CONFLICT DO NOTHING;

INSERT INTO products (name, slug, description, short_description, price, compare_price, cost_price, sku, quantity, category_id, brand, age_range, material, is_active, is_featured)
SELECT 'Baby Bottle Set', 'baby-bottle-set',
       'Complete feeding set (BPA-free). Certifications: FDA, BPA-Free. Materials: Silicone, Polypropylene.',
       'BPA-free baby bottle set', 32.99, 39.99, 18.00, 'FEED-BOTTLE-001', 80,
       c.id, 'SafeFeed', '0-12 months', 'Silicone / Polypropylene', true, false
FROM categories c WHERE c.slug = 'feeding'
ON CONFLICT DO NOTHING;

INSERT INTO products (name, slug, description, short_description, price, compare_price, cost_price, sku, quantity, category_id, brand, age_range, material, is_active, is_featured)
SELECT 'Musical Mobile', 'musical-mobile',
       'Soothing musical mobile with rotating animals. Certifications: CE. Materials: Plastic, Fabric.',
       'Musical crib mobile', 45.99, NULL, 25.00, 'NURS-MOBILE-001', 40,
       c.id, 'DreamTime', '0-6 months', 'Plastic / Fabric', true, true
FROM categories c WHERE c.slug = 'nursery'
ON CONFLICT DO NOTHING;

-- =========================
-- Product Images
-- =========================
INSERT INTO product_images (product_id, url, alt_text, sort_order)
SELECT id, '/images/products/teddy-bear-1.jpg', 'Organic Cotton Teddy Bear - Front', 0
FROM products WHERE slug = 'organic-cotton-teddy-bear'
  AND NOT EXISTS (SELECT 1 FROM product_images pi WHERE pi.url = '/images/products/teddy-bear-1.jpg');

INSERT INTO product_images (product_id, url, alt_text, sort_order)
SELECT id, '/images/products/stacking-rings-1.jpg', 'Wooden Stacking Rings - Set', 0
FROM products WHERE slug = 'wooden-stacking-rings'
  AND NOT EXISTS (SELECT 1 FROM product_images pi WHERE pi.url = '/images/products/stacking-rings-1.jpg');

INSERT INTO product_images (product_id, url, alt_text, sort_order)
SELECT id, '/images/products/bottle-set-1.jpg', 'Baby Bottle Set - All Sizes', 0
FROM products WHERE slug = 'baby-bottle-set'
  AND NOT EXISTS (SELECT 1 FROM product_images pi WHERE pi.url = '/images/products/bottle-set-1.jpg');

INSERT INTO product_images (product_id, url, alt_text, sort_order)
SELECT id, '/images/products/musical-mobile-1.jpg', 'Musical Mobile - Hanging', 0
FROM products WHERE slug = 'musical-mobile'
  AND NOT EXISTS (SELECT 1 FROM product_images pi WHERE pi.url = '/images/products/musical-mobile-1.jpg');

-- =========================
-- Coupons (type must be 'percentage' or 'fixed')
-- =========================
INSERT INTO coupons (code, name, description, type, value, minimum_amount, maximum_discount, usage_limit, is_active, starts_at, expires_at)
VALUES
  ('WELCOME10', 'Welcome Discount', 'Get 10% off on your first order', 'percentage', 10.00, 50.00, NULL, 100, true, CURRENT_TIMESTAMP, '2025-12-31 23:59:59'),
  ('BABY20', 'Baby Special', 'Flat 20 off on orders over 100', 'fixed', 20.00, 100.00, NULL, 50, true, CURRENT_TIMESTAMP, '2025-06-30 23:59:59')
ON CONFLICT (code) DO NOTHING;

-- Done.
