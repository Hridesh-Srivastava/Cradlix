"use client"

import { useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { Loader2, Star, Award, Shield } from 'lucide-react'
import Link from 'next/link'
import { useBrands } from '@/hooks/use-brands'

export default function BrandsPage() {
  const { brands, loading, error } = useBrands()
  const { toast } = useToast()

  useEffect(() => {
    if (error) {
      toast({
        title: 'Error loading brands',
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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Trusted Brands</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We partner with the best brands to bring you safe, high-quality baby products
          </p>
        </div>

        {/* Featured Brands */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
            <Award className="h-6 w-6 text-yellow-500" />
            Featured Brands
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {brands.filter(brand => brand.isFeatured).map((brand) => (
              <Card key={brand.id} className="group hover:shadow-lg transition-all duration-300">
                <CardHeader className="text-center">
                  <div className="w-20 h-20 mx-auto mb-4 bg-white rounded-full p-4 shadow-md">
                    <img
                      src={brand.logo}
                      alt={brand.name}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        e.currentTarget.src = '/placeholder.svg'
                      }}
                    />
                  </div>
                  <CardTitle className="text-xl">{brand.name}</CardTitle>
                  <div className="flex items-center justify-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{brand.rating}</span>
                    <span className="text-sm text-gray-500">({brand.productCount} products)</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-center mb-4">{brand.description}</p>
                  <div className="flex flex-wrap gap-1 justify-center mb-4">
                    {brand.certifications.map((cert, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {cert}
                      </Badge>
                    ))}
                  </div>
                  <Button asChild className="w-full">
                    <Link href={`/products?brand=${brand.name.toLowerCase()}`}>
                      View Products
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* All Brands */}
        <div>
          <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
            <Shield className="h-6 w-6 text-blue-500" />
            All Brands
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {brands.map((brand) => (
              <Card key={brand.id} className="group hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-white rounded-lg p-3 shadow-sm">
                      <img
                        src={brand.logo}
                        alt={brand.name}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          e.currentTarget.src = '/placeholder.svg'
                        }}
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{brand.name}</h3>
                      <div className="flex items-center gap-2 mb-2">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{brand.rating}</span>
                        <span className="text-sm text-gray-500">• {brand.productCount} products</span>
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2">{brand.description}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex flex-wrap gap-1">
                      {brand.certifications.slice(0, 2).map((cert, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {cert}
                        </Badge>
                      ))}
                    </div>
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/products?brand=${brand.name.toLowerCase()}`}>
                        View
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Brand Promise Section */}
        <div className="mt-16 bg-white rounded-lg p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-center mb-8">Our Brand Promise</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Safety First</h3>
              <p className="text-gray-600">All products meet the highest safety standards and certifications</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Quality Assured</h3>
              <p className="text-gray-600">We only partner with trusted brands known for their quality</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Customer Satisfaction</h3>
              <p className="text-gray-600">Your satisfaction is our priority with every purchase</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
