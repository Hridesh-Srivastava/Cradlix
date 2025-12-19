"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { AddressSelection } from "./address-selection"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { toast } from "sonner"
import { ChevronRight, CreditCard, Truck, Package, ShieldCheck, CheckCircle2 } from "lucide-react"

interface Address {
  id: string
  type: string
  firstName: string
  middleName?: string
  lastName: string
  phone: string
  addressLine1: string
  addressLine2?: string
  city: string
  state: string
  pincode: string
  isDefault: boolean
}

interface CartItem {
  id: string
  quantity: number
  product: {
    id: string
    name: string
    slug: string
    price: string
    images: { url: string; altText: string }[]
  }
}

declare global {
  interface Window {
    Razorpay: any
  }
}

type CheckoutStep = "address" | "payment" | "review"

export function ComprehensiveCheckout() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState<CheckoutStep>("address")
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null)
  const [paymentMethod, setPaymentMethod] = useState<"razorpay" | "cod">("razorpay")
  const [isProcessing, setIsProcessing] = useState(false)
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loadingCart, setLoadingCart] = useState(true)
  const [razorpayLoaded, setRazorpayLoaded] = useState(false)

  const subtotal = cartItems.reduce((sum, item) => sum + Number(item.product.price) * item.quantity, 0)
  const shippingCost = subtotal > 500 ? 0 : 50
  const taxAmount = subtotal * 0.18 // 18% GST
  const totalAmount = subtotal + shippingCost + taxAmount

  useEffect(() => {
    if (session?.user) {
      fetchCartItems()
    }
  }, [session])

  useEffect(() => {
    // Load Razorpay script
    const script = document.createElement("script")
    script.src = "https://checkout.razorpay.com/v1/checkout.js"
    script.async = true
    script.onload = () => {
      console.log('Razorpay SDK loaded successfully')
      setRazorpayLoaded(true)
    }
    script.onerror = () => {
      console.error('Failed to load Razorpay SDK')
      toast.error('Failed to load payment gateway. Please refresh the page.')
    }
    document.body.appendChild(script)

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script)
      }
    }
  }, [])

  const fetchCartItems = async () => {
    try {
      setLoadingCart(true)
      const response = await fetch("/api/cart")
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setCartItems(data.items)
        }
      }
    } catch (error) {
      console.error("Error fetching cart:", error)
      toast.error("Failed to load cart items")
    } finally {
      setLoadingCart(false)
    }
  }

  const handleAddressSelect = (address: Address) => {
    setSelectedAddress(address)
  }

  const handleContinueToPayment = () => {
    if (!selectedAddress) {
      toast.error("Please select a delivery address")
      return
    }
    setCurrentStep("payment")
  }

  const handleContinueToReview = () => {
    setCurrentStep("review")
  }

  const clearCartItems = () => {
    setCartItems([])
  }

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      toast.error("Please select a delivery address")
      return
    }

    if (cartItems.length === 0) {
      toast.error("Your cart is empty")
      return
    }

    setIsProcessing(true)

    try {
      const orderItems = cartItems.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
        price: Number(item.product.price),
      }))

      const shippingAddress = {
        fullName: `${selectedAddress.firstName} ${selectedAddress.middleName ? selectedAddress.middleName + ' ' : ''}${selectedAddress.lastName}`,
        phone: selectedAddress.phone || "",
        addressLine1: selectedAddress.addressLine1 || "",
        addressLine2: selectedAddress.addressLine2 || "",
        city: selectedAddress.city || "",
        state: selectedAddress.state || "",
        pincode: selectedAddress.pincode || "",
        country: "India",
      }

      if (paymentMethod === "cod") {
        // Handle COD order
        const response = await fetch("/api/payment/create-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            paymentMethod: "cod",
            items: orderItems,
            shippingAddress,
            billingAddress: shippingAddress,
          }),
        })

        const data = await response.json()

        if (data.success) {
          clearCartItems()
          toast.success("Order placed successfully!")
          router.push(`/order-success?orderId=${data.orderId}`)
        } else {
          throw new Error(data.error || "Failed to place order")
        }
      } else {
        // Handle Razorpay payment
        const createOrderResponse = await fetch("/api/payment/create-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            paymentMethod: "razorpay",
            amount: totalAmount,
            items: orderItems,
            shippingAddress,
            billingAddress: shippingAddress,
          }),
        })

        const orderData = await createOrderResponse.json()

        if (!orderData.success) {
          throw new Error(orderData.error || "Failed to create payment order")
        }

        // Initialize Razorpay payment
        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: orderData.order.amount,
          currency: orderData.order.currency,
          name: "Cradlix",
          description: "Complete your purchase",
          order_id: orderData.order.id,
          prefill: {
            name: `${selectedAddress.firstName} ${selectedAddress.middleName ? selectedAddress.middleName + ' ' : ''}${selectedAddress.lastName}`,
            email: session?.user?.email,
            contact: selectedAddress.phone,
          },
          theme: {
            color: "#3B82F6",
          },
          handler: async (response: any) => {
            try {
              // Verify payment and create order
              const verifyResponse = await fetch("/api/payment/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  items: orderItems,
                  shippingAddress,
                  billingAddress: shippingAddress,
                }),
              })

              const verifyData = await verifyResponse.json()

              if (verifyData.success) {
                clearCartItems()
                toast.success("Payment successful! Order confirmed.")
                router.push(`/order-success?orderId=${verifyData.orderId}`)
              } else {
                throw new Error(verifyData.error || "Payment verification failed")
              }
            } catch (error) {
              console.error("Payment verification error:", error)
              toast.error("Payment verification failed. Please contact support.")
              setIsProcessing(false)
            }
          },
          modal: {
            ondismiss: () => {
              setIsProcessing(false)
              toast.error("Payment cancelled")
            },
          },
        }

        if (typeof window.Razorpay === 'undefined') {
          throw new Error('Razorpay SDK failed to load. Please refresh the page and try again.')
        }

        const razorpay = new window.Razorpay(options)
        razorpay.open()
      }
    } catch (error) {
      console.error("Order placement error:", error)
      toast.error(error instanceof Error ? error.message : "Failed to place order")
      setIsProcessing(false)
    }
  }

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push("/login?callbackUrl=/checkout")
    }
  }, [status, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner className="h-8 w-8" />
      </div>
    )
  }

  if (!session?.user) {
    return null
  }

  if (loadingCart) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner className="h-8 w-8" />
      </div>
    )
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground mb-6">Add some items to your cart before checkout.</p>
            <Button onClick={() => router.push("/products")} size="lg">
              Continue Shopping
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container max-w-7xl mx-auto px-4">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-4">
            <StepIndicator
              step={1}
              label="Address"
              isActive={currentStep === "address"}
              isCompleted={currentStep === "payment" || currentStep === "review"}
            />
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
            <StepIndicator
              step={2}
              label="Payment"
              isActive={currentStep === "payment"}
              isCompleted={currentStep === "review"}
            />
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
            <StepIndicator step={3} label="Review" isActive={currentStep === "review"} isCompleted={false} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Step 1: Address Selection */}
            {currentStep === "address" && (
              <Card>
                <CardContent className="p-6">
                  <AddressSelection onAddressSelect={handleAddressSelect} selectedAddressId={selectedAddress?.id} />
                  <div className="mt-6 flex justify-end">
                    <Button onClick={handleContinueToPayment} disabled={!selectedAddress} size="lg">
                      Continue to Payment
                      <ChevronRight className="ml-2 h-5 w-5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 2: Payment Method */}
            {currentStep === "payment" && (
              <Card>
                <CardHeader>
                  <CardTitle>Select Payment Method</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <RadioGroup value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as "razorpay" | "cod")}>
                    <Card className={`cursor-pointer hover:bg-accent/50 transition-colors ${!razorpayLoaded ? 'opacity-50' : ''}`}>
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                          <RadioGroupItem value="razorpay" id="razorpay" disabled={!razorpayLoaded} />
                          <Label htmlFor="razorpay" className={`flex-1 ${razorpayLoaded ? 'cursor-pointer' : 'cursor-not-allowed'}`}>
                            <div className="flex items-center gap-3">
                              <CreditCard className="h-5 w-5 text-primary" />
                              <div>
                                <p className="font-medium">Card / UPI / Net Banking</p>
                                <p className="text-sm text-muted-foreground">
                                  {razorpayLoaded ? 'Pay securely with Razorpay' : 'Loading payment gateway...'}
                                </p>
                              </div>
                            </div>
                          </Label>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="cursor-pointer hover:bg-accent/50 transition-colors">
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                          <RadioGroupItem value="cod" id="cod" />
                          <Label htmlFor="cod" className="flex-1 cursor-pointer">
                            <div className="flex items-center gap-3">
                              <Truck className="h-5 w-5 text-primary" />
                              <div>
                                <p className="font-medium">Cash on Delivery</p>
                                <p className="text-sm text-muted-foreground">Pay when you receive the order</p>
                              </div>
                            </div>
                          </Label>
                        </div>
                      </CardContent>
                    </Card>
                  </RadioGroup>

                  <div className="flex gap-3 justify-between mt-6">
                    <Button variant="outline" onClick={() => setCurrentStep("address")}>
                      Back to Address
                    </Button>
                    <Button onClick={handleContinueToReview} size="lg">
                      Continue to Review
                      <ChevronRight className="ml-2 h-5 w-5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 3: Order Review */}
            {currentStep === "review" && (
              <div className="space-y-6">
                {/* Delivery Address */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Delivery Address</CardTitle>
                      <Button variant="outline" size="sm" onClick={() => setCurrentStep("address")}>
                        Change
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {selectedAddress && (
                      <div>
                        <p className="font-semibold">{selectedAddress.firstName} {selectedAddress.middleName ? selectedAddress.middleName + ' ' : ''}{selectedAddress.lastName}</p>
                        <p className="text-sm text-muted-foreground mt-1">{selectedAddress.addressLine1}</p>
                        {selectedAddress.addressLine2 && (
                          <p className="text-sm text-muted-foreground">{selectedAddress.addressLine2}</p>
                        )}
                        <p className="text-sm text-muted-foreground">
                          {selectedAddress.city}, {selectedAddress.state} - {selectedAddress.pincode}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">Phone: {selectedAddress.phone}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Payment Method */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Payment Method</CardTitle>
                      <Button variant="outline" size="sm" onClick={() => setCurrentStep("payment")}>
                        Change
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-3">
                      {paymentMethod === "razorpay" ? (
                        <>
                          <CreditCard className="h-5 w-5 text-primary" />
                          <div>
                            <p className="font-medium">Card / UPI / Net Banking</p>
                            <p className="text-sm text-muted-foreground">Pay securely with Razorpay</p>
                          </div>
                        </>
                      ) : (
                        <>
                          <Truck className="h-5 w-5 text-primary" />
                          <div>
                            <p className="font-medium">Cash on Delivery</p>
                            <p className="text-sm text-muted-foreground">Pay when you receive the order</p>
                          </div>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Order Items */}
                <Card>
                  <CardHeader>
                    <CardTitle>Review Items</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {cartItems.map((item) => (
                        <div key={item.id} className="flex gap-4">
                          <img
                            src={item.product.images[0]?.url || "/placeholder.svg"}
                            alt={item.product.images[0]?.altText || item.product.name}
                            className="w-20 h-20 object-cover rounded"
                          />
                          <div className="flex-1">
                            <p className="font-medium">{item.product.name}</p>
                            <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                            <p className="font-semibold mt-1">₹{(Number(item.product.price) * item.quantity).toFixed(2)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <div className="flex gap-3 justify-between">
                  <Button variant="outline" onClick={() => setCurrentStep("payment")}>
                    Back to Payment
                  </Button>
                  <Button 
                    onClick={handlePlaceOrder} 
                    disabled={isProcessing || (paymentMethod === 'razorpay' && !razorpayLoaded)} 
                    size="lg" 
                    className="min-w-[200px]"
                  >
                    {isProcessing ? (
                      <>
                        <LoadingSpinner className="mr-2 h-4 w-4" />
                        Processing...
                      </>
                    ) : (paymentMethod === 'razorpay' && !razorpayLoaded) ? (
                      <>
                        <LoadingSpinner className="mr-2 h-4 w-4" />
                        Loading Payment...
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="mr-2 h-5 w-5" />
                        Place Order
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Items ({cartItems.length})</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Shipping</span>
                    <span className={shippingCost === 0 ? "text-green-600 font-medium" : ""}>
                      {shippingCost === 0 ? "FREE" : `₹${shippingCost.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tax (GST 18%)</span>
                    <span>₹{taxAmount.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>₹{totalAmount.toFixed(2)}</span>
                  </div>
                </div>

                {shippingCost > 0 && (
                  <div className="text-xs text-muted-foreground bg-blue-50 p-3 rounded">
                    💡 Add ₹{(500 - subtotal).toFixed(2)} more to get FREE shipping!
                  </div>
                )}

                <div className="space-y-2 pt-4 border-t">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <ShieldCheck className="h-4 w-4 text-green-600" />
                    <span>Safe and Secure Payments</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Truck className="h-4 w-4 text-green-600" />
                    <span>Fast Delivery</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

function StepIndicator({
  step,
  label,
  isActive,
  isCompleted,
}: {
  step: number
  label: string
  isActive: boolean
  isCompleted: boolean
}) {
  return (
    <div className="flex items-center gap-2">
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
          isCompleted
            ? "bg-green-500 text-white"
            : isActive
            ? "bg-primary text-primary-foreground"
            : "bg-gray-200 text-gray-600"
        }`}
      >
        {isCompleted ? <CheckCircle2 className="h-6 w-6" /> : step}
      </div>
      <span className={`font-medium ${isActive ? "text-primary" : "text-muted-foreground"}`}>{label}</span>
    </div>
  )
}
