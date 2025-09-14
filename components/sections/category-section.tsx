"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

interface Category {
  id: string
  name: string
  slug: string
  description?: string | null
  imageUrl?: string | null
}

export function CategorySection() {
  const [items, setItems] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        const res = await fetch("/api/categories?parentId=null&active=true&sortBy=sortOrder&sortOrder=asc")
        if (!res.ok) throw new Error("Failed to fetch categories")
        const data = await res.json()
        setItems(data.categories || [])
      } catch (e) {
        setError(e instanceof Error ? e.message : "Error")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const gradientByIndex = useMemo(
    () => [
      "from-blue-100 to-blue-200",
      "from-pink-100 to-pink-200",
      "from-green-100 to-green-200",
      "from-yellow-100 to-yellow-200",
      "from-purple-100 to-purple-200",
      "from-red-100 to-red-200",
    ],
    [],
  )

  return (
    <section className="py-16 md:py-24">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">Shop by Category</h2>
          <p className="text-lg text-muted-foreground text-pretty max-w-2xl mx-auto">
            Find everything you need for your baby in our carefully curated categories
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : error ? (
          <div className="text-center text-muted-foreground">Failed to load categories.</div>
        ) : items.length === 0 ? (
          <div className="text-center text-muted-foreground">No categories available.</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
            {items.map((category, idx) => (
              <Link key={category.id} href={`/categories/${category.slug}`}>
                <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <CardContent className="p-4">
                    <div className={`aspect-square rounded-lg bg-gradient-to-br ${gradientByIndex[idx % gradientByIndex.length]} p-4 mb-3`}>
                      <img
                        src={category.imageUrl || "/placeholder.svg"}
                        alt={category.name}
                        className="w-full h-full object-cover rounded-md"
                      />
                    </div>
                    <h3 className="font-semibold text-sm md:text-base mb-1 group-hover:text-primary transition-colors">
                      {category.name}
                    </h3>
                    {category.description && (
                      <p className="text-xs md:text-sm text-muted-foreground">{category.description}</p>
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
