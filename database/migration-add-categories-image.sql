-- Migration to add missing image column to categories table
-- Run this if you get "column image does not exist" error

-- Add image column to categories if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'categories' AND column_name = 'image'
  ) THEN
    ALTER TABLE categories ADD COLUMN image TEXT;
  END IF;
END $$;
