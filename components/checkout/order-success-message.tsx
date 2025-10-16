"use client"

import { CheckCircle2, Package, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { formatCurrency } from '@/lib/utils'

interface OrderSuccessMessageProps {
  orderNumber: string
  total: number
  paymentMethod: 'razorpay' | 'cod'
  paymentStatus: 'paid' | 'pending'
  customerEmail: string
}

export function OrderSuccessMessage({
  orderNumber,
  total,
  paymentMethod,
  paymentStatus,
  customerEmail,
}: OrderSuccessMessageProps) {
  const router = useRouter()

  return (
    <div className="min-h-[400px] flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="rounded-full bg-green-100 p-4">
            <CheckCircle2 className="h-16 w-16 text-green-600" />
          </div>
        </div>

        {/* Success Message */}
        <div className="text-center space-y-4 mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {paymentStatus === 'paid' ? 'Payment Successful!' : 'Order Placed!'}
          </h1>
          <p className="text-lg text-gray-600">
            Your order has been confirmed successfully
          </p>
        </div>

        {/* Order Details Card */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg p-6 space-y-4 mb-6">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Order Number</span>
            <span className="font-mono font-bold text-gray-900">{orderNumber}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Total Amount</span>
            <span className="text-xl font-bold text-green-600">{formatCurrency(total)}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Payment Method</span>
            <span className="font-medium text-gray-900">
              {paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Payment Status</span>
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
              paymentStatus === 'paid' 
                ? 'bg-green-600 text-white' 
                : 'bg-yellow-500 text-white'
            }`}>
              {paymentStatus === 'paid' ? '✓ Paid' : '⏳ Pending'}
            </span>
          </div>
        </div>

        {/* Email Notification */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-start gap-3">
          <Mail className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm text-blue-900 font-medium">Order confirmation sent!</p>
            <p className="text-sm text-blue-700 mt-1">
              We've sent the order details to <strong>{customerEmail}</strong>
            </p>
            {paymentStatus === 'pending' && paymentMethod === 'cod' && (
              <p className="text-sm text-blue-700 mt-2">
                💡 You can also pay online by clicking the "Pay Now" button in your email
              </p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button 
            onClick={() => router.push('/account/orders')}
            className="w-full bg-green-600 hover:bg-green-700 text-white"
            size="lg"
          >
            <Package className="mr-2 h-5 w-5" />
            View Order Details
          </Button>
          
          <Button 
            onClick={() => router.push('/')}
            variant="outline"
            className="w-full"
            size="lg"
          >
            Continue Shopping
          </Button>
        </div>

        {/* Additional Info */}
        <div className="mt-6 text-center text-sm text-gray-500 space-y-1">
          <p>Thank you for shopping with Cradlix!</p>
          <p>We'll notify you when your order ships.</p>
        </div>
      </div>
    </div>
  )
}
