import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import { db } from '@/lib/db/postgres'
import { wishlistItems, products, productImages, categories } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const wishlist = await db
      .select({
        id: wishlistItems.id,
        addedAt: wishlistItems.createdAt,
        product: {
          id: products.id,
          name: products.name,
          slug: products.slug,
          price: products.price,
          comparePrice: products.comparePrice,
          inventoryQuantity: products.inventoryQuantity,
          isFeatured: products.isFeatured,
          brand: products.brand,
          ageRange: products.ageRange,
          category: {
            id: categories.id,
            name: categories.name,
            slug: categories.slug,
          },
          images: {
            id: productImages.id,
            url: productImages.url,
            altText: productImages.altText,
            isPrimary: productImages.isPrimary,
          },
        },
      })
      .from(wishlistItems)
      .leftJoin(products, eq(wishlistItems.productId, products.id))
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .leftJoin(productImages, eq(products.id, productImages.productId))
      .where(eq(wishlistItems.userId, session.user.id))

    // Group products and their images
    const wishlistMap = new Map()
    wishlist.forEach((item) => {
      if (!wishlistMap.has(item.id)) {
        wishlistMap.set(item.id, {
          id: item.id,
          addedAt: item.addedAt,
          product: {
            ...item.product,
            images: [],
          },
        })
      }
      if (item.product.images.id) {
        wishlistMap.get(item.id).product.images.push(item.product.images)
      }
    })

    const formattedWishlist = Array.from(wishlistMap.values())

    return NextResponse.json({
      success: true,
      wishlistItems: formattedWishlist,
    })
  } catch (error) {
    console.error('Error fetching wishlist:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { productId } = body

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      )
    }

    // Check if item already exists in wishlist
    const existingItem = await db
      .select()
      .from(wishlistItems)
      .where(
        and(
          eq(wishlistItems.userId, session.user.id),
          eq(wishlistItems.productId, productId)
        )
      )
      .limit(1)

    if (existingItem.length > 0) {
      return NextResponse.json({
        success: true,
        message: 'Item already in wishlist',
      })
    }

    // Add to wishlist
    const newItem = await db
      .insert(wishlistItems)
      .values({
        userId: session.user.id,
        productId,
      })
      .returning()

    return NextResponse.json({
      success: true,
      message: 'Item added to wishlist',
      item: newItem[0],
    })
  } catch (error) {
    console.error('Error adding to wishlist:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
