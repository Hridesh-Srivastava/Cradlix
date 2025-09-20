import { config } from 'dotenv'
import { client } from '@/lib/db/postgres'

config()

async function run() {
  console.log('Creating user_addresses table if not exists...')
  try {
    await client`CREATE EXTENSION IF NOT EXISTS pgcrypto` // for gen_random_uuid()

    await client`
      CREATE TABLE IF NOT EXISTS user_addresses (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL,
        type VARCHAR(20) NOT NULL DEFAULT 'home',
        name VARCHAR(255) NOT NULL,
        phone VARCHAR(30) NOT NULL,
        address TEXT NOT NULL,
        city VARCHAR(120) NOT NULL,
        state VARCHAR(120) NOT NULL,
        pincode VARCHAR(20) NOT NULL,
        is_default BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `

    // Add FK
    await client`
      DO $$ BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.table_constraints
          WHERE constraint_name = 'user_addresses_user_id_user_id_fk'
        ) THEN
          ALTER TABLE user_addresses
          ADD CONSTRAINT user_addresses_user_id_user_id_fk
          FOREIGN KEY (user_id) REFERENCES "user"(id) ON DELETE CASCADE;
        END IF;
      END $$;
    `

    // Indexes
    await client`CREATE INDEX IF NOT EXISTS idx_user_addresses_user_id ON user_addresses(user_id)`
    await client`CREATE INDEX IF NOT EXISTS idx_user_addresses_default ON user_addresses(is_default)`

    console.log('✅ user_addresses ready')
  } catch (err) {
    console.error('❌ Failed to create user_addresses:', err)
    process.exit(1)
  } finally {
    await client.end()
  }
}

run()
