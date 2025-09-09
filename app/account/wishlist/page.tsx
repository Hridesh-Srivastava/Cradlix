"use client"

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { ProductCard } from '@/components/product/product-card'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { Heart, ShoppingCart, Trash2 } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

interface WishlistItem {
  id: string
  product: {
    id: string
    name: string
    slug: string
    price: string
    comparePrice: string
    inventoryQuantity: number
    isFeatured: boolean
    brand: string
    ageRange: string
    images: {
      id: string
      url: string
      altText: string
      isPrimary: boolean
    }[]
    category: {
      id: string
      name: string
      slug: string
    }
  }
  addedAt: string
}

export default function WishlistPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([])
  const [loading, setLoading] = useState(true)
  const [removing, setRemoving] = useState<string | null>(null)

  useEffect(() => {
    if (session?.user) {
      fetchWishlist()
    } else {
      router.push('/login?callbackUrl=/account/wishlist')
    }
  }, [session, router])

  const fetchWishlist = async () => {
    try {
      const response = await fetch('/api/user/wishlist')
      if (response.ok) {
        const data = await response.json()
        setWishlistItems(data.wishlistItems || [])
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error)
      toast({
        title: 'Error loading wishlist',
        description: 'Please try again later.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const removeFromWishlist = async (productId: string) => {
    try {
      setRemoving(productId)
      const response = await fetch(`/api/user/wishlist/${productId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setWishlistItems(prev => prev.filter(item => item.product.id !== productId))
        toast({
          title: 'Removed from wishlist',
          description: 'Item has been removed from your wishlist.',
        })
      } else {
        throw new Error('Failed to remove from wishlist')
      }
    } catch (error) {
      toast({
        title: 'Error removing item',
        description: 'Please try again later.',
        variant: 'destructive',
      })
    } finally {
      setRemoving(null)
    }
  }

  const addToCart = async (productId: string) => {
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId,
          quantity: 1,
        }),
      })

      if (response.ok) {
        toast({
          title: 'Added to cart',
          description: 'Item has been added to your cart.',
        })
      } else {
        throw new Error('Failed to add to cart')
      }
    } catch (error) {
      toast({
        title: 'Error adding to cart',
        description: 'Please try again later.',
        variant: 'destructive',
      })
    }
  }

  if (loading) {
    return (
      <div className="container py-8">
        <div className="flex justify-center">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Wishlist</h1>
          <p className="text-muted-foreground">
            {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} in your wishlist
          </p>
        </div>

        {wishlistItems.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Heart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">Your wishlist is empty</h3>
              <p className="text-muted-foreground mb-6">
                Start adding items you love to your wishlist
              </p>
              <Button onClick={() => router.push('/products')}>
                Browse Products
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlistItems.map((item) => (
              <Card key={item.id} className="group hover:shadow-lg transition-all duration-300">
                <CardContent className="p-4">
                  <div className="relative mb-4">
                    <div className="aspect-square rounded-lg bg-muted overflow-hidden">
                      <img
                        src={item.product.images.find(img => img.isPrimary)?.url || "/placeholder.svg"}
                        alt={item.product.images.find(img => img.isPrimary)?.altText || item.product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2 h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeFromWishlist(item.product.id)}
                      disabled={removing === item.product.id}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    {item.product.isFeatured && (
                      <Badge className="absolute top-2 left-2" variant="default">
                        Featured
                      </Badge>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                      {item.product.name}
                    </h3>
                    
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-primary">
                        ₹{item.product.price}
                      </span>
                      {item.product.comparePrice && (
                        <span className="text-sm text-muted-foreground line-through">
                          ₹{item.product.comparePrice}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{item.product.brand}</span>
                      <span>•</span>
                      <span>{item.product.ageRange}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>Added {new Date(item.addedAt).toLocaleDateString()}</span>
                    </div>
                    
                    <div className="flex gap-2 pt-2">
                      <Button
                        size="sm"
                        className="flex-1"
                        onClick={() => addToCart(item.product.id)}
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Add to Cart
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/products/${item.product.slug}`)}
                      >
                        View
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
