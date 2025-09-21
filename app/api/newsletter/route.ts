import { NextResponse } from "next/server"
import { connectMongoDB, Newsletter } from "@/lib/db/mongodb"
import { mailer } from "@/lib/email"
import ExcelJS from "exceljs"

function isValidEmail(email: string) {
  return /[^@\s]+@[^@\s]+\.[^@\s]+/.test(email)
}

async function buildNewsletterWorkbookBuffer() {
  const all = await Newsletter.find().sort({ subscribedAt: 1 }).lean()
  const wb = new ExcelJS.Workbook()
  const ws = wb.addWorksheet("Subscribers")
  ws.columns = [
    { header: "Email", key: "email", width: 32 },
    { header: "Status", key: "status", width: 16 },
    { header: "Source", key: "source", width: 20 },
    { header: "Subscribed At", key: "subscribedAt", width: 26 },
  ]
  for (const s of all) {
    ws.addRow({
      email: s.email,
      status: s.status,
      source: s.source || "footer",
      subscribedAt: s.subscribedAt ? new Date(s.subscribedAt).toISOString() : "",
    })
  }
  return wb.xlsx.writeBuffer()
}

export async function POST(req: Request) {
  try {
    await connectMongoDB()
    const body = await req.json().catch(() => ({}))
    const email = (body?.email || "").trim().toLowerCase()
    const source = (body?.source || "footer") as string
    if (!email || !isValidEmail(email)) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 })
    }

    const ipAddress = (req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "").split(",")[0]?.trim() || null
    const userAgent = req.headers.get("user-agent") || null

    const subscribedAt = new Date()
    const sub = await Newsletter.findOneAndUpdate(
      { email },
      { email, source, status: "subscribed", subscribedAt, ipAddress, userAgent },
      { upsert: true, new: true }
    )

    // Build latest Excel
    const excel = await buildNewsletterWorkbookBuffer()
    const from = process.env.EMAIL_USER
    const adminTo = process.env.EMAIL_TO || from

    // Send thank-you email to subscriber
    if (from) {
      await mailer.sendMail({
        from,
        to: email,
        subject: "Thanks for subscribing to Baby Store",
        html: `
          <div style="font-family:Arial,Helvetica,sans-serif;max-width:640px;margin:auto">
            <h2 style="margin:0 0 12px">You're in! 🎉</h2>
            <p style="color:#333">Thanks for subscribing to the Baby Store newsletter.</p>
            <p style="color:#333">You'll receive exclusive offers, product updates, and parenting tips straight to your inbox.</p>
            <p style="margin:20px 0">
              <a href="${process.env.NEXTAUTH_URL || "http://localhost:3000"}/products" style="display:inline-block;background:#111;color:#fff;padding:10px 16px;border-radius:6px;text-decoration:none">Start exploring</a>
            </p>
            <p style="color:#888;font-size:12px">You can unsubscribe anytime from the email footer.</p>
          </div>
        `,
      })
    }

    // Send admin copy with attachment
    if (from && adminTo) {
      await mailer.sendMail({
        from,
        to: adminTo,
        subject: `New newsletter subscriber: ${email}`,
        html: `
          <div style="font-family:Arial,Helvetica,sans-serif;max-width:640px;margin:auto">
            <h2 style="margin:0 0 16px">New Newsletter Subscription</h2>
            <table style="width:100%;border-collapse:collapse">
              <tr><td style="padding:8px;border:1px solid #eee;width:140px"><strong>Email</strong></td><td style="padding:8px;border:1px solid #eee">${email}</td></tr>
              <tr><td style="padding:8px;border:1px solid #eee"><strong>Source</strong></td><td style="padding:8px;border:1px solid #eee">${source}</td></tr>
              <tr><td style="padding:8px;border:1px solid #eee"><strong>IP</strong></td><td style="padding:8px;border:1px solid #eee">${ipAddress || "-"}</td></tr>
              <tr><td style="padding:8px;border:1px solid #eee"><strong>User-Agent</strong></td><td style="padding:8px;border:1px solid #eee">${userAgent || "-"}</td></tr>
            </table>
            <p style="color:#666;margin-top:16px">The latest subscribers.xlsx is attached.</p>
          </div>
        `,
        attachments: [
          {
            filename: "subscribers.xlsx",
            content: Buffer.from(excel),
            contentType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          },
        ],
      })
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("Newsletter subscribe error:", error)
    return NextResponse.json({ error: "Unable to subscribe right now. Please try again later." }, { status: 500 })
  }
}
