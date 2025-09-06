import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db/postgres"
import { products, categories } from "@/lib/db/schema"
import { eq, ilike, and, gte, lte, sql } from "drizzle-orm"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search")
    const category = searchParams.get("category")
    const minPrice = searchParams.get("minPrice")
    const maxPrice = searchParams.get("maxPrice")
    const sortBy = searchParams.get("sortBy") || "createdAt"
    const sortOrder = searchParams.get("sortOrder") || "desc"
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "12")
    const offset = (page - 1) * limit

    // Build where conditions
    const conditions = []

    if (search) {
      conditions.push(ilike(products.name, `%${search}%`))
    }

    if (category) {
      conditions.push(eq(products.categoryId, category))
    }

    if (minPrice) {
      conditions.push(gte(products.price, Number.parseFloat(minPrice)))
    }

    if (maxPrice) {
      conditions.push(lte(products.price, Number.parseFloat(maxPrice)))
    }

    // Add active products filter
    conditions.push(eq(products.isActive, true))

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined

    // Get products with category information
    const productsList = await db
      .select({
        id: products.id,
        name: products.name,
        description: products.description,
        price: products.price,
        originalPrice: products.originalPrice,
        images: products.images,
        category: categories.name,
        categoryId: products.categoryId,
        stock: products.stock,
        rating: products.rating,
        reviewCount: products.reviewCount,
        createdAt: products.createdAt,
      })
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .where(whereClause)
      .orderBy(
        sortOrder === "desc"
          ? sql`${products[sortBy as keyof typeof products]} desc`
          : sql`${products[sortBy as keyof typeof products]} asc`,
      )
      .limit(limit)
      .offset(offset)

    // Get total count for pagination
    const [{ count }] = await db.select({ count: sql<number>`count(*)` }).from(products).where(whereClause)

    return NextResponse.json({
      success: true,
      products: productsList,
      pagination: {
        page,
        limit,
        total: Number(count),
        pages: Math.ceil(Number(count) / limit),
      },
    })
  } catch (error) {
    console.error("Products fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
