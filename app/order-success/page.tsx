import { Suspense } from "react"
import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"

export const metadata: Metadata = {
  title: "Order Successful - Baby Store",
  description: "Your order has been placed successfully",
}

function OrderSuccessContent({ searchParams }: { searchParams: { orderId?: string } }) {
  const orderId = searchParams.orderId

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto text-center">
        <Card>
          <CardHeader>
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <CardTitle className="text-2xl text-green-600">Order Placed Successfully!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-muted-foreground">
              Thank you for your purchase. Your order has been confirmed and will be processed shortly.
            </p>

            {orderId && (
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm font-medium">Order ID</p>
                <p className="text-lg font-mono">{orderId}</p>
              </div>
            )}

            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                You will receive an email confirmation shortly with your order details and tracking information.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild>
                  <Link href="/products">Continue Shopping</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/account/orders">View Orders</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function OrderSuccessPage({ searchParams }: { searchParams: { orderId?: string } }) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OrderSuccessContent searchParams={searchParams} />
    </Suspense>
  )
}
