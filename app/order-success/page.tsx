"use client"

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, Package, Truck, Home } from 'lucide-react'

export default function OrderSuccessPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [orderId, setOrderId] = useState<string | null>(null)

  useEffect(() => {
    const id = searchParams.get('orderId')
    setOrderId(id)
  }, [searchParams])

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container max-w-2xl mx-auto px-4">
        <Card className="text-center">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <CardTitle className="text-2xl text-green-600">Order Placed Successfully!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-muted-foreground">
              Thank you for your order! We've received your order and will process it shortly.
            </p>
            
            {orderId && (
              <div className="bg-gray-100 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">Order ID</p>
                <p className="font-mono font-medium">{orderId}</p>
              </div>
            )}

            <div className="space-y-4">
              <h3 className="font-semibold">What happens next?</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-left">
                  <Package className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="font-medium">Order Processing</p>
                    <p className="text-sm text-muted-foreground">We'll prepare your items for shipping</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-left">
                  <Truck className="h-5 w-5 text-orange-500" />
                  <div>
                    <p className="font-medium">Shipping</p>
                    <p className="text-sm text-muted-foreground">Your order will be shipped within 1-2 business days</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-4 justify-center">
              <Button variant="outline" onClick={() => router.push('/account/orders')}>
                View Orders
              </Button>
              <Button onClick={() => router.push('/')}>
                <Home className="mr-2 h-4 w-4" />
                Continue Shopping
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}