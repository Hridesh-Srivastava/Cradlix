import { db } from '../lib/db/postgres'
import { products, productImages } from '../lib/db/schema'
import { eq } from 'drizzle-orm'

async function seedLocalImages() {
  console.log('🖼️ Seeding local product images...')

  try {
    // Get all products
    const allProducts = await db.select().from(products)
    console.log(`Found ${allProducts.length} products to seed images for`)

    // Map products to their local images
    const productImageMap = {
      'organic-cotton-teddy-bear': '/organic-cotton-teddy-bear-soft-toy.jpg',
      'bpa-free-baby-bottle-set': '/baby-bottle-feeding-set-bpa-free.jpg',
      'wooden-stacking-rings': '/wooden-stacking-rings-educational-toy.jpg',
    }

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

      // Get the local image path for this product
      const imagePath = productImageMap[product.slug as keyof typeof productImageMap]
      
      if (imagePath) {
        // Save to database with local path
        await db.insert(productImages).values({
          productId: product.id,
          url: imagePath,
          altText: `${product.name} - Primary Image`,
          sortOrder: 0,
          isPrimary: true,
          createdAt: new Date(),
        })

        console.log(`  ✅ Added local image for ${product.name}: ${imagePath}`)
      } else {
        console.log(`  ⚠️ No local image found for ${product.slug}`)
      }
    }

    console.log('✅ Local image seeding completed!')
  } catch (error) {
    console.error('❌ Error seeding local images:', error)
  }
}

// Run the seeding
seedLocalImages()
  .then(() => {
    console.log('🎉 Local image seeding finished!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('💥 Local image seeding failed:', error)
    process.exit(1)
  })
