import { NextRequest, NextResponse } from 'next/server'
import { auth } from "@/lib/auth/config"
import { authOptions } from '@/lib/auth/config'
import { db, client } from '@/lib/db/postgres'
import { products, productImages } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { uploadImage, deleteImage } from '@/lib/cloudinary'
import { z } from 'zod'

const updateProductSchema = z.object({
  name: z.string().min(1).optional(),
  slug: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  shortDescription: z.string().optional(),
  sku: z.string().min(1).optional(),
  price: z.string().min(1).optional(),
  comparePrice: z.string().optional(),
  inventoryQuantity: z.number().min(0).optional(),
  isFeatured: z.boolean().optional(),
  brand: z.string().min(1).optional(),
  ageRange: z.string().min(1).optional(),
  categoryId: z.string().uuid().optional(),
  materials: z.array(z.string()).optional(),
  safetyCertifications: z.array(z.string()).optional(),
  isActive: z.boolean().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
})

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    
  // Check if user is authenticated and is admin, moderator, or super-admin
  if (!session?.user || !['admin','moderator','super-admin'].includes(session.user.role as string)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const productId = params.id

    // Get product with images
    const productQuery = `
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
      WHERE p.id = $1
      GROUP BY p.id, c.name, c.slug
    `

    const result = await client.unsafe(productQuery, [productId])
    
    if (result.length === 0) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: result[0],
    })
  } catch (error) {
    console.error('Admin product GET error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    
  // Check if user is authenticated and is admin, moderator, or super-admin
  if (!session?.user || !['admin','moderator','super-admin'].includes(session.user.role as string)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const productId = params.id
    const formData = await request.formData()
    const productData = JSON.parse(formData.get('product') as string)
    const newImages = formData.getAll('images') as File[]
    const imagesToDelete = JSON.parse(formData.get('imagesToDelete') as string || '[]')

    // Validate product data
    const validatedData = updateProductSchema.parse(productData)

    // Update product
    const [updatedProduct] = await db.update(products)
      .set({
        ...validatedData,
        updatedAt: new Date(),
      })
      .where(eq(products.id, productId))
      .returning()

    // Delete specified images
    for (const imageId of imagesToDelete) {
      const [imageToDelete] = await db.select()
        .from(productImages)
        .where(eq(productImages.id, imageId))
        .limit(1)

      if (imageToDelete) {
        // Delete from Cloudinary
        const publicId = imageToDelete.url.split('/').slice(-2).join('/').split('.')[0]
        await deleteImage(publicId)

        // Delete from database
        await db.delete(productImages).where(eq(productImages.id, imageId))
      }
    }

    // Upload new images
    const uploadedImages = []
    for (let i = 0; i < newImages.length; i++) {
      const image = newImages[i]
      if (image && image.size > 0) {
        const bytes = await image.arrayBuffer()
        const buffer = Buffer.from(bytes)
        
        const uploadResult = await uploadImage(buffer, 'baby-ecommerce/products', {
          public_id: `baby-ecommerce/products/${productId}-${Date.now()}-${i}`,
        })

  if (uploadResult.success && uploadResult.data?.secure_url) {
          const [imageRecord] = await db.insert(productImages).values({
            productId: productId,
            url: uploadResult.data.secure_url,
            altText: `${validatedData.name || updatedProduct.name} - Image ${i + 1}`,
            sortOrder: i,
            isPrimary: false,
            createdAt: new Date(),
          }).returning()
          
          uploadedImages.push(imageRecord)
        }
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        product: updatedProduct,
        newImages: uploadedImages,
      },
    })
  } catch (error) {
    console.error('Admin product PUT error:', error)
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    
  // Check if user is authenticated and is admin, moderator, or super-admin
  if (!session?.user || !['admin','moderator','super-admin'].includes(session.user.role as string)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const productId = params.id

    // Get all images for this product
    const productImagesList = await db.select()
      .from(productImages)
      .where(eq(productImages.productId, productId))

    // Delete images from Cloudinary
    for (const image of productImagesList) {
      const publicId = image.url.split('/').slice(-2).join('/').split('.')[0]
      await deleteImage(publicId)
    }

    // Delete product (cascade will delete images)
    await db.delete(products).where(eq(products.id, productId))

    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully',
    })
  } catch (error) {
    console.error('Admin product DELETE error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
