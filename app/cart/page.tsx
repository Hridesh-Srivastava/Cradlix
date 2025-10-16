"use client"

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { useToast } from '@/hooks/use-toast'
import { Loader2, ShoppingCart, Plus, Minus, Trash2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useCart } from '@/components/providers/cart-provider'
import { formatCurrency } from '@/lib/utils'

export default function CartPage() {
  const { data: session, status } = useSession()
  const { toast } = useToast()
  const { items: cartItems, updateQuantity: updateCartQuantity, removeItem: removeCartItem } = useCart()
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)

  useEffect(() => {
    // Just mark as loaded since we're using CartProvider
    setLoading(false)
  }, [])

  const updateQuantity = async (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return

    setUpdating(productId)
    try {
      // Update in CartProvider (localStorage)
      updateCartQuantity(productId, newQuantity)

      // Also update in database if user is authenticated
      if (session?.user) {
        await fetch('/api/cart', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            productId,
            quantity: newQuantity,
          }),
        })
      }

      toast({
        title: 'Quantity updated',
        description: 'Cart has been updated.',
      })
    } catch (error) {
      toast({
        title: 'Error updating quantity',
        description: 'Please try again.',
        variant: 'destructive',
      })
    } finally {
      setUpdating(null)
    }
  }

  const removeItem = async (productId: string) => {
    setUpdating(productId)
    try {
      // Remove from CartProvider
      removeCartItem(productId)

      // Also remove from database if user is authenticated
      if (session?.user) {
        await fetch('/api/cart', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ productId }),
        })
      }

      toast({
        title: 'Item removed',
        description: 'Item has been removed from your cart.',
      })
    } catch (error) {
      toast({
        title: 'Error removing item',
        description: 'Please try again.',
        variant: 'destructive',
      })
    } finally {
      setUpdating(null)
    }
  }

  const calculateSubtotal = () => {
    const subtotal = cartItems.reduce((sum, item) => 
      sum + (Number(item.price) * item.quantity), 0
    )
    return Math.round(subtotal * 100) / 100 // Round to 2 decimal places
  }

  const calculateShipping = () => {
    const subtotal = calculateSubtotal()
    return subtotal > 1000 ? 0 : 50
  }

  const calculateTax = () => {
    const subtotal = calculateSubtotal()
    const tax = subtotal * 0.18 // 18% GST
    return Math.round(tax * 100) / 100 // Round to 2 decimal places
  }

  const calculateTotal = () => {
    const total = calculateSubtotal() + calculateShipping() + calculateTax()
    return Math.round(total * 100) / 100 // Round to 2 decimal places
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container max-w-4xl mx-auto px-4">
          <div className="text-center py-16">
            <ShoppingCart className="h-24 w-24 mx-auto text-gray-400 mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
            <p className="text-gray-600 mb-8">Looks like you haven't added any items to your cart yet.</p>
            <Button asChild>
              <Link href="/products">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Continue Shopping
              </Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" asChild>
            <Link href="/products">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Continue Shopping
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">Shopping Cart</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <img
                      src={item.product?.images?.[0]?.url || '/placeholder.svg'}
                      alt={item.product?.images?.[0]?.altText || item.product?.name || 'Product'}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{item.product?.name || 'Product'}</h3>
                      <p className="text-gray-600">{formatCurrency(Number(item.price))}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        disabled={updating === item.productId || item.quantity <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        disabled={updating === item.productId}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{formatCurrency(Number(item.price) * item.quantity)}</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(item.productId)}
                        disabled={updating === item.productId}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatCurrency(calculateSubtotal())}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{formatCurrency(calculateShipping())}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax (GST)</span>
                  <span>{formatCurrency(calculateTax())}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>{formatCurrency(calculateTotal())}</span>
                </div>
                <Button 
                  className="w-full" 
                  size="lg"
                  asChild
                >
                  <Link href="/checkout">
                    Proceed to Checkout
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
