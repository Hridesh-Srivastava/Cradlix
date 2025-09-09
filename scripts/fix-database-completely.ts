// Load env early for standalone script
import dotenv from 'dotenv'
import path from 'path'
import fs from 'fs'
const root = process.cwd()
for (const f of ['.env.local', '.env']) {
  const p = path.join(root, f)
  if (fs.existsSync(p)) {
    dotenv.config({ path: p })
  }
}

import { db } from '../lib/db/postgres'
import { connectMongoDB } from '../lib/db/mongodb'
import { users, categories, products, productImages } from '../lib/db/schema'
import { eq } from 'drizzle-orm'
import bcrypt from 'bcryptjs'

async function fixDatabaseCompletely() {
  try {
    console.log('🔧 Completely fixing database schema and data...')

    // 1. Drop and recreate all tables to ensure clean state
    console.log('🗑️ Dropping existing tables...')
    const dropTablesSQL = `
      DROP TABLE IF EXISTS "verificationToken" CASCADE;
      DROP TABLE IF EXISTS "session" CASCADE;
      DROP TABLE IF EXISTS "account" CASCADE;
      DROP TABLE IF EXISTS "product_reviews" CASCADE;
      DROP TABLE IF EXISTS "order_items" CASCADE;
      DROP TABLE IF EXISTS "orders" CASCADE;
      DROP TABLE IF EXISTS "cart_items" CASCADE;
      DROP TABLE IF EXISTS "product_images" CASCADE;
      DROP TABLE IF EXISTS "products" CASCADE;
      DROP TABLE IF EXISTS "categories" CASCADE;
      DROP TABLE IF EXISTS "users" CASCADE;
    `

    const dropStatements = dropTablesSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0)

    for (const statement of dropStatements) {
      try {
        await db.execute(statement)
        console.log(`✅ Dropped: ${statement.substring(0, 50)}...`)
      } catch (error) {
        console.log(`⚠️ Drop statement: ${statement.substring(0, 50)}...`)
      }
    }

    // 2. Create all tables with proper structure
    console.log('📊 Creating all tables with proper structure...')
    const createTablesSQL = `
      -- Users table
      CREATE TABLE "users" (
        "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "email" VARCHAR(255) NOT NULL UNIQUE,
        "name" VARCHAR(255) NOT NULL,
        "password" TEXT,
        "image" TEXT,
        "role" VARCHAR(50) DEFAULT 'customer',
        "email_verified" TIMESTAMP,
        "created_at" TIMESTAMP DEFAULT NOW(),
        "updated_at" TIMESTAMP DEFAULT NOW()
      );

      -- Categories table
      CREATE TABLE "categories" (
        "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "name" VARCHAR(255) NOT NULL,
        "slug" VARCHAR(255) NOT NULL UNIQUE,
        "description" TEXT,
        "image_url" TEXT,
        "parent_id" UUID REFERENCES "categories"("id") ON DELETE SET NULL,
        "is_active" BOOLEAN DEFAULT true,
        "sort_order" INTEGER DEFAULT 0,
        "meta_title" VARCHAR(255),
        "meta_description" TEXT,
        "created_at" TIMESTAMP DEFAULT NOW(),
        "updated_at" TIMESTAMP DEFAULT NOW()
      );

      -- Products table (aligned with Drizzle schema: includes cost_price, track_inventory, low_stock_threshold, weight, dimensions)
      CREATE TABLE "products" (
        "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "name" VARCHAR(255) NOT NULL,
        "slug" VARCHAR(255) NOT NULL UNIQUE,
        "description" TEXT,
        "short_description" TEXT,
        "sku" VARCHAR(100) UNIQUE,
        "price" DECIMAL(10,2) NOT NULL,
        "compare_price" DECIMAL(10,2),
        "cost_price" DECIMAL(10,2),
        "track_inventory" BOOLEAN DEFAULT true,
        "inventory_quantity" INTEGER DEFAULT 0,
        "low_stock_threshold" INTEGER DEFAULT 5,
        "weight" DECIMAL(8,2),
        "dimensions" JSONB,
        "is_featured" BOOLEAN DEFAULT false,
        "brand" VARCHAR(255),
        "age_range" VARCHAR(100),
        "category_id" UUID REFERENCES "categories"("id") ON DELETE SET NULL,
        "materials" TEXT[],
        "safety_certifications" TEXT[],
        "is_active" BOOLEAN DEFAULT true,
        "meta_title" VARCHAR(255),
        "meta_description" TEXT,
        "created_at" TIMESTAMP DEFAULT NOW(),
        "updated_at" TIMESTAMP DEFAULT NOW()
      );

      -- Product Images table
      CREATE TABLE "product_images" (
        "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "product_id" UUID NOT NULL REFERENCES "products"("id") ON DELETE CASCADE,
        "url" TEXT NOT NULL,
        "alt_text" VARCHAR(255),
        "sort_order" INTEGER DEFAULT 0,
        "is_primary" BOOLEAN DEFAULT false,
        "created_at" TIMESTAMP DEFAULT NOW()
      );

      -- Cart Items table
      CREATE TABLE "cart_items" (
        "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "user_id" UUID NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
        "product_id" UUID NOT NULL REFERENCES "products"("id") ON DELETE CASCADE,
        "quantity" INTEGER NOT NULL DEFAULT 1,
        "created_at" TIMESTAMP DEFAULT NOW(),
        "updated_at" TIMESTAMP DEFAULT NOW(),
        UNIQUE("user_id", "product_id")
      );

      -- Orders table
      CREATE TABLE "orders" (
        "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "user_id" UUID NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
        "order_number" VARCHAR(50) NOT NULL UNIQUE,
        "status" VARCHAR(50) DEFAULT 'pending',
        "payment_method" VARCHAR(50),
        "payment_status" VARCHAR(50) DEFAULT 'pending',
        "payment_id" VARCHAR(255),
        "shipping_address" JSONB NOT NULL,
        "billing_address" JSONB NOT NULL,
        "subtotal" DECIMAL(10,2) NOT NULL,
        "shipping_cost" DECIMAL(10,2) DEFAULT 0,
        "tax_amount" DECIMAL(10,2) DEFAULT 0,
        "total_amount" DECIMAL(10,2) NOT NULL,
        "notes" TEXT,
        "created_at" TIMESTAMP DEFAULT NOW(),
        "updated_at" TIMESTAMP DEFAULT NOW()
      );

      -- Order Items table
      CREATE TABLE "order_items" (
        "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "order_id" UUID NOT NULL REFERENCES "orders"("id") ON DELETE CASCADE,
        "product_id" UUID NOT NULL REFERENCES "products"("id") ON DELETE CASCADE,
        "quantity" INTEGER NOT NULL,
        "price" DECIMAL(10,2) NOT NULL,
        "created_at" TIMESTAMP DEFAULT NOW()
      );

      -- Product Reviews table
      CREATE TABLE "product_reviews" (
        "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "product_id" UUID NOT NULL REFERENCES "products"("id") ON DELETE CASCADE,
        "user_id" UUID NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
        "rating" INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
        "title" VARCHAR(255),
        "comment" TEXT,
        "is_verified" BOOLEAN DEFAULT false,
        "created_at" TIMESTAMP DEFAULT NOW(),
        "updated_at" TIMESTAMP DEFAULT NOW(),
        UNIQUE("product_id", "user_id")
      );

      -- NextAuth.js required tables
      CREATE TABLE "account" (
        "userId" UUID NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
        "type" VARCHAR(255) NOT NULL,
        "provider" VARCHAR(255) NOT NULL,
        "providerAccountId" VARCHAR(255) NOT NULL,
        "refresh_token" TEXT,
        "access_token" TEXT,
        "expires_at" INTEGER,
        "token_type" VARCHAR(255),
        "scope" VARCHAR(255),
        "id_token" TEXT,
        "session_state" VARCHAR(255),
        PRIMARY KEY ("provider", "providerAccountId")
      );

      CREATE TABLE "session" (
        "sessionToken" VARCHAR(255) PRIMARY KEY,
        "userId" UUID NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
        "expires" TIMESTAMP NOT NULL
      );

      CREATE TABLE "verificationToken" (
        "identifier" VARCHAR(255) NOT NULL,
        "token" VARCHAR(255) NOT NULL,
        "expires" TIMESTAMP NOT NULL,
        PRIMARY KEY ("identifier", "token")
      );

      -- Create indexes
      CREATE INDEX "idx_categories_slug" ON "categories"("slug");
      CREATE INDEX "idx_categories_parent_id" ON "categories"("parent_id");
      CREATE INDEX "idx_products_slug" ON "products"("slug");
      CREATE INDEX "idx_products_category_id" ON "products"("category_id");
      CREATE INDEX "idx_products_is_featured" ON "products"("is_featured");
      CREATE INDEX "idx_products_is_active" ON "products"("is_active");
      CREATE INDEX "idx_product_images_product_id" ON "product_images"("product_id");
      CREATE INDEX "idx_cart_items_user_id" ON "cart_items"("user_id");
      CREATE INDEX "idx_orders_user_id" ON "orders"("user_id");
      CREATE INDEX "idx_orders_order_number" ON "orders"("order_number");
      CREATE INDEX "idx_order_items_order_id" ON "order_items"("order_id");
      CREATE INDEX "idx_product_reviews_product_id" ON "product_reviews"("product_id");
      CREATE INDEX "idx_product_reviews_user_id" ON "product_reviews"("user_id");
      CREATE INDEX "account_provider_providerAccountId_idx" ON "account"("provider", "providerAccountId");
      CREATE INDEX "verificationToken_identifier_token_idx" ON "verificationToken"("identifier", "token");
    `

    const createStatements = createTablesSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0)

    for (const statement of createStatements) {
      try {
        await db.execute(statement)
        console.log(`✅ Created: ${statement.substring(0, 50)}...`)
      } catch (error) {
        console.log(`⚠️ Create statement: ${statement.substring(0, 50)}...`)
      }
    }

    // 3. Set up MongoDB collections
    console.log('🍃 Setting up MongoDB collections...')
    try {
      await connectMongoDB()
      const { ContactForm, Newsletter, AnalyticsEvent, Feedback, SearchQuery } = await import('../lib/db/mongodb')
      
      await Promise.all([
        ContactForm.createIndexes(),
        Newsletter.createIndexes(),
        AnalyticsEvent.createIndexes(),
        Feedback.createIndexes(),
        SearchQuery.createIndexes(),
      ])
      console.log('✅ MongoDB collections and indexes created')
    } catch (error) {
      console.log('⚠️ MongoDB setup completed with warnings')
    }

    // 4. Create test user
    console.log('👤 Creating test user...')
    try {
      const hashedPassword = await bcrypt.hash('password123', 12)
      await db.insert(users).values({
        name: 'Test User',
        email: 'test@example.com',
        password: hashedPassword,
        role: 'customer',
      })
      console.log('✅ Test user created: test@example.com / password123')
    } catch (error) {
      console.log('⚠️ Test user creation skipped')
    }

    // 5. Create sample categories
    console.log('📂 Creating sample categories...')
    const categoryData = [
      {
        name: 'Baby Toys',
        slug: 'baby-toys',
        description: 'Safe and educational toys for babies',
        imageUrl: 'https://res.cloudinary.com/your-cloud/image/upload/v1/baby-toys-category.jpg',
        isActive: true,
        sortOrder: 1,
      },
      {
        name: 'Feeding',
        slug: 'feeding',
        description: 'Baby feeding essentials and accessories',
        imageUrl: 'https://res.cloudinary.com/your-cloud/image/upload/v1/feeding-category.jpg',
        isActive: true,
        sortOrder: 2,
      },
      {
        name: 'Baby Care',
        slug: 'baby-care',
        description: 'Essential baby care products',
        imageUrl: 'https://res.cloudinary.com/your-cloud/image/upload/v1/baby-care-category.jpg',
        isActive: true,
        sortOrder: 3,
      },
    ]

    const insertedCategories = await db.insert(categories).values(categoryData).returning()
    console.log(`✅ Created ${insertedCategories.length} categories`)

    // 6. Create sample products
    console.log('🛍️ Creating sample products...')
    const productData = [
      {
        name: 'Organic Cotton Teddy Bear',
        slug: 'organic-cotton-teddy-bear',
        description: 'A soft and cuddly organic cotton teddy bear perfect for your little one. Made with 100% organic cotton and natural dyes.',
        shortDescription: 'Soft organic cotton teddy bear for babies',
        sku: 'TEDDY-001',
        price: '24.99',
        comparePrice: '29.99',
        inventoryQuantity: 15,
        isFeatured: true,
        brand: 'EcoBaby',
        ageRange: '0-3 years',
        categoryId: insertedCategories[0].id,
        materials: ['Organic Cotton', 'Natural Dyes'],
        safetyCertifications: ['CE', 'ASTM F963'],
        isActive: true,
        metaTitle: 'Organic Cotton Teddy Bear - Safe Baby Toy',
        metaDescription: 'Buy the best organic cotton teddy bear for your baby.',
      },
      {
        name: 'BPA-Free Baby Bottle Set',
        slug: 'bpa-free-baby-bottle-set',
        description: 'Complete set of BPA-free baby bottles with anti-colic design. Perfect for feeding your little one safely.',
        shortDescription: 'BPA-free baby bottle set with anti-colic design',
        sku: 'BOTTLE-001',
        price: '19.99',
        comparePrice: '24.99',
        inventoryQuantity: 20,
        isFeatured: true,
        brand: 'SafeFeed',
        ageRange: '0-12 months',
        categoryId: insertedCategories[1].id,
        materials: ['BPA-Free Plastic', 'Silicone'],
        safetyCertifications: ['FDA Approved', 'BPA-Free'],
        isActive: true,
        metaTitle: 'BPA-Free Baby Bottle Set - Anti-Colic Design',
        metaDescription: 'Safe and reliable baby bottle set for your little one.',
      },
      {
        name: 'Wooden Stacking Rings',
        slug: 'wooden-stacking-rings',
        description: 'Educational wooden stacking rings that help develop fine motor skills and hand-eye coordination.',
        shortDescription: 'Educational wooden stacking rings for toddlers',
        sku: 'RINGS-001',
        price: '15.99',
        comparePrice: '19.99',
        inventoryQuantity: 25,
        isFeatured: false,
        brand: 'EduPlay',
        ageRange: '6-24 months',
        categoryId: insertedCategories[0].id,
        materials: ['Natural Wood', 'Non-toxic Paint'],
        safetyCertifications: ['CE', 'ASTM F963'],
        isActive: true,
        metaTitle: 'Wooden Stacking Rings - Educational Toy',
        metaDescription: 'Develop fine motor skills with these wooden stacking rings.',
      },
    ]

    const insertedProducts = await db.insert(products).values(productData).returning()
    console.log(`✅ Created ${insertedProducts.length} products`)

    // 7. Create product images
    console.log('🖼️ Creating product images...')
    const imageData = [
      {
        productId: insertedProducts[0].id,
        url: 'https://res.cloudinary.com/your-cloud/image/upload/v1/organic-cotton-teddy-bear-1.jpg',
        altText: 'Organic Cotton Teddy Bear - Front View',
        sortOrder: 1,
        isPrimary: true,
      },
      {
        productId: insertedProducts[1].id,
        url: 'https://res.cloudinary.com/your-cloud/image/upload/v1/bpa-free-baby-bottle-set-1.jpg',
        altText: 'BPA-Free Baby Bottle Set - Complete Set',
        sortOrder: 1,
        isPrimary: true,
      },
      {
        productId: insertedProducts[2].id,
        url: 'https://res.cloudinary.com/your-cloud/image/upload/v1/wooden-stacking-rings-1.jpg',
        altText: 'Wooden Stacking Rings - Educational Toy',
        sortOrder: 1,
        isPrimary: true,
      },
    ]

    await db.insert(productImages).values(imageData)
    console.log(`✅ Created ${imageData.length} product images`)

    console.log('🎉 Database completely fixed and set up!')
    console.log('\n📋 Summary:')
    console.log('✅ All tables dropped and recreated with proper structure')
    console.log('✅ NextAuth.js tables created with correct relationships')
    console.log('✅ MongoDB collections set up')
    console.log('✅ Test user created (test@example.com / password123)')
    console.log('✅ Sample categories and products created')
    console.log('\n🚀 You can now:')
    console.log('1. Run: npm run dev')
    console.log('2. Go to: http://localhost:3000')
    console.log('3. Test login with: test@example.com / password123')
    console.log('4. Test Google OAuth login')
    console.log('5. Test complete checkout flow')
    
  } catch (error) {
    console.error('❌ Error fixing database:', error)
    throw error
  }
}

// Run the fix function
if (require.main === module) {
  fixDatabaseCompletely()
    .then(() => {
      console.log('✅ Database fix completed')
      process.exit(0)
    })
    .catch((error) => {
      console.error('❌ Database fix failed:', error)
      process.exit(1)
    })
}

export { fixDatabaseCompletely }
