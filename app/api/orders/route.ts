import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db/postgres'
import { orders, orderItems, cartItems } from '@/lib/db/schema'
import { eq, and, desc } from 'drizzle-orm'
import { auth } from "@/lib/auth/config"
import { authOptions } from '@/lib/auth/config'
import { z } from 'zod'

const createOrderSchema = z.object({
  items: z.array(z.object({
    productId: z.string(),
    quantity: z.number().min(1),
    price: z.number(),
  })),
  shippingAddress: z.object({
    firstName: z.string(),
    lastName: z.string(),
    address: z.string(),
    city: z.string(),
    state: z.string(),
    zipCode: z.string(),
    country: z.string(),
    phone: z.string(),
  }),
  billingAddress: z.object({
    firstName: z.string(),
    lastName: z.string(),
    address: z.string(),
    city: z.string(),
    state: z.string(),
    zipCode: z.string(),
    country: z.string(),
    phone: z.string(),
  }),
  paymentMethod: z.string(),
  paymentId: z.string().optional(),
  notes: z.string().optional(),
})

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = (page - 1) * limit

    const ordersList = await db
      .select({
        id: orders.id,
        orderNumber: orders.orderNumber,
        status: orders.status,
        paymentStatus: orders.paymentStatus,
        paymentMethod: orders.paymentMethod,
        subtotal: orders.subtotal,
        taxAmount: orders.taxAmount,
        shippingAmount: orders.shippingAmount,
        discountAmount: orders.discountAmount,
        totalAmount: orders.totalAmount,
        currency: orders.currency,
        shippingAddress: orders.shippingAddress,
        billingAddress: orders.billingAddress,
        notes: orders.notes,
        shippedAt: orders.shippedAt,
        deliveredAt: orders.deliveredAt,
        createdAt: orders.createdAt,
        updatedAt: orders.updatedAt,
      })
      .from(orders)
      .where(eq(orders.userId, session.user.id))
      .orderBy(desc(orders.createdAt))
      .limit(limit)
      .offset(offset)

    return NextResponse.json({
      success: true,
      orders: ordersList,
      pagination: {
        page,
        limit,
        total: ordersList.length,
      },
    })
  } catch (error) {
    console.error('Orders fetch error:', error)
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

    const body = await request.json()
    const validatedData = createOrderSchema.parse(body)

    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`

    // Calculate totals
    const subtotal = validatedData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    const taxAmount = subtotal * 0.18 // 18% GST
    const shippingAmount = subtotal > 1000 ? 0 : 50 // Free shipping above ₹1000
    const totalAmount = subtotal + taxAmount + shippingAmount

    // Create order
    const newOrder = await db
      .insert(orders)
      .values({
        orderNumber,
        userId: session.user.id,
        status: 'pending',
        paymentStatus: 'pending',
        paymentMethod: validatedData.paymentMethod,
        paymentId: validatedData.paymentId,
        subtotal: subtotal.toString(),
        taxAmount: taxAmount.toString(),
        shippingAmount: shippingAmount.toString(),
        discountAmount: '0',
        totalAmount: totalAmount.toString(),
        currency: 'INR',
        shippingAddress: validatedData.shippingAddress,
        billingAddress: validatedData.billingAddress,
        notes: validatedData.notes,
      })
      .returning()

    // Create order items
    const orderItemsData = validatedData.items.map(item => ({
      orderId: newOrder[0].id,
      productId: item.productId,
      quantity: item.quantity,
      price: item.price.toString(),
      totalPrice: (item.price * item.quantity).toString(),
    }))

    await db.insert(orderItems).values(orderItemsData)

    // Clear cart after successful order
    await db.delete(cartItems).where(eq(cartItems.userId, session.user.id))

    return NextResponse.json({
      success: true,
      order: newOrder[0],
      message: 'Order created successfully',
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Order creation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
