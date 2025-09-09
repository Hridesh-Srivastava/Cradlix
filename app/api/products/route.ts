import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db/postgres"
import { products, categories, productImages } from "@/lib/db/schema"
import { eq, ilike, and, gte, lte, sql, desc, asc, or } from "drizzle-orm"

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
    const featured = searchParams.get("featured")
    const offset = (page - 1) * limit

    // Build where conditions
    const conditions = []

    if (search) {
      conditions.push(
        or(
          ilike(products.name, `%${search}%`),
          ilike(products.description, `%${search}%`),
          ilike(products.sku, `%${search}%`)
        )
      )
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

    if (featured === 'true') {
      conditions.push(eq(products.isFeatured, true))
    }

    // Add active products filter
    conditions.push(eq(products.isActive, true))

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined

    // Get products with category and images information
    const productsList = await db
      .select({
        id: products.id,
        name: products.name,
        slug: products.slug,
        description: products.description,
        shortDescription: products.shortDescription,
        sku: products.sku,
        price: products.price,
        comparePrice: products.comparePrice,
        inventoryQuantity: products.inventoryQuantity,
        isFeatured: products.isFeatured,
        brand: products.brand,
        ageRange: products.ageRange,
        category: {
          id: categories.id,
          name: categories.name,
          slug: categories.slug,
        },
        images: {
          id: productImages.id,
          url: productImages.url,
          altText: productImages.altText,
          isPrimary: productImages.isPrimary,
        },
        createdAt: products.createdAt,
      })
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .leftJoin(productImages, eq(products.id, productImages.productId))
      .where(whereClause)
      .orderBy(
        sortOrder === "desc"
          ? desc(products[sortBy as keyof typeof products])
          : asc(products[sortBy as keyof typeof products])
      )
      .limit(limit)
      .offset(offset)

    // Group products and their images
    const productsMap = new Map()
    productsList.forEach((product) => {
      if (!productsMap.has(product.id)) {
        productsMap.set(product.id, {
          ...product,
          images: [],
        })
      }
      if (product.images.id) {
        productsMap.get(product.id).images.push(product.images)
      }
    })

    const formattedProducts = Array.from(productsMap.values())

    // Get total count for pagination
    const [{ count }] = await db.select({ count: sql<number>`count(*)` }).from(products).where(whereClause)

    return NextResponse.json({
      success: true,
      products: formattedProducts,
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
