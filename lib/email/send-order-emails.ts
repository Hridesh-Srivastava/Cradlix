import { sendEmail } from './nodemailer'
import { generateOrderConfirmationEmail } from './templates/order-confirmation'

interface OrderEmailData {
  orderNumber: string
  customerName: string
  customerEmail: string
  items: Array<{
    name: string
    quantity: number
    price: number
    image?: string
  }>
  subtotal: number
  shipping: number
  tax: number
  total: number
  paymentMethod: string
  paymentStatus: string
  shippingAddress: {
    fullName?: string
    addressLine1: string
    addressLine2?: string
    city: string
    state: string
    pincode: string
    country: string
    phone: string
  }
  razorpayPaymentUrl?: string
}

export async function sendOrderConfirmationEmails(data: OrderEmailData) {
  const emailHtml = generateOrderConfirmationEmail(data)
  
  const results = {
    customer: { success: false, error: null as string | null },
    admin: { success: false, error: null as string | null },
  }

  // Send to customer
  try {
    const customerResult = await sendEmail({
      to: data.customerEmail,
      subject: `Order Confirmation - ${data.orderNumber} | Cradlix`,
      html: emailHtml,
    })
    results.customer = {
      success: customerResult.success,
      error: customerResult.error || null
    }
  } catch (error) {
    console.error('Failed to send customer email:', error)
    results.customer.error = error instanceof Error ? error.message : 'Unknown error'
  }

  // Send to admin/store owner
  const adminEmail = process.env.EMAIL_TO
  if (adminEmail && adminEmail !== data.customerEmail) {
    try {
      const adminResult = await sendEmail({
        to: adminEmail,
        subject: `New Order Received - ${data.orderNumber} | Cradlix`,
        html: emailHtml,
      })
      results.admin = {
        success: adminResult.success,
        error: adminResult.error || null
      }
    } catch (error) {
      console.error('Failed to send admin email:', error)
      results.admin.error = error instanceof Error ? error.message : 'Unknown error'
    }
  }

  return results
}
