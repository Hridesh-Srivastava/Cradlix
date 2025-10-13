import { NextResponse } from 'next/server'
import { z } from 'zod'
import { connectMongoDB, PendingRegistration } from '@/lib/db/mongodb'
import { rateLimit, rateLimitHeaders } from '@/lib/security/rate-limit'
import { getClientIp } from '@/lib/security/ip'
import { mailer } from '@/lib/email'

const schema = z.object({ email: z.string().email() })

export async function POST(req: Request) {
  // Rate limit: 5 resends / 10 minutes
  const ip = getClientIp(req)
  const rl = await rateLimit({ prefix: 'resend-otp', key: ip || 'unknown' }, { limit: 5, windowSec: 600 })
  if (!rl.allowed) {
    return NextResponse.json({ error: 'Too many requests.' }, { status: 429, headers: rateLimitHeaders(rl) })
  }

  try {
    const body = await req.json().catch(() => ({}))
    const { email } = schema.parse(body)
    await connectMongoDB()
    const pending = await PendingRegistration.findOne({ email })
    if (!pending) {
      return NextResponse.json({ error: 'No pending registration found.' }, { status: 400, headers: rateLimitHeaders(rl) })
    }

    const now = new Date()
    if (pending.resendAvailableAt && now < new Date(pending.resendAvailableAt)) {
      const waitSec = Math.ceil((new Date(pending.resendAvailableAt).getTime() - now.getTime()) / 1000)
      return NextResponse.json({ error: `Please wait ${waitSec}s before resending.` }, { status: 400, headers: rateLimitHeaders(rl) })
    }

    const newOtp = Math.floor(100000 + Math.random() * 900000).toString()
    pending.otp = newOtp
    pending.otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000)
    pending.resendAvailableAt = new Date(Date.now() + 60 * 1000)
    pending.updatedAt = new Date()
    await pending.save()

    const from = process.env.EMAIL_USER
    if (from) {
      await mailer.sendMail({
        from,
        to: email,
        subject: 'Your new verification code',
        html: `<p>Your new verification code is: <strong style="font-size:22px;letter-spacing:6px">${newOtp}</strong></p><p>This code expires in 10 minutes.</p>`
      })
    }

    return NextResponse.json({ success: true, message: 'A new code has been sent.' }, { headers: rateLimitHeaders(rl) })
  } catch (e: any) {
    if (e?.name === 'ZodError') {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
    }
    return NextResponse.json({ error: 'Could not resend code' }, { status: 500 })
  }
}
