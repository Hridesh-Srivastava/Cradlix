import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db/postgres'
import { orders, orderItems, products, productImages } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'
import { auth } from "@/lib/auth/config"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const orderId = params.id

    // Fetch order
    const orderResult = await db
      .select()
      .from(orders)
      .where(and(eq(orders.id, orderId), eq(orders.userId, session.user.id)))
      .limit(1)

    if (!orderResult || orderResult.length === 0) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    const order = orderResult[0]

    // Fetch order items with product details
    const items = await db
      .select({
        id: orderItems.id,
        quantity: orderItems.quantity,
        price: orderItems.price,
        totalPrice: orderItems.totalPrice,
        productId: products.id,
        productName: products.name,
        productSlug: products.slug,
        imageUrl: productImages.url,
        imageAltText: productImages.altText,
      })
      .from(orderItems)
      .leftJoin(products, eq(orderItems.productId, products.id))
      .leftJoin(productImages, and(
        eq(products.id, productImages.productId),
        eq(productImages.isPrimary, true)
      ))
      .where(eq(orderItems.orderId, orderId))

    return NextResponse.json({
      success: true,
      order: {
        ...order,
        items: items.map(item => ({
          id: item.id,
          quantity: item.quantity,
          price: item.price,
          totalPrice: item.totalPrice,
          product: {
            id: item.productId,
            name: item.productName,
            slug: item.productSlug,
            image: item.imageUrl ? {
              url: item.imageUrl,
              altText: item.imageAltText || '',
            } : null,
          },
        })),
      },
    })
  } catch (error) {
    console.error('Order fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
