import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth/config"
import { authOptions } from "@/lib/auth/config"
import { db } from "@/lib/db/postgres"
import { orders, products, users } from "@/lib/db/schema"
import { eq, desc, sql, and } from "drizzle-orm"

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id || (session.user.role !== "admin" && session.user.role !== "moderator")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get total counts and revenue
    const [statsResult] = await db
      .select({
        totalProducts: sql<number>`count(distinct ${products.id})`,
        totalOrders: sql<number>`count(distinct ${orders.id})`,
        totalUsers: sql<number>`count(distinct ${users.id})`,
        totalRevenue: sql<number>`coalesce(sum(${orders.totalAmount}), 0)`,
      })
      .from(products)
      .fullJoin(orders, sql`true`)
      .fullJoin(users, sql`true`)
      .where(and(eq(orders.paymentStatus, "completed")))

    // Get recent orders with user information
    const recentOrders = await db
      .select({
        id: orders.id,
        customerName: users.name,
        amount: orders.totalAmount,
        status: orders.status,
        createdAt: orders.createdAt,
      })
      .from(orders)
      .leftJoin(users, eq(orders.userId, users.id))
      .orderBy(desc(orders.createdAt))
      .limit(10)

    const stats = {
      totalProducts: Number(statsResult?.totalProducts) || 0,
      totalOrders: Number(statsResult?.totalOrders) || 0,
      totalUsers: Number(statsResult?.totalUsers) || 0,
      totalRevenue: Number(statsResult?.totalRevenue) || 0,
      recentOrders: recentOrders.map((order) => ({
        id: order.id,
        customerName: order.customerName || "Unknown Customer",
        amount: order.amount,
        status: order.status,
        createdAt: order.createdAt.toISOString(),
      })),
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error("Dashboard stats error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
