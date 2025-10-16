-- Migration: Add middle_name and country_code to addresses table
-- Run this in PostgreSQL if your addresses table already exists

-- Add middle_name column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'addresses' AND column_name = 'middle_name'
    ) THEN
        ALTER TABLE addresses ADD COLUMN middle_name VARCHAR(255);
    END IF;
END $$;

-- Add country_code column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'addresses' AND column_name = 'country_code'
    ) THEN
        ALTER TABLE addresses ADD COLUMN country_code VARCHAR(5) DEFAULT '+91';
    END IF;
END $$;

-- Update existing records to have default country code
UPDATE addresses SET country_code = '+91' WHERE country_code IS NULL;
