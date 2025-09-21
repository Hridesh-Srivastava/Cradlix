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

    // Check if user already exists
    const existingUser = await db.select().from(users).where(eq(users.email, email)).limit(1)
    
    if (existingUser[0]) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400, headers: rateLimitHeaders(rl) }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user
    const newUser = await db.insert(users).values({
      name,
      email,
      password: hashedPassword,
      role: 'customer',
    }).returning()

    // Remove password from response
    const { password: _, ...userWithoutPassword } = newUser[0]

    // Send emails (non-blocking best-effort)
    try {
      const from = process.env.EMAIL_USER
      const adminTo = process.env.EMAIL_TO || from
      const excel = await buildUsersWorkbookBuffer()
      if (from && userWithoutPassword.email) {
        await mailer.sendMail({
          from,
          to: userWithoutPassword.email,
          subject: 'Welcome to Baby Store',
          html: renderWelcomeUserHtml(userWithoutPassword.name || ''),
        })
      }
      if (from && adminTo) {
        await mailer.sendMail({
          from,
          to: adminTo,
          subject: `New user: ${userWithoutPassword.name || ''} <${userWithoutPassword.email}>`,
          html: renderNewUserAdminHtml({
            name: userWithoutPassword.name,
            email: userWithoutPassword.email,
            role: (userWithoutPassword as any).role || 'customer',
          }),
          attachments: [
            {
              filename: 'users.xlsx',
              content: Buffer.from(excel),
              contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            },
          ],
        })
      }
    } catch (e) {
      console.warn('Welcome/admin email failed:', e)
    }

    return NextResponse.json({
      success: true,
      user: userWithoutPassword,
      message: 'User registered successfully'
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
