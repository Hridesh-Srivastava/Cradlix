import { NextRequest, NextResponse } from 'next/server'
import { createRazorpayOrder } from '@/lib/payment/razorpay'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import { z } from 'zod'

const createOrderSchema = z.object({
  amount: z.number().min(1, 'Amount must be greater than 0'),
  currency: z.string().default('INR'),
  receipt: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { amount, currency, receipt } = createOrderSchema.parse(body)

    // Create Razorpay order
    const result = await createRazorpayOrder(amount, receipt || `order_${Date.now()}`)

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to create payment order' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      order: result.order,
    })
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