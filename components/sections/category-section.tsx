import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"

const categories = [
  {
    name: "Baby Toys",
    description: "Educational and fun toys",
    image: "/colorful-baby-toys.jpg",
    href: "/categories/toys",
    color: "from-blue-100 to-blue-200",
  },
  {
    name: "Baby Care",
    description: "Essential care products",
    image: "/baby-care-products.png",
    href: "/categories/care",
    color: "from-pink-100 to-pink-200",
  },
  {
    name: "Feeding",
    description: "Bottles, bibs & more",
    image: "/baby-feeding-bottles.jpg",
    href: "/categories/feeding",
    color: "from-green-100 to-green-200",
  },
  {
    name: "Clothing",
    description: "Comfortable baby wear",
    image: "/assorted-baby-clothes.png",
    href: "/categories/clothing",
    color: "from-yellow-100 to-yellow-200",
  },
  {
    name: "Furniture",
    description: "Cribs, chairs & storage",
    image: "/baby-furniture-crib.jpg",
    href: "/categories/furniture",
    color: "from-purple-100 to-purple-200",
  },
  {
    name: "Safety",
    description: "Baby proofing essentials",
    image: "/baby-safety-products.jpg",
    href: "/categories/safety",
    color: "from-red-100 to-red-200",
  },
]

export function CategorySection() {
  return (
    <section className="py-16 md:py-24">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">Shop by Category</h2>
          <p className="text-lg text-muted-foreground text-pretty max-w-2xl mx-auto">
            Find everything you need for your baby in our carefully curated categories
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
          {categories.map((category) => (
            <Link key={category.name} href={category.href}>
              <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-4">
                  <div className={`aspect-square rounded-lg bg-gradient-to-br ${category.color} p-4 mb-3`}>
                    <img
                      src={category.image || "/placeholder.svg"}
                      alt={category.name}
                      className="w-full h-full object-cover rounded-md"
                    />
                  </div>
                  <h3 className="font-semibold text-sm md:text-base mb-1 group-hover:text-primary transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-xs md:text-sm text-muted-foreground">{category.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
