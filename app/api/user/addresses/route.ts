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
    // Map legacy schema -> UI shape
    const mapped = rows.map((r: any) => ({
      id: r.id,
      type: r.type || 'home',
      name: `${r.firstName} ${r.lastName}`.trim(),
      phone: r.phone || '',
      address: [r.addressLine1, r.addressLine2].filter(Boolean).join(', '),
      city: r.city,
      state: r.state,
      pincode: r.postalCode,
      isDefault: r.isDefault,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
    }))
    return NextResponse.json({ success: true, addresses: mapped })
  } catch (e) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST: create address
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const body = await request.json()
  const { type = 'home', name, phone, address, city, state, pincode, isDefault = false } = body
    if (!name || !phone || !address || !city || !state || !pincode) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    if (isDefault) {
      await db.update(addresses).set({ isDefault: false }).where(eq(addresses.userId, session.user.id))
    }

    const [inserted] = await db
      .insert(addresses)
      .values({
        userId: session.user.id,
        type: type === 'billing' ? 'billing' : 'shipping',
        firstName: (name || '').split(' ').slice(0, -1).join(' ') || name,
        lastName: (name || '').split(' ').slice(-1).join(' '),
        company: null,
        addressLine1: (address || '').split(',')[0]?.trim() || address,
        addressLine2: (address || '').split(',').slice(1).join(', ').trim() || null,
        city,
        state,
        postalCode: pincode,
        country: 'India',
        phone,
        isDefault,
      })
      .returning()

    // Map back to UI shape
    const ui = {
      id: inserted.id,
      type,
      name,
      phone,
      address,
      city,
      state,
      pincode,
      isDefault,
      createdAt: inserted.createdAt,
      updatedAt: inserted.updatedAt,
    }
    return NextResponse.json({ success: true, address: ui })
  } catch (e) {
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
