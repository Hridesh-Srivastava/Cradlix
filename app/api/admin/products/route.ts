import { NextRequest, NextResponse } from 'next/server'
import { auth } from "@/lib/auth/config"
import { authOptions } from '@/lib/auth/config'
import { db } from '@/lib/db/postgres'
import { products, productImages } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { uploadImage } from '@/lib/cloudinary'
import { z } from 'zod'

// Create product schema
const createProductSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().min(1),
  shortDescription: z.string().optional(),
  sku: z.string().min(1),
  price: z.string().min(1),
  comparePrice: z.string().optional(),
  inventoryQuantity: z.number().min(0),
  isFeatured: z.boolean().default(false),
  brand: z.string().min(1),
  ageRange: z.string().min(1),
  categoryId: z.string().uuid(),
  materials: z.array(z.string()).optional(),
  safetyCertifications: z.array(z.string()).optional(),
  isActive: z.boolean().default(true),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
})

// Update product schema
const updateProductSchema = createProductSchema.partial()

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
    const categoryId = searchParams.get('categoryId')
    const isActive = searchParams.get('isActive')

    const offset = (page - 1) * limit

    // Build query conditions
    let whereConditions = []
    if (search) {
      whereConditions.push(`p.name ILIKE '%${search}%' OR p.description ILIKE '%${search}%'`)
    }
    if (categoryId) {
      whereConditions.push(`p.category_id = '${categoryId}'`)
    }
    if (isActive !== null) {
      whereConditions.push(`p.is_active = ${isActive === 'true'}`)
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : ''

    // Get products with images
    const productsQuery = `
      SELECT 
        p.*,
        c.name as category_name,
        c.slug as category_slug,
        COALESCE(
          json_agg(
            json_build_object(
              'id', pi.id,
              'url', pi.url,
              'altText', pi.alt_text,
              'isPrimary', pi.is_primary,
              'sortOrder', pi.sort_order
            )
          ) FILTER (WHERE pi.id IS NOT NULL),
          '[]'::json
        ) as images
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN product_images pi ON p.id = pi.product_id
      ${whereClause}
      GROUP BY p.id, c.name, c.slug
      ORDER BY p.created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `

    const result = await db.execute(productsQuery)
    const products = result.rows

    // Get total count
    const countQuery = `
      SELECT COUNT(*) as total
      FROM products p
      ${whereClause}
    `
    const countResult = await db.execute(countQuery)
    const total = parseInt(countResult.rows[0].total)

    return NextResponse.json({
      success: true,
      data: {
        products,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    })
  } catch (error) {
    console.error('Admin products GET error:', error)
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
    const productData = JSON.parse(formData.get('product') as string)
    const images = formData.getAll('images') as File[]

    // Validate product data
    const validatedData = createProductSchema.parse(productData)

    // Create product
    const [newProduct] = await db.insert(products).values({
      ...validatedData,
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning()

    // Upload images to Cloudinary
    const uploadedImages = []
    for (let i = 0; i < images.length; i++) {
      const image = images[i]
      if (image && image.size > 0) {
        const bytes = await image.arrayBuffer()
        const buffer = Buffer.from(bytes)
        
        const uploadResult = await uploadImage(buffer, 'baby-ecommerce/products', {
          public_id: `baby-ecommerce/products/${newProduct.id}-${i}`,
        })

        if (uploadResult.success) {
          const [imageRecord] = await db.insert(productImages).values({
            productId: newProduct.id,
            url: uploadResult.data.secure_url,
            altText: `${validatedData.name} - Image ${i + 1}`,
            sortOrder: i,
            isPrimary: i === 0,
            createdAt: new Date(),
          }).returning()
          
          uploadedImages.push(imageRecord)
        }
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        product: newProduct,
        images: uploadedImages,
      },
    })
  } catch (error) {
    console.error('Admin products POST error:', error)
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
