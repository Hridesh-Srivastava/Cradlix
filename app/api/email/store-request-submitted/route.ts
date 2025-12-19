import { NextRequest, NextResponse } from "next/server"
import { mailer } from "@/lib/email"

export async function POST(req: NextRequest) {
  try {
    const { email, businessName, contactPersonName } = await req.json()

    const html = `
    <div style="font-family:Arial,Helvetica,sans-serif;max-width:640px;margin:auto;padding:20px;">
      <div style="text-align:center;margin-bottom:30px;">
        <h1 style="color:#333;margin:0;">Store Registration Submitted</h1>
      </div>
      
      <p style="color:#333;font-size:16px;">Hi ${contactPersonName},</p>
      
      <p style="color:#333;font-size:16px;">
        Thank you for submitting your store registration request for <strong>${businessName}</strong>.
      </p>
      
      <p style="color:#333;font-size:16px;">
        Your application is now under review by our team. We will carefully evaluate your submission and get back to you within 2-3 business days.
      </p>
      
      <div style="background:#f5f5f5;border-left:4px solid #4CAF50;padding:15px;margin:20px 0;">
        <p style="margin:0;color:#333;"><strong>What happens next?</strong></p>
        <ul style="margin:10px 0 0;padding-left:20px;color:#666;">
          <li>Our team will review your business information and documents</li>
          <li>We may contact you for additional information if needed</li>
          <li>You'll receive an email once your application is approved or if any changes are required</li>
        </ul>
      </div>
      
      <p style="color:#333;font-size:16px;">
        If you have any questions, feel free to reach out to our support team.
      </p>
      
      <p style="color:#333;font-size:16px;margin-top:30px;">
        Best regards,<br/>
        <strong>The Cradlix Team</strong>
      </p>
      
      <hr style="border:none;border-top:1px solid #eee;margin:30px 0"/>
      <p style="color:#888;font-size:12px;text-align:center;">
        This is an automated message. Please do not reply to this email.
      </p>
    </div>
    `

    await mailer.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Store Registration Received - Under Review",
      html,
    })

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error("Email error:", error)
    return NextResponse.json(
      { message: "Failed to send email" },
      { status: 500 }
    )
  }
}
