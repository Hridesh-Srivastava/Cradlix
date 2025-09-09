"use client"

import type React from "react"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { Star, Heart, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { useCart } from "@/components/providers/cart-provider"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import type { Product } from "@/lib/types"

interface ProductCardProps {
  product: Product
  className?: string
}

export function ProductCard({ product, className }: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { dispatch } = useCart()
  const { toast } = useToast()

  const primaryImage = product.images?.[0]?.url || "/placeholder.svg?height=300&width=300"
  const hasDiscount = product.comparePrice && Number.parseFloat(product.comparePrice) > Number.parseFloat(product.price)
  const discountPercentage = hasDiscount
    ? Math.round(
        ((Number.parseFloat(product.comparePrice!) - Number.parseFloat(product.price)) /
          Number.parseFloat(product.comparePrice!)) *
          100,
      )
    : 0

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    setIsLoading(true)
    try {
      dispatch({
        type: "ADD_ITEM",
        payload: {
          id: product.id,
          name: product.name,
          price: Number.parseFloat(product.price),
          image: primaryImage,
          slug: product.slug,
          quantity: 1,
        },
      })

      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsWishlisted(!isWishlisted)

    toast({
      title: isWishlisted ? "Removed from wishlist" : "Added to wishlist",
      description: `${product.name} has been ${isWishlisted ? "removed from" : "added to"} your wishlist.`,
    })
  }

  return (
    <Card className={cn("group overflow-hidden transition-all hover:shadow-lg", className)}>
      <Link href={`/products/${product.slug}`}>
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={primaryImage || "/placeholder.svg"}
            alt={product.images?.[0]?.altText || product.name}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {product.isFeatured && (
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                Featured
              </Badge>
            )}
            {hasDiscount && <Badge variant="destructive">{discountPercentage}% OFF</Badge>}
            {product.inventoryQuantity <= 5 && product.inventoryQuantity > 0 && (
              <Badge variant="outline" className="bg-orange-100 text-orange-800">
                Low Stock
              </Badge>
            )}
            {product.inventoryQuantity === 0 && <Badge variant="destructive">Out of Stock</Badge>}
          </div>

          {/* Wishlist Button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 h-8 w-8 rounded-full bg-white/80 hover:bg-white"
            onClick={handleWishlistToggle}
          >
            <Heart className={cn("h-4 w-4", isWishlisted && "fill-red-500 text-red-500")} />
          </Button>

          {/* Quick Add to Cart */}
          <div className="absolute bottom-2 left-2 right-2 opacity-0 transition-opacity group-hover:opacity-100">
            <Button
              onClick={handleAddToCart}
              disabled={isLoading || product.inventoryQuantity === 0}
              className="w-full"
              size="sm"
            >
              {isLoading ? (
                "Adding..."
              ) : product.inventoryQuantity === 0 ? (
                "Out of Stock"
              ) : (
                <>
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Add to Cart
                </>
              )}
            </Button>
          </div>
        </div>
      </Link>

      <CardContent className="p-4">
        <Link href={`/products/${product.slug}`}>
          {/* Category */}
          {product.category && <p className="text-xs text-muted-foreground mb-1">{product.category.name}</p>}

          {/* Product Name */}
          <h3 className="font-semibold text-sm mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>

          {/* Rating */}
          {product.averageRating && product.totalReviews && (
            <div className="flex items-center gap-1 mb-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={cn(
                      "h-3 w-3",
                      star <= product.averageRating! ? "fill-yellow-400 text-yellow-400" : "text-gray-300",
                    )}
                  />
                ))}
              </div>
              <span className="text-xs text-muted-foreground">({product.totalReviews})</span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg">₹{product.price}</span>
            {hasDiscount && <span className="text-sm text-muted-foreground line-through">₹{product.comparePrice}</span>}
          </div>

          {/* Age Range */}
          {product.ageRange && <p className="text-xs text-muted-foreground mt-1">Age: {product.ageRange}</p>}
        </Link>
      </CardContent>
    </Card>
  )
}
