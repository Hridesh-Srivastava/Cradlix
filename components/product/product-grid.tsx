"use client"

import { ProductCard } from "./product-card"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import type { Product } from "@/lib/types"

interface ProductGridProps {
  products: (Product & {
    images?: { url: string; altText?: string }[]
    category?: { name: string; slug: string }
    averageRating?: number
    totalReviews?: number
  })[]
  loading?: boolean
  className?: string
}

export function ProductGrid({ products, loading, className }: ProductGridProps) {
  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
        <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
      </div>
    )
  }

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${className}`}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
