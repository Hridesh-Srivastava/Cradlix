"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { ProductGrid } from "@/components/product/product-grid"
import { ProductFilters } from "@/components/product/product-filters"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Mock data - replace with actual API calls
const mockProducts = [
  {
    id: "1",
    name: "Organic Cotton Teddy Bear",
    slug: "organic-cotton-teddy-bear",
    price: "24.99",
    comparePrice: "29.99",
    inventoryQuantity: 15,
    isFeatured: true,
    ageRange: "0-3 years",
    images: [{ url: "/organic-cotton-teddy-bear-soft-toy.jpg", altText: "Organic Cotton Teddy Bear" }],
    category: { name: "Soft Toys", slug: "soft-toys" },
    averageRating: 4.5,
    totalReviews: 23,
  },
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
    inventoryQuantity: 0,
    isFeatured: false,
    ageRange: "0-12 months",
    images: [{ url: "/baby-bottle-feeding-set-bpa-free.jpg", altText: "Baby Bottle Set" }],
    category: { name: "Feeding", slug: "feeding" },
    averageRating: 4.2,
    totalReviews: 31,
  },
]

const mockFilters = {
  categories: [
    { id: "1", name: "Baby Toys", count: 45 },
    { id: "2", name: "Feeding", count: 23 },
    { id: "3", name: "Clothing", count: 67 },
    { id: "4", name: "Bath & Care", count: 19 },
  ],
  brands: [
    { name: "BabyLove", count: 12 },
    { name: "EcoPlay", count: 8 },
    { name: "SafeFeed", count: 15 },
    { name: "TinyTots", count: 22 },
  ],
  ageRanges: [
    { range: "0-6 months", count: 34 },
    { range: "6-12 months", count: 28 },
    { range: "1-2 years", count: 41 },
    { range: "2-3 years", count: 25 },
  ],
  priceRange: { min: 0, max: 1000 },
}

export default function ProductsPage() {
  const [products, setProducts] = useState(mockProducts)
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilters, setActiveFilters] = useState({})
  const searchParams = useSearchParams()
  const { toast } = useToast()

  // Initialize filters from URL params
  useEffect(() => {
    const category = searchParams.get("category")
    const search = searchParams.get("search")

    if (category) {
      setActiveFilters((prev) => ({ ...prev, categories: [category] }))
    }

    if (search) {
      setSearchQuery(search)
    }
  }, [searchParams])

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Filter products based on search query
      const filteredProducts = mockProducts.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.category.name.toLowerCase().includes(searchQuery.toLowerCase()),
      )

      setProducts(filteredProducts)

      if (filteredProducts.length === 0) {
        toast({
          title: "No results found",
          description: `No products found for "${searchQuery}". Try different keywords.`,
        })
      }
    } catch (error) {
      toast({
        title: "Search failed",
        description: "Failed to search products. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (newFilters: any) => {
    setActiveFilters(newFilters)
    setLoading(true)

    // Simulate filtering
    setTimeout(() => {
      let filteredProducts = [...mockProducts]

      // Apply category filter
      if (newFilters.categories?.length > 0) {
        filteredProducts = filteredProducts.filter((product) =>
          newFilters.categories.some(
            (catId: string) => mockFilters.categories.find((cat) => cat.id === catId)?.name === product.category.name,
          ),
        )
      }

      // Apply price filter
      if (newFilters.minPrice !== undefined || newFilters.maxPrice !== undefined) {
        filteredProducts = filteredProducts.filter((product) => {
          const price = Number.parseFloat(product.price)
          return price >= (newFilters.minPrice || 0) && price <= (newFilters.maxPrice || 1000)
        })
      }

      // Apply sorting
      if (newFilters.sortBy) {
        filteredProducts.sort((a, b) => {
          switch (newFilters.sortBy) {
            case "price_asc":
              return Number.parseFloat(a.price) - Number.parseFloat(b.price)
            case "price_desc":
              return Number.parseFloat(b.price) - Number.parseFloat(a.price)
            case "name":
              return a.name.localeCompare(b.name)
            case "rating":
              return (b.averageRating || 0) - (a.averageRating || 0)
            default:
              return 0
          }
        })
      }

      setProducts(filteredProducts)
      setLoading(false)
    }, 300)
  }

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">All Products</h1>
        <p className="text-muted-foreground mb-6">
          Discover our complete collection of safe, high-quality baby products and toys
        </p>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex gap-2 max-w-md">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button type="submit" disabled={loading}>
            Search
          </Button>
        </form>
      </div>

      <div className="flex gap-8">
        {/* Filters Sidebar */}
        <ProductFilters
          filters={mockFilters}
          activeFilters={activeFilters}
          onFilterChange={handleFilterChange}
          className="w-64 shrink-0"
        />

        {/* Products Grid */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-muted-foreground">Showing {products.length} products</p>

            {/* Mobile Filter Button */}
            <ProductFilters filters={mockFilters} activeFilters={activeFilters} onFilterChange={handleFilterChange} />
          </div>

          <ProductGrid products={products} loading={loading} />
        </div>
      </div>
    </div>
  )
}
