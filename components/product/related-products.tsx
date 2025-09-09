"use client"

import { ProductCard } from "./product-card"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { useProducts } from "@/hooks/use-products"

interface RelatedProductsProps {
  categoryId: string
  currentProductId: string
  limit?: number
}

export function RelatedProducts({ categoryId, currentProductId, limit = 4 }: RelatedProductsProps) {
  const { products, loading } = useProducts({ 
    category: categoryId,
    limit: limit + 1 // Get one extra to account for filtering out current product
  })

  // Filter out current product and limit results
  const relatedProducts = products.filter((product) => product.id !== currentProductId).slice(0, limit)

  if (loading) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Related Products</h2>
        <div className="flex justify-center py-8">
          <LoadingSpinner />
        </div>
      </div>
    )
  }

  if (relatedProducts.length === 0) {
    return null
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Related Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {relatedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}
