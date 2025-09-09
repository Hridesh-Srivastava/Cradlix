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

async function seedCloudinaryData() {
  console.log('🌱 Seeding Cloudinary with sample data...')

  try {
    // Create sample images for different categories
    const sampleImages = {
      categories: [
        {
          name: 'Baby Toys',
          image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop&crop=center',
          folder: 'baby-ecommerce/categories'
        },
        {
          name: 'Feeding',
          image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop&crop=center',
          folder: 'baby-ecommerce/categories'
        },
        {
          name: 'Baby Care',
          image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop&crop=center',
          folder: 'baby-ecommerce/categories'
        }
      ],
      brands: [
        {
          name: 'EcoBaby',
          logo: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop&crop=center',
          folder: 'baby-ecommerce/brands'
        },
        {
          name: 'SafeFeed',
          logo: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=200&h=200&fit=crop&crop=center',
          folder: 'baby-ecommerce/brands'
        },
        {
          name: 'WoodenWonders',
          logo: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop&crop=center',
          folder: 'baby-ecommerce/brands'
        }
      ],
      banners: [
        {
          name: 'Hero Banner',
          image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&h=400&fit=crop&crop=center',
          mobileImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=300&fit=crop&crop=center',
          folder: 'baby-ecommerce/banners'
        },
        {
          name: 'Sale Banner',
          image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200&h=400&fit=crop&crop=center',
          mobileImage: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=300&fit=crop&crop=center',
          folder: 'baby-ecommerce/banners'
        }
      ],
      testimonials: [
        {
          name: 'Customer 1',
          image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
          folder: 'baby-ecommerce/testimonials'
        },
        {
          name: 'Customer 2',
          image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
          folder: 'baby-ecommerce/testimonials'
        },
        {
          name: 'Customer 3',
          image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
          folder: 'baby-ecommerce/testimonials'
        }
      ],
      heroImages: [
        {
          name: 'Main Hero',
          image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&h=800&fit=crop&crop=center',
          mobileImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=768&h=400&fit=crop&crop=center',
          folder: 'baby-ecommerce/hero-images'
        },
        {
          name: 'Secondary Hero',
          image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1920&h=800&fit=crop&crop=center',
          mobileImage: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=768&h=400&fit=crop&crop=center',
          folder: 'baby-ecommerce/hero-images'
        }
      ]
    }

    let totalUploaded = 0

    // Upload category images
    console.log('📂 Uploading category images...')
    for (const category of sampleImages.categories) {
      try {
        const response = await fetch(category.image)
        const buffer = Buffer.from(await response.arrayBuffer())
        
        const uploadResult = await cloudinary.uploader.upload(
          `data:image/jpeg;base64,${buffer.toString('base64')}`,
          {
            folder: category.folder,
            public_id: `category-${category.name.toLowerCase().replace(/\s+/g, '-')}`,
            resource_type: 'image',
            transformation: [
              { width: 400, height: 300, crop: 'fill', gravity: 'auto' },
              { quality: 'auto' },
              { format: 'auto' }
            ]
          }
        )
        
        console.log(`  ✅ Uploaded: ${category.name} - ${uploadResult.secure_url}`)
        totalUploaded++
      } catch (error) {
        console.log(`  ❌ Failed to upload ${category.name}: ${error}`)
      }
    }

    // Upload brand logos
    console.log('🏷️ Uploading brand logos...')
    for (const brand of sampleImages.brands) {
      try {
        const response = await fetch(brand.logo)
        const buffer = Buffer.from(await response.arrayBuffer())
        
        const uploadResult = await cloudinary.uploader.upload(
          `data:image/jpeg;base64,${buffer.toString('base64')}`,
          {
            folder: brand.folder,
            public_id: `brand-${brand.name.toLowerCase().replace(/\s+/g, '-')}`,
            resource_type: 'image',
            transformation: [
              { width: 200, height: 200, crop: 'fill', gravity: 'auto' },
              { quality: 'auto' },
              { format: 'auto' }
            ]
          }
        )
        
        console.log(`  ✅ Uploaded: ${brand.name} - ${uploadResult.secure_url}`)
        totalUploaded++
      } catch (error) {
        console.log(`  ❌ Failed to upload ${brand.name}: ${error}`)
      }
    }

    // Upload banner images
    console.log('🎯 Uploading banner images...')
    for (const banner of sampleImages.banners) {
      try {
        // Upload desktop banner
        const response = await fetch(banner.image)
        const buffer = Buffer.from(await response.arrayBuffer())
        
        const uploadResult = await cloudinary.uploader.upload(
          `data:image/jpeg;base64,${buffer.toString('base64')}`,
          {
            folder: banner.folder,
            public_id: `banner-${banner.name.toLowerCase().replace(/\s+/g, '-')}`,
            resource_type: 'image',
            transformation: [
              { width: 1200, height: 400, crop: 'fill', gravity: 'auto' },
              { quality: 'auto' },
              { format: 'auto' }
            ]
          }
        )
        
        console.log(`  ✅ Uploaded: ${banner.name} - ${uploadResult.secure_url}`)
        totalUploaded++

        // Upload mobile banner
        const mobileResponse = await fetch(banner.mobileImage)
        const mobileBuffer = Buffer.from(await mobileResponse.arrayBuffer())
        
        const mobileUploadResult = await cloudinary.uploader.upload(
          `data:image/jpeg;base64,${mobileBuffer.toString('base64')}`,
          {
            folder: banner.folder,
            public_id: `banner-${banner.name.toLowerCase().replace(/\s+/g, '-')}-mobile`,
            resource_type: 'image',
            transformation: [
              { width: 600, height: 300, crop: 'fill', gravity: 'auto' },
              { quality: 'auto' },
              { format: 'auto' }
            ]
          }
        )
        
        console.log(`  ✅ Uploaded: ${banner.name} Mobile - ${mobileUploadResult.secure_url}`)
        totalUploaded++
      } catch (error) {
        console.log(`  ❌ Failed to upload ${banner.name}: ${error}`)
      }
    }

    // Upload testimonial images
    console.log('💬 Uploading testimonial images...')
    for (const testimonial of sampleImages.testimonials) {
      try {
        const response = await fetch(testimonial.image)
        const buffer = Buffer.from(await response.arrayBuffer())
        
        const uploadResult = await cloudinary.uploader.upload(
          `data:image/jpeg;base64,${buffer.toString('base64')}`,
          {
            folder: testimonial.folder,
            public_id: `customer-${testimonial.name.toLowerCase().replace(/\s+/g, '-')}`,
            resource_type: 'image',
            transformation: [
              { width: 150, height: 150, crop: 'fill', gravity: 'face' },
              { quality: 'auto' },
              { format: 'auto' }
            ]
          }
        )
        
        console.log(`  ✅ Uploaded: ${testimonial.name} - ${uploadResult.secure_url}`)
        totalUploaded++
      } catch (error) {
        console.log(`  ❌ Failed to upload ${testimonial.name}: ${error}`)
      }
    }

    // Upload hero images
    console.log('🎨 Uploading hero images...')
    for (const heroImage of sampleImages.heroImages) {
      try {
        // Upload desktop hero
        const response = await fetch(heroImage.image)
        const buffer = Buffer.from(await response.arrayBuffer())
        
        const uploadResult = await cloudinary.uploader.upload(
          `data:image/jpeg;base64,${buffer.toString('base64')}`,
          {
            folder: heroImage.folder,
            public_id: `hero-${heroImage.name.toLowerCase().replace(/\s+/g, '-')}`,
            resource_type: 'image',
            transformation: [
              { width: 1920, height: 800, crop: 'fill', gravity: 'auto' },
              { quality: 'auto' },
              { format: 'auto' }
            ]
          }
        )
        
        console.log(`  ✅ Uploaded: ${heroImage.name} - ${uploadResult.secure_url}`)
        totalUploaded++

        // Upload mobile hero
        const mobileResponse = await fetch(heroImage.mobileImage)
        const mobileBuffer = Buffer.from(await mobileResponse.arrayBuffer())
        
        const mobileUploadResult = await cloudinary.uploader.upload(
          `data:image/jpeg;base64,${mobileBuffer.toString('base64')}`,
          {
            folder: heroImage.folder,
            public_id: `hero-${heroImage.name.toLowerCase().replace(/\s+/g, '-')}-mobile`,
            resource_type: 'image',
            transformation: [
              { width: 768, height: 400, crop: 'fill', gravity: 'auto' },
              { quality: 'auto' },
              { format: 'auto' }
            ]
          }
        )
        
        console.log(`  ✅ Uploaded: ${heroImage.name} Mobile - ${mobileUploadResult.secure_url}`)
        totalUploaded++
      } catch (error) {
        console.log(`  ❌ Failed to upload ${heroImage.name}: ${error}`)
      }
    }

    console.log(`\n✅ Cloudinary data seeding completed!`)
    console.log(`📊 Total images uploaded: ${totalUploaded}`)
    console.log(`📁 All images organized in proper folders`)

  } catch (error) {
    console.error('❌ Error seeding Cloudinary data:', error)
  }
}

// Run the seeding
seedCloudinaryData()
  .then(() => {
    console.log('🎉 Cloudinary data seeding finished!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('💥 Cloudinary data seeding failed:', error)
    process.exit(1)
  })
