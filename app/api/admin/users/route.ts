import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth/config'
import { db } from '@/lib/db/postgres'
import { users } from '@/lib/db/schema'
import { or, ilike, desc } from 'drizzle-orm'

export async function GET(request: NextRequest) {
  const session = await auth()
  if (!session?.user || session.user.role !== 'super-admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const search = searchParams.get('search') || ''

  const where = search
    ? or(ilike(users.email, `%${search}%`), ilike(users.name, `%${search}%`))
    : undefined

  const rows = await db
    .select({ id: users.id, email: users.email, name: users.name, role: users.role, createdAt: users.createdAt })
    .from(users)
    .where(where)
    .orderBy(desc(users.createdAt))

  return NextResponse.json({ users: rows })
}
