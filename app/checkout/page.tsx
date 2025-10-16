"use client"

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { useToast } from '@/hooks/use-toast'
import { Loader2, CreditCard, Smartphone, Truck } from 'lucide-react'
import { useCart } from '@/components/providers/cart-provider'
import { formatCurrency } from '@/lib/utils'

interface CheckoutData {
  items: any[]
  subtotal: number
  shipping: number
  tax: number
  total: number
}

export default function CheckoutPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  const { items: cartItems } = useCart()
  const [loading, setLoading] = useState(false)
  const [cartData, setCartData] = useState<CheckoutData | null>(null)
  const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'cod'>('razorpay')
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India',
  })

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/checkout')
      return
    }

    if (status === 'authenticated' || status === 'loading') {
      // Calculate cart data from CartProvider
      if (cartItems.length > 0) {
        const subtotal = cartItems.reduce((sum, item) => 
          sum + (Number(item.price) * item.quantity), 0
        )
        const shipping = subtotal > 1000 ? 0 : 50
        const tax = Math.round(subtotal * 0.18 * 100) / 100 // 18% GST
        const total = Math.round((subtotal + shipping + tax) * 100) / 100

        setCartData({
          items: cartItems,
          subtotal: Math.round(subtotal * 100) / 100,
          shipping,
          tax,
          total,
        })
      }
    }
  }, [status, router, cartItems])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleRazorpayPayment = async () => {
    if (!cartData) return

    setLoading(true)
    try {
      // Prepare order items
      const orderItems = cartData.items.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        price: Number(item.price),
      }))

      // Prepare shipping address
      const shippingAddress = {
        fullName: `${formData.firstName} ${formData.lastName}`,
        phone: formData.phone,
        addressLine1: formData.address,
        city: formData.city,
        state: formData.state,
        pincode: formData.zipCode,
        country: formData.country,
      }

      // Create Razorpay order
      const orderResponse = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentMethod: 'razorpay',
          amount: cartData.total,
          items: orderItems,
          shippingAddress,
          billingAddress: shippingAddress,
        }),
      })

      const orderData = await orderResponse.json()
      console.log('Order data:', orderData)

      if (!orderData.success) {
        throw new Error(orderData.error || 'Failed to create payment order')
      }

      // Check if Razorpay script is already loaded
      if ((window as any).Razorpay) {
        openRazorpay(orderData.order.id)
      } else {
        // Load Razorpay script
        const script = document.createElement('script')
        script.src = 'https://checkout.razorpay.com/v1/checkout.js'
        script.async = true
        script.onload = () => {
          console.log('Razorpay script loaded')
          openRazorpay(orderData.order.id)
        }
        script.onerror = () => {
          setLoading(false)
          toast({
            title: 'Script Loading Failed',
            description: 'Failed to load payment gateway. Please try again.',
            variant: 'destructive',
          })
        }
        document.body.appendChild(script)
      }
    } catch (error) {
      console.error('Payment error:', error)
      setLoading(false)
      toast({
        title: 'Payment failed',
        description: error instanceof Error ? error.message : 'Please try again.',
        variant: 'destructive',
      })
    }
  }

  const openRazorpay = (orderId: string) => {
    if (!cartData) return

    const razorpayKeyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID
    
    if (!razorpayKeyId) {
      console.error('Razorpay Key ID not found in environment variables')
      setLoading(false)
      toast({
        title: 'Configuration Error',
        description: 'Payment gateway is not configured properly. Please contact support.',
        variant: 'destructive',
      })
      return
    }

    console.log('Razorpay Key ID found:', razorpayKeyId.substring(0, 10) + '...')

    const options = {
      key: razorpayKeyId,
      amount: Math.round(cartData.total * 100), // Convert to paise
      currency: 'INR',
      name: 'Cradlix',
      description: 'Payment for your order',
      order_id: orderId,
      handler: async function (response: any) {
        console.log('Payment response:', response)
        try {
          // Verify payment
          const verifyResponse = await fetch('/api/payment/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              orderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
            }),
          })

          const verifyData = await verifyResponse.json()
          if (verifyData.success) {
            // Create order
            await createOrder('razorpay', response.razorpay_payment_id)
          } else {
            setLoading(false)
            toast({
              title: 'Payment verification failed',
              description: 'Please try again or contact support.',
              variant: 'destructive',
            })
          }
        } catch (error) {
          setLoading(false)
          console.error('Verification error:', error)
          toast({
            title: 'Payment verification failed',
            description: 'Please contact support.',
            variant: 'destructive',
          })
        }
      },
      modal: {
        ondismiss: function() {
          setLoading(false)
          toast({
            title: 'Payment Cancelled',
            description: 'You cancelled the payment.',
          })
        }
      },
      prefill: {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        contact: formData.phone,
      },
      theme: {
        color: '#3B82F6',
      },
    }

    console.log('Opening Razorpay with options:', options)
    const rzp = new (window as any).Razorpay(options)
    rzp.on('payment.failed', function (response: any) {
      setLoading(false)
      console.error('Payment failed:', response.error)
      toast({
        title: 'Payment Failed',
        description: response.error.description || 'Please try again.',
        variant: 'destructive',
      })
    })
    rzp.open()
  }

  const createOrder = async (paymentMethod: string, paymentId?: string) => {
    if (!cartData) return

    setLoading(true)
    try {
      const orderItems = cartData.items.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        price: Number(item.price),
      }))

      const orderResponse = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: orderItems,
          shippingAddress: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            address: formData.address,
            city: formData.city,
            state: formData.state,
            zipCode: formData.zipCode,
            country: formData.country,
            phone: formData.phone,
          },
          billingAddress: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            address: formData.address,
            city: formData.city,
            state: formData.state,
            zipCode: formData.zipCode,
            country: formData.country,
            phone: formData.phone,
          },
          paymentMethod,
          paymentId,
        }),
      })

      const orderData = await orderResponse.json()
      if (orderData.success) {
        toast({
          title: 'Order placed successfully!',
          description: 'Your order has been confirmed.',
        })
        router.push(`/order-success?orderId=${orderData.order.id}`)
      } else {
        throw new Error(orderData.error || 'Failed to create order')
      }
    } catch (error) {
      toast({
        title: 'Order failed',
        description: error instanceof Error ? error.message : 'Please try again.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handlePlaceOrder = async () => {
    // Validate form data
    if (!formData.firstName || !formData.lastName || !formData.email || 
        !formData.phone || !formData.address || !formData.city || 
        !formData.state || !formData.zipCode) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      })
      return
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      toast({
        title: 'Invalid Email',
        description: 'Please enter a valid email address.',
        variant: 'destructive',
      })
      return
    }

    // Validate phone
    if (formData.phone.length < 10) {
      toast({
        title: 'Invalid Phone',
        description: 'Please enter a valid 10-digit phone number.',
        variant: 'destructive',
      })
      return
    }

    if (paymentMethod === 'razorpay') {
      await handleRazorpayPayment()
    } else {
      await createOrder('cod')
    }
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!cartData || cartData.items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground mb-4">Add some items to your cart before checkout.</p>
            <Button onClick={() => router.push('/products')}>
              Continue Shopping
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Shipping Information */}
          <Card>
            <CardHeader>
              <CardTitle>Shipping Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="zipCode">ZIP Code</Label>
                  <Input
                    id="zipCode"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Order Items */}
              <div className="space-y-3">
                {cartData.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <img
                      src={item.product?.images?.[0]?.url || '/placeholder.svg'}
                      alt={item.product?.images?.[0]?.altText || item.product?.name || 'Product'}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium">{item.product?.name || 'Product'}</h4>
                      <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-medium">{formatCurrency(Number(item.price) * item.quantity)}</p>
                  </div>
                ))}
              </div>

              <Separator />

              {/* Payment Method */}
              <div>
                <h3 className="font-medium mb-3">Payment Method</h3>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="razorpay"
                      checked={paymentMethod === 'razorpay'}
                      onChange={(e) => setPaymentMethod(e.target.value as 'razorpay' | 'cod')}
                    />
                    <CreditCard className="h-4 w-4" />
                    <span>Credit/Debit Card (Razorpay)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={paymentMethod === 'cod'}
                      onChange={(e) => setPaymentMethod(e.target.value as 'razorpay' | 'cod')}
                    />
                    <Truck className="h-4 w-4" />
                    <span>Cash on Delivery</span>
                  </label>
                </div>
              </div>

              <Separator />

              {/* Order Total */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatCurrency(cartData.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{formatCurrency(cartData.shipping)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax (GST)</span>
                  <span>{formatCurrency(cartData.tax)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>{formatCurrency(cartData.total)}</span>
                </div>
              </div>

              <Button
                onClick={handlePlaceOrder}
                disabled={loading}
                className="w-full"
                size="lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  `Place Order - ${formatCurrency(cartData.total)}`
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}