import { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { 
  XCircle, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  Ban, 
  RefreshCw,
  Phone,
  Mail,
  Info
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Cancellation Policy | Baby Products Ecommerce',
  description: 'Learn about our order cancellation policy, timeframes, refund process, and how to cancel your order.',
  keywords: 'cancellation policy, order cancellation, cancel order, refund policy, order modifications',
};

export default function CancellationPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex justify-center mb-4">
            <div className="bg-red-100 p-4 rounded-full">
              <XCircle className="h-12 w-12 text-red-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Cancellation Policy
          </h1>
          <p className="text-lg text-gray-600">
            Easy cancellation process with full transparency
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Last Updated: January 2025
          </p>
        </div>

        {/* Quick Overview Alert */}
        <Alert className="mb-8 border-blue-200 bg-blue-50">
          <Info className="h-5 w-5 text-blue-600" />
          <AlertDescription className="ml-2">
            <div className="space-y-2">
              <p className="font-semibold text-blue-900">Key Points:</p>
              <ul className="list-disc list-inside space-y-1 text-blue-800 text-sm">
                <li><strong>Free cancellation</strong> within 1 hour of order placement</li>
                <li><strong>Full refund</strong> if cancelled before shipment</li>
                <li><strong>No cancellation</strong> once order is shipped</li>
                <li><strong>COD orders</strong> can be cancelled anytime before delivery</li>
                <li><strong>Refunds processed</strong> within 5-7 business days</li>
              </ul>
            </div>
          </AlertDescription>
        </Alert>

        {/* Section 1: Cancellation Timeframes */}
        <Card className="mb-6 shadow-lg border-t-4 border-t-blue-500">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Clock className="h-6 w-6 text-blue-600" />
              Cancellation Timeframes
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            {/* Within 1 Hour */}
            <div className="border-l-4 border-green-500 pl-4 py-2 bg-green-50 rounded-r-lg">
              <h3 className="font-bold text-lg text-green-900 mb-2 flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Within 1 Hour of Order Placement
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">✓</span>
                  <span><strong>Instant cancellation:</strong> Cancel your order directly from your account dashboard</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">✓</span>
                  <span><strong>100% refund:</strong> Full amount refunded immediately to original payment method</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">✓</span>
                  <span><strong>No questions asked:</strong> Simple one-click cancellation process</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">✓</span>
                  <span><strong>No cancellation fee:</strong> Completely free to cancel</span>
                </li>
              </ul>
            </div>

            {/* Before Shipment */}
            <div className="border-l-4 border-yellow-500 pl-4 py-2 bg-yellow-50 rounded-r-lg">
              <h3 className="font-bold text-lg text-yellow-900 mb-2 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                After 1 Hour but Before Shipment
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-yellow-600 mt-1">•</span>
                  <span><strong>Contact required:</strong> Email or call customer support to request cancellation</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-600 mt-1">•</span>
                  <span><strong>Subject to approval:</strong> We'll check if order has been processed for shipment</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-600 mt-1">•</span>
                  <span><strong>Full refund (if approved):</strong> 100% amount returned if not yet shipped</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-600 mt-1">•</span>
                  <span><strong>Response time:</strong> We'll respond within 2-4 hours during business hours</span>
                </li>
              </ul>
            </div>

            {/* After Shipment */}
            <div className="border-l-4 border-red-500 pl-4 py-2 bg-red-50 rounded-r-lg">
              <h3 className="font-bold text-lg text-red-900 mb-2 flex items-center gap-2">
                <Ban className="h-5 w-5" />
                After Order Has Been Shipped
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-red-600 mt-1">✗</span>
                  <span><strong>No cancellation:</strong> Orders cannot be cancelled once shipped</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 mt-1">✗</span>
                  <span><strong>Return instead:</strong> You may return the product after delivery (refer to our Return Policy)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 mt-1">✗</span>
                  <span><strong>Tracking available:</strong> Monitor your order status via tracking link sent to your email</span>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Section 2: How to Cancel Your Order */}
        <Card className="mb-6 shadow-lg border-t-4 border-t-purple-500">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
            <CardTitle className="flex items-center gap-2 text-2xl">
              <RefreshCw className="h-6 w-6 text-purple-600" />
              How to Cancel Your Order
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-6">
              {/* Method 1: Self-Service */}
              <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
                <h3 className="font-bold text-lg mb-3 text-gray-900">
                  Method 1: Self-Service (Within 1 Hour)
                </h3>
                <ol className="space-y-3 text-gray-700">
                  <li className="flex gap-3">
                    <span className="font-bold text-purple-600 flex-shrink-0">1.</span>
                    <span><strong>Log in</strong> to your account at <Link href="/account" className="text-blue-600 hover:underline">Your Account</Link></span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-bold text-purple-600 flex-shrink-0">2.</span>
                    <span><strong>Go to "My Orders"</strong> section and find your recent order</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-bold text-purple-600 flex-shrink-0">3.</span>
                    <span><strong>Click "Cancel Order"</strong> button next to the order (available only within 1 hour)</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-bold text-purple-600 flex-shrink-0">4.</span>
                    <span><strong>Confirm cancellation</strong> and receive instant confirmation email</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-bold text-purple-600 flex-shrink-0">5.</span>
                    <span><strong>Refund initiated</strong> automatically to your original payment method</span>
                  </li>
                </ol>
              </div>

              {/* Method 2: Contact Support */}
              <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
                <h3 className="font-bold text-lg mb-3 text-gray-900">
                  Method 2: Contact Customer Support (After 1 Hour)
                </h3>
                <ol className="space-y-3 text-gray-700">
                  <li className="flex gap-3">
                    <span className="font-bold text-purple-600 flex-shrink-0">1.</span>
                    <span><strong>Email us</strong> at <a href="mailto:support@babyproducts.com" className="text-blue-600 hover:underline">support@babyproducts.com</a></span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-bold text-purple-600 flex-shrink-0">2.</span>
                    <span><strong>Call us</strong> at <a href="tel:+911234567890" className="text-blue-600 hover:underline">+91-1234567890</a> (Mon-Sat, 9 AM - 6 PM)</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-bold text-purple-600 flex-shrink-0">3.</span>
                    <span><strong>Provide order details:</strong> Order ID, registered email, and reason for cancellation</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-bold text-purple-600 flex-shrink-0">4.</span>
                    <span><strong>Wait for confirmation:</strong> We'll check shipment status and confirm cancellation eligibility</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-bold text-purple-600 flex-shrink-0">5.</span>
                    <span><strong>Receive cancellation email</strong> with refund timeline details</span>
                  </li>
                </ol>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 3: Refund Process */}
        <Card className="mb-6 shadow-lg border-t-4 border-t-green-500">
          <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
            <CardTitle className="flex items-center gap-2 text-2xl">
              <RefreshCw className="h-6 w-6 text-green-600" />
              Refund Process After Cancellation
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <p className="text-gray-700 mb-4">
                Once your cancellation is confirmed, refunds are processed as follows:
              </p>

              {/* Refund Timeline Table */}
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300 text-sm">
                  <thead>
                    <tr className="bg-gradient-to-r from-green-100 to-emerald-100">
                      <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Payment Method</th>
                      <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Refund Timeline</th>
                      <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Refund Mode</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-3 font-medium">Credit/Debit Card</td>
                      <td className="border border-gray-300 px-4 py-3">5-7 business days</td>
                      <td className="border border-gray-300 px-4 py-3">Original card</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-3 font-medium">Net Banking</td>
                      <td className="border border-gray-300 px-4 py-3">5-7 business days</td>
                      <td className="border border-gray-300 px-4 py-3">Original bank account</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-3 font-medium">UPI (GPay, PhonePe, Paytm)</td>
                      <td className="border border-gray-300 px-4 py-3">5-7 business days</td>
                      <td className="border border-gray-300 px-4 py-3">Original UPI ID</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-3 font-medium">Wallet (Paytm, Amazon Pay)</td>
                      <td className="border border-gray-300 px-4 py-3">5-7 business days</td>
                      <td className="border border-gray-300 px-4 py-3">Original wallet</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-3 font-medium">Cash on Delivery (COD)</td>
                      <td className="border border-gray-300 px-4 py-3">N/A (No payment made)</td>
                      <td className="border border-gray-300 px-4 py-3">No refund needed</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <Alert className="mt-6 border-green-200 bg-green-50">
                <Info className="h-4 w-4 text-green-600" />
                <AlertDescription className="ml-2 text-green-800">
                  <strong>Note:</strong> Refund timelines may vary depending on your bank's processing time. You'll receive a confirmation email once the refund is initiated from our end.
                </AlertDescription>
              </Alert>
            </div>
          </CardContent>
        </Card>

        {/* Section 4: COD Order Cancellation */}
        <Card className="mb-6 shadow-lg border-t-4 border-t-orange-500">
          <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50">
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Ban className="h-6 w-6 text-orange-600" />
              Cash on Delivery (COD) Orders
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <p className="text-gray-700">
                Special cancellation rules apply to COD orders:
              </p>

              <div className="bg-orange-50 p-5 rounded-lg border border-orange-200">
                <h3 className="font-bold text-lg mb-3 text-orange-900">COD Cancellation Benefits:</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600 mt-1">✓</span>
                    <span><strong>Cancel anytime before delivery:</strong> No payment made yet, so easier cancellation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600 mt-1">✓</span>
                    <span><strong>Refuse at doorstep:</strong> Simply refuse to accept the order when delivery agent arrives</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600 mt-1">✓</span>
                    <span><strong>No refund hassle:</strong> Since payment hasn't been made, no refund processing needed</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600 mt-1">✓</span>
                    <span><strong>Order automatically cancelled:</strong> Refused orders are marked as cancelled in system</span>
                  </li>
                </ul>
              </div>

              <Alert className="border-red-200 bg-red-50">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <AlertDescription className="ml-2 text-red-800">
                  <strong>Important:</strong> Multiple cancellations or refusals (more than 3 in 30 days) may lead to restrictions on future COD orders. Please order responsibly.
                </AlertDescription>
              </Alert>
            </div>
          </CardContent>
        </Card>

        {/* Section 5: Non-Cancellable Items */}
        <Card className="mb-6 shadow-lg border-t-4 border-t-red-500">
          <CardHeader className="bg-gradient-to-r from-red-50 to-rose-50">
            <CardTitle className="flex items-center gap-2 text-2xl">
              <XCircle className="h-6 w-6 text-red-600" />
              Non-Cancellable Items
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <p className="text-gray-700 mb-4">
                The following items cannot be cancelled once the order is confirmed:
              </p>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                  <h4 className="font-semibold text-red-900 mb-2">Customized Products</h4>
                  <p className="text-sm text-gray-700">
                    Items with personalized names, engravings, or custom designs cannot be cancelled as they are made specifically for you.
                  </p>
                </div>

                <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                  <h4 className="font-semibold text-red-900 mb-2">Combo/Bundle Packs</h4>
                  <p className="text-sm text-gray-700">
                    Special combo offers or bundle packs cannot be partially cancelled. You must cancel the entire order.
                  </p>
                </div>

                <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                  <h4 className="font-semibold text-red-900 mb-2">Flash Sale Items</h4>
                  <p className="text-sm text-gray-700">
                    Products purchased during flash sales or limited-time offers may have stricter cancellation policies (cancellation window reduced to 30 minutes).
                  </p>
                </div>

                <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                  <h4 className="font-semibold text-red-900 mb-2">International Orders</h4>
                  <p className="text-sm text-gray-700">
                    Orders shipped internationally cannot be cancelled once customs documentation is prepared (usually within 24 hours).
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 6: Cancellation Confirmation */}
        <Card className="mb-6 shadow-lg border-t-4 border-t-blue-500">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50">
            <CardTitle className="flex items-center gap-2 text-2xl">
              <CheckCircle className="h-6 w-6 text-blue-600" />
              What Happens After Cancellation?
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-5 rounded-lg border border-blue-200">
                <h3 className="font-bold text-lg mb-3 text-blue-900">You'll Receive:</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">📧</span>
                    <span><strong>Cancellation Confirmation Email:</strong> Sent immediately with cancellation ID</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">📱</span>
                    <span><strong>SMS Notification:</strong> Order cancellation alert to your registered mobile number</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">💳</span>
                    <span><strong>Refund Confirmation Email:</strong> Once refund is initiated (with expected credit date)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">📊</span>
                    <span><strong>Account Dashboard Update:</strong> Order status changes to "Cancelled" in your account</span>
                  </li>
                </ul>
              </div>

              <div className="bg-gray-50 p-5 rounded-lg border border-gray-300">
                <h3 className="font-bold text-lg mb-3 text-gray-900">Refund Amount Details:</h3>
                <p className="text-gray-700 mb-3">Your refund will include:</p>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">✓</span>
                    <span>Product price (100% refunded)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">✓</span>
                    <span>Shipping charges (if applicable)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">✓</span>
                    <span>Any discount or coupon value used</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 mt-1">✗</span>
                    <span>Payment gateway charges (₹3-5) may be deducted by bank</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 7: FAQ */}
        <Card className="mb-6 shadow-lg border-t-4 border-t-indigo-500">
          <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50">
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Info className="h-6 w-6 text-indigo-600" />
              Frequently Asked Questions
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-5">
              <div className="border-b border-gray-200 pb-4">
                <h4 className="font-semibold text-gray-900 mb-2">Q: Can I modify my order instead of cancelling?</h4>
                <p className="text-gray-700 text-sm">
                  A: Yes! Within the first hour, you can modify your order (change address, add/remove items) by contacting customer support. After 1 hour, you'll need to cancel and place a new order.
                </p>
              </div>

              <div className="border-b border-gray-200 pb-4">
                <h4 className="font-semibold text-gray-900 mb-2">Q: What if I cancel multiple orders frequently?</h4>
                <p className="text-gray-700 text-sm">
                  A: We understand plans change! However, more than 5 cancellations in 30 days may trigger a review of your account. We may temporarily restrict COD orders to prevent abuse.
                </p>
              </div>

              <div className="border-b border-gray-200 pb-4">
                <h4 className="font-semibold text-gray-900 mb-2">Q: My refund hasn't arrived. What should I do?</h4>
                <p className="text-gray-700 text-sm">
                  A: Refunds can take 5-7 business days. If it's been longer, please check with your bank first (sometimes they hold refunds). If still not received, contact us with your Order ID and cancellation confirmation email.
                </p>
              </div>

              <div className="border-b border-gray-200 pb-4">
                <h4 className="font-semibold text-gray-900 mb-2">Q: Can I cancel part of my order?</h4>
                <p className="text-gray-700 text-sm">
                  A: Yes, partial cancellation is possible within the 1-hour window. Go to your order details and select specific items to cancel. After 1 hour, contact support for partial cancellations.
                </p>
              </div>

              <div className="pb-2">
                <h4 className="font-semibold text-gray-900 mb-2">Q: Will I get my coupon code back after cancellation?</h4>
                <p className="text-gray-700 text-sm">
                  A: Unfortunately, coupon codes are single-use and cannot be reissued. However, if you used a wallet or gift card, that amount will be credited back to your wallet within 24 hours.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Section */}
        <Card className="shadow-xl border-t-4 border-t-blue-600 bg-gradient-to-br from-blue-50 via-white to-purple-50">
          <CardContent className="pt-8 pb-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Need Help with Cancellation?
              </h2>
              <p className="text-gray-600">
                Our customer support team is here to assist you
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
              <a 
                href="mailto:support@babyproducts.com"
                className="flex items-center gap-4 p-5 bg-white rounded-lg border-2 border-blue-200 hover:border-blue-400 transition-all hover:shadow-lg group"
              >
                <div className="bg-blue-100 p-3 rounded-full group-hover:bg-blue-200 transition-colors">
                  <Mail className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Email Support</p>
                  <p className="text-sm text-gray-600">support@babyproducts.com</p>
                  <p className="text-xs text-gray-500 mt-1">Response within 2-4 hours</p>
                </div>
              </a>

              <a 
                href="tel:+911234567890"
                className="flex items-center gap-4 p-5 bg-white rounded-lg border-2 border-green-200 hover:border-green-400 transition-all hover:shadow-lg group"
              >
                <div className="bg-green-100 p-3 rounded-full group-hover:bg-green-200 transition-colors">
                  <Phone className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Phone Support</p>
                  <p className="text-sm text-gray-600">+91-1234567890</p>
                  <p className="text-xs text-gray-500 mt-1">Mon-Sat, 9 AM - 6 PM IST</p>
                </div>
              </a>
            </div>

            <div className="flex justify-center gap-4 mt-8">
              <Button asChild variant="outline" className="border-2">
                <Link href="/faqs">View FAQs</Link>
              </Button>
              <Button asChild variant="outline" className="border-2">
                <Link href="/refund-request">Request Refund</Link>
              </Button>
              <Button asChild className="bg-blue-600 hover:bg-blue-700">
                <Link href="/account">My Orders</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Footer Note */}
        <div className="mt-8 text-center text-sm text-gray-600 bg-gray-50 p-6 rounded-lg border border-gray-200">
          <p className="mb-2">
            <strong>Note:</strong> This cancellation policy is subject to change. We recommend reviewing it periodically.
          </p>
          <p>
            By placing an order on our website, you agree to our{' '}
            <Link href="/terms-conditions" className="text-blue-600 hover:underline font-medium">
              Terms & Conditions
            </Link>
            {' '}and{' '}
            <Link href="/privacy-policy" className="text-blue-600 hover:underline font-medium">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
