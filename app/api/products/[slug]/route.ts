import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db/postgres"
import { products, categories, reviews, users } from "@/lib/db/schema"
import { eq, and, desc } from "drizzle-orm"

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const { slug } = params

    // Get product with category information
    const [product] = await db
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
        specifications: products.specifications,
        features: products.features,
        ageRange: products.ageRange,
        brand: products.brand,
        createdAt: products.createdAt,
      })
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .where(and(eq(products.slug, slug), eq(products.isActive, true)))
      .limit(1)

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    // Get product reviews
    const productReviews = await db
      .select({
        id: reviews.id,
        rating: reviews.rating,
        comment: reviews.comment,
        userName: users.name,
        userImage: users.image,
        createdAt: reviews.createdAt,
      })
      .from(reviews)
      .leftJoin(users, eq(reviews.userId, users.id))
      .where(eq(reviews.productId, product.id))
      .orderBy(desc(reviews.createdAt))
      .limit(10)

    return NextResponse.json({
      success: true,
      product: {
        ...product,
        reviews: productReviews,
      },
    })
  } catch (error) {
    console.error("Product fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
