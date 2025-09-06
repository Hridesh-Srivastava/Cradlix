import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth/config"
import { verifyPaymentSignature } from "@/lib/payment/razorpay"
import { db } from "@/lib/db/postgres"
import { orders } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = await request.json()

    // Validate required fields
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !orderId) {
      return NextResponse.json({ error: "Missing payment details" }, { status: 400 })
    }

    // Verify payment signature
    const isValidSignature = verifyPaymentSignature(razorpay_order_id, razorpay_payment_id, razorpay_signature)

    if (!isValidSignature) {
      // Update order status to failed
      await db
        .update(orders)
        .set({
          status: "failed",
          paymentStatus: "failed",
          updatedAt: new Date(),
        })
        .where(eq(orders.id, orderId))

      return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 })
    }

    // Update order status to completed
    await db
      .update(orders)
      .set({
        status: "confirmed",
        paymentStatus: "completed",
        razorpayPaymentId: razorpay_payment_id,
        paidAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(orders.id, orderId))

    return NextResponse.json({
      success: true,
      message: "Payment verified successfully",
      orderId,
    })
  } catch (error) {
    console.error("Payment verification error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
