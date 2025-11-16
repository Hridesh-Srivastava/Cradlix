#!/usr/bin/env tsx
/**
 * Test Supabase Database Connection
 * 
 * This script verifies that your Supabase connection is working correctly.
 * Run: npx tsx scripts/test-supabase-connection.ts
 */

import { db, checkDatabaseConnection, client } from '../lib/db/postgres'
import { users, products, categories } from '../lib/db/schema'
import { sql } from 'drizzle-orm'

async function testSupabaseConnection() {
  console.log('🔍 Testing Supabase Database Connection...\n')

  try {
    // Test 1: Basic health check
    console.log('Test 1: Health Check')
    const health = await checkDatabaseConnection()
    if (health.success) {
      console.log('✅ Database connection successful\n')
    } else {
      console.error('❌ Database connection failed:', health.error)
      process.exit(1)
    }

    // Test 2: Check PostgreSQL version
    console.log('Test 2: PostgreSQL Version')
    const versionResult = await client`SELECT version()`
    console.log('✅ Version:', versionResult[0].version.split(' ').slice(0, 2).join(' '))
    console.log()

    // Test 3: Check extensions
    console.log('Test 3: Required Extensions')
    const extensions = await client`
      SELECT extname FROM pg_extension 
      WHERE extname IN ('uuid-ossp', 'pgcrypto')
    `
    console.log('✅ Installed extensions:', extensions.map(e => e.extname).join(', '))
    console.log()

    // Test 4: Count tables
    console.log('Test 4: Database Schema')
    const tablesResult = await client`
      SELECT COUNT(*) as count 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `
    console.log('✅ Total tables in schema:', tablesResult[0].count)
    console.log()

    // Test 5: Check specific tables
    console.log('Test 5: Essential Tables')
    const essentialTables = ['user', 'account', 'session', 'products', 'categories', 'orders']
    const existingTables = await client`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = ANY(${essentialTables})
    `
    const foundTables = existingTables.map(t => t.table_name)
    
    for (const table of essentialTables) {
      if (foundTables.includes(table)) {
        console.log(`✅ Table "${table}" exists`)
      } else {
        console.log(`⚠️  Table "${table}" not found (run drizzle-kit push:pg)`)
      }
    }
    console.log()

    // Test 6: Sample queries (if tables exist)
    if (foundTables.includes('user')) {
      console.log('Test 6: Sample Data Queries')
      
      const userCount = await db.select({ count: sql`count(*)` }).from(users)
      console.log('✅ Users count:', userCount[0].count)
      
      if (foundTables.includes('products')) {
        const productCount = await db.select({ count: sql`count(*)` }).from(products)
        console.log('✅ Products count:', productCount[0].count)
      }
      
      if (foundTables.includes('categories')) {
        const categoryCount = await db.select({ count: sql`count(*)` }).from(categories)
        console.log('✅ Categories count:', categoryCount[0].count)
      }
      console.log()
    }

    // Test 7: Connection info
    console.log('Test 7: Connection Information')
    const connectionInfo = await client`
      SELECT 
        current_database() as database,
        current_user as user,
        inet_server_addr() as server_ip,
        inet_server_port() as server_port
    `
    console.log('✅ Database:', connectionInfo[0].database)
    console.log('✅ User:', connectionInfo[0].user)
    console.log('✅ Server:', connectionInfo[0].server_ip || 'localhost', ':', connectionInfo[0].server_port)
    console.log()

    // Test 8: Check RLS status
    console.log('Test 8: Row Level Security (RLS) Status')
    const rlsStatus = await client`
      SELECT tablename, rowsecurity 
      FROM pg_tables 
      WHERE schemaname = 'public' 
      AND tablename IN ('user', 'products', 'orders')
      ORDER BY tablename
    `
    
    for (const table of rlsStatus) {
      const status = table.rowsecurity ? '🔒 Enabled' : '🔓 Disabled'
      console.log(`${status} - ${table.tablename}`)
    }
    console.log()

    // Summary
    console.log('=' .repeat(50))
    console.log('✅ All Supabase connection tests passed!')
    console.log('=' .repeat(50))
    console.log('\n📝 Next Steps:')
    console.log('1. If tables don\'t exist, run: npx drizzle-kit push:pg')
    console.log('2. To disable RLS, run the SQL from: database/supabase-disable-rls.sql')
    console.log('3. Start your app: npm run dev')
    
    // Close connection
    await client.end()
    process.exit(0)

  } catch (error) {
    console.error('\n❌ Connection test failed:', error)
    console.error('\n📝 Troubleshooting:')
    console.error('1. Check your DATABASE_URL in .env.local')
    console.error('2. Verify Supabase project is active')
    console.error('3. Ensure you\'re using the pooled connection string')
    console.error('4. Check if your IP is allowed in Supabase (Database > Settings > Network)')
    
    await client.end()
    process.exit(1)
  }
}

// Run the test
testSupabaseConnection()
