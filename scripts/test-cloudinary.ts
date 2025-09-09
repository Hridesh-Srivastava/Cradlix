import { config } from 'dotenv'
import { uploadImage } from '../lib/cloudinary'

// Load environment variables
config()

async function testCloudinary() {
  try {
    console.log('🧪 Testing Cloudinary upload...')
    
    // Check environment variables
    console.log('Cloudinary config:')
    console.log('CLOUD_NAME:', process.env.CLOUDINARY_CLOUD_NAME)
    console.log('API_KEY:', process.env.CLOUDINARY_API_KEY ? 'Set' : 'Not set')
    console.log('API_SECRET:', process.env.CLOUDINARY_API_SECRET ? 'Set' : 'Not set')
    
    // Create a simple test image (1x1 pixel PNG)
    const testImageBuffer = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
      'base64'
    )
    
    console.log('📤 Uploading test image...')
    const result = await uploadImage(testImageBuffer, 'test', {
      public_id: 'test-image',
    })
    
    if (result.success) {
      console.log('✅ Upload successful!')
      console.log('URL:', result.data.secure_url)
      console.log('Public ID:', result.data.public_id)
    } else {
      console.log('❌ Upload failed:', result.error)
    }
    
  } catch (error) {
    console.error('💥 Test failed:', error)
  }
}

testCloudinary()
  .then(() => {
    console.log('🎉 Test completed!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('💥 Test failed:', error)
    process.exit(1)
  })
