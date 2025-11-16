-- Supabase Database Setup for E-commerce Application
-- Run this script in Supabase SQL Editor after creating your project

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================================================
-- STEP 1: Disable Row Level Security (RLS)
-- Since we're using NextAuth for authentication
-- =====================================================

-- First, let's check if tables exist and disable RLS
DO $$ 
BEGIN
    -- Disable RLS for auth tables
    IF EXISTS (SELECT FROM pg_tables WHERE tablename = 'user') THEN
        ALTER TABLE "user" DISABLE ROW LEVEL SECURITY;
    END IF;
    
    IF EXISTS (SELECT FROM pg_tables WHERE tablename = 'account') THEN
        ALTER TABLE "account" DISABLE ROW LEVEL SECURITY;
    END IF;
    
    IF EXISTS (SELECT FROM pg_tables WHERE tablename = 'session') THEN
        ALTER TABLE "session" DISABLE ROW LEVEL SECURITY;
    END IF;
    
    IF EXISTS (SELECT FROM pg_tables WHERE tablename = 'verificationToken') THEN
        ALTER TABLE "verificationToken" DISABLE ROW LEVEL SECURITY;
    END IF;
END $$;

-- =====================================================
-- STEP 2: Schema will be created via Drizzle Push
-- This file is for reference and manual setup if needed
-- =====================================================

-- Note: The schema is defined in lib/db/schema.ts
-- To automatically create tables, run: npx drizzle-kit push:pg

-- =====================================================
-- STEP 3: Create Indexes (will be created by Drizzle)
-- =====================================================

-- These are included in the schema but listed here for reference:
-- - account_provider_providerAccountId_idx
-- - verificationToken_identifier_token_idx
-- - idx_addresses_user
-- - idx_categories_slug
-- - idx_products_category_id
-- - idx_products_is_active
-- - idx_products_is_featured
-- - idx_products_slug
-- - idx_product_images_product_id
-- - idx_orders_user_id
-- - idx_orders_status
-- - idx_orders_order_number
-- - idx_cart_items_user_id
-- - idx_cart_items_session_id

-- =====================================================
-- STEP 4: Verify Setup
-- =====================================================

-- Run this query to check if all required extensions are enabled
SELECT * FROM pg_extension WHERE extname IN ('uuid-ossp', 'pgcrypto');

-- Check database version
SELECT version();

-- =====================================================
-- STEP 5: Performance Optimization
-- =====================================================

-- Recommended: Update statistics for better query planning
ANALYZE;

-- =====================================================
-- NOTES:
-- =====================================================
-- 1. After running this script, use Drizzle Kit to push the schema:
--    npx drizzle-kit push:pg
--
-- 2. Your connection string should use pooled connections:
--    postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
--
-- 3. MongoDB connection remains unchanged (Atlas)
--
-- 4. NextAuth OAuth (Google) configuration remains unchanged
--
-- 5. For data migration from pgAdmin, export and import using pg_dump
--
-- 6. Monitor connections in Supabase Dashboard > Database > Connections
