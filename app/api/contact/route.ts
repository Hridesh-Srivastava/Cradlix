import { NextResponse } from "next/server"
import { saveContactForm, connectMongoDB, ContactForm } from "@/lib/db/mongodb"
import { auth } from "@/lib/auth/config"
import { mailer, renderAdminContactHtml, renderUserThankYouHtml } from "@/lib/email"
import ExcelJS from "exceljs"
import { verifyRecaptcha } from "@/lib/security/recaptcha"

export async function POST(req: Request) {
  try {
    const session = await auth().catch(() => null)
  const body = await req.json().catch(() => ({}))
  const { name, email, subject, message, captchaToken } = body || {}
    // Verify captcha
    const check = await verifyRecaptcha(captchaToken, 'contact')
    if (!check.success || (typeof check.score === 'number' && check.score < 0.5)) {
      return NextResponse.json({ error: "Captcha verification failed" }, { status: 400 })
    }

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Missing required fields: name, email, message" },
        { status: 400 },
      )
    }

    // Basic email validation
    const emailOk = /.+@.+\..+/.test(email)
    if (!emailOk) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 })
    }

    await connectMongoDB()

    // Extract client info
    const ipHeader = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip")
    const ipAddress = ipHeader ? ipHeader.split(",")[0].trim() : undefined
    const userAgent = req.headers.get("user-agent") || undefined

    const saved = await saveContactForm({
      name,
      email,
      subject: subject || "",
      message,
      ipAddress,
      userAgent,
      userId: (session?.user as any)?.id,
    })

    // Build an Excel workbook of all contact submissions (single sheet)
    const all = await ContactForm.find().sort({ createdAt: 1 }).lean()
    const wb = new ExcelJS.Workbook()
    const ws = wb.addWorksheet("Contact Submissions")
    ws.columns = [
      { header: "Name", key: "name", width: 24 },
      { header: "Email", key: "email", width: 28 },
      { header: "Subject", key: "subject", width: 28 },
      { header: "Message", key: "message", width: 50 },
      { header: "Status", key: "status", width: 12 },
      { header: "IP Address", key: "ipAddress", width: 18 },
      { header: "User Agent", key: "userAgent", width: 40 },
      { header: "Created At", key: "createdAt", width: 22 },
    ]
    all.forEach((r: any) => {
      ws.addRow({
        name: r.name,
        email: r.email,
        subject: r.subject || "",
        message: r.message,
        status: r.status,
        ipAddress: r.ipAddress || "",
        userAgent: r.userAgent || "",
        createdAt: new Date(r.createdAt).toISOString(),
      })
    })
    const excelBuffer = await wb.xlsx.writeBuffer()

    const adminTo = process.env.EMAIL_TO || process.env.EMAIL_USER
    const from = process.env.EMAIL_USER

    // Send admin notification with Excel attached
    if (adminTo && from) {
      await mailer.sendMail({
        from,
        to: adminTo,
        subject: `New contact: ${name} <${email}>`,
        html: renderAdminContactHtml({ name, email, subject, message }),
        attachments: [
          {
            filename: "contact_submissions.xlsx",
            content: Buffer.from(excelBuffer),
            contentType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          },
        ],
      })
    }

    // Send user thank-you email
    if (from && email) {
      await mailer.sendMail({
        from,
        to: email,
        subject: "Thanks for contacting Baby Store",
        html: renderUserThankYouHtml(name),
      })
    }

    return NextResponse.json({ ok: true, id: saved._id?.toString?.() }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Failed to submit" }, { status: 500 })
  }
}
