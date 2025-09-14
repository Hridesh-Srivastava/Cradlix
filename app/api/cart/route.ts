import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db/postgres'
import { cartItems, products, productImages } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'
import { auth } from "@/lib/auth/config"
import { randomUUID } from 'crypto'

// Helper: resolve cart identifier (userId or anonymous sessionId cookie)
async function resolveCartIdentity(session: any) {
  const c = await cookies()
  const COOKIE_NAME = 'cart_session_id'
  const userId: string | undefined = session?.user?.id
  let sessionId: string | undefined = c.get(COOKIE_NAME)?.value
  if (!userId && !sessionId) {
    sessionId = randomUUID()
    // 30 days expiry
    c.set(COOKIE_NAME, sessionId, { httpOnly: true, sameSite: 'lax', path: '/', maxAge: 60 * 60 * 24 * 30 })
  }
  return { userId, sessionId }
}

export async function GET(request: NextRequest) {
  try {
  const session = await auth()
  const { userId, sessionId } = await resolveCartIdentity(session)

    const rows = await db
      .select({
        id: cartItems.id,
        quantity: cartItems.quantity,
        productId: products.id,
        productName: products.name,
        productSlug: products.slug,
        productPrice: products.price,
        productComparePrice: products.comparePrice,
        productInventoryQuantity: products.inventoryQuantity,
        imageUrl: productImages.url,
        imageAltText: productImages.altText,
      })
      .from(cartItems)
      .leftJoin(products, eq(cartItems.productId, products.id))
      .leftJoin(productImages, and(
        eq(products.id, productImages.productId),
        eq(productImages.isPrimary, true)
      ))
  .where(userId ? eq(cartItems.userId, userId) : eq(cartItems.sessionId, sessionId!))

    const cartItemsList = rows.map((r) => ({
      id: r.id,
      quantity: r.quantity,
      product: {
        id: r.productId,
        name: r.productName,
        slug: r.productSlug,
        price: r.productPrice,
        comparePrice: r.productComparePrice,
        inventoryQuantity: r.productInventoryQuantity,
        images: r.imageUrl
          ? [
              {
                url: r.imageUrl,
                altText: r.imageAltText || '',
              },
            ]
          : [],
      },
    }))

    // Calculate totals
    const subtotal = cartItemsList.reduce((sum: number, item: any) => {
      return sum + Number(item.product.price) * Number(item.quantity)
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
  const { userId, sessionId } = await resolveCartIdentity(session)

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
      .where(
        and(
          eq(cartItems.productId, productId),
          userId ? eq(cartItems.userId, userId) : eq(cartItems.sessionId, sessionId!)
        )
      )
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
      const baseValues: any = { productId, quantity }
      const values = userId ? { ...baseValues, userId } : { ...baseValues, sessionId }
      const newItem = await db.insert(cartItems).values(values).returning()

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
  const { userId, sessionId } = await resolveCartIdentity(session)

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
        .where(
          and(
            eq(cartItems.id, itemId),
            userId ? eq(cartItems.userId, userId) : eq(cartItems.sessionId, sessionId!)
          )
        )

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
      .where(
        and(
          eq(cartItems.id, itemId),
          userId ? eq(cartItems.userId, userId) : eq(cartItems.sessionId, sessionId!)
        )
      )
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
  const { userId, sessionId } = await resolveCartIdentity(session)

    // Accept both JSON body and query param forms
    let itemId: string | null = null
    try {
      const body = await request.json()
      itemId = body?.itemId ?? null
    } catch {}
    if (!itemId) {
      const { searchParams } = new URL(request.url)
      itemId = searchParams.get('itemId')
    }

    if (!itemId) {
      return NextResponse.json(
        { error: 'Item ID is required' },
        { status: 400 }
      )
    }

    await db
      .delete(cartItems)
      .where(
        and(
          eq(cartItems.id, itemId),
          userId ? eq(cartItems.userId, userId) : eq(cartItems.sessionId, sessionId!)
        )
      )

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
