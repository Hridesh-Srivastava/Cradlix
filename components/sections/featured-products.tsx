import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Heart, ShoppingCart } from "lucide-react"

// Mock data - will be replaced with real data from database
const featuredProducts = [
  {
    id: "1",
    name: "Soft Plush Teddy Bear",
    price: 29.99,
    comparePrice: 39.99,
    image: "/soft-teddy-bear-toy.jpg",
    rating: 4.8,
    reviewCount: 124,
    badge: "Best Seller",
  },
  {
    id: "2",
    name: "Educational Building Blocks",
    price: 24.99,
    image: "/colorful-building-blocks.png",
    rating: 4.9,
    reviewCount: 89,
    badge: "New",
  },
  {
    id: "3",
    name: "Baby Feeding Bottle Set",
    price: 19.99,
    comparePrice: 24.99,
    image: "/baby-feeding-bottles.jpg",
    rating: 4.7,
    reviewCount: 156,
    badge: "Sale",
  },
  {
    id: "4",
    name: "Organic Cotton Onesie",
    price: 15.99,
    image: "/baby-onesie-clothing.jpg",
    rating: 4.6,
    reviewCount: 78,
  },
]

export function FeaturedProducts() {
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
          {featuredProducts.map((product) => (
            <Card key={product.id} className="group hover:shadow-lg transition-all duration-300">
              <CardContent className="p-4">
                <div className="relative mb-4">
                  <div className="aspect-square rounded-lg bg-muted overflow-hidden">
                    <img
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  {product.badge && (
                    <Badge
                      className="absolute top-2 left-2"
                      variant={product.badge === "Sale" ? "destructive" : "default"}
                    >
                      {product.badge}
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
                    <Link href={`/products/${product.id}`}>{product.name}</Link>
                  </h3>

                  <div className="flex items-center gap-1">
                    <div className="flex items-center">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3 w-3 ${
                            i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground">({product.reviewCount})</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold">${product.price}</span>
                    {product.comparePrice && (
                      <span className="text-sm text-muted-foreground line-through">${product.comparePrice}</span>
                    )}
                  </div>
                </div>
              </CardContent>

              <CardFooter className="p-4 pt-0">
                <Button className="w-full" size="sm">
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Add to Cart
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
