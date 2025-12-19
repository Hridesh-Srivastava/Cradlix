import { NextRequest, NextResponse } from "next/server"
import { mailer } from "@/lib/email"

export async function POST(req: NextRequest) {
  try {
    const { email, businessName, contactPersonName, storeSlug } = await req.json()

    const dashboardUrl = `${process.env.NEXTAUTH_URL}/admin`
    const storeUrl = `${process.env.NEXTAUTH_URL}/stores/${storeSlug}`

    const html = `
    <div style="font-family:Arial,Helvetica,sans-serif;max-width:640px;margin:auto;padding:20px;">
      <div style="text-align:center;margin-bottom:30px;">
        <h1 style="color:#4CAF50;margin:0;">🎉 Congratulations! Your Store is Approved</h1>
      </div>
      
      <p style="color:#333;font-size:16px;">Hi ${contactPersonName},</p>
      
      <p style="color:#333;font-size:16px;">
        Great news! Your store registration for <strong>${businessName}</strong> has been approved and is now live on our marketplace.
      </p>
      
      <div style="background:#E8F5E9;border-left:4px solid #4CAF50;padding:20px;margin:20px 0;border-radius:4px;">
        <p style="margin:0 0 10px;color:#333;font-size:18px;"><strong>✅ Your Store is Now Active!</strong></p>
        <p style="margin:0;color:#666;">
          You've been promoted to <strong>Admin</strong> role and can now start managing your store and products.
        </p>
      </div>
      
      <div style="margin:30px 0;">
        <p style="color:#333;font-size:16px;margin-bottom:15px;"><strong>Next Steps:</strong></p>
        <ol style="color:#666;font-size:15px;line-height:1.8;">
          <li>Log in to your admin dashboard</li>
          <li>Complete your store profile settings</li>
          <li>Add your first products</li>
          <li>Set up payment and shipping preferences</li>
        </ol>
      </div>
      
      <div style="text-align:center;margin:30px 0;">
        <a href="${dashboardUrl}" style="display:inline-block;background:#4CAF50;color:white;padding:15px 30px;text-decoration:none;border-radius:5px;font-weight:bold;">
          Go to Admin Dashboard
        </a>
      </div>
      
      <div style="background:#f5f5f5;padding:15px;margin:20px 0;border-radius:4px;">
        <p style="margin:0 0 10px;color:#333;"><strong>Store Information:</strong></p>
        <p style="margin:5px 0;color:#666;">Store Name: <strong>${businessName}</strong></p>
        <p style="margin:5px 0;color:#666;">Store URL: <a href="${storeUrl}" style="color:#4CAF50;">${storeUrl}</a></p>
        <p style="margin:5px 0;color:#666;">Commission Rate: <strong>10%</strong></p>
      </div>
      
      <p style="color:#333;font-size:16px;">
        If you have any questions or need assistance getting started, our support team is here to help.
      </p>
      
      <p style="color:#333;font-size:16px;margin-top:30px;">
        Welcome to the Cradlix family!<br/>
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
      subject: "🎉 Your Store Has Been Approved!",
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
