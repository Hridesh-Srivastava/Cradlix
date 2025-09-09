-- Baby Ecommerce Database Setup for pgAdmin 4
-- Usage:
--   1. (If not already created) Manually create the database once:  CREATE DATABASE baby_ecommerce;  (Run this alone, *not* inside a transaction.)
--   2. Connect to the database baby_ecommerce in pgAdmin (select it in the tree, open Query Tool).
--   3. Paste this whole script and run. It is written to be idempotent (safe to re‑run).
--   4. If you need a clean reset: DROP SCHEMA public CASCADE; CREATE SCHEMA public; then re-run this script.

-- IMPORTANT: Do NOT wrap this entire script in a manual BEGIN/COMMIT; pgAdmin auto‑commit is fine.

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    image TEXT,
    role VARCHAR(50) DEFAULT 'customer' CHECK (role IN ('customer', 'moderator', 'admin')),
    phone VARCHAR(20),
    date_of_birth DATE,
    gender VARCHAR(10) CHECK (gender IN ('male', 'female', 'other')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    image TEXT,
    parent_id UUID REFERENCES categories(id),
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    short_description TEXT,
    price DECIMAL(10,2) NOT NULL,
    compare_price DECIMAL(10,2),
    cost_price DECIMAL(10,2),
    sku VARCHAR(100) UNIQUE,
    barcode VARCHAR(100),
    track_quantity BOOLEAN DEFAULT true,
    quantity INTEGER DEFAULT 0,
    weight DECIMAL(8,2),
    dimensions JSONB,
    category_id UUID REFERENCES categories(id),
    brand VARCHAR(255),
    age_range VARCHAR(50),
    material VARCHAR(255),
    safety_info TEXT,
    care_instructions TEXT,
    is_active BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    meta_title VARCHAR(255),
    meta_description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS product_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    alt_text VARCHAR(255),
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS product_variants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10,2),
    compare_price DECIMAL(10,2),
    sku VARCHAR(100) UNIQUE,
    barcode VARCHAR(100),
    quantity INTEGER DEFAULT 0,
    weight DECIMAL(8,2),
    image TEXT,
    options JSONB,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS addresses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(20) DEFAULT 'shipping' CHECK (type IN ('shipping', 'billing')),
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    company VARCHAR(255),
    address_line_1 VARCHAR(255) NOT NULL,
    address_line_2 VARCHAR(255),
    city VARCHAR(255) NOT NULL,
    state VARCHAR(255) NOT NULL,
    postal_code VARCHAR(20) NOT NULL,
    country VARCHAR(255) NOT NULL DEFAULT 'India',
    phone VARCHAR(20),
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id),
    order_number VARCHAR(50) UNIQUE NOT NULL,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded')),
    payment_status VARCHAR(50) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded', 'partially_refunded')),
    payment_method VARCHAR(50),
    payment_id VARCHAR(255),
    razorpay_order_id VARCHAR(255),
    razorpay_payment_id VARCHAR(255),
    razorpay_signature VARCHAR(255),
    subtotal DECIMAL(10,2) NOT NULL,
    tax_amount DECIMAL(10,2) DEFAULT 0,
    shipping_amount DECIMAL(10,2) DEFAULT 0,
    discount_amount DECIMAL(10,2) DEFAULT 0,
    total_amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'INR',
    shipping_address JSONB,
    billing_address JSONB,
    notes TEXT,
    shipped_at TIMESTAMP,
    delivered_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id),
    variant_id UUID REFERENCES product_variants(id),
    quantity INTEGER NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    product_snapshot JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS cart_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    variant_id UUID REFERENCES product_variants(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, product_id, variant_id)
);

CREATE TABLE IF NOT EXISTS wishlist_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, product_id)
);

CREATE TABLE IF NOT EXISTS product_reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(255),
    comment TEXT,
    is_verified BOOLEAN DEFAULT false,
    is_approved BOOLEAN DEFAULT false,
    helpful_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(product_id, user_id)
);

CREATE TABLE IF NOT EXISTS coupons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(20) NOT NULL CHECK (type IN ('percentage', 'fixed')),
    value DECIMAL(10,2) NOT NULL,
    minimum_amount DECIMAL(10,2),
    maximum_discount DECIMAL(10,2),
    usage_limit INTEGER,
    used_count INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    starts_at TIMESTAMP,
    expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance (IF NOT EXISTS supported from PG 9.5 for indexes)
DO $$
BEGIN
    CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
    CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
    CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active);
    CREATE INDEX IF NOT EXISTS idx_products_featured ON products(is_featured);
    CREATE INDEX IF NOT EXISTS idx_product_images_product ON product_images(product_id);
    CREATE INDEX IF NOT EXISTS idx_product_variants_product ON product_variants(product_id);
    CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
    CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
    CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON orders(payment_status);
    CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
    CREATE INDEX IF NOT EXISTS idx_order_items_product ON order_items(product_id);
    CREATE INDEX IF NOT EXISTS idx_cart_items_user ON cart_items(user_id);
    CREATE INDEX IF NOT EXISTS idx_wishlist_items_user ON wishlist_items(user_id);
    CREATE INDEX IF NOT EXISTS idx_product_reviews_product ON product_reviews(product_id);
    CREATE INDEX IF NOT EXISTS idx_product_reviews_user ON product_reviews(user_id);
    CREATE INDEX IF NOT EXISTS idx_addresses_user ON addresses(user_id);
    CREATE INDEX IF NOT EXISTS idx_categories_parent ON categories(parent_id);
    CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
END $$;

-- Insert sample categories (idempotent)
INSERT INTO categories (name, slug, description, image)
SELECT * FROM (
    VALUES
        ('Toys', 'toys', 'Fun and educational toys for babies and toddlers', '/categories/toys.jpg'),
        ('Feeding', 'feeding', 'Bottles, cups, and feeding accessories', '/categories/feeding.jpg'),
        ('Clothing', 'clothing', 'Comfortable and safe baby clothing', '/categories/clothing.jpg'),
        ('Bath & Care', 'bath-care', 'Bath time essentials and baby care products', '/categories/bath-care.jpg'),
        ('Nursery', 'nursery', 'Furniture and decor for baby nursery', '/categories/nursery.jpg'),
        ('Safety', 'safety', 'Baby safety products and accessories', '/categories/safety.jpg')
) AS v(name, slug, description, image)
WHERE NOT EXISTS (SELECT 1 FROM categories c WHERE c.slug = v.slug);

-- Insert sample products (skip if slug exists)
INSERT INTO products (name, slug, description, short_description, price, compare_price, sku, category_id, brand, age_range, material, is_featured)
SELECT 'Organic Cotton Teddy Bear', 'organic-cotton-teddy-bear',
             'Soft and cuddly organic cotton teddy bear perfect for babies and toddlers. Made with 100% organic cotton and hypoallergenic stuffing.',
             'Soft organic cotton teddy bear for babies', 1299.00, 1599.00, 'TOY-TEDDY-001', id,
             'BabyLove', '0-3 years', 'Organic Cotton', true
FROM categories WHERE slug = 'toys'
    AND NOT EXISTS (SELECT 1 FROM products p WHERE p.slug = 'organic-cotton-teddy-bear');

INSERT INTO products (name, slug, description, short_description, price, compare_price, sku, category_id, brand, age_range, material, is_featured)
SELECT 'Wooden Stacking Rings', 'wooden-stacking-rings',
             'Educational wooden stacking rings toy that helps develop hand-eye coordination and problem-solving skills.',
             'Educational wooden stacking toy', 899.00, 1199.00, 'TOY-STACK-001', id,
             'EcoToys', '6 months - 2 years', 'Natural Wood', true
FROM categories WHERE slug = 'toys'
    AND NOT EXISTS (SELECT 1 FROM products p WHERE p.slug = 'wooden-stacking-rings');

INSERT INTO products (name, slug, description, short_description, price, compare_price, sku, category_id, brand, age_range, material, is_featured)
SELECT 'BPA-Free Baby Bottle Set', 'bpa-free-baby-bottle-set',
             'Complete baby bottle feeding set with anti-colic system. BPA-free and dishwasher safe.',
             'BPA-free baby bottle feeding set', 1599.00, 1999.00, 'FEED-BOTTLE-001', id,
             'SafeFeed', '0-12 months', 'BPA-Free Plastic', true
FROM categories WHERE slug = 'feeding'
    AND NOT EXISTS (SELECT 1 FROM products p WHERE p.slug = 'bpa-free-baby-bottle-set');

-- Insert product images (avoid duplicates via NOT EXISTS on url)
INSERT INTO product_images (product_id, url, alt_text, sort_order)
SELECT id, '/organic-cotton-teddy-bear-soft-toy.jpg', 'Organic Cotton Teddy Bear', 0
FROM products WHERE slug = 'organic-cotton-teddy-bear'
    AND NOT EXISTS (SELECT 1 FROM product_images pi WHERE pi.url = '/organic-cotton-teddy-bear-soft-toy.jpg');

INSERT INTO product_images (product_id, url, alt_text, sort_order)
SELECT id, '/wooden-stacking-rings-educational-toy.jpg', 'Wooden Stacking Rings', 0
FROM products WHERE slug = 'wooden-stacking-rings'
    AND NOT EXISTS (SELECT 1 FROM product_images pi WHERE pi.url = '/wooden-stacking-rings-educational-toy.jpg');

INSERT INTO product_images (product_id, url, alt_text, sort_order)
SELECT id, '/baby-bottle-feeding-set-bpa-free.jpg', 'BPA-Free Baby Bottle Set', 0
FROM products WHERE slug = 'bpa-free-baby-bottle-set'
    AND NOT EXISTS (SELECT 1 FROM product_images pi WHERE pi.url = '/baby-bottle-feeding-set-bpa-free.jpg');

-- Create admin user (idempotent)
INSERT INTO users (email, name, role)
SELECT 'admin@babystore.com', 'Admin User', 'admin'
WHERE NOT EXISTS (SELECT 1 FROM users u WHERE u.email = 'admin@babystore.com');

-- Done.
