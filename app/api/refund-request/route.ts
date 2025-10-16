import { NextResponse } from "next/server"
import { saveRefundQuery, connectMongoDB, RefundQuery } from "@/lib/db/mongodb"
import { mailer, renderAdminRefundRequestHtml, renderUserRefundThankYouHtml } from "@/lib/email"
import ExcelJS from "exceljs"
import { verifyRecaptcha } from "@/lib/security/recaptcha"
import { getClientIp } from "@/lib/security/ip"
import { rateLimit, rateLimitHeaders } from "@/lib/security/rate-limit"

export async function POST(req: Request) {
  try {
    // Rate limit per IP: 5 requests per 30 minutes
    const ip = getClientIp(req)
    const rl = await rateLimit({ prefix: 'refund', key: ip || 'unknown' }, { limit: 5, windowSec: 1800 })
    if (!rl.allowed) {
      return NextResponse.json(
        { error: 'Too many refund requests. Please try again later.' },
        { status: 429, headers: rateLimitHeaders(rl) }
      )
    }

    const body = await req.json().catch(() => ({}))
    const { name, email, phone, paymentId, subject, refundAmount, complaint, captchaToken } = body || {}

    // Verify captcha
    const check = await verifyRecaptcha(captchaToken, 'refund')
    if (!check.success || (typeof check.score === 'number' && check.score < 0.5)) {
      return NextResponse.json({ error: "Captcha verification failed" }, { status: 400, headers: rateLimitHeaders(rl) })
    }

    // Validation
    if (!name || !email || !phone || !paymentId || !subject || !refundAmount || !complaint) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400, headers: rateLimitHeaders(rl) },
      )
    }

    // Email validation
    const emailOk = /.+@.+\..+/.test(email)
    if (!emailOk) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400, headers: rateLimitHeaders(rl) })
    }

    // Amount validation
    const amount = parseFloat(refundAmount)
    if (isNaN(amount) || amount <= 0) {
      return NextResponse.json({ error: "Invalid refund amount" }, { status: 400, headers: rateLimitHeaders(rl) })
    }

    await connectMongoDB()

    // Extract client info
    const ipHeader = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip")
    const ipAddress = ipHeader ? ipHeader.split(",")[0].trim() : undefined
    const userAgent = req.headers.get("user-agent") || undefined

    const saved = await saveRefundQuery({
      name,
      email,
      phone,
      paymentId,
      subject,
      refundAmount: amount,
      complaint,
      ipAddress,
      userAgent,
    })

    // Build an Excel workbook of all refund requests
    const all = await RefundQuery.find().sort({ createdAt: -1 }).lean()
    const wb = new ExcelJS.Workbook()
    const ws = wb.addWorksheet("Refund Requests")
    
    ws.columns = [
      { header: "Request ID", key: "_id", width: 26 },
      { header: "Name", key: "name", width: 24 },
      { header: "Email", key: "email", width: 28 },
      { header: "Phone", key: "phone", width: 16 },
      { header: "Payment ID", key: "paymentId", width: 28 },
      { header: "Subject/Reason", key: "subject", width: 30 },
      { header: "Refund Amount (₹)", key: "refundAmount", width: 18 },
      { header: "Complaint/Remarks", key: "complaint", width: 50 },
      { header: "Status", key: "status", width: 14 },
      { header: "IP Address", key: "ipAddress", width: 18 },
      { header: "Submitted At", key: "createdAt", width: 22 },
    ]

    // Style the header row
    ws.getRow(1).font = { bold: true }
    ws.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE2E8F0' }
    }

    all.forEach((r: any) => {
      ws.addRow({
        _id: r._id.toString(),
        name: r.name,
        email: r.email,
        phone: r.phone || "",
        paymentId: r.paymentId,
        subject: r.subject || "",
        refundAmount: r.refundAmount,
        complaint: r.complaint,
        status: r.status,
        ipAddress: r.ipAddress || "",
        createdAt: new Date(r.createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      })
    })

    // Auto-filter
    ws.autoFilter = {
      from: 'A1',
      to: 'K1',
    }

    const excelBuffer = await wb.xlsx.writeBuffer()

    const adminTo = process.env.EMAIL_TO || process.env.EMAIL_USER
    const from = process.env.EMAIL_USER

    // Send admin notification with Excel attached
    if (adminTo && from) {
      await mailer.sendMail({
        from,
        to: adminTo,
        subject: `🔴 New Refund Request: ₹${amount.toFixed(2)} - ${name}`,
        html: renderAdminRefundRequestHtml({ 
          name, 
          email, 
          phone, 
          paymentId, 
          subject, 
          refundAmount: amount, 
          complaint 
        }),
        attachments: [
          {
            filename: "refund_requests.xlsx",
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
        subject: "Refund Request Received - Baby Store",
        html: renderUserRefundThankYouHtml(name, amount, paymentId),
      })
    }

    return NextResponse.json(
      { 
        ok: true, 
        id: saved._id?.toString?.(),
        message: "Refund request submitted successfully"
      }, 
      { status: 201, headers: rateLimitHeaders(rl) }
    )
  } catch (error: any) {
    console.error("Refund request error:", error)
    return NextResponse.json(
      { error: error?.message || "Failed to submit refund request" }, 
      { status: 500 }
    )
  }
}
