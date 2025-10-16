import { notFound } from "next/navigation"
import { ProductGrid } from "@/components/product/product-grid"
import { ProductFilters } from "@/components/product/product-filters"

// Mock category data
const mockCategories = {
  "baby-toys": {
    id: "1",
    name: "Baby Toys",
    slug: "baby-toys",
    description: "Safe and educational toys designed specifically for babies and toddlers",
    imageUrl: "/placeholder.svg?height=400&width=800",
  },
  feeding: {
    id: "2",
    name: "Feeding",
    slug: "feeding",
    description: "Everything you need for feeding your little one safely and comfortably",
    imageUrl: "/placeholder.svg?height=400&width=800",
  },
  clothing: {
    id: "3",
    name: "Baby Clothing",
    slug: "clothing",
    description: "Comfortable, soft, and adorable clothing for your baby",
    imageUrl: "/placeholder.svg?height=400&width=800",
  },
}

// Mock products for category
const mockCategoryProducts = [
  {
    id: "1",
    name: "Organic Cotton Teddy Bear",
    slug: "organic-cotton-teddy-bear",
    price: "24.99",
    comparePrice: "29.99",
    inventoryQuantity: 15,
    isFeatured: true,
    ageRange: "0-3 years",
    images: [{ url: "/organic-cotton-teddy-bear-soft-toy.jpg", altText: "Organic Cotton Teddy Bear" }],
    category: { name: "Baby Toys", slug: "baby-toys" },
    averageRating: 4.5,
    totalReviews: 23,
  },
  {
    id: "2",
    name: "Wooden Stacking Rings",
    slug: "wooden-stacking-rings",
    price: "18.99",
    comparePrice: null,
    inventoryQuantity: 8,
    isFeatured: false,
    ageRange: "6 months - 2 years",
    images: [{ url: "/wooden-stacking-rings-educational-toy.jpg", altText: "Wooden Stacking Rings" }],
    category: { name: "Baby Toys", slug: "baby-toys" },
    averageRating: 4.8,
    totalReviews: 15,
  },
]

const mockFilters = {
  categories: [
    { id: "1", name: "Soft Toys", count: 12 },
    { id: "2", name: "Educational Toys", count: 8 },
    { id: "3", name: "Musical Toys", count: 6 },
  ],
  brands: [
    { name: "BabyLove", count: 12 },
    { name: "EcoPlay", count: 8 },
    { name: "SafePlay", count: 6 },
  ],
  ageRanges: [
    { range: "0-6 months", count: 8 },
    { range: "6-12 months", count: 12 },
    { range: "1-2 years", count: 15 },
    { range: "2-3 years", count: 10 },
  ],
  priceRange: { min: 0, max: 100 },
}

interface CategoryPageProps {
  params: {
    category: string
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const category = mockCategories[params.category as keyof typeof mockCategories]

  if (!category) {
    notFound()
  }

  return (
    <div className="container py-8">
      {/* Category Header */}
      <div className="mb-8">
        <div className="relative h-48 md:h-64 rounded-lg overflow-hidden mb-6">
          <div
            className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/10"
            style={{
              backgroundImage: `url(${category.imageUrl})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <div className="absolute inset-0 bg-black/20" />
          <div className="relative h-full flex items-center justify-center text-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{category.name}</h1>
              <p className="text-lg text-white/90 max-w-2xl">{category.description}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Filters Sidebar */}
        <ProductFilters filters={mockFilters} activeFilters={{}} onFilterChange={() => {}} className="w-64 shrink-0" />

        {/* Products Grid */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-muted-foreground">
              Showing {mockCategoryProducts.length} products in {category.name}
            </p>

            {/* Mobile Filter Button */}
            <ProductFilters filters={mockFilters} activeFilters={{}} onFilterChange={() => {}} />
          </div>

          <ProductGrid products={mockCategoryProducts} />
        </div>
      </div>
    </div>
  )
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const category = mockCategories[params.category as keyof typeof mockCategories]

  if (!category) {
    return {
      title: "Category Not Found",
    }
  }

  return {
    title: `${category.name} | Cradlix`,
    description: category.description,
  }
}
