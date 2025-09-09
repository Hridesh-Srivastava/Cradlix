import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import { db } from '@/lib/db/postgres'
import { heroImages } from '@/lib/db/schema'
import { eq, and, or, ilike, desc, asc } from 'drizzle-orm'
import { v2 as cloudinary } from 'cloudinary'
import { z } from 'zod'

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dqdkbgshz',
  api_key: process.env.CLOUDINARY_API_KEY || '935333464895341',
  api_secret: process.env.CLOUDINARY_API_SECRET || '4ZRVJ9Ow_9G8B4Bn0JvaoEdo6jQ',
})

// Create hero image schema
const createHeroImageSchema = z.object({
  title: z.string().min(1),
  subtitle: z.string().optional(),
  description: z.string().optional(),
  buttonText: z.string().optional(),
  buttonLink: z.string().url().optional(),
  position: z.enum(['main', 'secondary', 'featured']).default('main'),
  isActive: z.boolean().default(true),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  sortOrder: z.number().default(0),
})

// Update hero image schema
const updateHeroImageSchema = createHeroImageSchema.partial()

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    // Check if user is authenticated and is admin
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const position = searchParams.get('position')
    const isActive = searchParams.get('isActive')

    const offset = (page - 1) * limit

    // Build query conditions
    let whereConditions = []
    if (search) {
      whereConditions.push(
        or(
          ilike(heroImages.title, `%${search}%`),
          ilike(heroImages.subtitle, `%${search}%`),
          ilike(heroImages.description, `%${search}%`)
        )
      )
    }
    if (position) {
      whereConditions.push(eq(heroImages.position, position))
    }
    if (isActive !== null) {
      whereConditions.push(eq(heroImages.isActive, isActive === 'true'))
    }

    const whereClause = whereConditions.length > 0 ? and(...whereConditions) : undefined

    // Get hero images from database
    const heroImagesList = await db
      .select()
      .from(heroImages)
      .where(whereClause)
      .orderBy(asc(heroImages.sortOrder), desc(heroImages.createdAt))
      .limit(limit)
      .offset(offset)

    // Get total count
    const totalResult = await db
      .select({ count: heroImages.id })
      .from(heroImages)
      .where(whereClause)
    
    const total = totalResult.length

    return NextResponse.json({
      success: true,
      data: {
        heroImages: heroImagesList,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    })
  } catch (error) {
    console.error('Admin hero images GET error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    // Check if user is authenticated and is admin
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const heroImageData = JSON.parse(formData.get('heroImage') as string)
    const image = formData.get('image') as File
    const mobileImage = formData.get('mobileImage') as File

    // Validate hero image data
    const validatedData = createHeroImageSchema.parse(heroImageData)

    // Upload images to Cloudinary
    let imageUrl = null
    let mobileImageUrl = null

    if (image && image.size > 0) {
      const bytes = await image.arrayBuffer()
      const buffer = Buffer.from(bytes)
      
      const uploadResult = await cloudinary.uploader.upload(
        `data:image/png;base64,${buffer.toString('base64')}`,
        {
          folder: 'baby-ecommerce/hero-images',
          public_id: `hero-${validatedData.position}-${Date.now()}`,
          resource_type: 'image',
          transformation: [
            { width: 1920, height: 800, crop: 'fill', gravity: 'auto' },
            { quality: 'auto' },
            { format: 'auto' }
          ]
        }
      )

      imageUrl = uploadResult.secure_url
    }

    if (mobileImage && mobileImage.size > 0) {
      const bytes = await mobileImage.arrayBuffer()
      const buffer = Buffer.from(bytes)
      
      const uploadResult = await cloudinary.uploader.upload(
        `data:image/png;base64,${buffer.toString('base64')}`,
        {
          folder: 'baby-ecommerce/hero-images',
          public_id: `hero-${validatedData.position}-mobile-${Date.now()}`,
          resource_type: 'image',
          transformation: [
            { width: 768, height: 400, crop: 'fill', gravity: 'auto' },
            { quality: 'auto' },
            { format: 'auto' }
          ]
        }
      )

      mobileImageUrl = uploadResult.secure_url
    }

    // Save to database
    const [newHeroImage] = await db.insert(heroImages).values({
      ...validatedData,
      image: imageUrl,
      mobileImage: mobileImageUrl,
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning()

    return NextResponse.json({
      success: true,
      data: {
        heroImage: newHeroImage,
      },
    })
  } catch (error) {
    console.error('Admin hero images POST error:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
