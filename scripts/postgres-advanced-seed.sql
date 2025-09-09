-- Advanced seed data for ecommerce (matches scripts/postgres-setup.sql schema)
-- Run AFTER executing scripts/postgres-setup.sql on an EMPTY database (recommended)
-- Safe-ish: uses ON CONFLICT for unique natural keys (slug, code, sku) but assumes
-- columns and constraints exactly as in advanced schema.

-- =========================
-- Categories (parent / child)
-- =========================
INSERT INTO categories (name, slug, description, image_url, parent_id, is_active, sort_order)
VALUES
  ('Baby Toys', 'baby-toys', 'Safe and educational toys for babies and toddlers', '/images/categories/baby-toys.jpg', NULL, true, 1),
  ('Feeding', 'feeding', 'Bottles, bibs, and feeding accessories', '/images/categories/feeding.jpg', NULL, true, 2),
  ('Clothing', 'clothing', 'Comfortable and cute baby clothing', '/images/categories/clothing.jpg', NULL, true, 3),
  ('Bath & Care', 'bath-care', 'Bath time essentials and baby care products', '/images/categories/bath-care.jpg', NULL, true, 4),
  ('Nursery', 'nursery', 'Furniture and decor for baby nursery', '/images/categories/nursery.jpg', NULL, true, 5)
ON CONFLICT (slug) DO NOTHING;

-- Child categories
INSERT INTO categories (name, slug, description, image_url, parent_id, is_active, sort_order)
SELECT 'Soft Toys', 'soft-toys', 'Cuddly and safe soft toys', '/images/categories/soft-toys.jpg', c.id, true, 1
FROM categories c WHERE c.slug = 'baby-toys'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO categories (name, slug, description, image_url, parent_id, is_active, sort_order)
SELECT 'Educational Toys', 'educational-toys', 'Learning and development toys', '/images/categories/educational-toys.jpg', c.id, true, 2
FROM categories c WHERE c.slug = 'baby-toys'
ON CONFLICT (slug) DO NOTHING;

-- Helper: get IDs for reuse
WITH ids AS (
  SELECT slug, id FROM categories WHERE slug IN ('soft-toys','educational-toys','feeding','nursery')
)
SELECT * FROM ids; -- (No effect, just visible if run manually)

-- =========================
-- Products
-- =========================
-- Note: inventory fields map to *inventory_quantity*, arrays for certifications/materials
INSERT INTO products (
  name, slug, description, short_description, sku, price, compare_price, cost_price,
  track_inventory, inventory_quantity, low_stock_threshold, category_id, brand, age_range,
  safety_certifications, materials, is_active, is_featured, meta_title, meta_description
)
SELECT 'Organic Cotton Teddy Bear', 'organic-cotton-teddy-bear',
       'Super soft organic cotton teddy bear perfect for newborns & toddlers.',
       'Soft organic cotton teddy bear for babies', 'TOY-TEDDY-001', 24.99, 29.99, 15.00,
       true, 50, 5, c.id, 'BabyLove', '0-3 years',
       ARRAY['CE','CPSIA'], ARRAY['Organic Cotton','Polyester Filling'], true, true,
       'Organic Cotton Teddy Bear', 'Hypoallergenic organic cotton teddy bear'
FROM categories c WHERE c.slug = 'soft-toys'
ON CONFLICT DO NOTHING; -- ignore conflict on slug or sku

INSERT INTO products (
  name, slug, description, short_description, sku, price, compare_price, cost_price,
  track_inventory, inventory_quantity, low_stock_threshold, category_id, brand, age_range,
  safety_certifications, materials, is_active, is_featured, meta_title, meta_description
)
SELECT 'Wooden Stacking Rings', 'wooden-stacking-rings',
       'Classic wooden stacking toy aiding coordination & problem solving.',
       'Educational wooden stacking toy', 'TOY-STACK-001', 18.99, NULL, 10.00,
       true, 120, 10, c.id, 'EcoPlay', '6 months - 2 years',
       ARRAY['CE','ASTM'], ARRAY['Sustainable Wood','Non-toxic Paint'], true, true,
       'Wooden Stacking Rings', 'Sustainably sourced educational stacking rings'
FROM categories c WHERE c.slug = 'educational-toys'
ON CONFLICT DO NOTHING; -- ignore conflict on slug or sku

INSERT INTO products (
  name, slug, description, short_description, sku, price, compare_price, cost_price,
  track_inventory, inventory_quantity, low_stock_threshold, category_id, brand, age_range,
  safety_certifications, materials, is_active, is_featured, meta_title, meta_description
)
SELECT 'Baby Bottle Set', 'baby-bottle-set',
       'Complete BPA-free feeding bottle set (3 sizes).',
       'BPA-free baby bottle set', 'FEED-BOTTLE-001', 32.99, 39.99, 18.00,
       true, 80, 8, c.id, 'SafeFeed', '0-12 months',
       ARRAY['FDA','BPA-Free'], ARRAY['Silicone','Polypropylene'], true, false,
       'Baby Bottle Set', 'BPA-free multi-size baby feeding bottles'
FROM categories c WHERE c.slug = 'feeding'
ON CONFLICT DO NOTHING; -- ignore conflict on slug or sku

INSERT INTO products (
  name, slug, description, short_description, sku, price, compare_price, cost_price,
  track_inventory, inventory_quantity, low_stock_threshold, category_id, brand, age_range,
  safety_certifications, materials, is_active, is_featured, meta_title, meta_description
)
SELECT 'Musical Mobile', 'musical-mobile',
       'Soothing musical mobile with rotating animals & gentle melodies.',
       'Musical crib mobile', 'NURS-MOBILE-001', 45.99, NULL, 25.00,
       true, 40, 5, c.id, 'DreamTime', '0-6 months',
       ARRAY['CE'], ARRAY['Plastic','Fabric'], true, true,
       'Nursery Musical Mobile', 'Calming musical mobile for better infant sleep'
FROM categories c WHERE c.slug = 'nursery'
ON CONFLICT DO NOTHING; -- ignore conflict on slug or sku

-- =========================
-- Product Images (primary flags)
-- =========================
INSERT INTO product_images (product_id, url, alt_text, sort_order, is_primary)
SELECT p.id, '/images/products/teddy-bear-1.jpg', 'Organic Cotton Teddy Bear - Front', 0, true
FROM products p WHERE p.slug = 'organic-cotton-teddy-bear'
  AND NOT EXISTS (SELECT 1 FROM product_images pi WHERE pi.url = '/images/products/teddy-bear-1.jpg');

INSERT INTO product_images (product_id, url, alt_text, sort_order, is_primary)
SELECT p.id, '/images/products/stacking-rings-1.jpg', 'Wooden Stacking Rings - Set', 0, true
FROM products p WHERE p.slug = 'wooden-stacking-rings'
  AND NOT EXISTS (SELECT 1 FROM product_images pi WHERE pi.url = '/images/products/stacking-rings-1.jpg');

INSERT INTO product_images (product_id, url, alt_text, sort_order, is_primary)
SELECT p.id, '/images/products/bottle-set-1.jpg', 'Baby Bottle Set - All Sizes', 0, true
FROM products p WHERE p.slug = 'baby-bottle-set'
  AND NOT EXISTS (SELECT 1 FROM product_images pi WHERE pi.url = '/images/products/bottle-set-1.jpg');

INSERT INTO product_images (product_id, url, alt_text, sort_order, is_primary)
SELECT p.id, '/images/products/musical-mobile-1.jpg', 'Musical Mobile - Hanging', 0, true
FROM products p WHERE p.slug = 'musical-mobile'
  AND NOT EXISTS (SELECT 1 FROM product_images pi WHERE pi.url = '/images/products/musical-mobile-1.jpg');

-- =========================
-- Coupons (supports fixed_amount & free_shipping types per advanced schema)
-- =========================
INSERT INTO coupons (code, name, description, type, value, minimum_amount, maximum_discount, usage_limit, is_active, starts_at, expires_at)
VALUES
  ('WELCOME10', 'Welcome Discount', 'Get 10% off on your first order', 'percentage', 10.00, 50.00, NULL, 100, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '180 days'),
  ('FREESHIP75', 'Free Shipping 75+', 'Free shipping over 75 total', 'free_shipping', 0.00, 75.00, NULL, 500, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '180 days'),
  ('BABY20', 'Baby Special', 'Flat 20 off on orders over 100', 'fixed_amount', 20.00, 100.00, NULL, 50, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '120 days')
ON CONFLICT (code) DO NOTHING;

-- =========================
-- (Optional) Example product variant
-- =========================
INSERT INTO product_variants (product_id, name, sku, price, inventory_quantity, variant_options, is_active)
SELECT p.id, 'Large', 'TOY-TEDDY-001-L', 26.99, 20, '{"size":"large"}'::jsonb, true
FROM products p WHERE p.slug = 'organic-cotton-teddy-bear'
ON CONFLICT (sku) DO NOTHING;

-- Done (advanced seed).
