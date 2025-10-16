import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db/postgres'
import { users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { mailer } from '@/lib/email'
import { renderWelcomeUserHtml, renderNewUserAdminHtml } from '@/lib/email'
import { buildUsersWorkbookBuffer } from '@/lib/export/users-excel'
import { verifyRecaptcha } from '@/lib/security/recaptcha'
import { getClientIp } from '@/lib/security/ip'
import { rateLimit, rateLimitHeaders } from '@/lib/security/rate-limit'
import { connectMongoDB, PendingRegistration } from '@/lib/db/mongodb'

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export async function POST(request: NextRequest) {
  try {
    // Rate limit per IP: 5 requests per 5 minutes
    const ip = getClientIp(request as unknown as Request)
    const rl = await rateLimit({ prefix: 'register', key: ip || 'unknown' }, { limit: 5, windowSec: 300 })
    if (!rl.allowed) {
      return NextResponse.json(
        { error: 'Too many registration attempts. Please try again later.' },
        { status: 429, headers: rateLimitHeaders(rl) }
      )
    }

    const body = await request.json()
    const { captchaToken, ...rest } = body || {}
    const { name, email, password } = registerSchema.parse(rest)

    // Verify reCAPTCHA for plain sign-up
    const result = await verifyRecaptcha(captchaToken, 'register')
    if (!result.success || (typeof result.score === 'number' && result.score < 0.5)) {
      return NextResponse.json({ error: 'Captcha verification failed' }, { status: 400, headers: rateLimitHeaders(rl) })
    }

    // Check if user already exists in SQL (final users table)
    const existingUser = await db.select().from(users).where(eq(users.email, email)).limit(1)
    if (existingUser[0]) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400, headers: rateLimitHeaders(rl) }
      )
    }

    // Prepare OTP-based pending registration
    await connectMongoDB()
    const passwordHash = await bcrypt.hash(password, 12)
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    const now = Date.now()
    const otpExpiresAt = new Date(now + 10 * 60 * 1000) // 10 minutes
    const resendAvailableAt = new Date(now + 60 * 1000) // 1 minute

    await PendingRegistration.findOneAndUpdate(
      { email },
      {
        email,
        name,
        passwordHash,
        otp,
        otpExpiresAt,
        resendAvailableAt,
        attempts: 0,
        ipAddress: request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || undefined,
        userAgent: request.headers.get('user-agent') || undefined,
        updatedAt: new Date(),
      },
      { upsert: true, new: true }
    )

    // Email the OTP
    const from = process.env.EMAIL_USER
    if (from) {
      await mailer.sendMail({
        from,
        to: email,
        subject: 'Your verification code for Cradlix',
        html: `
          <div style="font-family:Arial,Helvetica,sans-serif;max-width:640px;margin:auto">
            <h2 style="margin:0 0 12px">Verify your email</h2>
            <p>Hi ${name},</p>
            <p>Your one-time verification code is:</p>
            <p style="font-size:28px;letter-spacing:6px;font-weight:700">${otp}</p>
            <p>This code will expire in 10 minutes. If you didn't request this, you can ignore this email.</p>
          </div>
        `,
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Verification code sent to your email',
      next: `/verify-otp?email=${encodeURIComponent(email)}`,
    }, { headers: rateLimitHeaders(rl) })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
