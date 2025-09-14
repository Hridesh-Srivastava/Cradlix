import { notFound } from "next/navigation"
import { headers } from "next/headers"
import { ProductDetails } from "@/components/product/product-details"
import { ProductReviews } from "@/components/product/product-reviews"
import { RelatedProducts } from "@/components/product/related-products"

interface ProductPageProps {
  params: {
    slug: string
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const h = await headers()
  const host = h.get("x-forwarded-host") || h.get("host")
  const proto = h.get("x-forwarded-proto") || (host?.includes("localhost") ? "http" : "https")
  const baseUrl = host ? `${proto}://${host}` : process.env.NEXTAUTH_URL || ""
  const res = await fetch(`${baseUrl}/api/products/${params.slug}`, { cache: 'no-store' })
  if (!res.ok) notFound()
  const data = await res.json()
  if (!data?.success || !data.product) notFound()
  const product = data.product

  return (
    <div className="container py-8">
      <ProductDetails product={product} />

      <div className="mt-16">
        <ProductReviews
          productId={product.id}
    reviews={product.reviews}
    averageRating={product.averageRating}
    totalReviews={product.reviewCount}
        />
      </div>

      <div className="mt-16">
        <RelatedProducts categoryId={product.category.id} currentProductId={product.id} />
      </div>
    </div>
  )
}

export async function generateMetadata({ params }: ProductPageProps) {
  const h = await headers()
  const host = h.get("x-forwarded-host") || h.get("host")
  const proto = h.get("x-forwarded-proto") || (host?.includes("localhost") ? "http" : "https")
  const baseUrl = host ? `${proto}://${host}` : process.env.NEXTAUTH_URL || ""
  const res = await fetch(`${baseUrl}/api/products/${params.slug}`, { cache: 'no-store' })
  if (!res.ok) return {}
  const data = await res.json()
  const product = data?.product
  if (!product) return {}

  return {
    title: `${product.name} | Baby Store`,
    description: product.shortDescription,
    openGraph: {
      title: product.name,
      description: product.shortDescription,
      images: [product.images?.[0]?.url || "/placeholder.svg"],
    },
  }
}
