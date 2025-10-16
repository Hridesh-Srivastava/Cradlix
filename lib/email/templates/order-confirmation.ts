import { formatCurrency } from '@/lib/utils'

interface OrderItem {
  name: string
  quantity: number
  price: number
  image?: string
}

interface OrderConfirmationProps {
  orderNumber: string
  customerName: string
  customerEmail: string
  items: OrderItem[]
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
  razorpayPaymentUrl?: string // For COD with Pay Now option
}

export function generateOrderConfirmationEmail(props: OrderConfirmationProps): string {
  const {
    orderNumber,
    customerName,
    items,
    subtotal,
    shipping,
    tax,
    total,
    paymentMethod,
    paymentStatus,
    shippingAddress,
    razorpayPaymentUrl,
  } = props

  const isPending = paymentStatus === 'pending'
  const isCOD = paymentMethod === 'cod'

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Confirmation - ${orderNumber}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f5f5f5;
    }
    .email-container {
      background: white;
      border-radius: 8px;
      padding: 30px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .header {
      text-align: center;
      padding-bottom: 20px;
      border-bottom: 2px solid #4CAF50;
    }
    .header h1 {
      color: #4CAF50;
      margin: 0;
      font-size: 28px;
    }
    .order-number {
      background: #f0f9ff;
      padding: 15px;
      border-radius: 6px;
      margin: 20px 0;
      text-align: center;
    }
    .order-number strong {
      color: #0066cc;
      font-size: 18px;
    }
    .status-badge {
      display: inline-block;
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 14px;
      font-weight: 600;
      margin-top: 10px;
    }
    .status-paid {
      background: #d4edda;
      color: #155724;
    }
    .status-pending {
      background: #fff3cd;
      color: #856404;
    }
    .pay-now-button {
      display: inline-block;
      background: #0066cc;
      color: white !important;
      padding: 12px 30px;
      text-decoration: none;
      border-radius: 6px;
      margin: 15px 0;
      font-weight: 600;
    }
    .pay-now-button:hover {
      background: #0052a3;
    }
    .section {
      margin: 25px 0;
    }
    .section-title {
      font-size: 18px;
      font-weight: 600;
      margin-bottom: 15px;
      color: #333;
    }
    .items-table {
      width: 100%;
      border-collapse: collapse;
      margin: 15px 0;
    }
    .items-table th {
      background: #f8f9fa;
      padding: 12px;
      text-align: left;
      font-weight: 600;
      border-bottom: 2px solid #dee2e6;
    }
    .items-table td {
      padding: 12px;
      border-bottom: 1px solid #dee2e6;
    }
    .item-image {
      width: 60px;
      height: 60px;
      object-fit: cover;
      border-radius: 4px;
    }
    .totals-table {
      width: 100%;
      margin-top: 20px;
    }
    .totals-table td {
      padding: 8px 0;
    }
    .totals-table .label {
      text-align: right;
      padding-right: 20px;
      color: #666;
    }
    .totals-table .value {
      text-align: right;
      font-weight: 600;
    }
    .total-row {
      border-top: 2px solid #dee2e6;
      font-size: 18px;
      color: #4CAF50;
    }
    .address-box {
      background: #f8f9fa;
      padding: 15px;
      border-radius: 6px;
      margin: 10px 0;
    }
    .footer {
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #dee2e6;
      text-align: center;
      color: #666;
      font-size: 14px;
    }
    .footer a {
      color: #0066cc;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <h1>🎉 Order Confirmed!</h1>
      <p>Thank you for your purchase, ${customerName}!</p>
    </div>

    <div class="order-number">
      <div><strong>Order Number: ${orderNumber}</strong></div>
      <div class="status-badge ${isPending ? 'status-pending' : 'status-paid'}">
        Payment: ${paymentStatus.toUpperCase()}
      </div>
      ${isCOD ? '<div style="margin-top: 10px; color: #666;">Cash on Delivery</div>' : ''}
    </div>

    ${isPending && razorpayPaymentUrl ? `
    <div style="text-align: center; margin: 20px 0; padding: 20px; background: #fff3cd; border-radius: 6px;">
      <p style="margin: 0 0 15px 0; color: #856404; font-weight: 600;">
        Complete Your Payment Online
      </p>
      <a href="${razorpayPaymentUrl}" class="pay-now-button">
        Pay Now - ${formatCurrency(total)}
      </a>
      <p style="margin: 15px 0 0 0; font-size: 14px; color: #666;">
        Click the button above to pay securely via Razorpay
      </p>
    </div>
    ` : ''}

    <div class="section">
      <h2 class="section-title">Order Items</h2>
      <table class="items-table">
        <thead>
          <tr>
            <th>Product</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Subtotal</th>
          </tr>
        </thead>
        <tbody>
          ${items.map(item => `
            <tr>
              <td>
                <div style="display: flex; align-items: center; gap: 10px;">
                  ${item.image ? `<img src="${item.image}" alt="${item.name}" class="item-image" />` : ''}
                  <span>${item.name}</span>
                </div>
              </td>
              <td>${item.quantity}</td>
              <td>${formatCurrency(item.price)}</td>
              <td>${formatCurrency(item.price * item.quantity)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <table class="totals-table">
        <tr>
          <td class="label">Subtotal:</td>
          <td class="value">${formatCurrency(subtotal)}</td>
        </tr>
        <tr>
          <td class="label">Shipping:</td>
          <td class="value">${formatCurrency(shipping)}</td>
        </tr>
        <tr>
          <td class="label">Tax (GST 18%):</td>
          <td class="value">${formatCurrency(tax)}</td>
        </tr>
        <tr class="total-row">
          <td class="label"><strong>Total:</strong></td>
          <td class="value"><strong>${formatCurrency(total)}</strong></td>
        </tr>
      </table>
    </div>

    <div class="section">
      <h2 class="section-title">Shipping Address</h2>
      <div class="address-box">
        <strong>${shippingAddress.fullName || customerName}</strong><br>
        ${shippingAddress.addressLine1}<br>
        ${shippingAddress.addressLine2 ? `${shippingAddress.addressLine2}<br>` : ''}
        ${shippingAddress.city}, ${shippingAddress.state} ${shippingAddress.pincode}<br>
        ${shippingAddress.country}<br>
        Phone: ${shippingAddress.phone}
      </div>
    </div>

    <div class="section">
      <h2 class="section-title">Payment Information</h2>
      <div class="address-box">
        <strong>Method:</strong> ${paymentMethod === 'cod' ? 'Cash on Delivery (COD)' : 'Online Payment (Razorpay)'}<br>
        <strong>Status:</strong> ${paymentStatus === 'paid' ? '✅ Paid' : '⏳ Pending'}
      </div>
    </div>

    <div class="footer">
      <p>Questions about your order? Contact us at <a href="mailto:${process.env.EMAIL_TO || 'support@cradlix.com'}">${process.env.EMAIL_TO || 'support@cradlix.com'}</a></p>
      <p>Track your order: <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/account/orders">View Order Status</a></p>
      <p style="margin-top: 20px; color: #999; font-size: 12px;">
        This is an automated email. Please do not reply directly to this message.
      </p>
    </div>
  </div>
</body>
</html>
`
}
