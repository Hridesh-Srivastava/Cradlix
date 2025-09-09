-- Migration script: simple (pgadmin-setup.sql) -> advanced (postgres-setup.sql)
-- Apply ONLY if you previously created the simple schema and have minimal data.
-- Review before running in production.

-- 1. Categories: rename image -> image_url (if it exists and image_url not already present)
DO $$ BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name='categories' AND column_name='image'
    ) AND NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name='categories' AND column_name='image_url'
    ) THEN
        EXECUTE 'ALTER TABLE categories RENAME COLUMN image TO image_url';
    END IF;
END $$;

-- 2. Products table adjustments
-- If simple products table exists and advanced fields missing, add them.
ALTER TABLE products
    ADD COLUMN IF NOT EXISTS sku VARCHAR(100),
    ADD COLUMN IF NOT EXISTS track_inventory BOOLEAN DEFAULT true,
    ADD COLUMN IF NOT EXISTS inventory_quantity INTEGER DEFAULT 0,
    ADD COLUMN IF NOT EXISTS low_stock_threshold INTEGER DEFAULT 5,
    ADD COLUMN IF NOT EXISTS safety_certifications TEXT[],
    ADD COLUMN IF NOT EXISTS materials TEXT[],
    ADD COLUMN IF NOT EXISTS meta_title VARCHAR(255),
    ADD COLUMN IF NOT EXISTS meta_description TEXT;

-- If old columns exist (quantity, track_quantity) migrate to new names
DO $$ BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='products' AND column_name='quantity') THEN
        EXECUTE 'UPDATE products SET inventory_quantity = COALESCE(inventory_quantity,0) + quantity';
        -- keep quantity column for now or drop:
        -- EXECUTE 'ALTER TABLE products DROP COLUMN quantity';
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='products' AND column_name='track_quantity') AND NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='products' AND column_name='track_inventory') THEN
        EXECUTE 'ALTER TABLE products ADD COLUMN track_inventory BOOLEAN';
        EXECUTE 'UPDATE products SET track_inventory = track_quantity';
        -- EXECUTE 'ALTER TABLE products DROP COLUMN track_quantity';
    END IF;
END $$;

-- 3. Product images: add is_primary if missing
ALTER TABLE product_images ADD COLUMN IF NOT EXISTS is_primary BOOLEAN DEFAULT false;

-- 4. Product variants: adapt names (if old schema had compare_price/quantity/options)
ALTER TABLE product_variants
    ADD COLUMN IF NOT EXISTS inventory_quantity INTEGER DEFAULT 0,
    ADD COLUMN IF NOT EXISTS variant_options JSONB,
    ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- 5. Coupons type normalization & constraint (fix ordering to avoid violations)
-- Drop only the specific coupons_type_check constraint if present (so we can freely update data)
DO $$ BEGIN
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname='coupons_type_check') THEN
        EXECUTE 'ALTER TABLE coupons DROP CONSTRAINT coupons_type_check';
    END IF;
END $$;

-- Normalize legacy values BEFORE adding the widened constraint
DO $$ BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='coupons' AND column_name='type') THEN
        UPDATE coupons SET type='fixed_amount' WHERE type='fixed';
    END IF;
END $$;

-- Recreate constraint only if absent (idempotent)
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname='coupons_type_check') THEN
        EXECUTE 'ALTER TABLE coupons ADD CONSTRAINT coupons_type_check CHECK (type IN (''percentage'',''fixed_amount'',''free_shipping''))';
    END IF;
END $$;

-- 6. Add update triggers if not present
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END; $$ LANGUAGE plpgsql;

DO $$ BEGIN
  PERFORM 1 FROM pg_trigger WHERE tgname='update_products_updated_at';
  IF NOT FOUND THEN
    CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

-- (Repeat for other tables as needed)

-- 7. Manual cleanup suggestions (uncomment if desired):
-- ALTER TABLE products DROP COLUMN IF EXISTS quantity;
-- ALTER TABLE products DROP COLUMN IF EXISTS track_quantity;

-- Done. Now you can run scripts/postgres-advanced-seed.sql
