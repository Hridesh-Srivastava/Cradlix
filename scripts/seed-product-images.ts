import { db } from '../lib/db/postgres'
import { products, productImages } from '../lib/db/schema'
import { eq } from 'drizzle-orm'
import { uploadImage } from '../lib/cloudinary'
import fs from 'fs'
import path from 'path'

async function seedProductImages() {
  console.log('🖼️ Seeding product images...')

  try {
    // Get all products
    const allProducts = await db.select().from(products)
    console.log(`Found ${allProducts.length} products to seed images for`)

    // Sample image URLs (you can replace these with actual image URLs)
    const sampleImages = [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=800&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop&crop=center',
    ]

    for (const product of allProducts) {
      console.log(`Processing product: ${product.name}`)

      // Check if product already has images
      const existingImages = await db.select()
        .from(productImages)
        .where(eq(productImages.productId, product.id))

      if (existingImages.length > 0) {
        console.log(`  ⏭️ Product already has ${existingImages.length} images, skipping`)
        continue
      }

      // Upload sample image to Cloudinary
      try {
        const imageUrl = sampleImages[Math.floor(Math.random() * sampleImages.length)]
        
        // Fetch image from URL
        const response = await fetch(imageUrl)
        if (!response.ok) {
          throw new Error(`Failed to fetch image: ${response.statusText}`)
        }
        
        const imageBuffer = Buffer.from(await response.arrayBuffer())
        
        // Upload to Cloudinary
        const uploadResult = await uploadImage(imageBuffer, 'baby-ecommerce/products', {
          public_id: `baby-ecommerce/products/${product.id}-primary`,
        })

        if (uploadResult.success) {
          // Save to database
          await db.insert(productImages).values({
            productId: product.id,
            url: uploadResult.data.secure_url,
            altText: `${product.name} - Primary Image`,
            sortOrder: 0,
            isPrimary: true,
            createdAt: new Date(),
          })

          console.log(`  ✅ Uploaded image for ${product.name}`)
        } else {
          console.log(`  ❌ Failed to upload image for ${product.name}: ${uploadResult.error}`)
        }
      } catch (error) {
        console.log(`  ❌ Error processing ${product.name}:`, error)
      }
    }

    console.log('✅ Product image seeding completed!')
  } catch (error) {
    console.error('❌ Error seeding product images:', error)
  }
}

// Run the seeding
seedProductImages()
  .then(() => {
    console.log('🎉 Product image seeding finished!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('💥 Product image seeding failed:', error)
    process.exit(1)
  })
