"use client"

import { useState } from "react"
import Image from "next/image"
import { Star, Heart, ShoppingCart, Truck, Shield, RotateCcw, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useCart } from "@/components/providers/cart-provider"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import type { Product as ProductType } from "@/lib/types"

interface ProductDetailsProps {
  product: (ProductType & {
    averageRating?: number
    reviewCount?: number
    seller?: { id: string; name: string; slug?: string; logo?: string | null; website?: string | null }
  }) & {
    // Optional fields for UI convenience
    dimensions?: { length: number; width: number; height: number }
    images?: { url: string; altText?: string }[]
  weight?: string
  }
}

export function ProductDetails({ product }: ProductDetailsProps) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const { addItem } = useCart()
  const { toast } = useToast()

  const hasDiscount = product.comparePrice && Number.parseFloat(product.comparePrice) > Number.parseFloat(product.price)
  const discountPercentage = hasDiscount
    ? Math.round(
        ((Number.parseFloat(product.comparePrice!) - Number.parseFloat(product.price)) /
          Number.parseFloat(product.comparePrice!)) *
          100,
      )
    : 0

  const handleAddToCart = () => {
    // Use provider API to keep state consistent
    addItem(product as unknown as ProductType, quantity)
    toast({ title: "Added to cart", description: `${quantity} × ${product.name} added to your cart.` })
  }

  const handleWishlistToggle = () => {
    setIsWishlisted(!isWishlisted)
    toast({
      title: isWishlisted ? "Removed from wishlist" : "Added to wishlist",
      description: `${product.name} has been ${isWishlisted ? "removed from" : "added to"} your wishlist.`,
    })
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Product Images */}
      <div className="space-y-4">
        {/* Main Image */}
    <div className="aspect-square overflow-hidden rounded-lg border">
          <Image
      src={product.images?.[selectedImage]?.url || "/placeholder.svg"}
      alt={product.images?.[selectedImage]?.altText || product.name}
            width={600}
            height={600}
            className="h-full w-full object-cover"
          />
        </div>

        {/* Thumbnail Images */}
    {product.images && product.images.length > 1 && (
          <div className="flex gap-2">
      {product.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={cn(
                  "aspect-square w-20 overflow-hidden rounded-md border-2 transition-colors",
                  selectedImage === index ? "border-primary" : "border-transparent",
                )}
              >
                <Image
          src={image.url || "/placeholder.svg"}
          alt={image.altText || product.name}
                  width={80}
                  height={80}
                  className="h-full w-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="space-y-6">
        {/* Header */}
        <div>
          <p className="text-sm text-muted-foreground">{product.category?.name || ""}</p>
          <h1 className="text-3xl font-bold mt-1">{product.name}</h1>
          <p className="text-muted-foreground mt-2">{product.shortDescription}</p>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-2">
      <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={cn(
                  "h-5 w-5",
      star <= (product.averageRating || 0) ? "fill-yellow-400 text-yellow-400" : "text-gray-300",
                )}
              />
            ))}
          </div>
          <span className="text-sm text-muted-foreground">
    {product.averageRating || 0} ({product.reviewCount || 0} reviews)
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-3">
          <span className="text-3xl font-bold">₹{product.price}</span>
          {hasDiscount && (
            <>
              <span className="text-xl text-muted-foreground line-through">₹{product.comparePrice}</span>
              <Badge variant="destructive">{discountPercentage}% OFF</Badge>
            </>
          )}
        </div>

        {/* Stock Status */}
        <div>
          {product.inventoryQuantity > 0 ? (
            <div className="flex items-center gap-2 text-green-600">
              <div className="h-2 w-2 rounded-full bg-green-600" />
              <span className="text-sm font-medium">In Stock ({product.inventoryQuantity} available)</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-red-600">
              <div className="h-2 w-2 rounded-full bg-red-600" />
              <span className="text-sm font-medium">Out of Stock</span>
            </div>
          )}
        </div>

        {/* Seller and ETA */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {product.seller && (
            <div className="flex items-center gap-3 p-3 border rounded-md">
              {product.seller.logo ? (
                <Image src={product.seller.logo} alt={product.seller.name} width={32} height={32} className="rounded" />
              ) : (
                <Shield className="h-5 w-5 text-muted-foreground" />
              )}
              <div className="text-sm">
                <div className="text-muted-foreground">Sold by</div>
                <div className="font-medium">{product.seller.name}</div>
              </div>
            </div>
          )}
          <div className="flex items-center gap-3 p-3 border rounded-md">
            <Truck className="h-5 w-5 text-muted-foreground" />
            <div className="text-sm">
              <div className="text-muted-foreground">Estimated delivery</div>
              <div className="font-medium">
                {new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>

        {/* Quantity & Actions */}
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium">Quantity:</label>
            <div className="flex items-center border rounded-md">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
              >
                -
              </Button>
              <span className="px-4 py-2 text-center min-w-[3rem]">{quantity}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setQuantity(Math.min(product.inventoryQuantity, quantity + 1))}
                disabled={quantity >= product.inventoryQuantity}
              >
                +
              </Button>
            </div>
          </div>

          <div className="flex gap-3">
            <Button onClick={handleAddToCart} disabled={product.inventoryQuantity === 0} className="flex-1" size="lg">
              <ShoppingCart className="mr-2 h-5 w-5" />
              Add to Cart
            </Button>
            <Button variant="outline" size="lg" onClick={handleWishlistToggle}>
              <Heart className={cn("h-5 w-5", isWishlisted && "fill-red-500 text-red-500")} />
            </Button>
            <Button variant="outline" size="lg">
              <Share2 className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-4">
          <div className="flex items-center gap-2 text-sm">
            <Truck className="h-4 w-4 text-muted-foreground" />
            <span>Free Shipping</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Shield className="h-4 w-4 text-muted-foreground" />
            <span>Safe & Secure</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <RotateCcw className="h-4 w-4 text-muted-foreground" />
            <span>Easy Returns</span>
          </div>
        </div>

        <Separator />

        {/* Product Details Tabs */}
        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="specifications">Specifications</TabsTrigger>
            <TabsTrigger value="safety">Safety</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="mt-4">
            <div className="space-y-4">
              <p className="text-sm leading-relaxed">{product.description}</p>
              <div>
                <h4 className="font-medium mb-2">Key Features:</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Made with 100% organic cotton</li>
                  <li>• Hypoallergenic and safe for sensitive skin</li>
                  <li>• Machine washable for easy care</li>
                  <li>• Perfect size for little hands to hold</li>
                </ul>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="specifications" className="mt-4">
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Brand:</span>
                <span>{product.brand}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">SKU:</span>
                <span>{product.sku}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Age Range:</span>
                <span>{product.ageRange}</span>
              </div>
              {product.weight && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Weight:</span>
                  <span>{product.weight} kg</span>
                </div>
              )}
              {product.dimensions && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Dimensions:</span>
                  <span>
                    {product.dimensions.length} × {product.dimensions.width} × {product.dimensions.height} cm
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Materials:</span>
                <span>{product.materials?.join(", ") || "—"}</span>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="safety" className="mt-4">
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Safety Certifications:</h4>
                <div className="flex gap-2">
                  {product.safetyCertifications?.map((cert) => (
                    <Badge key={cert} variant="secondary">
                      {cert}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2">Safety Guidelines:</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Always supervise children during play</li>
                  <li>• Check for wear and tear regularly</li>
                  <li>• Suitable for ages {product.ageRange}</li>
                  <li>• Meets all international safety standards</li>
                </ul>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
