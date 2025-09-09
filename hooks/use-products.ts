import { useState, useEffect } from 'react'

interface Product {
  id: string
  name: string
  slug: string
  description: string
  shortDescription: string
  sku: string
  price: string
  comparePrice: string
  inventoryQuantity: number
  isFeatured: boolean
  brand: string
  ageRange: string
  category: {
    id: string
    name: string
    slug: string
  }
  images: {
    id: string
    url: string
    altText: string
    isPrimary: boolean
  }[]
  createdAt: string
}

interface ProductsResponse {
  success: boolean
  products: Product[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

interface UseProductsOptions {
  page?: number
  limit?: number
  category?: string
  search?: string
  featured?: boolean
  minPrice?: string
  maxPrice?: string
  sortBy?: string
  sortOrder?: string
}

export function useProducts(options: UseProductsOptions = {}) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    pages: 0,
  })

  const fetchProducts = async () => {
    try {
      setLoading(true)
      setError(null)

      const searchParams = new URLSearchParams()
      
      if (options.page) searchParams.set('page', options.page.toString())
      if (options.limit) searchParams.set('limit', options.limit.toString())
      if (options.category) searchParams.set('category', options.category)
      if (options.search) searchParams.set('search', options.search)
      if (options.featured !== undefined) searchParams.set('featured', options.featured.toString())
      if (options.minPrice) searchParams.set('minPrice', options.minPrice)
      if (options.maxPrice) searchParams.set('maxPrice', options.maxPrice)
      if (options.sortBy) searchParams.set('sortBy', options.sortBy)
      if (options.sortOrder) searchParams.set('sortOrder', options.sortOrder)

      const response = await fetch(`/api/products?${searchParams.toString()}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch products')
      }

      const data: ProductsResponse = await response.json()
      
      if (data.success) {
        setProducts(data.products)
        setPagination(data.pagination)
      } else {
        throw new Error('Failed to fetch products')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [
    options.page,
    options.limit,
    options.category,
    options.search,
    options.featured,
    options.minPrice,
    options.maxPrice,
    options.sortBy,
    options.sortOrder,
  ])

  return {
    products,
    loading,
    error,
    pagination,
    refetch: fetchProducts,
  }
}
