import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db/postgres'
import { categories } from '@/lib/db/schema'
import { eq, and, desc, asc } from 'drizzle-orm'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const parentId = searchParams.get('parentId')
    const active = searchParams.get('active')
    const sortBy = searchParams.get('sortBy') || 'sortOrder'
    const sortOrder = searchParams.get('sortOrder') || 'asc'

    let whereConditions = []

    if (parentId === 'null' || parentId === '') {
      whereConditions.push(eq(categories.parentId, null))
    } else if (parentId) {
      whereConditions.push(eq(categories.parentId, parentId))
    }

    if (active === 'true') {
      whereConditions.push(eq(categories.isActive, true))
    }

    const whereClause = whereConditions.length > 0 ? and(...whereConditions) : undefined

    const categoriesList = await db
      .select()
      .from(categories)
      .where(whereClause)
      .orderBy(
        sortOrder === 'desc'
          ? desc(categories[sortBy as keyof typeof categories])
          : asc(categories[sortBy as keyof typeof categories])
      )

    return NextResponse.json({
      success: true,
      categories: categoriesList,
    })
  } catch (error) {
    console.error('Categories fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
