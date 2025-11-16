-- Migration: Add shipping_amount column to orders table
-- Description: Adds the missing shipping_amount column for order shipping cost tracking

-- Add shipping_amount column to orders table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'orders' 
        AND column_name = 'shipping_amount'
    ) THEN
        ALTER TABLE orders 
        ADD COLUMN shipping_amount DECIMAL(10, 2) DEFAULT 0 NOT NULL;
        
        RAISE NOTICE 'Added shipping_amount column to orders table';
    ELSE
        RAISE NOTICE 'shipping_amount column already exists in orders table';
    END IF;
END $$;

-- Update any existing orders to have default shipping_amount if NULL
UPDATE orders 
SET shipping_amount = 0 
WHERE shipping_amount IS NULL;

-- Verify the migration
SELECT 
    table_name, 
    column_name, 
    data_type,
    column_default,
    is_nullable
FROM information_schema.columns
WHERE table_name = 'orders' 
AND column_name = 'shipping_amount';
