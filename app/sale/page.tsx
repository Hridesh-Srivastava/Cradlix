"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { Loader2, ShoppingCart, Heart, Star, Percent } from 'lucide-react'
import Link from 'next/link'
import { useProducts } from '@/hooks/use-products'

export default function SalePage() {
  const { products, loading, error } = useProducts({ 
    limit: 20,
    sortBy: 'createdAt',
    sortOrder: 'desc'
  })
  const { toast } = useToast()

  // Filter products that have a compare price (indicating a sale)
  const saleProducts = products.filter(product => 
    product.comparePrice && Number(product.comparePrice) > Number(product.price)
  )

  const calculateDiscountPercentage = (price: string, comparePrice: string) => {
    const originalPrice = Number(comparePrice)
    const salePrice = Number(price)
    return Math.round(((originalPrice - salePrice) / originalPrice) * 100)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container max-w-4xl mx-auto px-4">
          <div className="text-center py-16">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Error loading sale items</h1>
            <p className="text-gray-600 mb-8">Please try again later.</p>
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Percent className="h-8 w-8 text-red-500" />
            <h1 className="text-4xl font-bold text-gray-900">Sale</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Don't miss out on these amazing deals! Limited time offers on premium baby products.
          </p>
        </div>

        {/* Sale Banner */}
        <div className="bg-gradient-to-r from-red-500 to-pink-500 rounded-lg p-8 text-white mb-12">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-2">Flash Sale - Up to 50% Off!</h2>
            <p className="text-lg mb-4">Limited time offer on selected baby products</p>
            <div className="flex items-center justify-center gap-4 text-sm">
              <span>⏰ Ends in 2 days</span>
              <span>•</span>
              <span>🚚 Free shipping on orders over ₹1000</span>
            </div>
          </div>
        </div>

        {saleProducts.length === 0 ? (
          <div className="text-center py-16">
            <Percent className="h-24 w-24 mx-auto text-gray-400 mb-6" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">No sale items available</h2>
            <p className="text-gray-600 mb-8">Check back soon for amazing deals!</p>
            <Button asChild>
              <Link href="/products">
                Browse All Products
              </Link>
            </Button>
          </div>
        ) : (
          <>
            {/* Sale Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <Card className="text-center">
                <CardContent className="p-6">
                  <div className="text-3xl font-bold text-red-500 mb-2">
                    {saleProducts.length}
                  </div>
                  <p className="text-gray-600">Items on Sale</p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="p-6">
                  <div className="text-3xl font-bold text-green-500 mb-2">
                    Up to {Math.max(...saleProducts.map(p => 
                      calculateDiscountPercentage(p.price, p.comparePrice || p.price)
                    ))}%
                  </div>
                  <p className="text-gray-600">Maximum Discount</p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="p-6">
                  <div className="text-3xl font-bold text-blue-500 mb-2">
                    ₹{Math.min(...saleProducts.map(p => Number(p.price)))}
                  </div>
                  <p className="text-gray-600">Starting From</p>
                </CardContent>
              </Card>
            </div>

            {/* Sale Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {saleProducts.map((product) => {
                const primaryImage = product.images?.find(img => img.isPrimary) || product.images?.[0]
                const discountPercentage = calculateDiscountPercentage(
                  product.price, 
                  product.comparePrice || product.price
                )

                return (
                  <Card key={product.id} className="group hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-4">
                      <div className="relative mb-4">
                        <div className="aspect-square rounded-lg bg-muted overflow-hidden">
                          <img
                            src={primaryImage?.url || "/placeholder.svg"}
                            alt={primaryImage?.altText || product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <Badge className="absolute top-2 left-2" variant="destructive">
                          {discountPercentage}% OFF
                        </Badge>
                        <button
                          className="absolute top-2 right-2 h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity bg-transparent border-none cursor-pointer flex items-center justify-center rounded-md hover:bg-gray-100"
                          onClick={() => {
                            // Add to wishlist functionality
                            console.log('Add to wishlist:', product.id)
                          }}
                        >
                          <Heart className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="space-y-2">
                        <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                          <Link href={`/products/${product.slug}`}>{product.name}</Link>
                        </h3>
                        {product.ageRange && (
                          <p className="text-xs text-muted-foreground">Age: {product.ageRange}</p>
                        )}
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold text-red-500">₹{product.price}</span>
                          <span className="text-sm text-muted-foreground line-through">
                            ₹{product.comparePrice}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm text-muted-foreground">4.5 (128 reviews)</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="p-4 pt-0">
                      <Button className="w-full" size="sm" asChild>
                        <Link href={`/products/${product.slug}`}>
                          <ShoppingCart className="mr-2 h-4 w-4" />
                          View Details
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                )
              })}
            </div>

            {/* Sale Terms */}
            <div className="mt-16 bg-white rounded-lg p-8 shadow-sm">
              <h2 className="text-2xl font-bold mb-6">Sale Terms & Conditions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-semibold text-lg mb-3">What's Included</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Free shipping on orders over ₹1000</li>
                    <li>• 30-day return policy</li>
                    <li>• Original manufacturer warranty</li>
                    <li>• Secure payment processing</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-3">Important Notes</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Limited quantities available</li>
                    <li>• Prices valid while stocks last</li>
                    <li>• Cannot be combined with other offers</li>
                    <li>• Sale ends at midnight</li>
                  </ul>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
