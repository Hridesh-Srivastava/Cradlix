import { NextRequest, NextResponse } from 'next/server'
import { createRazorpayOrder } from '@/lib/payment/razorpay'
import { auth } from "@/lib/auth/config"
import { db } from '@/lib/db/postgres'
import { orders, orderItems, cartItems, products } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { z } from 'zod'

const createOrderSchema = z.object({
  paymentMethod: z.enum(['razorpay', 'cod']),
  amount: z.number().min(1, 'Amount must be greater than 0').optional(),
  items: z.array(z.object({
    productId: z.string(),
    quantity: z.number().min(1),
    price: z.number(),
  })),
  shippingAddress: z.object({
    fullName: z.string(),
    phone: z.string(),
    addressLine1: z.string(),
    addressLine2: z.string().optional(),
    city: z.string(),
    state: z.string(),
    pincode: z.string(),
    country: z.string().default('India'),
  }),
  billingAddress: z.object({
    fullName: z.string(),
    phone: z.string(),
    addressLine1: z.string(),
    addressLine2: z.string().optional(),
    city: z.string(),
    state: z.string(),
    pincode: z.string(),
    country: z.string().default('India'),
  }).optional(),
  notes: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = createOrderSchema.parse(body)

    // If payment method is Razorpay, create Razorpay order
    if (validatedData.paymentMethod === 'razorpay') {
      const amount = validatedData.amount || validatedData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      const receipt = `order_${Date.now()}`

      const result = await createRazorpayOrder(amount, receipt)

      if (!result.success) {
        return NextResponse.json(
          { error: result.error || 'Failed to create payment order' },
          { status: 500 }
        )
      }

      return NextResponse.json({
        success: true,
        paymentMethod: 'razorpay',
        order: result.order,
        amount,
      })
    }

    // If payment method is COD, create order directly
    if (validatedData.paymentMethod === 'cod') {
      // Generate order number
      const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`

      // Calculate totals
      const subtotal = validatedData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      const shippingAmount = subtotal > 500 ? 0 : 50
      const taxAmount = subtotal * 0.18 // 18% GST
      const totalAmount = subtotal + taxAmount + shippingAmount

      // Use shipping address as billing if not provided
      const billingAddress = validatedData.billingAddress || validatedData.shippingAddress

      // Create order
      const [newOrder] = await db
        .insert(orders)
        .values({
          orderNumber,
          userId: session.user.id,
          status: 'pending',
          paymentStatus: 'pending',
          paymentMethod: 'cod',
          subtotal: subtotal.toFixed(2),
          taxAmount: taxAmount.toFixed(2),
          shippingAmount: shippingAmount.toFixed(2),
          discountAmount: '0',
          totalAmount: totalAmount.toFixed(2),
          currency: 'INR',
          shippingAddress: validatedData.shippingAddress,
          billingAddress,
          notes: validatedData.notes,
        })
        .returning()

      // Create order items
      const orderItemsData = validatedData.items.map(item => ({
        orderId: newOrder.id,
        productId: item.productId,
        quantity: item.quantity,
        price: item.price.toFixed(2),
        totalPrice: (item.price * item.quantity).toFixed(2),
      }))

      await db.insert(orderItems).values(orderItemsData)

      // Clear cart after successful order
      await db.delete(cartItems).where(eq(cartItems.userId, session.user.id))

      return NextResponse.json({
        success: true,
        paymentMethod: 'cod',
        order: newOrder,
        orderId: newOrder.id,
        orderNumber: newOrder.orderNumber,
        message: 'Order placed successfully with Cash on Delivery',
      })
    }

    return NextResponse.json(
      { error: 'Invalid payment method' },
      { status: 400 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Payment order creation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}