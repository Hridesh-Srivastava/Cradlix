import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth/config'
import { db } from '@/lib/db/postgres'
import { users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth()
  if (!session?.user || session.user.role !== 'super-admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const id = params.id
  const body = await request.json().catch(() => ({}))
  const role: string | undefined = body.role
  if (!role || !['customer','moderator','admin','super-admin'].includes(role)) {
    return NextResponse.json({ error: 'Invalid role' }, { status: 400 })
  }
  const updated = await db.update(users).set({ role }).where(eq(users.id, id)).returning({ id: users.id, email: users.email, role: users.role })
  if (updated.length === 0) return NextResponse.json({ error: 'User not found' }, { status: 404 })
  return NextResponse.json({ user: updated[0] })
}
