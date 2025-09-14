import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db/postgres"
import { heroImages } from "@/lib/db/schema"
import { and, asc, eq, gte, isNull, lte, or } from "drizzle-orm"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const position = searchParams.get("position") || "main"
    const limit = parseInt(searchParams.get("limit") || "1")

    const now = new Date()

    const rows = await db
      .select({
        id: heroImages.id,
        title: heroImages.title,
        subtitle: heroImages.subtitle,
        description: heroImages.description,
        buttonText: heroImages.buttonText,
        buttonLink: heroImages.buttonLink,
        image: heroImages.image,
        mobileImage: heroImages.mobileImage,
      })
      .from(heroImages)
      .where(
        and(
          eq(heroImages.isActive, true),
          eq(heroImages.position, position),
          // Start date <= now or null
          or(isNull(heroImages.startDate), lte(heroImages.startDate, now)),
          // End date >= now or null
          or(isNull(heroImages.endDate), gte(heroImages.endDate, now)),
        ),
      )
      .orderBy(asc(heroImages.sortOrder))
      .limit(limit)

    return NextResponse.json({ success: true, heroImages: rows })
  } catch (error) {
    console.error("Public hero images GET error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
