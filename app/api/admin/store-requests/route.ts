import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth/config"
import { db } from "@/lib/db/postgres"
import { storeRequests } from "@/lib/db/schema"
import { desc } from "drizzle-orm"

// Get all store requests (Super Admin only)
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || session.user.role !== "super_admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 })
    }

    const requests = await db
      .select()
      .from(storeRequests)
      .orderBy(desc(storeRequests.createdAt))

    return NextResponse.json({ requests }, { status: 200 })
  } catch (error) {
    console.error("Fetch store requests error:", error)
    return NextResponse.json(
      { message: "Failed to fetch store requests" },
      { status: 500 }
    )
  }
}
