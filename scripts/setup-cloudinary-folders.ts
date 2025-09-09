import { config } from 'dotenv'
import { v2 as cloudinary } from 'cloudinary'

// Load environment variables
config()

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dqdkbgshz',
  api_key: process.env.CLOUDINARY_API_KEY || '935333464895341',
  api_secret: process.env.CLOUDINARY_API_SECRET || '4ZRVJ9Ow_9G8B4Bn0JvaoEdo6jQ',
})

async function setupCloudinaryFolders() {
  console.log('📁 Setting up Cloudinary folder structure...')

  try {
    // Create a placeholder image to establish folder structure
    const placeholderImage = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
      'base64'
    )

    const folders = [
      'baby-ecommerce/products',
      'baby-ecommerce/categories', 
      'baby-ecommerce/brands',
      'baby-ecommerce/users/avatars',
      'baby-ecommerce/users/custom-avatars',
      'baby-ecommerce/banners',
      'baby-ecommerce/testimonials',
      'baby-ecommerce/reviews',
      'baby-ecommerce/blog',
      'baby-ecommerce/hero-images',
      'baby-ecommerce/featured-collections',
      'baby-ecommerce/sale-banners',
      'baby-ecommerce/social-proof',
      'baby-ecommerce/email-templates',
      'baby-ecommerce/legal-documents'
    ]

    console.log('📂 Creating folder structure...')
    
    for (const folder of folders) {
      try {
        // Upload a tiny placeholder to create the folder
        const result = await cloudinary.uploader.upload(
          `data:image/png;base64,${placeholderImage.toString('base64')}`,
          {
            folder: folder,
            public_id: `${folder}/.folder-placeholder`,
            resource_type: 'image',
            tags: ['folder-setup', 'placeholder']
          }
        )
        
        console.log(`  ✅ Created folder: ${folder}`)
        
        // Delete the placeholder immediately
        await cloudinary.uploader.destroy(result.public_id)
        console.log(`  🗑️ Cleaned up placeholder for: ${folder}`)
        
      } catch (error) {
        console.log(`  ⚠️ Folder ${folder} might already exist or error: ${error}`)
      }
    }

    console.log('✅ Cloudinary folder structure setup completed!')
    console.log('\n📁 Created folders:')
    folders.forEach(folder => console.log(`  - ${folder}`))
    
  } catch (error) {
    console.error('❌ Error setting up folders:', error)
  }
}

// Run the setup
setupCloudinaryFolders()
  .then(() => {
    console.log('🎉 Cloudinary folder setup finished!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('💥 Folder setup failed:', error)
    process.exit(1)
  })
