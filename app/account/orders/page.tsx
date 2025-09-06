import type { Metadata } from "next"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth/config"
import { OrdersList } from "@/components/account/orders-list"

export const metadata: Metadata = {
  title: "Orders - Baby Store",
  description: "View your order history",
}

export default async function OrdersPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return null
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Orders</h1>
        <p className="text-muted-foreground">View and track your orders</p>
      </div>

      <OrdersList userId={session.user.id!} />
    </div>
  )
}
