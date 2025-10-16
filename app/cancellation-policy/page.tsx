import { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { 
  XCircle, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Ban, 
  RefreshCw,
  Phone,
  Mail,
  Info,
  Package,
  Shield
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Cancellation Policy - Cradlix',
  description: 'Understand our order cancellation policy, timelines, refund procedures, and how to cancel your order effectively.',
  keywords: 'cancellation policy, order cancellation, cancel order, refund policy, order modifications, return policy',
};

export default function CancellationPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
            <XCircle className="h-8 w-8 text-red-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Cancellation Policy
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Flexible cancellation options with transparent refund processes
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Last Updated: October 16, 2025
          </p>
        </div>

        {/* Quick Overview Alert */}
        <Alert className="mb-8 border-primary/30 bg-primary/5">
          <CheckCircle2 className="h-5 w-5 text-primary" />
          <AlertTitle className="text-lg">Quick Overview</AlertTitle>
          <AlertDescription className="mt-2">
            <ul className="space-y-1 text-sm">
              <li>✅ Cancel orders within 1 hour - instant cancellation</li>
              <li>✅ Full refund if cancelled before dispatch</li>
              <li>✅ Refunds processed in 5-7 business days</li>
              <li>✅ COD orders can be cancelled anytime before delivery</li>
              <li>✅ Easy cancellation from your account dashboard</li>
            </ul>
          </AlertDescription>
        </Alert>

        {/* Overview Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5 text-primary" />
              1. Cancellation Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700">
              We understand that circumstances change. Our cancellation policy is designed to provide you flexibility while maintaining service quality. You can cancel your order at different stages with varying procedures.
            </p>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">Why We Have This Policy</h3>
              <ul className="space-y-1 text-sm text-blue-800 ml-4 list-disc">
                <li>To ensure fair treatment for all customers</li>
                <li>To manage inventory and logistics efficiently</li>
                <li>To prevent misuse of services while maintaining flexibility</li>
                <li>To provide transparent refund processes</li>
              </ul>
            </div>

            <p className="text-sm text-gray-600">
              <strong>Important:</strong> This policy applies to all orders placed through our website or mobile application. Special promotional offers may have specific cancellation terms mentioned at the time of purchase.
            </p>
          </CardContent>
        </Card>

        {/* Cancellation Timeframes */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              2. When Can You Cancel?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 gap-4">
              {/* Within 1 Hour */}
              <div className="border-l-4 border-green-500 bg-green-50 p-4 rounded-r-lg">
                <div className="flex items-start gap-3 mb-3">
                  <CheckCircle2 className="h-6 w-6 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-lg text-green-900">
                      Within 1 Hour of Order Placement
                    </h3>
                    <p className="text-green-700 text-sm mt-1">Self-service cancellation available</p>
                  </div>
                </div>
                <ul className="space-y-2 text-gray-700 text-sm ml-9">
                  <li><strong>How:</strong> Cancel directly from your account - no approval needed</li>
                  <li><strong>Refund:</strong> 100% amount refunded to original payment source</li>
                  <li><strong>Processing Time:</strong> Instant cancellation confirmation</li>
                  <li><strong>Charges:</strong> No cancellation fee</li>
                </ul>
              </div>

              {/* Before Dispatch */}
              <div className="border-l-4 border-yellow-500 bg-yellow-50 p-4 rounded-r-lg">
                <div className="flex items-start gap-3 mb-3">
                  <AlertTriangle className="h-6 w-6 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-lg text-yellow-900">
                      After 1 Hour but Before Dispatch
                    </h3>
                    <p className="text-yellow-700 text-sm mt-1">Requires customer support assistance</p>
                  </div>
                </div>
                <ul className="space-y-2 text-gray-700 text-sm ml-9">
                  <li><strong>How:</strong> Contact customer support with order details</li>
                  <li><strong>Refund:</strong> Full refund if order not yet dispatched</li>
                  <li><strong>Processing Time:</strong> Response within 2-4 hours</li>
                  <li><strong>Approval:</strong> Subject to order processing status</li>
                </ul>
              </div>

              {/* After Dispatch */}
              <div className="border-l-4 border-red-500 bg-red-50 p-4 rounded-r-lg">
                <div className="flex items-start gap-3 mb-3">
                  <Ban className="h-6 w-6 text-red-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-lg text-red-900">
                      After Dispatch/In Transit
                    </h3>
                    <p className="text-red-700 text-sm mt-1">Cancellation not available</p>
                  </div>
                </div>
                <ul className="space-y-2 text-gray-700 text-sm ml-9">
                  <li><strong>Status:</strong> Orders cannot be cancelled once shipped</li>
                  <li><strong>Alternative:</strong> Use our return policy after receiving the product</li>
                  <li><strong>Exception:</strong> COD orders can be refused at delivery</li>
                  <li><strong>Tracking:</strong> Monitor delivery via tracking link in email/SMS</li>
                </ul>
              </div>
            </div>

            <Alert className="border-gray-300 bg-gray-50 mt-4">
              <Info className="h-4 w-4 text-gray-600" />
              <AlertDescription className="text-gray-700 text-sm ml-2">
                <strong>Order Status Guide:</strong> Orders go through stages: Order Confirmed → Processing → Packed → Dispatched → In Transit → Out for Delivery → Delivered. Cancellation is possible only during the first two stages.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* How to Cancel */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5 text-primary" />
              3. How to Cancel Your Order
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Self-Service Method */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-5">
              <h3 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                Method 1: Self-Service Cancellation (Within 1 Hour)
              </h3>
              <div className="space-y-3">
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                  <p className="text-gray-700 text-sm"><strong>Sign in</strong> to your account at <Link href="/account" className="text-primary hover:underline">Your Account</Link></p>
                </div>
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                  <p className="text-gray-700 text-sm"><strong>Navigate</strong> to "Orders" section from the menu</p>
                </div>
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                  <p className="text-gray-700 text-sm"><strong>Locate</strong> the order you wish to cancel</p>
                </div>
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">4</div>
                  <p className="text-gray-700 text-sm"><strong>Click</strong> on "Cancel Order" button (available only within 1 hour)</p>
                </div>
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">5</div>
                  <p className="text-gray-700 text-sm"><strong>Select</strong> cancellation reason from the dropdown menu</p>
                </div>
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">6</div>
                  <p className="text-gray-700 text-sm"><strong>Confirm</strong> cancellation and receive instant email notification</p>
                </div>
              </div>
              <p className="text-xs text-green-800 mt-4 bg-green-100 p-2 rounded">
                💡 <strong>Tip:</strong> Cancellation is processed immediately. You'll receive a confirmation email within minutes.
              </p>
            </div>

            {/* Customer Support Method */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-5">
              <h3 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
                <Phone className="h-5 w-5 text-blue-600" />
                Method 2: Contact Customer Support (After 1 Hour)
              </h3>
              <div className="space-y-3">
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                  <div className="text-gray-700 text-sm">
                    <p className="mb-1"><strong>Contact Options:</strong></p>
                    <ul className="ml-4 space-y-1 text-sm">
                      <li>• Email: <a href="mailto:support@cradlix.com" className="text-primary hover:underline">support@cradlix.com</a></li>
                      <li>• Phone: <a href="tel:+911234567890" className="text-primary hover:underline">+91-1234567890</a> (Mon-Sat, 9 AM - 6 PM IST)</li>
                    </ul>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                  <p className="text-gray-700 text-sm"><strong>Provide</strong> your Order ID, registered email, and contact number</p>
                </div>
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                  <p className="text-gray-700 text-sm"><strong>Mention</strong> reason for cancellation request</p>
                </div>
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">4</div>
                  <p className="text-gray-700 text-sm"><strong>Wait</strong> for our team to verify order dispatch status</p>
                </div>
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">5</div>
                  <p className="text-gray-700 text-sm"><strong>Receive</strong> cancellation confirmation via email (if approved)</p>
                </div>
              </div>
              <p className="text-xs text-blue-800 mt-4 bg-blue-100 p-2 rounded">
                ⏱️ <strong>Response Time:</strong> We respond to cancellation requests within 2-4 hours during business hours.
              </p>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2 text-sm flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                Information Required for Cancellation:
              </h4>
              <ul className="space-y-1 text-sm text-gray-700 ml-6 list-disc">
                <li>Order ID (found in confirmation email)</li>
                <li>Registered email address or phone number</li>
                <li>Reason for cancellation (optional but helpful)</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Refund Process */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5 text-primary" />
              4. Refund Process & Timeline
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700">
              Once your cancellation request is approved, refunds are initiated according to the payment method used during purchase. All refunds are processed securely through Razorpay, our trusted payment gateway partner.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Payment Method</th>
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Refund Timeline</th>
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Refund Destination</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-3 font-medium">Credit Card</td>
                    <td className="border border-gray-300 px-4 py-3">5-7 business days</td>
                    <td className="border border-gray-300 px-4 py-3">Original credit card</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-3 font-medium">Debit Card</td>
                    <td className="border border-gray-300 px-4 py-3">5-7 business days</td>
                    <td className="border border-gray-300 px-4 py-3">Original debit card/bank account</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-3 font-medium">Net Banking</td>
                    <td className="border border-gray-300 px-4 py-3">5-7 business days</td>
                    <td className="border border-gray-300 px-4 py-3">Original bank account</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-3 font-medium">UPI (GPay, PhonePe, Paytm)</td>
                    <td className="border border-gray-300 px-4 py-3">5-7 business days</td>
                    <td className="border border-gray-300 px-4 py-3">Source UPI ID/linked account</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-3 font-medium">Digital Wallets</td>
                    <td className="border border-gray-300 px-4 py-3">5-7 business days</td>
                    <td className="border border-gray-300 px-4 py-3">Original wallet account</td>
                  </tr>
                  <tr className="bg-green-50">
                    <td className="border border-gray-300 px-4 py-3 font-medium">Cash on Delivery (COD)</td>
                    <td className="border border-gray-300 px-4 py-3">Not applicable</td>
                    <td className="border border-gray-300 px-4 py-3">No refund (no payment made)</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2 text-sm flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  What's Included in Refund
                </h4>
                <ul className="space-y-1 text-sm text-blue-800 ml-4 list-disc">
                  <li>Full product price</li>
                  <li>Applicable taxes</li>
                  <li>Shipping charges (if paid)</li>
                  <li>Promotional discounts maintained</li>
                </ul>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <h4 className="font-semibold text-amber-900 mb-2 text-sm flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  Possible Deductions
                </h4>
                <ul className="space-y-1 text-sm text-amber-800 ml-4 list-disc">
                  <li>Bank processing charges (₹2-5)</li>
                  <li>Razorpay payment gateway fees (minimal)</li>
                  <li>Currency conversion fees (if applicable)</li>
                </ul>
              </div>
            </div>

            <Alert className="border-gray-300 bg-gray-50">
              <Info className="h-4 w-4 text-gray-600" />
              <AlertDescription className="text-gray-700 text-sm ml-2">
                <strong>Please Note:</strong> Refund timelines depend on your bank's processing schedule. While we initiate refunds immediately, banks may take additional time to credit your account. If you don't receive your refund within the stated timeframe, please contact your bank first before reaching out to us.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* COD Orders */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              5. Cash on Delivery (COD) Orders
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700">
              COD orders have flexible cancellation options since payment hasn't been processed yet.
            </p>

            <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-lg p-5">
              <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-orange-600" />
                COD Cancellation Options
              </h3>
              <div className="space-y-3 text-gray-700 text-sm">
                <div className="flex items-start gap-2">
                  <span className="text-orange-600 mt-0.5">•</span>
                  <p><strong>Before Dispatch:</strong> Cancel through your account or contact customer support</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-orange-600 mt-0.5">•</span>
                  <p><strong>After Dispatch:</strong> You can refuse the delivery at your doorstep</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-orange-600 mt-0.5">•</span>
                  <p><strong>At Delivery:</strong> Simply inform the delivery partner you're refusing the order</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-orange-600 mt-0.5">•</span>
                  <p><strong>No Refund Needed:</strong> Since no payment was made, there's no refund process</p>
                </div>
              </div>
            </div>

            <Alert className="border-red-200 bg-red-50">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800 text-sm ml-2">
                <strong>Fair Usage Policy:</strong> Excessive cancellations or refusals (more than 3 times in a 30-day period) may result in restrictions on future COD orders. We request customers to order responsibly to help us maintain this service for everyone.
              </AlertDescription>
            </Alert>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2 text-sm">How Refusals Are Processed:</h4>
              <ol className="space-y-1 text-sm text-gray-700 ml-5 list-decimal">
                <li>Order is returned to our warehouse</li>
                <li>We verify the product condition</li>
                <li>Order status is updated to "Cancelled" in your account</li>
                <li>You receive a confirmation email</li>
              </ol>
            </div>
          </CardContent>
        </Card>

        {/* Non-Cancellable Items */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Ban className="h-5 w-5 text-primary" />
              6. Non-Cancellable / Restricted Items
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700">
              Certain product categories may have specific cancellation restrictions due to their nature:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border-l-4 border-red-500 bg-red-50 p-4 rounded-r-lg">
                <h4 className="font-semibold text-red-900 mb-2">Personalized Products</h4>
                <p className="text-sm text-gray-700">
                  Items with custom names, engravings, or specific designs cannot be cancelled after production begins (typically 2 hours after order).
                </p>
              </div>

              <div className="border-l-4 border-red-500 bg-red-50 p-4 rounded-r-lg">
                <h4 className="font-semibold text-red-900 mb-2">Combo Offers</h4>
                <p className="text-sm text-gray-700">
                  Bundle deals and combo packs cannot be partially cancelled. Entire order must be cancelled if needed.
                </p>
              </div>

              <div className="border-l-4 border-red-500 bg-red-50 p-4 rounded-r-lg">
                <h4 className="font-semibold text-red-900 mb-2">Flash Sale Items</h4>
                <p className="text-sm text-gray-700">
                  Products bought during limited-time sales have reduced cancellation window (30 minutes only).
                </p>
              </div>

              <div className="border-l-4 border-red-500 bg-red-50 p-4 rounded-r-lg">
                <h4 className="font-semibold text-red-900 mb-2">Pre-Order Items</h4>
                <p className="text-sm text-gray-700">
                  Pre-ordered products can be cancelled up to 48 hours before expected dispatch date.
                </p>
              </div>
            </div>

            <p className="text-xs text-gray-600 bg-gray-100 p-3 rounded">
              <strong>Note:</strong> Special cancellation terms, if applicable, will be clearly mentioned on the product page and during checkout.
            </p>
          </CardContent>
        </Card>

        {/* Post-Cancellation */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-primary" />
              7. After Cancellation Confirmation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700">
              Once your cancellation is processed, here's what you can expect:
            </p>

            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-5">
              <h3 className="font-bold text-gray-900 mb-3">You Will Receive:</h3>
              <div className="space-y-2 text-gray-700 text-sm">
                <div className="flex items-start gap-3">
                  <Mail className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <p><strong>Email Notification:</strong> Cancellation confirmation with reference number</p>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <p><strong>SMS Alert:</strong> Order cancellation update to your registered mobile</p>
                </div>
                <div className="flex items-start gap-3">
                  <RefreshCw className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <p><strong>Refund Initiation Email:</strong> Details about refund amount and timeline</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <p><strong>Account Update:</strong> Order status changed to "Cancelled" in your dashboard</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2 text-sm">Refund Breakdown</h4>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li className="flex items-center gap-2">
                    <span className="text-green-600">✓</span>
                    <span>Product cost (100%)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-600">✓</span>
                    <span>Applicable taxes</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-600">✓</span>
                    <span>Shipping charges (if paid)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-600">✓</span>
                    <span>Discount/coupon value</span>
                  </li>
                </ul>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <h4 className="font-semibold text-amber-900 mb-2 text-sm">Not Refunded</h4>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li className="flex items-center gap-2">
                    <span className="text-red-600">✗</span>
                    <span>Razorpay gateway charges</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-red-600">✗</span>
                    <span>Bank processing fees</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-red-600">✗</span>
                    <span>Convenience charges (minimal)</span>
                  </li>
                </ul>
              </div>
            </div>

            <p className="text-xs text-gray-600 bg-gray-100 p-3 rounded">
              <strong>Tracking Your Refund:</strong> You can monitor refund status in the "My Orders" section of your account. For queries, use the cancellation reference number provided in the confirmation email.
            </p>
          </CardContent>
        </Card>

        {/* FAQ Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5 text-primary" />
              8. Frequently Asked Questions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="border-l-4 border-primary/30 pl-4 py-2">
                <h4 className="font-semibold text-gray-900 mb-1">Can I modify my order instead of cancelling it?</h4>
                <p className="text-gray-700 text-sm">
                  Yes, within the first hour you can modify shipping address or contact details by reaching our support team. For changes to products or quantities, you'll need to cancel and place a new order.
                </p>
              </div>

              <div className="border-l-4 border-primary/30 pl-4 py-2">
                <h4 className="font-semibold text-gray-900 mb-1">What if I cancel multiple orders frequently?</h4>
                <p className="text-gray-700 text-sm">
                  While we understand plans change, frequent cancellations (more than 5 in 30 days) may trigger a review of your account. We may temporarily limit COD options to maintain service quality for all customers.
                </p>
              </div>

              <div className="border-l-4 border-primary/30 pl-4 py-2">
                <h4 className="font-semibold text-gray-900 mb-1">Can I cancel part of my order?</h4>
                <p className="text-gray-700 text-sm">
                  Yes, partial cancellation is possible within 1 hour through your account dashboard. Select specific items you wish to cancel. After 1 hour, contact customer support for assistance.
                </p>
              </div>

              <div className="border-l-4 border-primary/30 pl-4 py-2">
                <h4 className="font-semibold text-gray-900 mb-1">My refund hasn't arrived yet. What should I do?</h4>
                <p className="text-gray-700 text-sm">
                  Refunds typically take 5-7 business days after cancellation confirmation. If delayed, first check with your bank as they may require additional processing time. If still not received after 10 business days, contact us with your order details.
                </p>
              </div>

              <div className="border-l-4 border-primary/30 pl-4 py-2">
                <h4 className="font-semibold text-gray-900 mb-1">Will my coupon code be returned after cancellation?</h4>
                <p className="text-gray-700 text-sm">
                  Single-use coupon codes cannot be reissued once applied. However, if you used store credit or gift cards, the amount will be restored to your account within 24 hours of cancellation.
                </p>
              </div>

              <div className="border-l-4 border-primary/30 pl-4 py-2">
                <h4 className="font-semibold text-gray-900 mb-1">Can I cancel an order placed using multiple payment methods?</h4>
                <p className="text-gray-700 text-sm">
                  Yes. When an order paid through multiple methods is cancelled, refunds are processed to each respective payment source proportionally.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Section */}
        <Card className="mb-6 border-2 border-primary/20">
          <CardContent className="pt-6">
            <div className="text-center mb-6">
              <Shield className="h-12 w-12 text-primary mx-auto mb-3" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Need Assistance with Cancellation?
              </h2>
              <p className="text-gray-600">
                Our customer support team is ready to help you
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto mb-6">
              <a 
                href="mailto:support@cradlix.com"
                className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border-2 border-blue-200 hover:border-blue-400 transition-all hover:shadow-md group"
              >
                <div className="bg-blue-100 p-3 rounded-full group-hover:bg-blue-200 transition-colors">
                  <Mail className="h-5 w-5 text-blue-600" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-gray-900 text-sm">Email Support</p>
                  <p className="text-xs text-gray-600">support@cradlix.com</p>
                  <p className="text-xs text-gray-500 mt-0.5">Response within 2-4 hours</p>
                </div>
              </a>

              <a 
                href="tel:+911234567890"
                className="flex items-center gap-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border-2 border-green-200 hover:border-green-400 transition-all hover:shadow-md group"
              >
                <div className="bg-green-100 p-3 rounded-full group-hover:bg-green-200 transition-colors">
                  <Phone className="h-5 w-5 text-green-600" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-gray-900 text-sm">Phone Support</p>
                  <p className="text-xs text-gray-600">+91-1234567890</p>
                  <p className="text-xs text-gray-500 mt-0.5">Mon-Sat, 9 AM - 6 PM IST</p>
                </div>
              </a>
            </div>

            <div className="flex flex-wrap justify-center gap-3">
              <Button asChild variant="outline" size="sm">
                <Link href="/faqs">View All FAQs</Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link href="/shipping-policy">Shipping Policy</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/account">My Orders</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Footer Note */}
        <div className="bg-gray-100 border border-gray-200 rounded-lg p-6 text-center text-sm text-gray-700">
          <p className="mb-3">
            <strong>Policy Updates:</strong> This cancellation policy is effective as of the last updated date mentioned above and may be modified at any time. We recommend reviewing this page periodically for any changes.
          </p>
          <p className="text-xs">
            By placing an order on our platform, you acknowledge that you have read, understood, and agree to this Cancellation Policy along with our{' '}
            <Link href="/terms-conditions" className="text-primary hover:underline font-medium">
              Terms & Conditions
            </Link>
            {', '}
            <Link href="/shipping-policy" className="text-primary hover:underline font-medium">
              Shipping Policy
            </Link>
            {', and '}
            <Link href="/privacy-policy" className="text-primary hover:underline font-medium">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}

