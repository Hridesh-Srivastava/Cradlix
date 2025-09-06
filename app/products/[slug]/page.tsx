import { notFound } from "next/navigation"
import { ProductDetails } from "@/components/product/product-details"
import { ProductReviews } from "@/components/product/product-reviews"
import { RelatedProducts } from "@/components/product/related-products"

// Mock data - replace with actual API call
const mockProduct = {
  id: "1",
  name: "Organic Cotton Teddy Bear",
  slug: "organic-cotton-teddy-bear",
  description:
    "Super soft organic cotton teddy bear perfect for newborns and toddlers. Made with 100% organic materials and safe dyes. This cuddly companion is designed to provide comfort and security for your little one while being completely safe for sensitive skin.",
  shortDescription: "Soft organic cotton teddy bear for babies",
  price: "24.99",
  comparePrice: "29.99",
  inventoryQuantity: 15,
  isFeatured: true,
  ageRange: "0-3 years",
  brand: "BabyLove",
  sku: "TOY-TEDDY-001",
  weight: "0.3",
  dimensions: { length: 25, width: 15, height: 30 },
  safetyCertifications: ["CE", "CPSIA"],
  materials: ["Organic Cotton", "Polyester Filling"],
  images: [
    { url: "/organic-cotton-teddy-bear-soft-toy.jpg", altText: "Organic Cotton Teddy Bear - Front View" },
    { url: "/placeholder.svg?height=600&width=600", altText: "Organic Cotton Teddy Bear - Side View" },
    { url: "/placeholder.svg?height=600&width=600", altText: "Organic Cotton Teddy Bear - Back View" },
  ],
  category: { id: "1", name: "Soft Toys", slug: "soft-toys" },
  averageRating: 4.5,
  totalReviews: 23,
  reviews: [
    {
      id: "1",
      rating: 5,
      title: "Perfect for my newborn",
      comment:
        "My baby loves this teddy bear! It's so soft and well-made. The organic cotton is perfect for sensitive skin.",
      isVerifiedPurchase: true,
      createdAt: new Date("2024-01-15"),
      user: { name: "Sarah M.", image: null },
    },
    {
      id: "2",
      rating: 4,
      title: "Great quality",
      comment: "Beautiful teddy bear with excellent craftsmanship. My toddler carries it everywhere.",
      isVerifiedPurchase: true,
      createdAt: new Date("2024-01-10"),
      user: { name: "Mike R.", image: null },
    },
  ],
}

interface ProductPageProps {
  params: {
    slug: string
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  // In a real app, fetch product by slug from database
  if (params.slug !== "organic-cotton-teddy-bear") {
    notFound()
  }

  const product = mockProduct

  return (
    <div className="container py-8">
      <ProductDetails product={product} />

      <div className="mt-16">
        <ProductReviews
          productId={product.id}
          reviews={product.reviews}
          averageRating={product.averageRating}
          totalReviews={product.totalReviews}
        />
      </div>

      <div className="mt-16">
        <RelatedProducts categoryId={product.category.id} currentProductId={product.id} />
      </div>
    </div>
  )
}

export async function generateMetadata({ params }: ProductPageProps) {
  // In a real app, fetch product data for metadata
  const product = mockProduct

  return {
    title: `${product.name} | Baby Store`,
    description: product.shortDescription,
    openGraph: {
      title: product.name,
      description: product.shortDescription,
      images: [product.images[0].url],
    },
  }
}
