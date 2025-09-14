import { NextRequest, NextResponse } from 'next/server'
import { auth } from "@/lib/auth/config"
import { authOptions } from '@/lib/auth/config'
import { db } from '@/lib/db/postgres'
import { testimonials } from '@/lib/db/schema'
import { eq, and, or, ilike, desc, asc } from 'drizzle-orm'
import { v2 as cloudinary } from 'cloudinary'
import { z } from 'zod'

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

// Create testimonial schema
const createTestimonialSchema = z.object({
  customerName: z.string().min(1),
  customerEmail: z.string().email().optional(),
  customerLocation: z.string().optional(),
  rating: z.number().min(1).max(5),
  title: z.string().min(1),
  content: z.string().min(1),
  productId: z.string().uuid().optional(),
  isApproved: z.boolean().default(false),
  isFeatured: z.boolean().default(false),
  sortOrder: z.number().default(0),
})

// Update testimonial schema
const updateTestimonialSchema = createTestimonialSchema.partial()

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
    const isApproved = searchParams.get('isApproved')
    const isFeatured = searchParams.get('isFeatured')
    const rating = searchParams.get('rating')

    const offset = (page - 1) * limit

    // Build query conditions
    let whereConditions = []
    if (search) {
      whereConditions.push(
        or(
          ilike(testimonials.customerName, `%${search}%`),
          ilike(testimonials.title, `%${search}%`),
          ilike(testimonials.content, `%${search}%`)
        )
      )
    }
    if (isApproved !== null) {
      whereConditions.push(eq(testimonials.isApproved, isApproved === 'true'))
    }
    if (isFeatured !== null) {
      whereConditions.push(eq(testimonials.isFeatured, isFeatured === 'true'))
    }
    if (rating) {
      whereConditions.push(eq(testimonials.rating, parseInt(rating)))
    }

    const whereClause = whereConditions.length > 0 ? and(...whereConditions) : undefined

    // Get testimonials from database
    const testimonialsList = await db
      .select()
      .from(testimonials)
      .where(whereClause)
      .orderBy(asc(testimonials.sortOrder), desc(testimonials.createdAt))
      .limit(limit)
      .offset(offset)

    // Get total count
    const totalResult = await db
      .select({ count: testimonials.id })
      .from(testimonials)
      .where(whereClause)
    
    const total = totalResult.length

    return NextResponse.json({
      success: true,
      data: {
        testimonials: testimonialsList,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    })
  } catch (error) {
    console.error('Admin testimonials GET error:', error)
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
    const testimonialData = JSON.parse(formData.get('testimonial') as string)
    const customerImage = formData.get('customerImage') as File

    // Validate testimonial data
    const validatedData = createTestimonialSchema.parse(testimonialData)

    // Upload customer image to Cloudinary if provided
    let customerImageUrl = null
    if (customerImage && customerImage.size > 0) {
      const bytes = await customerImage.arrayBuffer()
      const buffer = Buffer.from(bytes)
      
      const uploadResult = await cloudinary.uploader.upload(
        `data:image/png;base64,${buffer.toString('base64')}`,
        {
          folder: 'baby-ecommerce/testimonials',
          public_id: `customer-${Date.now()}`,
          resource_type: 'image',
          transformation: [
            { width: 150, height: 150, crop: 'fill', gravity: 'face' },
            { quality: 'auto' },
            { format: 'auto' }
          ]
        }
      )

      customerImageUrl = uploadResult.secure_url
    }

    // Save to database
    const [newTestimonial] = await db.insert(testimonials).values({
      ...validatedData,
      customerImage: customerImageUrl,
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning()

    return NextResponse.json({
      success: true,
      data: {
        testimonial: newTestimonial,
      },
    })
  } catch (error) {
    console.error('Admin testimonials POST error:', error)
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
