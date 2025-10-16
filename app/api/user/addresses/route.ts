import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth/config'
import { db } from '@/lib/db/postgres'
import { addresses } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'

// GET: list current user's addresses
export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const rows = await db.select().from(addresses).where(eq(addresses.userId, session.user.id))
    
    // Map database schema to UI format
    const mapped = rows.map((r: any) => ({
      id: r.id,
      type: r.type || 'home',
      firstName: r.firstName,
      middleName: r.middleName,
      lastName: r.lastName,
      // Add backward compatible full name field
      name: `${r.firstName}${r.middleName ? ' ' + r.middleName : ''} ${r.lastName}`.trim(),
      email: r.email,
      countryCode: r.countryCode || '+91',
      phone: r.phone || '',
      addressLine1: r.addressLine1,
      addressLine2: r.addressLine2,
      // Add backward compatible field names
      address: r.addressLine1,
      pincode: r.postalCode,
      city: r.city,
      state: r.state,
      postalCode: r.postalCode,
      country: r.country,
      isDefault: r.isDefault,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
    }))
    
    return NextResponse.json({ success: true, addresses: mapped })
  } catch (e) {
    console.error('Get addresses error:', e)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST: create address
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    
    const body = await request.json()
    const { 
      type = 'home',
      firstName,
      middleName,
      lastName,
      email,
      countryCode = '+91',
      phone,
      addressLine1,
      addressLine2,
      city,
      state,
      postalCode,
      country = 'India',
      isDefault = false
    } = body

    // Validate required fields
    if (!firstName || !lastName || !phone || !addressLine1 || !city || !state || !postalCode) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Validate email format if provided
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        return NextResponse.json({ error: 'Invalid email format' }, { status: 400 })
      }
    }

    // Validate phone (10 digits)
    const phoneRegex = /^\d{10}$/
    if (!phoneRegex.test(phone)) {
      return NextResponse.json({ error: 'Phone number must be 10 digits' }, { status: 400 })
    }

    // If this is set as default, unset other defaults
    if (isDefault) {
      await db.update(addresses).set({ isDefault: false }).where(eq(addresses.userId, session.user.id))
    }

    const [inserted] = await db
      .insert(addresses)
      .values({
        userId: session.user.id,
        type: type === 'billing' ? 'billing' : 'shipping',
        firstName,
        middleName: middleName || null,
        lastName,
        email: email || null,
        countryCode,
        company: null,
        addressLine1,
        addressLine2: addressLine2 || null,
        city,
        state,
        postalCode,
        country,
        phone,
        isDefault,
      })
      .returning()

    return NextResponse.json({ success: true, address: inserted })
  } catch (e) {
    console.error('Create address error:', e)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT: update address
export async function PUT(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const body = await request.json()
    const { id, ...updates } = body
    if (!id) return NextResponse.json({ error: 'Missing address id' }, { status: 400 })

    if (updates.isDefault === true) {
      await db.update(addresses).set({ isDefault: false }).where(eq(addresses.userId, session.user.id))
    }

    // Split UI payload into legacy fields
    const name: string = updates.name || ''
    const addressStr: string = updates.address || ''
    const firstName = name.split(' ').slice(0, -1).join(' ') || name
    const lastName = name.split(' ').slice(-1).join(' ')
    const addressLine1 = addressStr.split(',')[0]?.trim() || addressStr
    const addressLine2 = addressStr.split(',').slice(1).join(', ').trim() || null

    const [updated] = await db
      .update(addresses)
      .set({
        type: updates.type === 'billing' ? 'billing' : 'shipping',
        firstName,
        lastName,
        addressLine1,
        addressLine2,
        city: updates.city,
        state: updates.state,
        postalCode: updates.pincode,
        phone: updates.phone,
        isDefault: updates.isDefault ?? undefined,
        updatedAt: new Date(),
      })
      .where(and(eq(addresses.id, id), eq(addresses.userId, session.user.id)))
      .returning()

    if (!updated) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    // Map to UI
    const ui = {
      id: updated.id,
      type: updated.type || 'home',
      name: `${updated.firstName} ${updated.lastName}`.trim(),
      phone: updated.phone || '',
      address: [updated.addressLine1, updated.addressLine2].filter(Boolean).join(', '),
      city: updated.city,
      state: updated.state,
      pincode: updated.postalCode,
      isDefault: updated.isDefault,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
    }
    return NextResponse.json({ success: true, address: ui })
  } catch (e) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE: delete address
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

    const [deleted] = await db
      .delete(addresses)
      .where(and(eq(addresses.id, id), eq(addresses.userId, session.user.id)))
      .returning()

    if (!deleted) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json({ success: true })
  } catch (e) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
