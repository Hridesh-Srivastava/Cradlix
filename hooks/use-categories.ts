import { useState, useEffect } from 'react'

interface Category {
  id: string
  name: string
  slug: string
  description: string
  imageUrl: string
  parentId: string | null
  isActive: boolean
  sortOrder: number
  createdAt: string
  updatedAt: string
}

interface CategoriesResponse {
  success: boolean
  categories: Category[]
}

interface UseCategoriesOptions {
  parentId?: string | null
  active?: boolean
  sortBy?: string
  sortOrder?: string
}

export function useCategories(options: UseCategoriesOptions = {}) {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCategories = async () => {
    try {
      setLoading(true)
      setError(null)

      const searchParams = new URLSearchParams()
      
      if (options.parentId !== undefined) {
        searchParams.set('parentId', options.parentId === null ? 'null' : options.parentId)
      }
      if (options.active !== undefined) searchParams.set('active', options.active.toString())
      if (options.sortBy) searchParams.set('sortBy', options.sortBy)
      if (options.sortOrder) searchParams.set('sortOrder', options.sortOrder)

      const response = await fetch(`/api/categories?${searchParams.toString()}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch categories')
      }

      const data: CategoriesResponse = await response.json()
      
      if (data.success) {
        setCategories(data.categories)
      } else {
        throw new Error('Failed to fetch categories')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      setCategories([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [
    options.parentId,
    options.active,
    options.sortBy,
    options.sortOrder,
  ])

  return {
    categories,
    loading,
    error,
    refetch: fetchCategories,
  }
}
