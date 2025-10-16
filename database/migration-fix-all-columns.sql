-- ALL-IN-ONE Migration Script
-- This will add all missing columns to your existing database
-- Safe to run multiple times (idempotent)

-- ============================================
-- ADDRESSES TABLE COLUMNS
-- ============================================

-- Add email column to addresses table
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'addresses' AND column_name = 'email'
  ) THEN
    ALTER TABLE addresses ADD COLUMN email VARCHAR(255);
  END IF;
END $$;

-- Add middle_name column to addresses table
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'addresses' AND column_name = 'middle_name'
  ) THEN
    ALTER TABLE addresses ADD COLUMN middle_name VARCHAR(255);
  END IF;
END $$;

-- Add country_code column to addresses table
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'addresses' AND column_name = 'country_code'
  ) THEN
    ALTER TABLE addresses ADD COLUMN country_code VARCHAR(5) DEFAULT '+91';
    -- Update existing records to have default country code
    UPDATE addresses SET country_code = '+91' WHERE country_code IS NULL;
  END IF;
END $$;

-- ============================================
-- CATEGORIES TABLE COLUMNS
-- ============================================

-- Add image column to categories table
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'categories' AND column_name = 'image'
  ) THEN
    ALTER TABLE categories ADD COLUMN image TEXT;
  END IF;
END $$;

-- ============================================
-- PRODUCTS TABLE COLUMNS
-- ============================================

-- Add material column to products table
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'products' AND column_name = 'material'
  ) THEN
    ALTER TABLE products ADD COLUMN material VARCHAR(255);
  END IF;
END $$;

-- Add safety_info column to products table
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'products' AND column_name = 'safety_info'
  ) THEN
    ALTER TABLE products ADD COLUMN safety_info TEXT;
  END IF;
END $$;

-- Add care_instructions column to products table
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'products' AND column_name = 'care_instructions'
  ) THEN
    ALTER TABLE products ADD COLUMN care_instructions TEXT;
  END IF;
END $$;
