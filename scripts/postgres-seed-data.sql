-- Seed data for the baby ecommerce store
-- Run this after the main schema setup

-- Insert sample categories
INSERT INTO categories (id, name, slug, description, image_url, parent_id, sort_order) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'Baby Toys', 'baby-toys', 'Safe and educational toys for babies and toddlers', '/images/categories/baby-toys.jpg', NULL, 1),
  ('550e8400-e29b-41d4-a716-446655440002', 'Feeding', 'feeding', 'Bottles, bibs, and feeding accessories', '/images/categories/feeding.jpg', NULL, 2),
  ('550e8400-e29b-41d4-a716-446655440003', 'Clothing', 'clothing', 'Comfortable and cute baby clothing', '/images/categories/clothing.jpg', NULL, 3),
  ('550e8400-e29b-41d4-a716-446655440004', 'Bath & Care', 'bath-care', 'Bath time essentials and baby care products', '/images/categories/bath-care.jpg', NULL, 4),
  ('550e8400-e29b-41d4-a716-446655440005', 'Nursery', 'nursery', 'Furniture and decor for baby nursery', '/images/categories/nursery.jpg', NULL, 5),
  ('550e8400-e29b-41d4-a716-446655440006', 'Soft Toys', 'soft-toys', 'Cuddly and safe soft toys', '550e8400-e29b-41d4-a716-446655440001', 1),
  ('550e8400-e29b-41d4-a716-446655440007', 'Educational Toys', 'educational-toys', 'Learning and development toys', '550e8400-e29b-41d4-a716-446655440001', 2);

-- Insert sample products
INSERT INTO products (id, name, slug, description, short_description, sku, price, compare_price, category_id, brand, age_range, safety_certifications, materials, is_featured) VALUES
  ('660e8400-e29b-41d4-a716-446655440001', 'Organic Cotton Teddy Bear', 'organic-cotton-teddy-bear', 'Super soft organic cotton teddy bear perfect for newborns and toddlers. Made with 100% organic materials and safe dyes.', 'Soft organic cotton teddy bear for babies', 'TOY-TEDDY-001', 24.99, 29.99, '550e8400-e29b-41d4-a716-446655440006', 'BabyLove', '0-3 years', ARRAY['CE', 'CPSIA'], ARRAY['Organic Cotton', 'Polyester Filling'], true),
  ('660e8400-e29b-41d4-a716-446655440002', 'Wooden Stacking Rings', 'wooden-stacking-rings', 'Classic wooden stacking toy that helps develop hand-eye coordination and problem-solving skills. Made from sustainable wood.', 'Educational wooden stacking toy', 'TOY-STACK-001', 18.99, NULL, '550e8400-e29b-41d4-a716-446655440007', 'EcoPlay', '6 months - 2 years', ARRAY['CE', 'ASTM'], ARRAY['Sustainable Wood', 'Non-toxic Paint'], true),
  ('660e8400-e29b-41d4-a716-446655440003', 'Baby Bottle Set', 'baby-bottle-set', 'Complete feeding set with 3 bottles of different sizes, perfect for growing babies. BPA-free and easy to clean.', 'BPA-free baby bottle set', 'FEED-BOTTLE-001', 32.99, 39.99, '550e8400-e29b-41d4-a716-446655440002', 'SafeFeed', '0-12 months', ARRAY['FDA', 'BPA-Free'], ARRAY['Silicone', 'Polypropylene'], false),
  ('660e8400-e29b-41d4-a716-446655440004', 'Musical Mobile', 'musical-mobile', 'Soothing musical mobile with rotating animals and gentle melodies to help baby sleep peacefully.', 'Musical crib mobile for babies', 'NURS-MOBILE-001', 45.99, NULL, '550e8400-e29b-41d4-a716-446655440005', 'DreamTime', '0-6 months', ARRAY['CE'], ARRAY['Plastic', 'Fabric'], true);

-- Insert product images
INSERT INTO product_images (product_id, url, alt_text, sort_order, is_primary) VALUES
  ('660e8400-e29b-41d4-a716-446655440001', '/images/products/teddy-bear-1.jpg', 'Organic Cotton Teddy Bear - Front View', 0, true),
  ('660e8400-e29b-41d4-a716-446655440001', '/images/products/teddy-bear-2.jpg', 'Organic Cotton Teddy Bear - Side View', 1, false),
  ('660e8400-e29b-41d4-a716-446655440002', '/images/products/stacking-rings-1.jpg', 'Wooden Stacking Rings - Complete Set', 0, true),
  ('660e8400-e29b-41d4-a716-446655440003', '/images/products/bottle-set-1.jpg', 'Baby Bottle Set - All Sizes', 0, true),
  ('660e8400-e29b-41d4-a716-446655440004', '/images/products/musical-mobile-1.jpg', 'Musical Mobile - Hanging View', 0, true);

-- Insert sample coupons
INSERT INTO coupons (code, name, description, type, value, minimum_amount, usage_limit, is_active, expires_at) VALUES
  ('WELCOME10', 'Welcome Discount', 'Get 10% off on your first order', 'percentage', 10.00, 50.00, 100, true, '2025-12-31 23:59:59'),
  ('FREESHIP', 'Free Shipping', 'Free shipping on orders over $75', 'free_shipping', 0.00, 75.00, NULL, true, '2025-12-31 23:59:59'),
  ('BABY20', 'Baby Special', 'Flat $20 off on orders over $100', 'fixed_amount', 20.00, 100.00, 50, true, '2025-06-30 23:59:59');
