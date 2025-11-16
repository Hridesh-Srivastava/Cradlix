#!/usr/bin/env tsx
/**
 * Data Migration Script: pgAdmin to Supabase
 * 
 * This script helps you migrate data from your local pgAdmin database to Supabase.
 * 
 * Prerequisites:
 * 1. Have both DATABASE_URL (Supabase) and LOCAL_DATABASE_URL (pgAdmin) in .env.local
 * 2. Schema should already be created in Supabase (via drizzle-kit push:pg)
 * 
 * Run: npx tsx scripts/migrate-data-to-supabase.ts
 */

import postgres from "postgres"
import { drizzle } from "drizzle-orm/postgres-js"
import * as schema from "../lib/db/schema"
import fs from "fs"
import path from "path"

// Load environment variables
const loadEnv = () => {
  const candidates = ['.env.local', '.env']
  for (const file of candidates) {
    const envPath = path.join(process.cwd(), file)
    if (fs.existsSync(envPath)) {
      require('dotenv').config({ path: envPath })
      break
    }
  }
}

loadEnv()

// Connection strings
const supabaseUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL
const localUrl = process.env.LOCAL_DATABASE_URL // You need to add this for your pgAdmin DB

if (!supabaseUrl) {
  console.error('❌ DATABASE_URL (Supabase) not found in .env.local')
  process.exit(1)
}

if (!localUrl) {
  console.error('❌ LOCAL_DATABASE_URL (pgAdmin) not found in .env.local')
  console.log('\n📝 Add this to your .env.local:')
  console.log('LOCAL_DATABASE_URL="postgresql://postgres:password@localhost:5432/baby_ecommerce"')
  process.exit(1)
}

// Create connections
const sourceClient = postgres(localUrl)
const targetClient = postgres(supabaseUrl)

const sourceDb = drizzle(sourceClient, { schema })
const targetDb = drizzle(targetClient, { schema })

// Tables to migrate in order (respecting foreign key constraints)
const TABLES_TO_MIGRATE = [
  { name: 'users', table: schema.users },
  { name: 'accounts', table: schema.accounts },
  { name: 'sessions', table: schema.sessions },
  { name: 'verificationTokens', table: schema.verificationTokens },
  { name: 'addresses', table: schema.addresses },
  { name: 'categories', table: schema.categories },
  { name: 'brands', table: schema.brands },
  { name: 'products', table: schema.products },
  { name: 'productImages', table: schema.productImages },
  { name: 'cartItems', table: schema.cartItems },
  { name: 'wishlistItems', table: schema.wishlistItems },
  { name: 'orders', table: schema.orders },
  { name: 'orderItems', table: schema.orderItems },
  { name: 'productReviews', table: schema.productReviews },
  { name: 'testimonials', table: schema.testimonials },
  { name: 'banners', table: schema.banners },
  { name: 'heroImages', table: schema.heroImages },
]

async function migrateData() {
  console.log('🚀 Starting data migration from pgAdmin to Supabase...\n')

  try {
    // Test connections
    console.log('Testing connections...')
    await sourceClient`SELECT 1`
    console.log('✅ Source (pgAdmin) connected')
    
    await targetClient`SELECT 1`
    console.log('✅ Target (Supabase) connected\n')

    // Migrate each table
    for (const { name, table } of TABLES_TO_MIGRATE) {
      try {
        console.log(`📦 Migrating table: ${name}`)

        // Get data from source
        const data = await sourceDb.select().from(table)
        
        if (data.length === 0) {
          console.log(`⚠️  No data found in ${name}, skipping...\n`)
          continue
        }

        console.log(`   Found ${data.length} rows`)

        // Insert into target (in batches to avoid timeout)
        const batchSize = 100
        let inserted = 0

        for (let i = 0; i < data.length; i += batchSize) {
          const batch = data.slice(i, i + batchSize)
          await targetDb.insert(table).values(batch).onConflictDoNothing()
          inserted += batch.length
          console.log(`   Inserted ${inserted}/${data.length} rows`)
        }

        console.log(`✅ Completed migrating ${name}\n`)

      } catch (error: any) {
        // Check if error is due to table not existing
        if (error.message?.includes('does not exist')) {
          console.log(`⚠️  Table ${name} doesn't exist in source, skipping...\n`)
          continue
        }
        
        console.error(`❌ Error migrating ${name}:`, error.message)
        console.log(`⚠️  Continuing with next table...\n`)
      }
    }

    // Summary
    console.log('=' .repeat(50))
    console.log('✅ Data migration completed!')
    console.log('=' .repeat(50))
    console.log('\n📝 Next Steps:')
    console.log('1. Verify data in Supabase dashboard')
    console.log('2. Run test script: npx tsx scripts/test-supabase-connection.ts')
    console.log('3. Update your .env.local to use Supabase URL')
    console.log('4. Test your application: npm run dev')

  } catch (error) {
    console.error('\n❌ Migration failed:', error)
    console.error('\n📝 Troubleshooting:')
    console.error('1. Ensure schema exists in Supabase (run: npx drizzle-kit push:pg)')
    console.error('2. Check both connection strings are correct')
    console.error('3. Verify pgAdmin database is running')
    console.error('4. Check Supabase project status')
  } finally {
    // Close connections
    await sourceClient.end()
    await targetClient.end()
  }
}

// Run migration
migrateData()
