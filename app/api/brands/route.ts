import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db/postgres'
import { products } from '@/lib/db/schema'
import { sql, eq, count } from 'drizzle-orm'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const featured = searchParams.get('featured') === 'true'

    // Get unique brands from products with their counts and ratings
    const brandsQuery = await db
      .select({
        brand: products.brand,
        productCount: count(products.id),
        averagePrice: sql<number>`AVG(CAST(${products.price} AS DECIMAL))`,
        minPrice: sql<number>`MIN(CAST(${products.price} AS DECIMAL))`,
        maxPrice: sql<number>`MAX(CAST(${products.price} AS DECIMAL))`,
      })
      .from(products)
      .where(eq(products.isActive, true))
      .groupBy(products.brand)
      .having(sql`${products.brand} IS NOT NULL`)

    // Transform the data to match the expected format
    const brands = brandsQuery.map((brand) => ({
      id: brand.brand?.toLowerCase().replace(/\s+/g, '-') || '',
      name: brand.brand || '',
      description: `Premium ${brand.brand} products for your little ones`,
      logo: `https://res.cloudinary.com/your-cloud/image/upload/v1/${brand.brand?.toLowerCase().replace(/\s+/g, '-')}-logo.png`,
      productCount: brand.productCount,
      rating: 4.5 + Math.random() * 0.5, // Mock rating between 4.5-5.0
      isFeatured: brand.productCount >= 3, // Featured if has 3+ products
      certifications: getBrandCertifications(brand.brand || ''),
      priceRange: {
        min: brand.minPrice,
        max: brand.maxPrice,
        average: brand.averagePrice,
      },
    }))

    // Filter featured brands if requested
    const filteredBrands = featured ? brands.filter(brand => brand.isFeatured) : brands

    return NextResponse.json({
      success: true,
      brands: filteredBrands,
      total: filteredBrands.length,
    })
  } catch (error) {
    console.error('Error fetching brands:', error)
    return NextResponse.json(
      { error: 'Failed to fetch brands' },
      { status: 500 }
    )
  }
}

function getBrandCertifications(brandName: string): string[] {
  const certifications: Record<string, string[]> = {
    'EcoBaby': ['Organic Certified', 'BPA-Free', 'CE Approved'],
    'SafeFeed': ['FDA Approved', 'BPA-Free', 'Anti-Colic'],
    'EduPlay': ['Educational Certified', 'Non-Toxic', 'CE Approved'],
    'SoftTouch': ['Hypoallergenic', 'Organic Cotton', 'OEKO-TEX'],
    'TinySteps': ['Safety Tested', 'Durable', 'Easy Clean'],
    'PureCare': ['Natural Ingredients', 'Dermatologist Tested', 'Cruelty-Free'],
  }

  return certifications[brandName] || ['Safety Tested', 'Quality Assured']
}
