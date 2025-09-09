import { db } from '../lib/db/postgres'
import { users, categories, products, productImages } from '../lib/db/schema'
import bcrypt from 'bcryptjs'

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...')

    // Create categories
    console.log('📁 Creating categories...')
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
        name: 'Clothing',
        slug: 'clothing',
        description: 'Comfortable and safe baby clothing',
        imageUrl: 'https://res.cloudinary.com/your-cloud/image/upload/v1/clothing-category.jpg',
        isActive: true,
        sortOrder: 3,
      },
      {
        name: 'Bath & Care',
        slug: 'bath-care',
        description: 'Baby bath and care products',
        imageUrl: 'https://res.cloudinary.com/your-cloud/image/upload/v1/bath-care-category.jpg',
        isActive: true,
        sortOrder: 4,
      },
    ]

    const insertedCategories = await db.insert(categories).values(categoryData).returning()
    console.log(`✅ Created ${insertedCategories.length} categories`)

    // Create a test user
    console.log('👤 Creating test user...')
    const hashedPassword = await bcrypt.hash('password123', 12)
    const testUser = await db.insert(users).values({
      name: 'Test User',
      email: 'test@example.com',
      password: hashedPassword,
      role: 'customer',
    }).returning()
    console.log('✅ Created test user')

    // Create products
    console.log('🛍️ Creating products...')
    const productData = [
      {
        name: 'Organic Cotton Teddy Bear',
        slug: 'organic-cotton-teddy-bear',
        description: 'A soft and cuddly organic cotton teddy bear perfect for your little one. Made with 100% organic cotton and safe for babies.',
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
        metaDescription: 'Buy the best organic cotton teddy bear for your baby. Safe, soft, and eco-friendly.',
      },
      {
        name: 'Wooden Stacking Rings',
        slug: 'wooden-stacking-rings',
        description: 'Educational wooden stacking rings that help develop fine motor skills and hand-eye coordination. Made from sustainable wood.',
        shortDescription: 'Educational wooden stacking rings for toddlers',
        sku: 'RINGS-001',
        price: '18.99',
        inventoryQuantity: 8,
        isFeatured: false,
        brand: 'EcoPlay',
        ageRange: '6 months - 2 years',
        categoryId: insertedCategories[0].id,
        materials: ['Sustainably Sourced Wood', 'Non-toxic Paint'],
        safetyCertifications: ['CE', 'ASTM F963', 'EN71'],
        isActive: true,
        metaTitle: 'Wooden Stacking Rings - Educational Baby Toy',
        metaDescription: 'Educational wooden stacking rings for developing motor skills in babies and toddlers.',
      },
      {
        name: 'Baby Bottle Set',
        slug: 'baby-bottle-set',
        description: 'Complete baby bottle feeding set with BPA-free bottles, nipples, and cleaning accessories. Perfect for feeding your little one.',
        shortDescription: 'BPA-free baby bottle feeding set',
        sku: 'BOTTLE-001',
        price: '32.99',
        comparePrice: '39.99',
        inventoryQuantity: 0,
        isFeatured: false,
        brand: 'SafeFeed',
        ageRange: '0-12 months',
        categoryId: insertedCategories[1].id,
        materials: ['BPA-free Plastic', 'Silicone'],
        safetyCertifications: ['FDA Approved', 'BPA-free'],
        isActive: true,
        metaTitle: 'Baby Bottle Set - BPA-free Feeding Essentials',
        metaDescription: 'Complete BPA-free baby bottle set with all feeding essentials for your baby.',
      },
      {
        name: 'Organic Baby Onesie',
        slug: 'organic-baby-onesie',
        description: 'Soft and comfortable organic cotton onesie for your baby. Gentle on sensitive skin and perfect for everyday wear.',
        shortDescription: 'Soft organic cotton baby onesie',
        sku: 'ONESIE-001',
        price: '15.99',
        inventoryQuantity: 25,
        isFeatured: true,
        brand: 'TinyTots',
        ageRange: '0-12 months',
        categoryId: insertedCategories[2].id,
        materials: ['100% Organic Cotton'],
        safetyCertifications: ['GOTS Certified', 'OEKO-TEX'],
        isActive: true,
        metaTitle: 'Organic Baby Onesie - Comfortable Cotton Clothing',
        metaDescription: 'Soft and comfortable organic cotton onesie for your baby. GOTS certified.',
      },
      {
        name: 'Baby Bath Set',
        slug: 'baby-bath-set',
        description: 'Complete baby bath set with gentle, tear-free shampoo, body wash, and soft washcloth. Made with natural ingredients.',
        shortDescription: 'Gentle baby bath and care set',
        sku: 'BATH-001',
        price: '22.99',
        inventoryQuantity: 12,
        isFeatured: false,
        brand: 'GentleCare',
        ageRange: '0-24 months',
        categoryId: insertedCategories[3].id,
        materials: ['Natural Ingredients', 'Organic Extracts'],
        safetyCertifications: ['Pediatrician Tested', 'Hypoallergenic'],
        isActive: true,
        metaTitle: 'Baby Bath Set - Gentle Care Products',
        metaDescription: 'Complete baby bath set with gentle, natural ingredients for sensitive skin.',
      },
    ]

    const insertedProducts = await db.insert(products).values(productData).returning()
    console.log(`✅ Created ${insertedProducts.length} products`)

    // Create product images
    console.log('🖼️ Creating product images...')
    const imageData = [
      // Teddy Bear images
      {
        productId: insertedProducts[0].id,
        url: 'https://res.cloudinary.com/your-cloud/image/upload/v1/organic-cotton-teddy-bear-1.jpg',
        altText: 'Organic Cotton Teddy Bear - Front View',
        sortOrder: 1,
        isPrimary: true,
      },
      {
        productId: insertedProducts[0].id,
        url: 'https://res.cloudinary.com/your-cloud/image/upload/v1/organic-cotton-teddy-bear-2.jpg',
        altText: 'Organic Cotton Teddy Bear - Side View',
        sortOrder: 2,
        isPrimary: false,
      },
      // Stacking Rings images
      {
        productId: insertedProducts[1].id,
        url: 'https://res.cloudinary.com/your-cloud/image/upload/v1/wooden-stacking-rings-1.jpg',
        altText: 'Wooden Stacking Rings - Complete Set',
        sortOrder: 1,
        isPrimary: true,
      },
      // Baby Bottle images
      {
        productId: insertedProducts[2].id,
        url: 'https://res.cloudinary.com/your-cloud/image/upload/v1/baby-bottle-set-1.jpg',
        altText: 'Baby Bottle Set - Complete Kit',
        sortOrder: 1,
        isPrimary: true,
      },
      // Onesie images
      {
        productId: insertedProducts[3].id,
        url: 'https://res.cloudinary.com/your-cloud/image/upload/v1/organic-baby-onesie-1.jpg',
        altText: 'Organic Baby Onesie - Front View',
        sortOrder: 1,
        isPrimary: true,
      },
      // Bath Set images
      {
        productId: insertedProducts[4].id,
        url: 'https://res.cloudinary.com/your-cloud/image/upload/v1/baby-bath-set-1.jpg',
        altText: 'Baby Bath Set - Complete Kit',
        sortOrder: 1,
        isPrimary: true,
      },
    ]

    await db.insert(productImages).values(imageData)
    console.log(`✅ Created ${imageData.length} product images`)

    console.log('🎉 Database seeding completed successfully!')
    console.log('\n📋 Summary:')
    console.log(`- Categories: ${insertedCategories.length}`)
    console.log(`- Products: ${insertedProducts.length}`)
    console.log(`- Product Images: ${imageData.length}`)
    console.log(`- Test User: test@example.com (password: password123)`)
    
  } catch (error) {
    console.error('❌ Error seeding database:', error)
    throw error
  }
}

// Run the seeding function
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log('✅ Seeding completed')
      process.exit(0)
    })
    .catch((error) => {
      console.error('❌ Seeding failed:', error)
      process.exit(1)
    })
}

export { seedDatabase }
