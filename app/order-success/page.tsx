"use client"

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { CheckCircle, Package, Truck, Home, MapPin, CreditCard, FileText, Loader2 } from 'lucide-react'

interface OrderDetails {
  id: string
  orderNumber: string
  status: string
  paymentStatus: string
  paymentMethod: string
  subtotal: string
  taxAmount: string
  shippingAmount: string
  totalAmount: string
  shippingAddress: any
  createdAt: string
}

export default function OrderSuccessPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const orderId = searchParams.get('orderId')
    if (orderId) {
      fetchOrderDetails(orderId)
    } else {
      setError("Order ID not found")
      setLoading(false)
    }
  }, [searchParams])

  const fetchOrderDetails = async (orderId: string) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/orders/${orderId}`)
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setOrderDetails(data.order)
        } else {
          setError("Order not found")
        }
      } else {
        setError("Failed to fetch order details")
      }
    } catch (error) {
      console.error("Error fetching order details:", error)
      setError("Failed to load order information")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading order details...</p>
        </div>
      </div>
    )
  }

  if (error || !orderDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <p className="text-destructive mb-4">{error || "Order not found"}</p>
            <Button onClick={() => router.push('/')}>
              <Home className="mr-2 h-4 w-4" />
              Go to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container max-w-4xl mx-auto px-4">
        {/* Success Header */}
        <Card className="text-center mb-6">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <div className="bg-green-100 rounded-full p-4">
                <CheckCircle className="h-16 w-16 text-green-600" />
              </div>
            </div>
            <CardTitle className="text-3xl text-green-600 mb-2">Order Placed Successfully!</CardTitle>
            <p className="text-muted-foreground">
              Thank you for your order! We've received your order and will process it shortly.
            </p>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Order Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Order Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Order Number</p>
                <p className="font-mono font-semibold text-lg">{orderDetails.orderNumber}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Order Date</p>
                <p className="font-medium">{formatDate(orderDetails.createdAt)}</p>
              </div>
              <div className="flex gap-2">
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Status</p>
                  <span className="inline-block mt-1 px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded-full">
                    {orderDetails.status.charAt(0).toUpperCase() + orderDetails.status.slice(1)}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Payment</p>
                  <span className={`inline-block mt-1 px-3 py-1 text-sm font-medium rounded-full ${
                    orderDetails.paymentStatus === 'paid' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {orderDetails.paymentStatus.charAt(0).toUpperCase() + orderDetails.paymentStatus.slice(1)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Method */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment Method
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                {orderDetails.paymentMethod === 'razorpay' ? (
                  <>
                    <div className="bg-blue-100 p-3 rounded-full">
                      <CreditCard className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">Online Payment</p>
                      <p className="text-sm text-muted-foreground">Paid via Razorpay</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="bg-orange-100 p-3 rounded-full">
                      <Truck className="h-6 w-6 text-orange-600" />
                    </div>
                    <div>
                      <p className="font-medium">Cash on Delivery</p>
                      <p className="text-sm text-muted-foreground">Pay when you receive</p>
                    </div>
                  </>
                )}
              </div>
              <Separator />
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>₹{Number(orderDetails.subtotal).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Shipping</span>
                  <span>{Number(orderDetails.shippingAmount) === 0 ? 'FREE' : `₹${Number(orderDetails.shippingAmount).toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tax (GST)</span>
                  <span>₹{Number(orderDetails.taxAmount).toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>₹{Number(orderDetails.totalAmount).toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Delivery Address */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Delivery Address
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="font-semibold text-lg">{orderDetails.shippingAddress.fullName}</p>
              <p className="text-muted-foreground mt-2">{orderDetails.shippingAddress.addressLine1}</p>
              {orderDetails.shippingAddress.addressLine2 && (
                <p className="text-muted-foreground">{orderDetails.shippingAddress.addressLine2}</p>
              )}
              <p className="text-muted-foreground">
                {orderDetails.shippingAddress.city}, {orderDetails.shippingAddress.state} - {orderDetails.shippingAddress.pincode}
              </p>
              <p className="text-muted-foreground">{orderDetails.shippingAddress.country}</p>
              <p className="text-muted-foreground mt-2">
                <span className="font-medium">Phone:</span> {orderDetails.shippingAddress.phone}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* What's Next */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>What happens next?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="bg-blue-100 p-2 rounded-full">
                  <Package className="h-6 w-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Order Processing</p>
                  <p className="text-sm text-muted-foreground">
                    We're preparing your items for shipping. You'll receive an email confirmation shortly.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-orange-100 p-2 rounded-full">
                  <Truck className="h-6 w-6 text-orange-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Shipping & Delivery</p>
                  <p className="text-sm text-muted-foreground">
                    Your order will be shipped within 1-2 business days. Expected delivery in 3-5 business days.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="outline" size="lg" onClick={() => router.push('/account/orders')}>
            <Package className="mr-2 h-5 w-5" />
            View All Orders
          </Button>
          <Button size="lg" onClick={() => router.push('/products')}>
            <Home className="mr-2 h-5 w-5" />
            Continue Shopping
          </Button>
        </div>
      </div>
    </div>
  )
}
