import { NextResponse } from "next/server"
import { db } from "@/lib/db/postgres"
import { products, testimonials } from "@/lib/db/schema"
import { eq, sql } from "drizzle-orm"

export async function GET() {
  try {
    const [productCountResult] = await db
      .select({ totalProducts: sql<number>`count(*)` })
      .from(products)
      .where(eq(products.isActive, true))

    const [testimonialsCountResult] = await db
      .select({ totalTestimonials: sql<number>`count(*)` })
      .from(testimonials)
      .where(eq(testimonials.isApproved, true))

    return NextResponse.json({
      success: true,
      stats: {
        totalProducts: Number(productCountResult?.totalProducts || 0),
        totalTestimonials: Number(testimonialsCountResult?.totalTestimonials || 0),
      },
    })
  } catch (error) {
    console.error("Public stats GET error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
