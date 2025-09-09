import { db } from '../lib/db/postgres'
import { productImages, products } from '../lib/db/schema'

async function checkImages() {
  try {
    console.log('🔍 Checking database for images...')
    
    const images = await db.select().from(productImages)
    console.log(`Total images in database: ${images.length}`)
    
    if (images.length > 0) {
      console.log('Sample image:', images[0])
    } else {
      console.log('❌ No images found in database')
    }
    
    const allProducts = await db.select().from(products)
    console.log(`Total products in database: ${allProducts.length}`)
    
    if (allProducts.length > 0) {
      console.log('Sample product:', allProducts[0])
    }
    
  } catch (error) {
    console.error('Error:', error)
  }
}

checkImages()
  .then(() => {
    console.log('✅ Check completed!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('💥 Check failed:', error)
    process.exit(1)
  })
