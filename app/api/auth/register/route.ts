import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db/postgres'
import { users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { mailer } from '@/lib/email'
import { renderWelcomeUserHtml, renderNewUserAdminHtml } from '@/lib/email'
import { buildUsersWorkbookBuffer } from '@/lib/export/users-excel'

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, password } = registerSchema.parse(body)

    // Check if user already exists
    const existingUser = await db.select().from(users).where(eq(users.email, email)).limit(1)
    
    if (existingUser[0]) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
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
    })
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
