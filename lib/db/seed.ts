import { db } from "./postgres"
import { categories, products, productImages } from "./schema"
import { connectMongoDB, Newsletter } from "./mongodb"

// Sample data for seeding
const sampleCategories = [
  {
    id: "550e8400-e29b-41d4-a716-446655440001",
    name: "Baby Toys",
    slug: "baby-toys",
    description: "Safe and educational toys for babies and toddlers",
    imageUrl: "/images/categories/baby-toys.jpg",
    parentId: null,
    sortOrder: 1,
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440002",
    name: "Feeding",
    slug: "feeding",
    description: "Bottles, bibs, and feeding accessories",
    imageUrl: "/images/categories/feeding.jpg",
    parentId: null,
    sortOrder: 2,
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440003",
    name: "Clothing",
    slug: "clothing",
    description: "Comfortable and cute baby clothing",
    imageUrl: "/images/categories/clothing.jpg",
    parentId: null,
    sortOrder: 3,
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440006",
    name: "Soft Toys",
    slug: "soft-toys",
    description: "Cuddly and safe soft toys",
    imageUrl: "/images/categories/soft-toys.jpg",
    parentId: "550e8400-e29b-41d4-a716-446655440001",
    sortOrder: 1,
  },
]

const sampleProducts = [
  {
    id: "660e8400-e29b-41d4-a716-446655440001",
    name: "Organic Cotton Teddy Bear",
    slug: "organic-cotton-teddy-bear",
    description:
      "Super soft organic cotton teddy bear perfect for newborns and toddlers. Made with 100% organic materials and safe dyes.",
    shortDescription: "Soft organic cotton teddy bear for babies",
    sku: "TOY-TEDDY-001",
    price: "24.99",
    comparePrice: "29.99",
    categoryId: "550e8400-e29b-41d4-a716-446655440006",
    brand: "BabyLove",
    ageRange: "0-3 years",
    safetyCertifications: ["CE", "CPSIA"],
    materials: ["Organic Cotton", "Polyester Filling"],
    isFeatured: true,
    inventoryQuantity: 50,
  },
  {
    id: "660e8400-e29b-41d4-a716-446655440002",
    name: "Wooden Stacking Rings",
    slug: "wooden-stacking-rings",
    description:
      "Classic wooden stacking toy that helps develop hand-eye coordination and problem-solving skills. Made from sustainable wood.",
    shortDescription: "Educational wooden stacking toy",
    sku: "TOY-STACK-001",
    price: "18.99",
    categoryId: "550e8400-e29b-41d4-a716-446655440001",
    brand: "EcoPlay",
    ageRange: "6 months - 2 years",
    safetyCertifications: ["CE", "ASTM"],
    materials: ["Sustainable Wood", "Non-toxic Paint"],
    isFeatured: true,
    inventoryQuantity: 30,
  },
  {
    id: "660e8400-e29b-41d4-a716-446655440003",
    name: "Baby Bottle Set",
    slug: "baby-bottle-set",
    description:
      "Complete feeding set with 3 bottles of different sizes, perfect for growing babies. BPA-free and easy to clean.",
    shortDescription: "BPA-free baby bottle set",
    sku: "FEED-BOTTLE-001",
    price: "32.99",
    comparePrice: "39.99",
    categoryId: "550e8400-e29b-41d4-a716-446655440002",
    brand: "SafeFeed",
    ageRange: "0-12 months",
    safetyCertifications: ["FDA", "BPA-Free"],
    materials: ["Silicone", "Polypropylene"],
    isFeatured: false,
    inventoryQuantity: 25,
  },
]

const sampleProductImages = [
  {
    productId: "660e8400-e29b-41d4-a716-446655440001",
    url: "/organic-cotton-teddy-bear-soft-toy.jpg",
    altText: "Organic Cotton Teddy Bear - Front View",
    sortOrder: 0,
    isPrimary: true,
  },
  {
    productId: "660e8400-e29b-41d4-a716-446655440002",
    url: "/wooden-stacking-rings-educational-toy.jpg",
    altText: "Wooden Stacking Rings - Complete Set",
    sortOrder: 0,
    isPrimary: true,
  },
  {
    productId: "660e8400-e29b-41d4-a716-446655440003",
    url: "/baby-bottle-feeding-set-bpa-free.jpg",
    altText: "Baby Bottle Set - All Sizes",
    sortOrder: 0,
    isPrimary: true,
  },
]

export async function seedDatabase() {
  try {
    console.log("Starting database seeding...")

    // Seed PostgreSQL data
    console.log("Seeding categories...")
    await db.insert(categories).values(sampleCategories).onConflictDoNothing()

    console.log("Seeding products...")
    await db.insert(products).values(sampleProducts).onConflictDoNothing()

    console.log("Seeding product images...")
    await db.insert(productImages).values(sampleProductImages).onConflictDoNothing()

    // Seed MongoDB data
    console.log("Connecting to MongoDB...")
    await connectMongoDB()

    console.log("Seeding newsletter subscriptions...")
    await Newsletter.create({
      email: "demo@example.com",
      status: "subscribed",
      source: "seed",
      preferences: {
        productUpdates: true,
        promotions: true,
        newsletter: true,
      },
    }).catch(() => {}) // Ignore if already exists

    console.log("Database seeding completed successfully!")
  } catch (error) {
    console.error("Database seeding failed:", error)
    throw error
  }
}

// Run seeding if this file is executed directly
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log("Seeding process completed")
      process.exit(0)
    })
    .catch((error) => {
      console.error("Seeding process failed:", error)
      process.exit(1)
    })
}
