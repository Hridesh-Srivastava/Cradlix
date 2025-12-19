import { NextRequest, NextResponse } from "next/server"
import { mailer } from "@/lib/email"

export async function POST(req: NextRequest) {
  try {
    const { email, businessName, contactPersonName, rejectionReason } = await req.json()

    const html = `
    <div style="font-family:Arial,Helvetica,sans-serif;max-width:640px;margin:auto;padding:20px;">
      <div style="text-align:center;margin-bottom:30px;">
        <h1 style="color:#f44336;margin:0;">Store Registration Update</h1>
      </div>
      
      <p style="color:#333;font-size:16px;">Hi ${contactPersonName},</p>
      
      <p style="color:#333;font-size:16px;">
        Thank you for your interest in joining our marketplace with <strong>${businessName}</strong>.
      </p>
      
      <p style="color:#333;font-size:16px;">
        After careful review of your application, we regret to inform you that we are unable to approve your store registration at this time.
      </p>
      
      <div style="background:#FFEBEE;border-left:4px solid #f44336;padding:20px;margin:20px 0;border-radius:4px;">
        <p style="margin:0 0 10px;color:#333;font-weight:bold;">Reason for Rejection:</p>
        <p style="margin:0;color:#666;white-space:pre-line;">${rejectionReason}</p>
      </div>
      
      <div style="background:#f5f5f5;padding:20px;margin:20px 0;border-radius:4px;">
        <p style="margin:0 0 10px;color:#333;font-weight:bold;">What You Can Do:</p>
        <ul style="margin:10px 0 0;padding-left:20px;color:#666;">
          <li>Review the reason provided and address any concerns</li>
          <li>Update your business documentation if needed</li>
          <li>Reapply with corrected information</li>
          <li>Contact our support team if you have questions</li>
        </ul>
      </div>
      
      <p style="color:#333;font-size:16px;">
        We encourage you to address the issues mentioned and submit a new application in the future. Our team is committed to supporting quality vendors on our platform.
      </p>
      
      <div style="text-align:center;margin:30px 0;">
        <a href="${process.env.NEXTAUTH_URL}/register-store" style="display:inline-block;background:#4CAF50;color:white;padding:15px 30px;text-decoration:none;border-radius:5px;font-weight:bold;">
          Submit New Application
        </a>
      </div>
      
      <p style="color:#333;font-size:16px;">
        If you have any questions about this decision or need clarification, please don't hesitate to reach out to our support team.
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
      subject: "Store Registration Decision - Cradlix",
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
