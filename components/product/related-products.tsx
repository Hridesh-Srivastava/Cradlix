"use client"

import { useState, useEffect } from "react"
import { ProductCard } from "./product-card"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

// Mock related products data
const mockRelatedProducts = [
  {
    id: "2",
    name: "Wooden Stacking Rings",
    slug: "wooden-stacking-rings",
    price: "18.99",
    comparePrice: null,
    inventoryQuantity: 8,
    isFeatured: false,
    ageRange: "6 months - 2 years",
    images: [{ url: "/wooden-stacking-rings-educational-toy.jpg", altText: "Wooden Stacking Rings" }],
    category: { name: "Educational Toys", slug: "educational-toys" },
    averageRating: 4.8,
    totalReviews: 15,
  },
  {
    id: "3",
    name: "Baby Bottle Set",
    slug: "baby-bottle-set",
    price: "32.99",
    comparePrice: "39.99",
    inventoryQuantity: 12,
    isFeatured: false,
    ageRange: "0-12 months",
    images: [{ url: "/baby-bottle-feeding-set-bpa-free.jpg", altText: "Baby Bottle Set" }],
    category: { name: "Feeding", slug: "feeding" },
    averageRating: 4.2,
    totalReviews: 31,
  },
  {
    id: "4",
    name: "Soft Plush Elephant",
    slug: "soft-plush-elephant",
    price: "22.99",
    comparePrice: "27.99",
    inventoryQuantity: 20,
    isFeatured: true,
    ageRange: "0-3 years",
    images: [{ url: "/placeholder.svg?height=300&width=300", altText: "Soft Plush Elephant" }],
    category: { name: "Soft Toys", slug: "soft-toys" },
    averageRating: 4.6,
    totalReviews: 18,
  },
  {
    id: "5",
    name: "Musical Activity Cube",
    slug: "musical-activity-cube",
    price: "45.99",
    comparePrice: null,
    inventoryQuantity: 6,
    isFeatured: false,
    ageRange: "12 months - 3 years",
    images: [{ url: "/placeholder.svg?height=300&width=300", altText: "Musical Activity Cube" }],
    category: { name: "Educational Toys", slug: "educational-toys" },
    averageRating: 4.7,
    totalReviews: 12,
  },
]

interface RelatedProductsProps {
  categoryId: string
  currentProductId: string
  limit?: number
}

export function RelatedProducts({ categoryId, currentProductId, limit = 4 }: RelatedProductsProps) {
  const [products, setProducts] = useState<typeof mockRelatedProducts>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      setLoading(true)
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 500))

        // Filter out current product and limit results
        const relatedProducts = mockRelatedProducts.filter((product) => product.id !== currentProductId).slice(0, limit)

        setProducts(relatedProducts)
      } catch (error) {
        console.error("Failed to fetch related products:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchRelatedProducts()
  }, [categoryId, currentProductId, limit])

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

  if (products.length === 0) {
    return null
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Related Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}
