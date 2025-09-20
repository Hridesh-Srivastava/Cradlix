import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db/postgres'
import { categories } from '@/lib/db/schema'
import { eq, and, desc, asc, isNull } from 'drizzle-orm'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const parentId = searchParams.get('parentId')
    const active = searchParams.get('active')
  const sortBy = searchParams.get('sortBy') || 'sortOrder'
  const sortOrder = searchParams.get('sortOrder') || 'asc'

    let whereConditions = []

    if (parentId === 'null' || parentId === '') {
      whereConditions.push(isNull(categories.parentId))
    } else if (parentId) {
      whereConditions.push(eq(categories.parentId, parentId))
    }

    if (active === 'true') {
      whereConditions.push(eq(categories.isActive, true))
    }

    const whereClause = whereConditions.length > 0 ? and(...whereConditions) : undefined

    // Map of allowed sort fields to prevent unsafe dynamic access
    const sortMap = {
      sortOrder: categories.sortOrder,
      createdAt: categories.createdAt,
      name: categories.name,
    } as const
    const sortCol = sortMap[(sortBy as keyof typeof sortMap) || 'sortOrder'] || categories.sortOrder

    const categoriesList = await db
      .select()
      .from(categories)
      .where(whereClause)
      .orderBy(sortOrder === 'desc' ? desc(sortCol) : asc(sortCol))

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
