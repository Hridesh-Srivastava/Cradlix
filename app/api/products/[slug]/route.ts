import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db/postgres'
import { products, categories, productImages, productReviews, users, brands } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params

    // Get product with category and images
    const productData = await db
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
  // Additional fields like costPrice, inventory tracking, weight can be added later
        brand: products.brand,
        brandInfo: {
          id: brands.id,
          name: brands.name,
          slug: brands.slug,
          logo: brands.logo,
          website: brands.website,
          description: brands.description,
        },
        ageRange: products.ageRange,
        safetyCertifications: products.safetyCertifications,
        materials: products.materials,
        isActive: products.isActive,
        isFeatured: products.isFeatured,
        metaTitle: products.metaTitle,
        metaDescription: products.metaDescription,
        category: {
          id: categories.id,
          name: categories.name,
          slug: categories.slug,
        },
        images: {
          id: productImages.id,
          url: productImages.url,
          altText: productImages.altText,
          sortOrder: productImages.sortOrder,
          isPrimary: productImages.isPrimary,
        },
        createdAt: products.createdAt,
        updatedAt: products.updatedAt,
      })
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .leftJoin(brands, eq(products.brandId, brands.id))
      .leftJoin(productImages, eq(products.id, productImages.productId))
      .where(and(eq(products.slug, slug), eq(products.isActive, true)))
      .orderBy(productImages.sortOrder)

    if (!productData.length) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    // Group product data and images
    const product = {
      ...productData[0],
      images: productData
        .filter((item) => item.images && item.images.id)
        .map((item) => item.images!)
        .sort((a, b) => ((a?.sortOrder || 0) - (b?.sortOrder || 0))),
    }

    // Get product reviews
    const reviews = await db
      .select({
        id: productReviews.id,
        rating: productReviews.rating,
        title: productReviews.title,
        comment: productReviews.comment,
        isVerifiedPurchase: productReviews.isVerifiedPurchase,
        isApproved: productReviews.isApproved,
        helpfulCount: productReviews.helpfulCount,
        createdAt: productReviews.createdAt,
        user: {
          id: users.id,
          name: users.name,
          image: users.image,
        },
      })
      .from(productReviews)
      .leftJoin(users, eq(productReviews.userId, users.id))
      .where(and(
        eq(productReviews.productId, product.id),
        eq(productReviews.isApproved, true)
      ))
      .orderBy(productReviews.createdAt)

    // Calculate average rating
    const averageRating = reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0

    return NextResponse.json({
      success: true,
      product: {
        ...product,
        brand: product.brandInfo?.name || product.brand,
        seller: product.brandInfo ? {
          id: product.brandInfo.id,
          name: product.brandInfo.name,
          slug: product.brandInfo.slug,
          logo: product.brandInfo.logo,
          website: product.brandInfo.website,
          description: product.brandInfo.description,
        } : undefined,
        reviews,
        averageRating: Math.round(averageRating * 10) / 10,
        reviewCount: reviews.length,
      },
    })
  } catch (error) {
    console.error('Product fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}