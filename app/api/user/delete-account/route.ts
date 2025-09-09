import { NextRequest, NextResponse } from 'next/server'
import { auth } from "@/lib/auth/config"
import { authOptions } from '@/lib/auth/config'
import { db } from '@/lib/db/postgres'
import { users, cartItems, orders } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function DELETE() {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id

    // Delete user's cart items
    await db.delete(cartItems).where(eq(cartItems.userId, userId))

    // Note: In a real application, you might want to anonymize orders instead of deleting them
    // for business/legal reasons. For now, we'll delete them.
    await db.delete(orders).where(eq(orders.userId, userId))

    // Delete the user account
    const deletedUser = await db
      .delete(users)
      .where(eq(users.id, userId))
      .returning({ id: users.id })

    if (!deletedUser.length) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: 'Account deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting account:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
