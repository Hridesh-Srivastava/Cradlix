"use client"

import { useEffect, useState } from 'react'

export default function TestProductsPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products')
        const data = await response.json()
        console.log('API Response:', data)
        setProducts(data.products || [])
      } catch (err) {
        console.error('Error:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-4">Test Products Page</h1>
      <p>Products count: {products.length}</p>
      <pre className="bg-gray-100 p-4 rounded mt-4">
        {JSON.stringify(products, null, 2)}
      </pre>
    </div>
  )
}
