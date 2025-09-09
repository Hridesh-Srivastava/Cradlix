import fs from 'fs'
import crypto from 'crypto'

function generateSecret(): string {
  return crypto.randomBytes(32).toString('hex')
}

function setupEnvironment() {
  console.log('🔧 Setting up environment variables for Next.js 15...')
  
  const envContent = `# NextAuth Configuration
NEXTAUTH_SECRET=${generateSecret()}
NEXTAUTH_URL=http://localhost:3000

# Database Configuration
DATABASE_URL=postgresql://postgres:password@localhost:5432/baby_ecommerce

# Google OAuth (Optional - for Google login)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret

# Razorpay Configuration (Optional - for payments)
RAZORPAY_KEY_ID=your-razorpay-key-id
RAZORPAY_KEY_SECRET=your-razorpay-key-secret
`

  try {
    // Check if .env.local exists
    if (fs.existsSync('.env.local')) {
      console.log('✅ .env.local already exists')
      return
    }
    
    // Check if .env exists
    if (fs.existsSync('.env')) {
      console.log('✅ .env already exists')
      return
    }
    
    // Create .env file
    fs.writeFileSync('.env', envContent)
    console.log('✅ Created .env file with secure NEXTAUTH_SECRET')
    console.log('🔑 Generated NEXTAUTH_SECRET:', generateSecret())
    
  } catch (error) {
    console.error('❌ Error creating environment file:', error)
    console.log('\n📝 Please create .env file manually with:')
    console.log('NEXTAUTH_SECRET=' + generateSecret())
    console.log('NEXTAUTH_URL=http://localhost:3000')
  }
}

setupEnvironment()
