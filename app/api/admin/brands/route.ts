import { NextRequest, NextResponse } from 'next/server'
import { auth } from "@/lib/auth/config"
import { authOptions } from '@/lib/auth/config'
import { db } from '@/lib/db/postgres'
import { brands } from '@/lib/db/schema'
import { eq, and, or, ilike, desc, asc } from 'drizzle-orm'
import { v2 as cloudinary } from 'cloudinary'
import { z } from 'zod'

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

// Create brand schema
const createBrandSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().optional(),
  website: z.string().url().optional(),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  sortOrder: z.number().default(0),
})

// Update brand schema
const updateBrandSchema = createBrandSchema.partial()

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
    const isActive = searchParams.get('isActive')
    const isFeatured = searchParams.get('isFeatured')

    const offset = (page - 1) * limit

    // Build query conditions
    let whereConditions = []
    if (search) {
      whereConditions.push(
        or(
          ilike(brands.name, `%${search}%`),
          ilike(brands.description, `%${search}%`)
        )
      )
    }
    if (isActive !== null) {
      whereConditions.push(eq(brands.isActive, isActive === 'true'))
    }
    if (isFeatured !== null) {
      whereConditions.push(eq(brands.isFeatured, isFeatured === 'true'))
    }

    const whereClause = whereConditions.length > 0 ? and(...whereConditions) : undefined

    // Get brands from database
    const brandsList = await db
      .select()
      .from(brands)
      .where(whereClause)
      .orderBy(asc(brands.sortOrder), desc(brands.createdAt))
      .limit(limit)
      .offset(offset)

    // Get total count
    const totalResult = await db
      .select({ count: brands.id })
      .from(brands)
      .where(whereClause)
    
    const total = totalResult.length

    return NextResponse.json({
      success: true,
      data: {
        brands: brandsList,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    })
  } catch (error) {
    console.error('Admin brands GET error:', error)
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
    const brandData = JSON.parse(formData.get('brand') as string)
    const logo = formData.get('logo') as File

    // Validate brand data
    const validatedData = createBrandSchema.parse(brandData)

    // Upload logo to Cloudinary if provided
    let logoUrl = null
    if (logo && logo.size > 0) {
      const bytes = await logo.arrayBuffer()
      const buffer = Buffer.from(bytes)
      
      const uploadResult = await cloudinary.uploader.upload(
        `data:image/png;base64,${buffer.toString('base64')}`,
        {
          folder: 'baby-ecommerce/brands',
          public_id: `brand-${validatedData.slug}`,
          resource_type: 'image',
          transformation: [
            { width: 200, height: 200, crop: 'fill', gravity: 'auto' },
            { quality: 'auto' },
            { format: 'auto' }
          ]
        }
      )

      logoUrl = uploadResult.secure_url
    }

    // Save to database
    const [newBrand] = await db.insert(brands).values({
      ...validatedData,
      logo: logoUrl,
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning()

    return NextResponse.json({
      success: true,
      data: {
        brand: newBrand,
      },
    })
  } catch (error) {
    console.error('Admin brands POST error:', error)
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
