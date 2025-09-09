import { useState, useEffect } from 'react'

interface Brand {
  id: string
  name: string
  description: string
  logo: string
  productCount: number
  rating: number
  isFeatured: boolean
  certifications: string[]
  priceRange: {
    min: number
    max: number
    average: number
  }
}

interface UseBrandsOptions {
  featured?: boolean
}

interface UseBrandsReturn {
  brands: Brand[]
  loading: boolean
  error: string | null
  refetch: () => void
}

export function useBrands(options: UseBrandsOptions = {}): UseBrandsReturn {
  const [brands, setBrands] = useState<Brand[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchBrands = async () => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams()
      if (options.featured) {
        params.append('featured', 'true')
      }

      const response = await fetch(`/api/brands?${params.toString()}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch brands')
      }

      const data = await response.json()
      
      if (data.success) {
        setBrands(data.brands)
      } else {
        throw new Error(data.error || 'Failed to fetch brands')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      console.error('Error fetching brands:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBrands()
  }, [options.featured])

  return {
    brands,
    loading,
    error,
    refetch: fetchBrands,
  }
}
