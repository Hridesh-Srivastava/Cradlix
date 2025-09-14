"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Star, Shield, Truck } from "lucide-react"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

interface HeroItem {
  title: string
  subtitle?: string | null
  description?: string | null
  buttonText?: string | null
  buttonLink?: string | null
  image?: string | null
  mobileImage?: string | null
}

export function HeroSection() {
  const [hero, setHero] = useState<HeroItem | null>(null)
  const [stats, setStats] = useState<{ totalProducts: number; totalTestimonials: number } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        const [heroRes, statsRes] = await Promise.all([
          fetch("/api/hero-images?position=main&limit=1"),
          fetch("/api/stats"),
        ])
        if (heroRes.ok) {
          const d = await heroRes.json()
          setHero(d.heroImages?.[0] ?? null)
        }
        if (statsRes.ok) {
          const s = await statsRes.json()
          setStats(s.stats)
        }
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const title = hero?.title || "Premium Baby Products for Your"
  const subtitleSpan = " Little Ones"
  const desc = hero?.description ||
    "Discover safe, high-quality baby products and toys. From feeding essentials to educational toys, we have everything your baby needs."
  const ctaText = hero?.buttonText || "Shop Now"
  const ctaLink = hero?.buttonLink || "/products"
  const heroImg = hero?.image || "/happy-baby-with-colorful-toys.jpg"

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-pink-50">
      <div className="container py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-balance">
                {title}
                <span className="text-primary">{subtitleSpan}</span>
              </h1>
              <p className="text-lg text-muted-foreground text-pretty max-w-md">
                {desc}
              </p>
            </div>

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

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" asChild>
                <Link href={ctaLink}>
                  {ctaText}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/categories">Browse Categories</Link>
              </Button>
            </div>

            <div className="flex gap-8 pt-4">
              <div>
                <div className="text-2xl font-bold">{stats?.totalTestimonials ? `${stats.totalTestimonials}+` : "10K+"}</div>
                <div className="text-sm text-muted-foreground">Happy Parents</div>
              </div>
              <div>
                <div className="text-2xl font-bold">{stats?.totalProducts ? `${stats.totalProducts}+` : "500+"}</div>
                <div className="text-sm text-muted-foreground">Products</div>
              </div>
              <div>
                <div className="text-2xl font-bold">4.9</div>
                <div className="text-sm text-muted-foreground">Rating</div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="aspect-square rounded-2xl bg-gradient-to-br from-blue-100 to-pink-100 p-8">
              {loading ? (
                <div className="w-full h-full flex items-center justify-center">
                  <LoadingSpinner />
                </div>
              ) : (
                <img src={heroImg} alt={title} className="w-full h-full object-cover rounded-xl" />
              )}
            </div>
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
