import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth/config"
import { createRazorpayOrder } from "@/lib/payment/razorpay"
import { db } from "@/lib/db/postgres"
import { orders, orderItems } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { orderId, items, shippingAddress, billingAddress } = await request.json()

    // Validate required fields
    if (!orderId || !items || !shippingAddress) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Calculate total amount
    const totalAmount = items.reduce((sum: number, item: any) => {
      return sum + item.price * item.quantity
    }, 0)

    // Create order in database
    const [order] = await db
      .insert(orders)
      .values({
        id: orderId,
        userId: session.user.id,
        status: "pending",
        totalAmount,
        shippingAddress: JSON.stringify(shippingAddress),
        billingAddress: JSON.stringify(billingAddress || shippingAddress),
        paymentStatus: "pending",
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning()

    // Create order items
    const orderItemsData = items.map((item: any) => ({
      orderId: order.id,
      productId: item.productId,
      quantity: item.quantity,
      price: item.price,
      createdAt: new Date(),
    }))

    await db.insert(orderItems).values(orderItemsData)

    // Create Razorpay order
    const razorpayResult = await createRazorpayOrder(totalAmount, orderId)

    if (!razorpayResult.success) {
      // Update order status to failed
      await db.update(orders).set({ status: "failed", updatedAt: new Date() }).where(eq(orders.id, orderId))

      return NextResponse.json({ error: razorpayResult.error }, { status: 500 })
    }

    // Update order with Razorpay order ID
    await db
      .update(orders)
      .set({
        razorpayOrderId: razorpayResult.order.id,
        updatedAt: new Date(),
      })
      .where(eq(orders.id, orderId))

    return NextResponse.json({
      success: true,
      order: razorpayResult.order,
      orderId: order.id,
      amount: totalAmount,
    })
  } catch (error) {
    console.error("Create order error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
