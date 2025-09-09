"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Heart, ShoppingCart } from "lucide-react"
import { useProducts } from "@/hooks/use-products"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

export function FeaturedProducts() {
  const { products, loading, error } = useProducts({
    featured: true,
    limit: 4,
  })

  if (loading) {
    return (
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Products</h2>
              <p className="text-lg text-muted-foreground">Handpicked favorites loved by parents and babies</p>
            </div>
          </div>
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        </div>
      </section>
    )
  }

  if (error || !products.length) {
    return (
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Products</h2>
              <p className="text-lg text-muted-foreground">Handpicked favorites loved by parents and babies</p>
            </div>
            <Button variant="outline" asChild>
              <Link href="/products">View All</Link>
            </Button>
          </div>
          <div className="text-center py-12">
            <p className="text-muted-foreground">No featured products available at the moment.</p>
          </div>
        </div>
      </section>
    )
  }
  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Products</h2>
            <p className="text-lg text-muted-foreground">Handpicked favorites loved by parents and babies</p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/products">View All</Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => {
            const primaryImage = product.images?.find(img => img.isPrimary) || product.images?.[0]
            const hasDiscount = product.comparePrice && Number.parseFloat(product.comparePrice) > Number.parseFloat(product.price)
            const discountPercentage = hasDiscount
              ? Math.round(
                  ((Number.parseFloat(product.comparePrice!) - Number.parseFloat(product.price)) /
                    Number.parseFloat(product.comparePrice!)) * 100
                )
              : 0

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
                    {product.isFeatured && (
                      <Badge className="absolute top-2 left-2" variant="default">
                        Featured
                      </Badge>
                    )}
                    {hasDiscount && (
                      <Badge className="absolute top-2 left-2" variant="destructive">
                        {discountPercentage}% OFF
                      </Badge>
                    )}
                    <Button
                      size="icon"
                      variant="ghost"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                      <Link href={`/products/${product.slug}`}>{product.name}</Link>
                    </h3>

                    {product.ageRange && (
                      <p className="text-xs text-muted-foreground">Age: {product.ageRange}</p>
                    )}

                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold">₹{product.price}</span>
                      {hasDiscount && (
                        <span className="text-sm text-muted-foreground line-through">₹{product.comparePrice}</span>
                      )}
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
      </div>
    </section>
  )
}
