import { NextRequest, NextResponse } from 'next/server'
import { auth } from "@/lib/auth/config"
import { authOptions } from '@/lib/auth/config'
import { db } from '@/lib/db/postgres'
import { banners } from '@/lib/db/schema'
import { eq, and, or, ilike, desc, asc } from 'drizzle-orm'
import { v2 as cloudinary } from 'cloudinary'
import { z } from 'zod'

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

// Create banner schema
const createBannerSchema = z.object({
  title: z.string().min(1),
  subtitle: z.string().optional(),
  description: z.string().optional(),
  buttonText: z.string().optional(),
  buttonLink: z.string().url().optional(),
  position: z.enum(['hero', 'top', 'middle', 'bottom', 'sidebar']).default('hero'),
  isActive: z.boolean().default(true),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  sortOrder: z.number().default(0),
})

// Update banner schema
const updateBannerSchema = createBannerSchema.partial()

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    
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
          ilike(banners.title, `%${search}%`),
          ilike(banners.subtitle, `%${search}%`),
          ilike(banners.description, `%${search}%`)
        )
      )
    }
    if (position) {
      whereConditions.push(eq(banners.position, position))
    }
    if (isActive !== null) {
      whereConditions.push(eq(banners.isActive, isActive === 'true'))
    }

    const whereClause = whereConditions.length > 0 ? and(...whereConditions) : undefined

    // Get banners from database
    const bannersList = await db
      .select()
      .from(banners)
      .where(whereClause)
      .orderBy(asc(banners.sortOrder), desc(banners.createdAt))
      .limit(limit)
      .offset(offset)

    // Get total count
    const totalResult = await db
      .select({ count: banners.id })
      .from(banners)
      .where(whereClause)
    
    const total = totalResult.length

    return NextResponse.json({
      success: true,
      data: {
        banners: bannersList,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    })
  } catch (error) {
    console.error('Admin banners GET error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    // Check if user is authenticated and is admin
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const bannerData = JSON.parse(formData.get('banner') as string)
    const image = formData.get('image') as File
    const mobileImage = formData.get('mobileImage') as File

    // Validate banner data
    const validatedData = createBannerSchema.parse(bannerData)

    // Upload images to Cloudinary
    let imageUrl = null
    let mobileImageUrl = null

    if (image && image.size > 0) {
      const bytes = await image.arrayBuffer()
      const buffer = Buffer.from(bytes)
      
      const uploadResult = await cloudinary.uploader.upload(
        `data:image/png;base64,${buffer.toString('base64')}`,
        {
          folder: 'baby-ecommerce/banners',
          public_id: `banner-${validatedData.position}-${Date.now()}`,
          resource_type: 'image',
          transformation: [
            { width: 1200, height: 400, crop: 'fill', gravity: 'auto' },
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
          folder: 'baby-ecommerce/banners',
          public_id: `banner-${validatedData.position}-mobile-${Date.now()}`,
          resource_type: 'image',
          transformation: [
            { width: 600, height: 300, crop: 'fill', gravity: 'auto' },
            { quality: 'auto' },
            { format: 'auto' }
          ]
        }
      )

      mobileImageUrl = uploadResult.secure_url
    }

    // Save to database
    const [newBanner] = await db.insert(banners).values({
      ...validatedData,
      image: imageUrl,
      mobileImage: mobileImageUrl,
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning()

    return NextResponse.json({
      success: true,
      data: {
        banner: newBanner,
      },
    })
  } catch (error) {
    console.error('Admin banners POST error:', error)
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
