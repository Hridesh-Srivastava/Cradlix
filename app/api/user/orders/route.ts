import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth/config"
import { authOptions } from "@/lib/auth/config"
import { db } from "@/lib/db/postgres"
import { orders, orderItems, products } from "@/lib/db/schema"
import { eq, desc } from "drizzle-orm"

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    // Verify user can access these orders
    if (userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Fetch user orders with items
    const userOrders = await db
      .select({
        id: orders.id,
        status: orders.status,
        paymentStatus: orders.paymentStatus,
        totalAmount: orders.totalAmount,
        createdAt: orders.createdAt,
        updatedAt: orders.updatedAt,
        shippingAddress: orders.shippingAddress,
      })
      .from(orders)
      .where(eq(orders.userId, userId))
      .orderBy(desc(orders.createdAt))

    // Fetch order items for each order
    const ordersWithItems = await Promise.all(
      userOrders.map(async (order) => {
        const items = await db
          .select({
            id: orderItems.id,
            productId: orderItems.productId,
            productName: products.name,
            quantity: orderItems.quantity,
            price: orderItems.price,
          })
          .from(orderItems)
          .leftJoin(products, eq(orderItems.productId, products.id))
          .where(eq(orderItems.orderId, order.id))

        return {
          ...order,
          items: items.map((item) => ({
            id: item.id,
            productName: item.productName || "Unknown Product",
            quantity: item.quantity,
            price: item.price,
          })),
        }
      }),
    )

    return NextResponse.json({
      success: true,
      orders: ordersWithItems,
    })
  } catch (error) {
    console.error("Orders fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
