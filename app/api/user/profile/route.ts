import { NextRequest, NextResponse } from 'next/server'
import { auth } from "@/lib/auth/config"
import { authOptions } from '@/lib/auth/config'
import { db } from '@/lib/db/postgres'
import { users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user ID from query params for admin access, otherwise use session user ID
    const { searchParams } = new URL(request.url)
    const requestedUserId = searchParams.get('userId')
    
    // Only allow admin to access other users' profiles
    const targetUserId = (session.user.role === 'admin' && requestedUserId) ? requestedUserId : session.user.id

    const user = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        image: users.image,
        role: users.role,
        emailVerified: users.emailVerified,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(eq(users.id, targetUserId))
      .limit(1)

    if (!user.length) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Ensure user can only access their own data (unless admin)
    if (session.user.role !== 'admin' && user[0].id !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Mock addresses for now - in real app, fetch from addresses table
    const addresses = [
      {
        id: '1',
        type: 'home' as const,
        name: 'John Doe',
        phone: '+1234567890',
        address: '123 Main Street',
        city: 'New York',
        state: 'NY',
        pincode: '10001',
        isDefault: true,
      },
    ]

    return NextResponse.json({
      success: true,
      profile: {
        ...user[0],
        addresses,
      },
    })
  } catch (error) {
    console.error('Error fetching user profile:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, email, userId } = body

    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      )
    }

    // Only allow admin to update other users' profiles
    const targetUserId = (session.user.role === 'admin' && userId) ? userId : session.user.id

    // Ensure user can only update their own data (unless admin)
    if (session.user.role !== 'admin' && targetUserId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const updatedUser = await db
      .update(users)
      .set({
        name,
        email,
        updatedAt: new Date(),
      })
      .where(eq(users.id, targetUserId))
      .returning({
        id: users.id,
        name: users.name,
        email: users.email,
        image: users.image,
        role: users.role,
        emailVerified: users.emailVerified,
        createdAt: users.createdAt,
      })

    if (!updatedUser.length) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      profile: updatedUser[0],
    })
  } catch (error) {
    console.error('Error updating user profile:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}