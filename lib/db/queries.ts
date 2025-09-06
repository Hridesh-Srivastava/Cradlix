import { db } from "./postgres"
import { products, categories, productImages, cartItems, users, orders, productReviews } from "./schema"
import { eq, desc, asc, and, or, like, sql, count } from "drizzle-orm"

// Product queries
export async function getProducts(
  options: {
    categoryId?: string
    featured?: boolean
    limit?: number
    offset?: number
    search?: string
    sortBy?: "name" | "price" | "created_at"
    sortOrder?: "asc" | "desc"
  } = {},
) {
  const { categoryId, featured, limit = 20, offset = 0, search, sortBy = "created_at", sortOrder = "desc" } = options

  let query = db
    .select({
      id: products.id,
      name: products.name,
      slug: products.slug,
      description: products.description,
      shortDescription: products.shortDescription,
      sku: products.sku,
      price: products.price,
      comparePrice: products.comparePrice,
      brand: products.brand,
      ageRange: products.ageRange,
      isActive: products.isActive,
      isFeatured: products.isFeatured,
      createdAt: products.createdAt,
      category: {
        id: categories.id,
        name: categories.name,
        slug: categories.slug,
      },
    })
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .where(eq(products.isActive, true))

  // Add filters
  const conditions = [eq(products.isActive, true)]

  if (categoryId) {
    conditions.push(eq(products.categoryId, categoryId))
  }

  if (featured) {
    conditions.push(eq(products.isFeatured, true))
  }

  if (search) {
    conditions.push(
      or(
        like(products.name, `%${search}%`),
        like(products.description, `%${search}%`),
        like(products.brand, `%${search}%`),
      ),
    )
  }

  if (conditions.length > 1) {
    query = query.where(and(...conditions))
  }

  // Add sorting
  const sortColumn = sortBy === "name" ? products.name : sortBy === "price" ? products.price : products.createdAt

  query = query.orderBy(sortOrder === "asc" ? asc(sortColumn) : desc(sortColumn))

  // Add pagination
  query = query.limit(limit).offset(offset)

  return await query
}

export async function getProductBySlug(slug: string) {
  const result = await db
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
      weight: products.weight,
      dimensions: products.dimensions,
      brand: products.brand,
      ageRange: products.ageRange,
      safetyCertifications: products.safetyCertifications,
      materials: products.materials,
      isActive: products.isActive,
      isFeatured: products.isFeatured,
      metaTitle: products.metaTitle,
      metaDescription: products.metaDescription,
      createdAt: products.createdAt,
      category: {
        id: categories.id,
        name: categories.name,
        slug: categories.slug,
      },
    })
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .where(and(eq(products.slug, slug), eq(products.isActive, true)))
    .limit(1)

  if (result.length === 0) return null

  // Get product images
  const images = await db
    .select()
    .from(productImages)
    .where(eq(productImages.productId, result[0].id))
    .orderBy(asc(productImages.sortOrder))

  // Get product reviews
  const reviews = await db
    .select({
      id: productReviews.id,
      rating: productReviews.rating,
      title: productReviews.title,
      comment: productReviews.comment,
      isVerifiedPurchase: productReviews.isVerifiedPurchase,
      createdAt: productReviews.createdAt,
      user: {
        name: users.name,
        image: users.image,
      },
    })
    .from(productReviews)
    .leftJoin(users, eq(productReviews.userId, users.id))
    .where(and(eq(productReviews.productId, result[0].id), eq(productReviews.isApproved, true)))
    .orderBy(desc(productReviews.createdAt))

  return {
    ...result[0],
    images,
    reviews,
  }
}

// Category queries
export async function getCategories(parentId?: string | null) {
  return await db
    .select()
    .from(categories)
    .where(
      and(
        eq(categories.isActive, true),
        parentId ? eq(categories.parentId, parentId) : sql`${categories.parentId} IS NULL`,
      ),
    )
    .orderBy(asc(categories.sortOrder), asc(categories.name))
}

export async function getCategoryBySlug(slug: string) {
  const result = await db
    .select()
    .from(categories)
    .where(and(eq(categories.slug, slug), eq(categories.isActive, true)))
    .limit(1)

  return result[0] || null
}

// Cart queries
export async function getCartItems(userId?: string, sessionId?: string) {
  if (!userId && !sessionId) return []

  const condition = userId ? eq(cartItems.userId, userId) : eq(cartItems.sessionId, sessionId!)

  return await db
    .select({
      id: cartItems.id,
      quantity: cartItems.quantity,
      createdAt: cartItems.createdAt,
      product: {
        id: products.id,
        name: products.name,
        slug: products.slug,
        price: products.price,
        inventoryQuantity: products.inventoryQuantity,
        images: sql<string[]>`ARRAY(
          SELECT url FROM product_images 
          WHERE product_id = ${products.id} 
          ORDER BY sort_order ASC 
          LIMIT 1
        )`,
      },
    })
    .from(cartItems)
    .leftJoin(products, eq(cartItems.productId, products.id))
    .where(condition)
    .orderBy(desc(cartItems.createdAt))
}

export async function addToCart(data: {
  userId?: string
  sessionId?: string
  productId: string
  quantity: number
}) {
  const { userId, sessionId, productId, quantity } = data

  // Check if item already exists in cart
  const condition = userId
    ? and(eq(cartItems.userId, userId), eq(cartItems.productId, productId))
    : and(eq(cartItems.sessionId, sessionId!), eq(cartItems.productId, productId))

  const existingItem = await db.select().from(cartItems).where(condition).limit(1)

  if (existingItem.length > 0) {
    // Update quantity
    return await db
      .update(cartItems)
      .set({
        quantity: existingItem[0].quantity + quantity,
        updatedAt: new Date(),
      })
      .where(eq(cartItems.id, existingItem[0].id))
      .returning()
  } else {
    // Insert new item
    return await db
      .insert(cartItems)
      .values({
        userId,
        sessionId,
        productId,
        quantity,
      })
      .returning()
  }
}

export async function updateCartItemQuantity(itemId: string, quantity: number) {
  if (quantity <= 0) {
    return await db.delete(cartItems).where(eq(cartItems.id, itemId))
  }

  return await db.update(cartItems).set({ quantity, updatedAt: new Date() }).where(eq(cartItems.id, itemId)).returning()
}

export async function removeFromCart(itemId: string) {
  return await db.delete(cartItems).where(eq(cartItems.id, itemId))
}

export async function clearCart(userId?: string, sessionId?: string) {
  const condition = userId ? eq(cartItems.userId, userId) : eq(cartItems.sessionId, sessionId!)

  return await db.delete(cartItems).where(condition)
}

// Order queries
export async function createOrder(orderData: any) {
  return await db.insert(orders).values(orderData).returning()
}

export async function getOrdersByUser(userId: string) {
  return await db.select().from(orders).where(eq(orders.userId, userId)).orderBy(desc(orders.createdAt))
}

export async function getOrderByNumber(orderNumber: string) {
  return await db.select().from(orders).where(eq(orders.orderNumber, orderNumber)).limit(1)
}

// Analytics queries
export async function getProductStats(productId: string) {
  const reviewStats = await db
    .select({
      averageRating: sql<number>`AVG(${productReviews.rating})`,
      totalReviews: count(productReviews.id),
    })
    .from(productReviews)
    .where(and(eq(productReviews.productId, productId), eq(productReviews.isApproved, true)))

  return reviewStats[0] || { averageRating: 0, totalReviews: 0 }
}
