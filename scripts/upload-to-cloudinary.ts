import { config } from 'dotenv'
import { v2 as cloudinary } from 'cloudinary'
import { db } from '../lib/db/postgres'
import { products, productImages } from '../lib/db/schema'
import { eq } from 'drizzle-orm'
import fs from 'fs'
import path from 'path'

// Load environment variables
config()

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

async function uploadToCloudinary() {
  console.log('Uploading local images to Cloudinary...')

  try {
    // Get all products with their current images
    const allProducts = await db.select().from(products)
    console.log(`Found ${allProducts.length} products`)

    // Map products to their local images
    const productImageMap = {
      'organic-cotton-teddy-bear': '/organic-cotton-teddy-bear-soft-toy.jpg',
      'bpa-free-baby-bottle-set': '/baby-bottle-feeding-set-bpa-free.jpg',
      'wooden-stacking-rings': '/wooden-stacking-rings-educational-toy.jpg',
    }

    for (const product of allProducts) {
      console.log(`Processing product: ${product.name}`)

      // Get the local image path for this product
      const localImagePath = productImageMap[product.slug as keyof typeof productImageMap]
      
      if (localImagePath) {
        // Get the full path to the image file
        const fullImagePath = path.join(process.cwd(), 'public', localImagePath.substring(1))
        
        if (fs.existsSync(fullImagePath)) {
          console.log(`Uploading ${localImagePath} to Cloudinary...`)
          
          try {
            // Upload to Cloudinary
            const uploadResult = await cloudinary.uploader.upload(fullImagePath, {
              folder: 'baby-ecommerce/products',
              public_id: `baby-ecommerce/products/${product.id}-primary`,
              resource_type: 'image',
            })

            console.log(`Uploaded successfully! URL: ${uploadResult.secure_url}`)

            // Update the database with the Cloudinary URL
            await db.update(productImages)
              .set({
                url: uploadResult.secure_url,
                updatedAt: new Date(),
              })
              .where(eq(productImages.productId, product.id))

            console.log(`Updated database with Cloudinary URL`)
            
          } catch (uploadError) {
            console.log(`Upload failed: ${uploadError}`)
          }
        } else {
          console.log(`Image file not found: ${fullImagePath}`)
        }
      } else {
        console.log(`No image mapping found for ${product.slug}`)
      }
    }

    console.log('Cloudinary upload completed!')
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error)
  }
}

// Run the upload
uploadToCloudinary()
  .then(() => {
    console.log('Cloudinary upload finished!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('Cloudinary upload failed:', error)
    process.exit(1)
  })
