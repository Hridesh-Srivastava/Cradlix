import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db/postgres'
import { cartItems, products, productImages } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'
import { auth } from "@/lib/auth/config"
import { authOptions } from '@/lib/auth/config'

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const cartItemsList = await db
      .select({
        id: cartItems.id,
        quantity: cartItems.quantity,
        product: {
          id: products.id,
          name: products.name,
          slug: products.slug,
          price: products.price,
          comparePrice: products.comparePrice,
          inventoryQuantity: products.inventoryQuantity,
          images: {
            id: productImages.id,
            url: productImages.url,
            altText: productImages.altText,
            isPrimary: productImages.isPrimary,
          },
        },
      })
      .from(cartItems)
      .leftJoin(products, eq(cartItems.productId, products.id))
      .leftJoin(productImages, and(
        eq(products.id, productImages.productId),
        eq(productImages.isPrimary, true)
      ))
      .where(eq(cartItems.userId, session.user.id))

    // Calculate totals
    const subtotal = cartItemsList.reduce((sum, item) => {
      return sum + (Number(item.product.price) * item.quantity)
    }, 0)

    return NextResponse.json({
      success: true,
      items: cartItemsList,
      subtotal,
      itemCount: cartItemsList.length,
    })
  } catch (error) {
    console.error('Cart fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { productId, quantity = 1 } = await request.json()

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      )
    }

    // Check if item already exists in cart
    const existingItem = await db
      .select()
      .from(cartItems)
      .where(and(
        eq(cartItems.userId, session.user.id),
        eq(cartItems.productId, productId)
      ))
      .limit(1)

    if (existingItem[0]) {
      // Update quantity
      const updatedItem = await db
        .update(cartItems)
        .set({ 
          quantity: existingItem[0].quantity + quantity,
          updatedAt: new Date()
        })
        .where(eq(cartItems.id, existingItem[0].id))
        .returning()

      return NextResponse.json({
        success: true,
        item: updatedItem[0],
        message: 'Cart item updated',
      })
    } else {
      // Add new item
      const newItem = await db
        .insert(cartItems)
        .values({
          userId: session.user.id,
          productId,
          quantity,
        })
        .returning()

      return NextResponse.json({
        success: true,
        item: newItem[0],
        message: 'Item added to cart',
      })
    }
  } catch (error) {
    console.error('Cart add error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { itemId, quantity } = await request.json()

    if (!itemId || quantity === undefined) {
      return NextResponse.json(
        { error: 'Item ID and quantity are required' },
        { status: 400 }
      )
    }

    if (quantity <= 0) {
      // Remove item if quantity is 0 or negative
      await db
        .delete(cartItems)
        .where(and(
          eq(cartItems.id, itemId),
          eq(cartItems.userId, session.user.id)
        ))

      return NextResponse.json({
        success: true,
        message: 'Item removed from cart',
      })
    }

    // Update quantity
    const updatedItem = await db
      .update(cartItems)
      .set({ 
        quantity,
        updatedAt: new Date()
      })
      .where(and(
        eq(cartItems.id, itemId),
        eq(cartItems.userId, session.user.id)
      ))
      .returning()

    if (!updatedItem[0]) {
      return NextResponse.json(
        { error: 'Cart item not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      item: updatedItem[0],
      message: 'Cart item updated',
    })
  } catch (error) {
    console.error('Cart update error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const itemId = searchParams.get('itemId')

    if (!itemId) {
      return NextResponse.json(
        { error: 'Item ID is required' },
        { status: 400 }
      )
    }

    await db
      .delete(cartItems)
      .where(and(
        eq(cartItems.id, itemId),
        eq(cartItems.userId, session.user.id)
      ))

    return NextResponse.json({
      success: true,
      message: 'Item removed from cart',
    })
  } catch (error) {
    console.error('Cart delete error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
