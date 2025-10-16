import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth/config'
import { db } from '@/lib/db/postgres'
import { orders } from '@/lib/db/schema'
import { sendOrderConfirmationEmails } from '@/lib/email/send-order-emails'

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      paymentMethod,
      paymentId,
      paymentStatus,
      items,
      subtotal,
      shipping,
      tax,
      total,
      shippingAddress,
      billingAddress,
    } = body

    // Validate required fields
    if (!paymentMethod || !items || !shippingAddress) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    if (items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 })
    }

    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`

    // Create order in database
    const [order] = await db
      .insert(orders)
      .values({
        orderNumber,
        userId: session.user.id,
        status: 'pending',
        paymentStatus: paymentStatus || (paymentMethod === 'cod' ? 'pending' : 'paid'),
        paymentMethod,
        paymentId: paymentId || null,
        subtotal: subtotal.toString(),
        taxAmount: tax.toString(),
        shippingAmount: shipping.toString(),
        discountAmount: '0',
        totalAmount: total.toString(),
        currency: 'INR',
        shippingAddress: shippingAddress as any,
        billingAddress: (billingAddress || shippingAddress) as any,
      })
      .returning()

    // Prepare email data
    const customerEmail = shippingAddress.email || session.user.email || ''
    const customerName = shippingAddress.fullName || session.user.name || 'Customer'

    // Generate Razorpay payment URL for COD orders (Pay Now option)
    let razorpayPaymentUrl: string | undefined
    if (paymentMethod === 'cod' && paymentStatus === 'pending') {
      // Create a payment link that redirects to checkout with order ID
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
      razorpayPaymentUrl = `${baseUrl}/account/orders/${order.id}/pay`
    }

    // Send order confirmation emails
    const emailResults = await sendOrderConfirmationEmails({
      orderNumber,
      customerName,
      customerEmail,
      items: items.map((item: any) => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        image: item.image,
      })),
      subtotal,
      shipping,
      tax,
      total,
      paymentMethod,
      paymentStatus: paymentStatus || (paymentMethod === 'cod' ? 'pending' : 'paid'),
      shippingAddress,
      razorpayPaymentUrl,
    })

    console.log('Email send results:', emailResults)

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        orderNumber: order.orderNumber,
        total: order.totalAmount,
        paymentStatus: order.paymentStatus,
        paymentMethod: order.paymentMethod,
      },
      emailsSent: {
        customer: emailResults.customer.success,
        admin: emailResults.admin.success,
      },
    })
  } catch (error) {
    console.error('Create order error:', error)
    return NextResponse.json(
      { error: 'Failed to create order', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
