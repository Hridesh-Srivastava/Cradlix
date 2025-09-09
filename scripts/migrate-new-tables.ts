import { config } from 'dotenv'
import { db, client } from '../lib/db/postgres'
import { brands, banners, testimonials, heroImages } from '../lib/db/schema'

// Load environment variables
config()

async function migrateNewTables() {
  console.log('🔄 Migrating new tables to database...')

  try {
    // Create brands table
    console.log('📊 Creating brands table...')
    await client`
      CREATE TABLE IF NOT EXISTS brands (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(255) NOT NULL UNIQUE,
        description TEXT,
        website VARCHAR(500),
        logo TEXT,
        is_active BOOLEAN DEFAULT true,
        is_featured BOOLEAN DEFAULT false,
        sort_order INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `
    console.log('✅ Brands table created')

    // Create banners table
    console.log('📊 Creating banners table...')
    await client`
      CREATE TABLE IF NOT EXISTS banners (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title VARCHAR(255) NOT NULL,
        subtitle VARCHAR(255),
        description TEXT,
        button_text VARCHAR(100),
        button_link VARCHAR(500),
        position VARCHAR(50) DEFAULT 'hero',
        image TEXT,
        mobile_image TEXT,
        is_active BOOLEAN DEFAULT true,
        start_date TIMESTAMP,
        end_date TIMESTAMP,
        sort_order INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `
    console.log('✅ Banners table created')

    // Create testimonials table
    console.log('📊 Creating testimonials table...')
    await client`
      CREATE TABLE IF NOT EXISTS testimonials (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        customer_name VARCHAR(255) NOT NULL,
        customer_email VARCHAR(255),
        customer_location VARCHAR(255),
        customer_image TEXT,
        rating INTEGER NOT NULL,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        product_id UUID REFERENCES products(id),
        is_approved BOOLEAN DEFAULT false,
        is_featured BOOLEAN DEFAULT false,
        sort_order INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `
    console.log('✅ Testimonials table created')

    // Create hero_images table
    console.log('📊 Creating hero_images table...')
    await client`
      CREATE TABLE IF NOT EXISTS hero_images (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title VARCHAR(255) NOT NULL,
        subtitle VARCHAR(255),
        description TEXT,
        button_text VARCHAR(100),
        button_link VARCHAR(500),
        position VARCHAR(50) DEFAULT 'main',
        image TEXT,
        mobile_image TEXT,
        is_active BOOLEAN DEFAULT true,
        start_date TIMESTAMP,
        end_date TIMESTAMP,
        sort_order INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `
    console.log('✅ Hero images table created')

    // Add brand_id column to products table if it doesn't exist
    console.log('📊 Adding brand_id to products table...')
    try {
      await client`
        ALTER TABLE products ADD COLUMN IF NOT EXISTS brand_id UUID REFERENCES brands(id)
      `
      console.log('✅ Brand ID column added to products table')
    } catch (error) {
      console.log('ℹ️ Brand ID column already exists or error:', error)
    }

    // Create indexes
    console.log('📊 Creating indexes...')
    
    // Brands indexes
    await client`CREATE INDEX IF NOT EXISTS idx_brands_slug ON brands(slug)`
    await client`CREATE INDEX IF NOT EXISTS idx_brands_is_active ON brands(is_active)`
    await client`CREATE INDEX IF NOT EXISTS idx_brands_is_featured ON brands(is_featured)`
    
    // Banners indexes
    await client`CREATE INDEX IF NOT EXISTS idx_banners_position ON banners(position)`
    await client`CREATE INDEX IF NOT EXISTS idx_banners_is_active ON banners(is_active)`
    await client`CREATE INDEX IF NOT EXISTS idx_banners_dates ON banners(start_date, end_date)`
    
    // Testimonials indexes
    await client`CREATE INDEX IF NOT EXISTS idx_testimonials_product_id ON testimonials(product_id)`
    await client`CREATE INDEX IF NOT EXISTS idx_testimonials_is_approved ON testimonials(is_approved)`
    await client`CREATE INDEX IF NOT EXISTS idx_testimonials_is_featured ON testimonials(is_featured)`
    await client`CREATE INDEX IF NOT EXISTS idx_testimonials_rating ON testimonials(rating)`
    
    // Hero images indexes
    await client`CREATE INDEX IF NOT EXISTS idx_hero_images_position ON hero_images(position)`
    await client`CREATE INDEX IF NOT EXISTS idx_hero_images_is_active ON hero_images(is_active)`
    await client`CREATE INDEX IF NOT EXISTS idx_hero_images_dates ON hero_images(start_date, end_date)`
    
    console.log('✅ All indexes created')

    // Seed sample data
    console.log('🌱 Seeding sample data...')
    
    // Insert sample brands
    const sampleBrands = [
      {
        name: 'EcoBaby',
        slug: 'ecobaby',
        description: 'Organic and eco-friendly baby products',
        website: 'https://ecobaby.com',
        logo: 'https://res.cloudinary.com/dqdkbgshz/image/upload/v1757451944/baby-ecommerce/brands/brand-ecobaby.jpg',
        isActive: true,
        isFeatured: true,
        sortOrder: 1,
      },
      {
        name: 'SafeFeed',
        slug: 'safefeed',
        description: 'Safe feeding solutions for babies',
        website: 'https://safefeed.com',
        logo: 'https://res.cloudinary.com/dqdkbgshz/image/upload/v1757451945/baby-ecommerce/brands/brand-safefeed.jpg',
        isActive: true,
        isFeatured: true,
        sortOrder: 2,
      },
      {
        name: 'WoodenWonders',
        slug: 'woodenwonders',
        description: 'Educational wooden toys for children',
        website: 'https://woodenwonders.com',
        logo: 'https://res.cloudinary.com/dqdkbgshz/image/upload/v1757451946/baby-ecommerce/brands/brand-woodenwonders.jpg',
        isActive: true,
        isFeatured: false,
        sortOrder: 3,
      },
    ]

    for (const brand of sampleBrands) {
      await client`
        INSERT INTO brands (name, slug, description, website, logo, is_active, is_featured, sort_order, created_at, updated_at)
        VALUES (${brand.name}, ${brand.slug}, ${brand.description}, ${brand.website}, ${brand.logo}, ${brand.isActive}, ${brand.isFeatured}, ${brand.sortOrder}, NOW(), NOW())
        ON CONFLICT (slug) DO NOTHING
      `
    }
    console.log('✅ Sample brands seeded')

    // Insert sample banners
    const sampleBanners = [
      {
        title: 'Welcome to Baby Store',
        subtitle: 'Premium Baby Products',
        description: 'Discover safe, high-quality baby products and toys for your little ones',
        buttonText: 'Shop Now',
        buttonLink: '/products',
        position: 'hero',
        image: 'https://res.cloudinary.com/dqdkbgshz/image/upload/v1757451947/baby-ecommerce/banners/banner-hero-banner.jpg',
        mobileImage: 'https://res.cloudinary.com/dqdkbgshz/image/upload/v1757451948/baby-ecommerce/banners/banner-hero-banner-mobile.jpg',
        isActive: true,
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
        sortOrder: 1,
      },
      {
        title: 'New Arrivals',
        subtitle: 'Latest Baby Products',
        description: 'Check out our newest collection of baby essentials',
        buttonText: 'View Collection',
        buttonLink: '/products?new=true',
        position: 'top',
        image: 'https://res.cloudinary.com/dqdkbgshz/image/upload/v1757451949/baby-ecommerce/banners/banner-sale-banner.jpg',
        mobileImage: 'https://res.cloudinary.com/dqdkbgshz/image/upload/v1757451951/baby-ecommerce/banners/banner-sale-banner-mobile.jpg',
        isActive: true,
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days from now
        sortOrder: 2,
      },
    ]

    for (const banner of sampleBanners) {
      await client`
        INSERT INTO banners (title, subtitle, description, button_text, button_link, position, image, mobile_image, is_active, start_date, end_date, sort_order, created_at, updated_at)
        VALUES (${banner.title}, ${banner.subtitle}, ${banner.description}, ${banner.buttonText}, ${banner.buttonLink}, ${banner.position}, ${banner.image}, ${banner.mobileImage}, ${banner.isActive}, ${banner.startDate}, ${banner.endDate}, ${banner.sortOrder}, NOW(), NOW())
      `
    }
    console.log('✅ Sample banners seeded')

    // Insert sample testimonials
    const sampleTestimonials = [
      {
        customerName: 'Sarah Johnson',
        customerEmail: 'sarah.johnson@email.com',
        customerLocation: 'New York, USA',
        rating: 5,
        title: 'Amazing Quality Products',
        content: 'The baby products from this store are absolutely amazing! My little one loves the organic cotton teddy bear. The quality is outstanding and I feel safe knowing everything is made with natural materials.',
        customerImage: 'https://res.cloudinary.com/dqdkbgshz/image/upload/v1757451952/baby-ecommerce/testimonials/customer-customer-2.jpg',
        isApproved: true,
        isFeatured: true,
        sortOrder: 1,
      },
      {
        customerName: 'Michael Chen',
        customerEmail: 'michael.chen@email.com',
        customerLocation: 'California, USA',
        rating: 5,
        title: 'Perfect for My Baby',
        content: 'The BPA-free baby bottle set is perfect! My baby has been using it for months now and we\'ve had no issues. The anti-colic design really works and the bottles are easy to clean.',
        customerImage: 'https://res.cloudinary.com/dqdkbgshz/image/upload/v1757451953/baby-ecommerce/testimonials/customer-customer-3.jpg',
        isApproved: true,
        isFeatured: true,
        sortOrder: 2,
      },
    ]

    for (const testimonial of sampleTestimonials) {
      await client`
        INSERT INTO testimonials (customer_name, customer_email, customer_location, rating, title, content, customer_image, is_approved, is_featured, sort_order, created_at, updated_at)
        VALUES (${testimonial.customerName}, ${testimonial.customerEmail}, ${testimonial.customerLocation}, ${testimonial.rating}, ${testimonial.title}, ${testimonial.content}, ${testimonial.customerImage}, ${testimonial.isApproved}, ${testimonial.isFeatured}, ${testimonial.sortOrder}, NOW(), NOW())
      `
    }
    console.log('✅ Sample testimonials seeded')

    // Insert sample hero images
    const sampleHeroImages = [
      {
        title: 'Premium Baby Products For Little Ones',
        subtitle: 'Safe, High-Quality, and Affordable',
        description: 'Discover safe, high-quality baby products and toys. From feeding essentials to educational toys, we have everything your baby needs.',
        buttonText: 'Shop Now',
        buttonLink: '/products',
        position: 'main',
        image: 'https://res.cloudinary.com/dqdkbgshz/image/upload/v1757451955/baby-ecommerce/hero-images/hero-main-hero.jpg',
        mobileImage: 'https://res.cloudinary.com/dqdkbgshz/image/upload/v1757451958/baby-ecommerce/hero-images/hero-main-hero-mobile.jpg',
        isActive: true,
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year from now
        sortOrder: 1,
      },
      {
        title: 'New Collection Arrived',
        subtitle: 'Latest Baby Essentials',
        description: 'Check out our newest collection of baby products designed with love and care for your little ones.',
        buttonText: 'Explore Collection',
        buttonLink: '/products?new=true',
        position: 'secondary',
        image: 'https://res.cloudinary.com/dqdkbgshz/image/upload/v1757451960/baby-ecommerce/hero-images/hero-secondary-hero.jpg',
        mobileImage: 'https://res.cloudinary.com/dqdkbgshz/image/upload/v1757451962/baby-ecommerce/hero-images/hero-secondary-hero-mobile.jpg',
        isActive: true,
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(), // 90 days from now
        sortOrder: 2,
      },
    ]

    for (const heroImage of sampleHeroImages) {
      await client`
        INSERT INTO hero_images (title, subtitle, description, button_text, button_link, position, image, mobile_image, is_active, start_date, end_date, sort_order, created_at, updated_at)
        VALUES (${heroImage.title}, ${heroImage.subtitle}, ${heroImage.description}, ${heroImage.buttonText}, ${heroImage.buttonLink}, ${heroImage.position}, ${heroImage.image}, ${heroImage.mobileImage}, ${heroImage.isActive}, ${heroImage.startDate}, ${heroImage.endDate}, ${heroImage.sortOrder}, NOW(), NOW())
      `
    }
    console.log('✅ Sample hero images seeded')

    console.log('\n🎉 Database migration completed successfully!')
    console.log('📊 Created tables:')
    console.log('  ✅ brands')
    console.log('  ✅ banners')
    console.log('  ✅ testimonials')
    console.log('  ✅ hero_images')
    console.log('  ✅ Updated products table with brand_id')
    console.log('📈 Seeded sample data for all tables')

  } catch (error) {
    console.error('❌ Migration failed:', error)
    throw error
  } finally {
    await client.end()
  }
}

// Run the migration
migrateNewTables()
  .then(() => {
    console.log('✅ Migration completed successfully!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('💥 Migration failed:', error)
    process.exit(1)
  })
