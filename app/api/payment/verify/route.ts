import { NextRequest, NextResponse } from 'next/server'
import { verifyPaymentSignature } from '@/lib/payment/razorpay'
import { auth } from "@/lib/auth/config"
import { db } from '@/lib/db/postgres'
import { orders, orderItems, cartItems } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { z } from 'zod'

const verifyPaymentSchema = z.object({
  razorpay_order_id: z.string().min(1, 'Order ID is required'),
  razorpay_payment_id: z.string().min(1, 'Payment ID is required'),
  razorpay_signature: z.string().min(1, 'Signature is required'),
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
    const validatedData = verifyPaymentSchema.parse(body)

    // Verify payment signature
    const isValid = verifyPaymentSignature(
      validatedData.razorpay_order_id,
      validatedData.razorpay_payment_id,
      validatedData.razorpay_signature
    )

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid payment signature' },
        { status: 400 }
      )
    }

    // Create order after successful payment verification
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
        status: 'confirmed',
        paymentStatus: 'paid',
        paymentMethod: 'razorpay',
        paymentId: validatedData.razorpay_payment_id,
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
      verified: true,
      paymentId: validatedData.razorpay_payment_id,
      orderId: newOrder.id,
      orderNumber: newOrder.orderNumber,
      order: newOrder,
      message: 'Payment verified and order created successfully',
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Payment verification error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}