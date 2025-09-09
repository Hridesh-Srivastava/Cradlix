import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import { db } from '@/lib/db/postgres'
import { categories } from '@/lib/db/schema'
import { eq, and, or, ilike, desc, asc } from 'drizzle-orm'
import { v2 as cloudinary } from 'cloudinary'
import { z } from 'zod'

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dqdkbgshz',
  api_key: process.env.CLOUDINARY_API_KEY || '935333464895341',
  api_secret: process.env.CLOUDINARY_API_SECRET || '4ZRVJ9Ow_9G8B4Bn0JvaoEdo6jQ',
})

// Create category schema
const createCategorySchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().optional(),
  parentId: z.string().uuid().optional(),
  sortOrder: z.number().default(0),
  isActive: z.boolean().default(true),
})

// Update category schema
const updateCategorySchema = createCategorySchema.partial()

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
    const isActive = searchParams.get('isActive')

    const offset = (page - 1) * limit

    // Build query conditions
    let whereConditions = []
    if (search) {
      whereConditions.push(
        or(
          ilike(categories.name, `%${search}%`),
          ilike(categories.description, `%${search}%`)
        )
      )
    }
    if (isActive !== null) {
      whereConditions.push(eq(categories.isActive, isActive === 'true'))
    }

    const whereClause = whereConditions.length > 0 ? and(...whereConditions) : undefined

    // Get categories with parent information
    const categoriesList = await db
      .select({
        id: categories.id,
        name: categories.name,
        slug: categories.slug,
        description: categories.description,
        imageUrl: categories.imageUrl,
        parentId: categories.parentId,
        isActive: categories.isActive,
        sortOrder: categories.sortOrder,
        createdAt: categories.createdAt,
        updatedAt: categories.updatedAt,
        parentName: categories.name, // This will be joined properly
        parentSlug: categories.slug, // This will be joined properly
      })
      .from(categories)
      .where(whereClause)
      .orderBy(asc(categories.sortOrder), desc(categories.createdAt))
      .limit(limit)
      .offset(offset)

    // Get total count
    const totalResult = await db
      .select({ count: categories.id })
      .from(categories)
      .where(whereClause)
    
    const total = totalResult.length

    return NextResponse.json({
      success: true,
      data: {
        categories: categoriesList,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    })
  } catch (error) {
    console.error('Admin categories GET error:', error)
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
    const categoryData = JSON.parse(formData.get('category') as string)
    const image = formData.get('image') as File

    // Validate category data
    const validatedData = createCategorySchema.parse(categoryData)

    // Upload image to Cloudinary if provided
    let imageUrl = null
    if (image && image.size > 0) {
      const bytes = await image.arrayBuffer()
      const buffer = Buffer.from(bytes)
      
      const uploadResult = await cloudinary.uploader.upload(
        `data:image/png;base64,${buffer.toString('base64')}`,
        {
          folder: 'baby-ecommerce/categories',
          public_id: `category-${validatedData.slug}`,
          resource_type: 'image',
          transformation: [
            { width: 400, height: 300, crop: 'fill', gravity: 'auto' },
            { quality: 'auto' },
            { format: 'auto' }
          ]
        }
      )

      imageUrl = uploadResult.secure_url
    }

    // Create category
    const [newCategory] = await db.insert(categories).values({
      ...validatedData,
      imageUrl,
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning()

    return NextResponse.json({
      success: true,
      data: {
        category: newCategory,
      },
    })
  } catch (error) {
    console.error('Admin categories POST error:', error)
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
