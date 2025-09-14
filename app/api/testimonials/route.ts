import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db/postgres"
import { testimonials } from "@/lib/db/schema"
import { and, desc, eq, isNull, lte, or } from "drizzle-orm"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const featured = searchParams.get("featured") === "true"
    const limit = parseInt(searchParams.get("limit") || "6")

    const now = new Date()

    const where = and(
      eq(testimonials.isApproved, true),
      // Optional featured filter
      featured ? eq(testimonials.isFeatured, true) : undefined,
    ).filter(Boolean) as any

    const rows = await db
      .select({
        id: testimonials.id,
        name: testimonials.customerName,
        email: testimonials.customerEmail,
        location: testimonials.customerLocation,
        avatar: testimonials.customerImage,
        rating: testimonials.rating,
        title: testimonials.title,
        content: testimonials.content,
      })
      .from(testimonials)
      .where(where)
      .orderBy(desc(testimonials.sortOrder), desc(testimonials.createdAt))
      .limit(limit)

    return NextResponse.json({ success: true, testimonials: rows })
  } catch (error) {
    console.error("Public testimonials GET error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
