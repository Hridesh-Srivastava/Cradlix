"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { Loader2, Package } from 'lucide-react'
import Link from 'next/link'
import { useCategories } from '@/hooks/use-categories'

export default function CategoriesPage() {
  const { categories, loading, error } = useCategories({ active: true })
  const { toast } = useToast()

  useEffect(() => {
    if (error) {
      toast({
        title: 'Error loading categories',
        description: 'Please try again later.',
        variant: 'destructive',
      })
    }
  }, [error, toast])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (error || !categories.length) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container max-w-4xl mx-auto px-4">
          <div className="text-center py-16">
            <Package className="h-24 w-24 mx-auto text-gray-400 mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">No categories found</h1>
            <p className="text-gray-600 mb-8">We're working on adding more categories for you.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Shop by Category</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover our carefully curated collection of baby products organized by category
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Card key={category.id} className="group hover:shadow-lg transition-all duration-300">
              <CardHeader className="p-0">
                <Link href={`/categories/${category.slug}`}>
                  <div className="aspect-video bg-gradient-to-br from-blue-100 to-purple-100 rounded-t-lg overflow-hidden cursor-pointer">
                    {category.imageUrl ? (
                      <img
                        src={category.imageUrl}
                        alt={category.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="h-16 w-16 text-gray-400" />
                      </div>
                    )}
                  </div>
                </Link>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <Link href={`/categories/${category.slug}`}>
                    <CardTitle className="text-xl group-hover:text-primary transition-colors cursor-pointer">
                      {category.name}
                    </CardTitle>
                  </Link>
                  <Badge variant="secondary">Active</Badge>
                </div>
                <p className="text-gray-600 line-clamp-2">
                  {category.description || 'Explore our collection of baby products in this category.'}
                </p>
                <Link href={`/categories/${category.slug}`}>
                  <div className="mt-4 flex items-center text-sm text-primary font-medium cursor-pointer">
                    Shop Now
                    <svg
                      className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Featured Categories Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center mb-8">Featured Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="bg-gradient-to-r from-pink-50 to-purple-50 border-pink-200">
              <CardContent className="p-8">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-pink-100 rounded-full">
                    <Package className="h-8 w-8 text-pink-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Baby Toys</h3>
                    <p className="text-gray-600">Safe and educational toys for your little ones</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
              <CardContent className="p-8">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-100 rounded-full">
                    <Package className="h-8 w-8 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Feeding Essentials</h3>
                    <p className="text-gray-600">Everything you need for feeding your baby</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
