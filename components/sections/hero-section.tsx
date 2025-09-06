import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Star, Shield, Truck } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-pink-50">
      <div className="container py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-balance">
                Premium Baby Products for Your
                <span className="text-primary"> Little Ones</span>
              </h1>
              <p className="text-lg text-muted-foreground text-pretty max-w-md">
                Discover safe, high-quality baby products and toys. From feeding essentials to educational toys, we have
                everything your baby needs.
              </p>
            </div>

            {/* Features */}
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-green-600" />
                <span className="text-sm font-medium">100% Safe</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-500" />
                <span className="text-sm font-medium">Top Rated</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-medium">Fast Delivery</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" asChild>
                <Link href="/products">
                  Shop Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/categories">Browse Categories</Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="flex gap-8 pt-4">
              <div>
                <div className="text-2xl font-bold">10K+</div>
                <div className="text-sm text-muted-foreground">Happy Parents</div>
              </div>
              <div>
                <div className="text-2xl font-bold">500+</div>
                <div className="text-sm text-muted-foreground">Products</div>
              </div>
              <div>
                <div className="text-2xl font-bold">4.9</div>
                <div className="text-sm text-muted-foreground">Rating</div>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative">
            <div className="aspect-square rounded-2xl bg-gradient-to-br from-blue-100 to-pink-100 p-8">
              <img
                src="/happy-baby-with-colorful-toys.jpg"
                alt="Happy baby with toys"
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 bg-white rounded-full p-4 shadow-lg">
              <Star className="h-6 w-6 text-yellow-500" />
            </div>
            <div className="absolute -bottom-4 -left-4 bg-white rounded-full p-4 shadow-lg">
              <Shield className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
