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
import { useProducts } from "@/hooks/use-products"
import { useCategories } from "@/hooks/use-categories"

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilters, setActiveFilters] = useState({
    category: "",
    minPrice: "",
    maxPrice: "",
    sortBy: "createdAt",
    sortOrder: "desc",
  })
  const [currentPage, setCurrentPage] = useState(1)
  const searchParams = useSearchParams()
  const { toast } = useToast()

  // Fetch products with dynamic data
  const { products, loading, error, pagination } = useProducts({
    page: currentPage,
    limit: 12,
    category: activeFilters.category,
    search: searchQuery,
    minPrice: activeFilters.minPrice,
    maxPrice: activeFilters.maxPrice,
    sortBy: activeFilters.sortBy,
    sortOrder: activeFilters.sortOrder,
  })

  // Fetch categories for filters
  const { categories } = useCategories({ active: true })

  // Initialize filters from URL params
  useEffect(() => {
    const category = searchParams.get("category")
    const search = searchParams.get("search")

    if (category) {
      setActiveFilters((prev) => ({ ...prev, category }))
    }

    if (search) {
      setSearchQuery(search)
    }
  }, [searchParams])

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1) // Reset to first page when searching
  }

  const handleFilterChange = (newFilters: any) => {
    setActiveFilters(prev => ({ ...prev, ...newFilters }))
    setCurrentPage(1) // Reset to first page when filtering
  }

  // Show error if products failed to load
  if (error) {
    return (
      <div className="container py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Error Loading Products</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    )
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
          filters={{
            categories: categories.map(cat => ({ id: cat.id, name: cat.name, count: 0 })),
            brands: [],
            ageRanges: [],
            priceRange: { min: 0, max: 1000 },
          }}
          activeFilters={activeFilters}
          onFilterChange={handleFilterChange}
          className="w-64 shrink-0"
        />

        {/* Products Grid */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-muted-foreground">
              Showing {pagination.total} products
              {pagination.total > 0 && (
                <span className="ml-2">
                  (Page {pagination.page} of {pagination.pages})
                </span>
              )}
            </p>

            {/* Mobile Filter Button */}
            <ProductFilters 
              filters={{
                categories: categories.map(cat => ({ id: cat.id, name: cat.name, count: 0 })),
                brands: [],
                ageRanges: [],
                priceRange: { min: 0, max: 1000 },
              }} 
              activeFilters={activeFilters} 
              onFilterChange={handleFilterChange} 
            />
          </div>

          <ProductGrid products={products} loading={loading} />

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex justify-center mt-8 gap-2">
              <Button
                variant="outline"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1 || loading}
              >
                Previous
              </Button>
              
              {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                const pageNum = i + 1
                return (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? "default" : "outline"}
                    onClick={() => setCurrentPage(pageNum)}
                    disabled={loading}
                  >
                    {pageNum}
                  </Button>
                )
              })}
              
              <Button
                variant="outline"
                onClick={() => setCurrentPage(prev => Math.min(pagination.pages, prev + 1))}
                disabled={currentPage === pagination.pages || loading}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
