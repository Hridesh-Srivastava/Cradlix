import { NextResponse } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db/postgres'
import { users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { connectMongoDB, PendingRegistration } from '@/lib/db/mongodb'
import { rateLimit, rateLimitHeaders } from '@/lib/security/rate-limit'
import { getClientIp } from '@/lib/security/ip'
import { mailer, renderWelcomeUserHtml, renderNewUserAdminHtml } from '@/lib/email'
import { buildUsersWorkbookBuffer } from '@/lib/export/users-excel'

const schema = z.object({
  email: z.string().email(),
  otp: z.string().length(6),
})

export async function POST(req: Request) {
  // Rate limit: 10 attempts / 10 minutes per IP
  const ip = getClientIp(req)
  const rl = await rateLimit({ prefix: 'verify-otp', key: ip || 'unknown' }, { limit: 10, windowSec: 600 })
  if (!rl.allowed) {
    return NextResponse.json({ error: 'Too many attempts. Try later.' }, { status: 429, headers: rateLimitHeaders(rl) })
  }

  try {
    const body = await req.json().catch(() => ({}))
    const { email, otp } = schema.parse(body)
    await connectMongoDB()

    const pending = await PendingRegistration.findOne({ email })
    if (!pending) {
      return NextResponse.json({ error: 'No pending registration found.' }, { status: 400, headers: rateLimitHeaders(rl) })
    }
    if (new Date() > new Date(pending.otpExpiresAt)) {
      return NextResponse.json({ error: 'OTP expired. Please resend a new code.' }, { status: 400, headers: rateLimitHeaders(rl) })
    }
    if (pending.otp !== otp) {
      pending.attempts = (pending.attempts || 0) + 1
      pending.updatedAt = new Date()
      await pending.save()
      return NextResponse.json({ error: 'Invalid OTP. Please try again.' }, { status: 400, headers: rateLimitHeaders(rl) })
    }

    // Create the user now in Postgres
    const exists = await db.select().from(users).where(eq(users.email, email)).limit(1)
    if (exists[0]) {
      // Clean up pending record anyway
      await PendingRegistration.deleteOne({ email })
      return NextResponse.json({ success: true, message: 'Already verified. You can sign in.' }, { headers: rateLimitHeaders(rl) })
    }

    const created = await db.insert(users).values({
      email,
      name: pending.name,
      password: pending.passwordHash,
      role: 'customer',
      status: 'approved',
    }).returning()

    // Cleanup pending
    await PendingRegistration.deleteOne({ email })

    // Send welcome/admin emails
    try {
      const from = process.env.EMAIL_USER
      const adminTo = process.env.EMAIL_TO || from
      const excel = await buildUsersWorkbookBuffer()
      const user = created[0]
      if (from && user?.email) {
        await mailer.sendMail({
          from,
          to: user.email,
          subject: 'Welcome to Baby Store',
          html: renderWelcomeUserHtml(user.name || ''),
        })
      }
      if (from && adminTo && user?.email) {
        await mailer.sendMail({
          from,
          to: adminTo,
          subject: `New user: ${user.name || ''} <${user.email}>`,
          html: renderNewUserAdminHtml({ name: user.name || null, email: user.email, role: (user as any).role || 'customer' }),
          attachments: [
            {
              filename: 'users.xlsx',
              content: Buffer.from(excel),
              contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            },
          ],
        })
      }
    } catch {}

    return NextResponse.json({ success: true, message: 'Email verified. You can sign in now.' }, { headers: rateLimitHeaders(rl) })
  } catch (e: any) {
    if (e?.name === 'ZodError') {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
    }
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 })
  }
}
