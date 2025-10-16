import nodemailer from "nodemailer"

const host = process.env.EMAIL_HOST
const port = Number(process.env.EMAIL_PORT || 587)
const user = process.env.EMAIL_USER
const pass = process.env.EMAIL_PASS

if (!host || !user || !pass) {
  // Keep non-fatal; API handlers can decide
  console.warn("Email environment variables are missing; emails may not be sent.")
}

export const mailer = nodemailer.createTransport({
  host,
  port,
  secure: false,
  auth: { user, pass },
})

export function renderAdminContactHtml(data: { name: string; email: string; phone?: string; subject?: string; message: string }) {
  const { name, email, phone, subject, message } = data
  return `
  <div style="font-family:Arial,Helvetica,sans-serif;max-width:640px;margin:auto">
    <h2 style="margin:0 0 16px">New Contact Submission</h2>
    <table style="width:100%;border-collapse:collapse">
      <tr><td style="padding:8px;border:1px solid #eee;width:140px"><strong>Name</strong></td><td style="padding:8px;border:1px solid #eee">${name}</td></tr>
      <tr><td style="padding:8px;border:1px solid #eee"><strong>Email</strong></td><td style="padding:8px;border:1px solid #eee">${email}</td></tr>
      <tr><td style="padding:8px;border:1px solid #eee"><strong>Phone</strong></td><td style="padding:8px;border:1px solid #eee">${phone || "(not provided)"}</td></tr>
      <tr><td style="padding:8px;border:1px solid #eee"><strong>Subject</strong></td><td style="padding:8px;border:1px solid #eee">${subject || "(none)"}</td></tr>
      <tr><td style="padding:8px;border:1px solid #eee"><strong>Message</strong></td><td style="padding:8px;border:1px solid #eee;white-space:pre-line">${message}</td></tr>
    </table>
    <p style="color:#666;margin-top:16px">This email includes an updated Excel sheet of all contact submissions as an attachment.</p>
  </div>`
}

export function renderUserThankYouHtml(name: string) {
  return `
  <div style="font-family:Arial,Helvetica,sans-serif;max-width:640px;margin:auto">
    <h2 style="margin:0 0 12px">Thank you for contacting Baby Store</h2>
    <p style="color:#333">Hi ${name || "there"},</p>
    <p style="color:#333">We’ve received your message and our team will get back to you within 24 hours.</p>
    <p style="color:#666">If this wasn’t you, you can ignore this email.</p>
    <hr style="border:none;border-top:1px solid #eee;margin:16px 0"/>
    <p style="color:#888;font-size:12px">This is an automated message. Please do not reply.</p>
  </div>`
}

export function renderWelcomeUserHtml(name: string) {
  const startUrl = `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/products`
  return `
  <div style="font-family:Arial,Helvetica,sans-serif;max-width:640px;margin:auto">
    <h2 style="margin:0 0 12px">Welcome to Baby Store</h2>
    <p style="color:#333">Hi ${name || "there"},</p>
    <p style="color:#333">Your account has been created successfully. Start shopping with us!</p>
    <p style="margin:20px 0">
      <a href="${startUrl}" style="display:inline-block;background:#111;color:#fff;padding:10px 16px;border-radius:6px;text-decoration:none">Start shopping</a>
    </p>
    <p style="color:#666">We’re excited to have you on board.</p>
  </div>`
}

export function renderNewUserAdminHtml(user: { name: string | null; email: string; role?: string }) {
  return `
  <div style="font-family:Arial,Helvetica,sans-serif;max-width:640px;margin:auto">
    <h2 style="margin:0 0 16px">New User Registered</h2>
    <table style="width:100%;border-collapse:collapse">
      <tr><td style="padding:8px;border:1px solid #eee;width:140px"><strong>Name</strong></td><td style="padding:8px;border:1px solid #eee">${user.name || "(unknown)"}</td></tr>
      <tr><td style="padding:8px;border:1px solid #eee"><strong>Email</strong></td><td style="padding:8px;border:1px solid #eee">${user.email}</td></tr>
      <tr><td style="padding:8px;border:1px solid #eee"><strong>Role</strong></td><td style="padding:8px;border:1px solid #eee">${user.role || "customer"}</td></tr>
    </table>
    <p style="color:#666;margin-top:16px">The latest Excel of all users is attached.</p>
  </div>`
}

export function renderAdminRefundRequestHtml(data: { 
  name: string; 
  email: string; 
  phone: string; 
  paymentId: string; 
  subject: string; 
  refundAmount: number; 
  complaint: string 
}) {
  const { name, email, phone, paymentId, subject, refundAmount, complaint } = data
  return `
  <div style="font-family:Arial,Helvetica,sans-serif;max-width:640px;margin:auto">
    <h2 style="margin:0 0 16px;color:#dc2626">New Refund Request</h2>
    <div style="background:#fef2f2;border-left:4px solid #dc2626;padding:12px;margin-bottom:16px">
      <p style="margin:0;color:#991b1b;font-weight:bold">⚠️ Action Required: Review and Process Refund</p>
    </div>
    <table style="width:100%;border-collapse:collapse">
      <tr><td style="padding:8px;border:1px solid #eee;width:160px"><strong>Customer Name</strong></td><td style="padding:8px;border:1px solid #eee">${name}</td></tr>
      <tr><td style="padding:8px;border:1px solid #eee"><strong>Email</strong></td><td style="padding:8px;border:1px solid #eee">${email}</td></tr>
      <tr><td style="padding:8px;border:1px solid #eee"><strong>Phone</strong></td><td style="padding:8px;border:1px solid #eee">${phone}</td></tr>
      <tr><td style="padding:8px;border:1px solid #eee"><strong>Payment/Transaction ID</strong></td><td style="padding:8px;border:1px solid #eee;font-family:monospace;color:#059669">${paymentId}</td></tr>
      <tr><td style="padding:8px;border:1px solid #eee"><strong>Subject/Reason</strong></td><td style="padding:8px;border:1px solid #eee">${subject}</td></tr>
      <tr style="background:#fef3c7"><td style="padding:8px;border:1px solid #eee"><strong>Refund Amount</strong></td><td style="padding:8px;border:1px solid #eee;font-size:18px;font-weight:bold;color:#92400e">₹${refundAmount.toFixed(2)}</td></tr>
      <tr><td style="padding:8px;border:1px solid #eee;vertical-align:top"><strong>Complaint/Remarks</strong></td><td style="padding:8px;border:1px solid #eee;white-space:pre-line">${complaint}</td></tr>
    </table>
    
    <div style="background:#f3f4f6;padding:12px;margin-top:16px;border-radius:6px">
      <h3 style="margin:0 0 8px;font-size:14px">Next Steps:</h3>
      <ol style="margin:0;padding-left:20px;font-size:14px;color:#374151">
        <li>Verify the payment ID in Razorpay Dashboard</li>
        <li>Review the refund reason and complaint</li>
        <li>Check order history and delivery status</li>
        <li>Process refund through Razorpay if approved</li>
        <li>Update customer via email/phone</li>
      </ol>
    </div>
    
    <p style="color:#666;margin-top:16px;font-size:13px">
      <strong>Note:</strong> This email includes an updated Excel sheet of all refund requests as an attachment. 
      Please process this request within 5-7 business days as per our refund policy.
    </p>
    
    <div style="margin-top:20px;padding-top:16px;border-top:1px solid #eee">
      <p style="color:#888;font-size:12px;margin:0">
        Razorpay Dashboard: <a href="https://dashboard.razorpay.com/" style="color:#2563eb">https://dashboard.razorpay.com/</a>
      </p>
    </div>
  </div>`
}

export function renderUserRefundThankYouHtml(name: string, refundAmount: number, paymentId: string) {
  return `
  <div style="font-family:Arial,Helvetica,sans-serif;max-width:640px;margin:auto">
    <div style="text-align:center;padding:20px 0;background:#f0fdf4;border-radius:8px;margin-bottom:20px">
      <div style="display:inline-block;width:48px;height:48px;background:#10b981;border-radius:50%;margin-bottom:12px">
        <span style="color:white;font-size:32px;line-height:48px">✓</span>
      </div>
      <h2 style="margin:0;color:#065f46">Refund Request Received</h2>
    </div>
    
    <p style="color:#333;font-size:16px">Hi ${name || "there"},</p>
    
    <p style="color:#333">Thank you for submitting your refund request. We have received your request and wanted to confirm the details:</p>
    
    <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:6px;padding:16px;margin:20px 0">
      <table style="width:100%">
        <tr><td style="padding:6px 0;color:#6b7280"><strong>Payment ID:</strong></td><td style="padding:6px 0;text-align:right;font-family:monospace;color:#059669">${paymentId}</td></tr>
        <tr><td style="padding:6px 0;color:#6b7280"><strong>Refund Amount:</strong></td><td style="padding:6px 0;text-align:right;font-size:18px;font-weight:bold;color:#059669">₹${refundAmount.toFixed(2)}</td></tr>
      </table>
    </div>
    
    <h3 style="color:#111;font-size:16px;margin:24px 0 12px">What happens next?</h3>
    
    <div style="border-left:3px solid #3b82f6;padding-left:16px;margin:16px 0">
      <p style="margin:8px 0;color:#374151"><strong>1. Review (5-7 business days)</strong><br/>
      <span style="color:#6b7280;font-size:14px">Our team will review your refund request and verify the payment details.</span></p>
      
      <p style="margin:8px 0;color:#374151"><strong>2. Processing (within review period)</strong><br/>
      <span style="color:#6b7280;font-size:14px">Once approved, we'll initiate the refund through Razorpay to your original payment method.</span></p>
      
      <p style="margin:8px 0;color:#374151"><strong>3. Credit to Account</strong><br/>
      <span style="color:#6b7280;font-size:14px">
        • Credit/Debit Card: 5-7 business days<br/>
        • UPI/Wallet: 5-7 business days<br/>
        • Net Banking: 5-7 business days
      </span></p>
    </div>
    
    <div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:6px;padding:16px;margin:20px 0">
      <p style="margin:0;color:#1e40af;font-size:14px">
        <strong>💡 Please Note:</strong> We'll get back to you within <strong>5-7 business days</strong> with an update on your refund status. 
        The actual credit to your account depends on your bank's processing time.
      </p>
    </div>
    
    <p style="color:#333">If you have any questions or need to provide additional information, please feel free to contact us:</p>
    
    <div style="background:#f9fafb;padding:12px;border-radius:6px;margin:16px 0">
      <p style="margin:4px 0;color:#374151;font-size:14px">📧 Email: <a href="mailto:support@babystore.com" style="color:#2563eb">support@babystore.com</a></p>
      <p style="margin:4px 0;color:#374151;font-size:14px">📞 Phone: +91 98765 43210</p>
      <p style="margin:4px 0;color:#6b7280;font-size:13px">Monday-Friday: 9 AM - 6 PM IST</p>
    </div>
    
    <p style="color:#666;margin-top:24px">Thank you for your patience and for being a valued customer.</p>
    
    <p style="color:#666">Best regards,<br/>
    <strong>Baby Store Support Team</strong></p>
    
    <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0"/>
    <p style="color:#9ca3af;font-size:12px;text-align:center">
      This is an automated confirmation email. Please do not reply to this email.<br/>
      For assistance, contact us at support@babystore.com
    </p>
  </div>`
}
