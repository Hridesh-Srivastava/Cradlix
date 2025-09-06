import type { Metadata } from "next"
import { HeroSection } from "@/components/sections/hero-section"
import { FeaturedProducts } from "@/components/sections/featured-products"
import { CategorySection } from "@/components/sections/category-section"
import { TestimonialsSection } from "@/components/sections/testimonials-section"
import { NewsletterSection } from "@/components/sections/newsletter-section"

export const metadata: Metadata = {
  title: "Baby Store - Premium Baby Products & Toys",
  description:
    "Discover the best baby products and toys for your little ones. Safe, high-quality, and affordable products with fast delivery.",
  keywords: "baby products, baby toys, infant care, toddler toys, baby accessories",
}

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <CategorySection />
      <FeaturedProducts />
      <TestimonialsSection />
      <NewsletterSection />
    </main>
  )
}
