import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Truck, Package, MapPin, Clock, IndianRupee, Shield, CheckCircle2, AlertCircle, Phone, Mail } from 'lucide-react'
import Link from 'next/link'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

export const metadata = {
  title: 'Shipping Policy - Baby Store',
  description: 'Learn about our shipping methods, delivery times, charges, and tracking options.',
}

export default function ShippingPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
            <Truck className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Shipping Policy</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Fast, reliable, and secure delivery of your baby products across India
          </p>
          <p className="text-sm text-gray-500 mt-2">Last Updated: October 16, 2025</p>
        </div>

        {/* Quick Overview */}
        <Alert className="mb-8 border-primary/30 bg-primary/5">
          <CheckCircle2 className="h-5 w-5 text-primary" />
          <AlertTitle className="text-lg">Quick Overview</AlertTitle>
          <AlertDescription className="mt-2">
            <ul className="space-y-1 text-sm">
              <li>✅ Free shipping on orders above ₹399</li>
              <li>✅ Delivery within 3-5 business days (Standard)</li>
              <li>✅ Express delivery available in 1-2 days</li>
              <li>✅ Real-time order tracking</li>
              <li>✅ Cash on Delivery (COD) available</li>
            </ul>
          </AlertDescription>
        </Alert>

        {/* Shipping Coverage */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              1. Shipping Coverage
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Domestic Shipping (India)</h3>
              <p className="text-gray-700 mb-2">
                We currently ship to all serviceable locations across India. We deliver to all major cities, metros, tier-2, and tier-3 cities, as well as many rural areas.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <h4 className="font-medium text-green-900 mb-1 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4" />
                    Metro Cities
                  </h4>
                  <p className="text-sm text-green-800">Delhi, Mumbai, Bangalore, Chennai, Kolkata, Hyderabad, Pune, Ahmedabad, and more</p>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <h4 className="font-medium text-blue-900 mb-1 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4" />
                    Tier 2 & 3 Cities
                  </h4>
                  <p className="text-sm text-blue-800">Dehradun, Jaipur, Lucknow, Chandigarh, Indore, Bhopal, Coimbatore, and 1000+ cities</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">International Shipping</h3>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                <p className="text-gray-700 text-sm flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                  <span>Currently, we only ship within India. International shipping is coming soon! Subscribe to our newsletter to be notified when we launch international delivery.</span>
                </p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Non-Serviceable Areas</h3>
              <p className="text-gray-700 text-sm">
                Some remote areas and restricted locations may not be serviceable. You can check serviceability by entering your PIN code at checkout. If your location is not serviceable, we'll notify you before payment.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Delivery Timeframes */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              2. Delivery Timeframes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Standard Shipping */}
              <div className="border-2 border-primary/20 rounded-lg p-4 hover:border-primary/40 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg">Standard Shipping</h3>
                    <p className="text-primary font-medium">₹99 (Free above ₹399)</p>
                  </div>
                  <Package className="h-6 w-6 text-primary" />
                </div>
                <div className="space-y-2 text-sm text-gray-700">
                  <p className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span><strong>3-5 business days</strong></span>
                  </p>
                  <ul className="space-y-1 ml-6 list-disc">
                    <li>Metro cities: 3-4 days</li>
                    <li>Other cities: 4-5 days</li>
                    <li>Remote areas: 5-7 days</li>
                  </ul>
                </div>
              </div>

              {/* Express Shipping */}
              <div className="border-2 border-orange-200 rounded-lg p-4 hover:border-orange-400 transition-colors bg-orange-50">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg">Express Shipping</h3>
                    <p className="text-orange-600 font-medium">₹199</p>
                  </div>
                  <Truck className="h-6 w-6 text-orange-600" />
                </div>
                <div className="space-y-2 text-sm text-gray-700">
                  <p className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span><strong>1-2 business days</strong></span>
                  </p>
                  <ul className="space-y-1 ml-6 list-disc">
                    <li>Available for metro cities</li>
                    <li>Order before 2 PM for same-day dispatch</li>
                    <li>Subject to availability</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-gray-100 rounded-lg p-4 mt-4">
              <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-gray-600" />
                Important Notes:
              </h4>
              <ul className="space-y-1 text-sm text-gray-700 ml-6 list-disc">
                <li><strong>Business Days:</strong> Monday to Saturday (excluding Sundays and public holidays)</li>
                <li><strong>Order Processing:</strong> Orders placed before 2 PM are processed same day; after 2 PM are processed next business day</li>
                <li><strong>Remote Areas:</strong> May require additional 1-2 days</li>
                <li><strong>Weather/Unforeseen Events:</strong> Delivery may be delayed due to natural calamities, political unrest, or courier service issues</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Shipping Charges */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IndianRupee className="h-5 w-5 text-primary" />
              3. Shipping Charges
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Order Value</th>
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Standard Shipping</th>
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Express Shipping</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 px-4 py-3">Below ₹399</td>
                    <td className="border border-gray-300 px-4 py-3">₹99</td>
                    <td className="border border-gray-300 px-4 py-3">₹199</td>
                  </tr>
                  <tr className="bg-green-50">
                    <td className="border border-gray-300 px-4 py-3 font-medium">₹399 and above</td>
                    <td className="border border-gray-300 px-4 py-3 text-green-700 font-semibold">FREE ✨</td>
                    <td className="border border-gray-300 px-4 py-3">₹199</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-3">Remote locations (all orders)</td>
                    <td className="border border-gray-300 px-4 py-3" colSpan={2}>Additional ₹50-100 may apply</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2">💡 Pro Tip:</h4>
              <p className="text-sm text-blue-800">
                Add items worth ₹399 or more to your cart to enjoy <strong>FREE standard shipping</strong>! Save on delivery charges while getting more products for your baby.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Order Processing */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              4. Order Processing & Dispatch
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Processing Timeline</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-semibold">1</div>
                  <div>
                    <h4 className="font-medium text-gray-900">Order Confirmation</h4>
                    <p className="text-sm text-gray-600">Immediate email/SMS after successful payment</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-semibold">2</div>
                  <div>
                    <h4 className="font-medium text-gray-900">Order Processing</h4>
                    <p className="text-sm text-gray-600">0-24 hours (orders before 2 PM processed same day)</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-semibold">3</div>
                  <div>
                    <h4 className="font-medium text-gray-900">Dispatch & Tracking</h4>
                    <p className="text-sm text-gray-600">Tracking number sent via email/SMS within 24 hours of dispatch</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-semibold">4</div>
                  <div>
                    <h4 className="font-medium text-gray-900">Delivery</h4>
                    <p className="text-sm text-gray-600">As per selected shipping method (Standard: 3-5 days, Express: 1-2 days)</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">What Happens After Order Placement?</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>We verify your payment and order details</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Products are picked, quality-checked, and securely packaged</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Package is handed over to our courier partner</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>You receive tracking details to monitor delivery status</span>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Order Tracking */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              5. Order Tracking
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">How to Track Your Order</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border rounded-lg p-4 text-center">
                  <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl">📱</span>
                  </div>
                  <h4 className="font-medium text-gray-900 mb-1">Via Your Account</h4>
                  <p className="text-sm text-gray-600">Log in → My Orders → Track Order</p>
                </div>
                <div className="border rounded-lg p-4 text-center">
                  <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl">📧</span>
                  </div>
                  <h4 className="font-medium text-gray-900 mb-1">Via Email Link</h4>
                  <p className="text-sm text-gray-600">Click tracking link in shipping confirmation email</p>
                </div>
                <div className="border rounded-lg p-4 text-center">
                  <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl">💬</span>
                  </div>
                  <h4 className="font-medium text-gray-900 mb-1">Via SMS Link</h4>
                  <p className="text-sm text-gray-600">Click tracking link sent via SMS</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Tracking Status Explained</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-3 p-2 bg-blue-50 rounded">
                  <span className="font-medium text-blue-900 min-w-[140px]">Order Confirmed</span>
                  <span className="text-gray-700">Your order has been received and payment verified</span>
                </div>
                <div className="flex items-start gap-3 p-2 bg-yellow-50 rounded">
                  <span className="font-medium text-yellow-900 min-w-[140px]">Processing</span>
                  <span className="text-gray-700">Your order is being prepared for shipment</span>
                </div>
                <div className="flex items-start gap-3 p-2 bg-purple-50 rounded">
                  <span className="font-medium text-purple-900 min-w-[140px]">Shipped</span>
                  <span className="text-gray-700">Your order is on its way to you</span>
                </div>
                <div className="flex items-start gap-3 p-2 bg-orange-50 rounded">
                  <span className="font-medium text-orange-900 min-w-[140px]">Out for Delivery</span>
                  <span className="text-gray-700">Your order is with the delivery partner and will arrive today</span>
                </div>
                <div className="flex items-start gap-3 p-2 bg-green-50 rounded">
                  <span className="font-medium text-green-900 min-w-[140px]">Delivered</span>
                  <span className="text-gray-700">Your order has been successfully delivered</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cash on Delivery */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IndianRupee className="h-5 w-5 text-primary" />
              6. Cash on Delivery (COD)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">COD Availability</h3>
              <p className="text-gray-700 mb-3">
                Cash on Delivery is available for eligible orders. You can pay in cash at the time of delivery.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <h4 className="font-medium text-green-900 mb-2">✅ COD Available</h4>
                  <ul className="space-y-1 text-sm text-green-800">
                    <li>• Orders up to ₹25,000</li>
                    <li>• All serviceable PIN codes</li>
                    <li>• Verified customer addresses</li>
                  </ul>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <h4 className="font-medium text-red-900 mb-2">❌ COD Not Available</h4>
                  <ul className="space-y-1 text-sm text-red-800">
                    <li>• Orders above ₹25,000</li>
                    <li>• Remote/restricted locations</li>
                    <li>• During promotional sales (select items)</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">COD Charges</h3>
              <p className="text-gray-700 mb-2">A nominal COD handling fee of <strong>₹50</strong> is applicable on all Cash on Delivery orders.</p>
              <div className="bg-gray-100 rounded-lg p-3 text-sm">
                <p className="text-gray-700"><strong>Example:</strong></p>
                <p className="text-gray-700">Product Price: ₹1,500 + Shipping: ₹0 (Free) + COD Fee: ₹50 = <strong>Total: ₹1,550</strong></p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">COD Guidelines</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                  <span>Please keep exact change ready. Our delivery partner may not always have change.</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                  <span>Payment must be made in Indian Rupees (INR) only. Foreign currency and cheques are not accepted.</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                  <span>Refusal to pay or repeated failed delivery attempts may result in COD restriction on future orders.</span>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Packaging */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              7. Packaging & Product Safety
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700">
              We take utmost care in packaging your orders to ensure products reach you in perfect condition. Baby products require extra care, and we understand that!
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2">📦 Secure Packaging</h4>
                <ul className="space-y-1 text-sm text-blue-800">
                  <li>• High-quality corrugated boxes</li>
                  <li>• Bubble wrap for fragile items</li>
                  <li>• Sealed with tamper-proof tape</li>
                  <li>• Weatherproof outer covering</li>
                </ul>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-semibold text-green-900 mb-2">✅ Quality Checks</h4>
                <ul className="space-y-1 text-sm text-green-800">
                  <li>• Product inspection before packing</li>
                  <li>• Expiry date verification</li>
                  <li>• Safety seal checks</li>
                  <li>• Invoice and warranty cards included</li>
                </ul>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <p className="text-sm text-amber-900 flex items-start gap-2">
                <Shield className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span><strong>Damaged Package?</strong> If you receive a damaged package, please refuse delivery or take photos/videos before opening. Contact us immediately at support@babystore.com for replacement.</span>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Failed Delivery */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-primary" />
              8. Failed Delivery & Re-attempts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">What Happens If Delivery Fails?</h3>
              <p className="text-gray-700 mb-3">
                If our courier partner is unable to deliver your order, they will make multiple attempts to reach you.
              </p>
              <div className="space-y-3">
                <div className="border-l-4 border-blue-500 pl-4 py-2">
                  <h4 className="font-medium text-gray-900">Attempt 1</h4>
                  <p className="text-sm text-gray-600">First delivery attempt on scheduled date</p>
                </div>
                <div className="border-l-4 border-yellow-500 pl-4 py-2">
                  <h4 className="font-medium text-gray-900">Attempt 2</h4>
                  <p className="text-sm text-gray-600">Second attempt next business day (you'll receive SMS/call)</p>
                </div>
                <div className="border-l-4 border-orange-500 pl-4 py-2">
                  <h4 className="font-medium text-gray-900">Attempt 3</h4>
                  <p className="text-sm text-gray-600">Final attempt on third day (courier may request pickup)</p>
                </div>
                <div className="border-l-4 border-red-500 pl-4 py-2">
                  <h4 className="font-medium text-gray-900">After 3 Failed Attempts</h4>
                  <p className="text-sm text-gray-600">Order returned to us. You may be charged return shipping fees.</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Common Reasons for Failed Delivery</h3>
              <ul className="space-y-1 text-sm text-gray-700 list-disc ml-6">
                <li>Customer not available at delivery address</li>
                <li>Incomplete or incorrect address provided</li>
                <li>Customer refused to accept delivery</li>
                <li>Delivery location inaccessible</li>
                <li>Contact number not reachable</li>
              </ul>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2">💡 How to Avoid Failed Delivery:</h4>
              <ul className="space-y-1 text-sm text-blue-800">
                <li>✓ Provide complete and accurate delivery address with landmarks</li>
                <li>✓ Keep your phone reachable on delivery day</li>
                <li>✓ Track your order and be available during estimated delivery time</li>
                <li>✓ Update delivery instructions in your account if needed</li>
                <li>✓ Coordinate with courier partner via their SMS/call</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Contact Section */}
        <Card className="mb-6 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5 text-primary" />
              Need Shipping Help?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700">
              For any shipping-related queries, delivery issues, or tracking assistance, our customer support team is here to help!
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-900">Email Support</p>
                  <a href="mailto:support@babystore.com" className="text-primary hover:underline">
                    support@babystore.com
                  </a>
                  <p className="text-xs text-gray-600 mt-1">Response within 24 hours</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-900">Phone Support</p>
                  <p className="text-gray-700">+91 98765 43210</p>
                  <p className="text-xs text-gray-600 mt-1">Mon-Fri: 9 AM - 6 PM IST</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-3 border">
              <p className="text-sm text-gray-700">
                <strong>Quick Links:</strong>{' '}
                <Link href="/contact" className="text-primary hover:underline">Contact Us</Link>
                {' • '}
                <Link href="/faqs" className="text-primary hover:underline">FAQs</Link>
                {' • '}
                <Link href="/refund-request" className="text-primary hover:underline">Request Refund</Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer Note */}
        <div className="text-center text-sm text-gray-600 py-6 border-t">
          <p className="mb-2">
            This shipping policy is effective as of October 16, 2025 and applies to all orders placed on Baby Store.
          </p>
          <p>
            We reserve the right to modify this policy at any time. Changes will be posted on this page.
          </p>
        </div>
      </div>
    </div>
  )
}
