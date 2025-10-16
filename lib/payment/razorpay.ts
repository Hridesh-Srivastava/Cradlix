import Razorpay from "razorpay"

// Initialize Razorpay instance
export const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

// Payment configuration
export const RAZORPAY_CONFIG = {
  currency: "INR",
  receipt_prefix: "baby_store_",
  theme: {
    color: "#3B82F6",
  },
  prefill: {
    method: "card",
  },
}

// Create order with Razorpay
export async function createRazorpayOrder(amount: number, orderId: string) {
  try {
    const options = {
      amount: Math.round(amount * 100), // Convert to paise and ensure integer
      currency: RAZORPAY_CONFIG.currency,
      receipt: `${RAZORPAY_CONFIG.receipt_prefix}${orderId}`,
      payment_capture: 1,
    }

    console.log('Creating Razorpay order with options:', options)
    const order = await razorpay.orders.create(options)
    return { success: true, order }
  } catch (error) {
    console.error("Razorpay order creation failed:", error)
    return { success: false, error: "Failed to create payment order" }
  }
}

// Verify payment signature
export function verifyPaymentSignature(orderId: string, paymentId: string, signature: string): boolean {
  try {
    const crypto = require("crypto")
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(`${orderId}|${paymentId}`)
      .digest("hex")

    return expectedSignature === signature
  } catch (error) {
    console.error("Payment signature verification failed:", error)
    return false
  }
}

// Payment status types
export type PaymentStatus = "pending" | "processing" | "completed" | "failed" | "cancelled"

export interface PaymentData {
  orderId: string
  amount: number
  currency: string
  paymentId?: string
  signature?: string
  status: PaymentStatus
  createdAt: Date
  updatedAt: Date
}
