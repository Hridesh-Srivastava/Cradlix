import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, ShoppingCart, CreditCard, Truck, RefreshCw, Shield, AlertCircle, Scale, Mail, Phone, MapPin } from 'lucide-react'
import Link from 'next/link'

export const metadata = {
  title: 'Terms & Conditions - Baby Store',
  description: 'Read our terms and conditions for using Baby Store website and services.',
}

export default function TermsConditionsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
            <FileText className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms & Conditions</h1>
          <p className="text-lg text-gray-600">
            Last Updated: October 13, 2025
          </p>
        </div>

        {/* Introduction */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <p className="text-gray-700 leading-relaxed">
              Welcome to <strong>Baby Store</strong>! These Terms and Conditions ("Terms") govern your use of our website and the purchase of products from our online store. By accessing or using our website, you agree to be bound by these Terms.
            </p>
            <p className="text-gray-700 leading-relaxed mt-4">
              Please read these Terms carefully before using our services. If you do not agree with any part of these Terms, you must not use our website or services.
            </p>
          </CardContent>
        </Card>

        {/* General Terms */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scale className="h-5 w-5 text-primary" />
              1. General Terms
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">1.1 Acceptance of Terms</h3>
              <p className="text-gray-700">
                By accessing and using Baby Store (the "Website"), you accept and agree to be bound by these Terms and Conditions, our Privacy Policy, and all applicable laws and regulations.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">1.2 Eligibility</h3>
              <p className="text-gray-700">
                You must be at least 18 years old to use this Website and purchase products. By using our services, you represent that you are of legal age to form a binding contract.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">1.3 Modifications</h3>
              <p className="text-gray-700">
                We reserve the right to modify these Terms at any time. Changes will be effective immediately upon posting. Your continued use of the Website after changes constitutes acceptance of the modified Terms.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">1.4 Business Information</h3>
              <p className="text-gray-700">
                <strong>Baby Store</strong><br />
                123 Baby Street, Rajpur Road<br />
                Dehradun, Uttarakhand 248001, India<br />
                Email: support@babystore.com<br />
                Phone: +91 98765 43210
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Account Registration */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              2. Account Registration and Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">2.1 Account Creation</h3>
              <p className="text-gray-700">
                To make purchases, you may need to create an account. You agree to provide accurate, current, and complete information during registration and to update such information to keep it accurate.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">2.2 Account Security</h3>
              <p className="text-gray-700 mb-2">You are responsible for:</p>
              <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                <li>Maintaining the confidentiality of your account credentials</li>
                <li>All activities that occur under your account</li>
                <li>Notifying us immediately of any unauthorized access</li>
                <li>Ensuring your password is strong and secure</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">2.3 Account Termination</h3>
              <p className="text-gray-700">
                We reserve the right to suspend or terminate your account at our sole discretion if you violate these Terms or engage in fraudulent or illegal activities.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Products and Pricing */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-primary" />
              3. Products, Pricing, and Availability
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">3.1 Product Information</h3>
              <p className="text-gray-700">
                We strive to display accurate product descriptions, images, and specifications. However, we do not guarantee that product descriptions or other content are error-free, complete, or current.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">3.2 Pricing</h3>
              <p className="text-gray-700">
                All prices are listed in Indian Rupees (INR) and include applicable taxes unless stated otherwise. We reserve the right to change prices at any time without prior notice. The price at the time of order placement will be the final price charged.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">3.3 Product Availability</h3>
              <p className="text-gray-700">
                All products are subject to availability. We reserve the right to discontinue any product at any time. If a product becomes unavailable after you place an order, we will notify you and provide a full refund.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">3.4 Pricing Errors</h3>
              <p className="text-gray-700">
                In case of a pricing error, we reserve the right to cancel the order and issue a full refund, even if the order has been confirmed. We will notify you promptly in such cases.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Orders and Payment */}
        <Card className="mb-6 border-primary/30 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" />
              4. Orders, Payment, and Razorpay
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">4.1 Order Placement</h3>
              <p className="text-gray-700">
                When you place an order, you are making an offer to purchase the product(s). We reserve the right to accept or decline your order for any reason. Order confirmation via email does not guarantee acceptance.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">4.2 Payment Processing via Razorpay</h3>
              <p className="text-gray-700 mb-2">
                All payments are processed securely through <strong>Razorpay</strong>, our authorized payment gateway partner. By making a payment, you agree to Razorpay's Terms and Conditions.
              </p>
              <p className="text-gray-700 mb-2">
                <strong>Razorpay Terms:</strong>{' '}
                <a 
                  href="https://razorpay.com/terms" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline font-medium"
                >
                  https://razorpay.com/terms
                </a>
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">4.3 Accepted Payment Methods</h3>
              <p className="text-gray-700 mb-2">We accept the following payment methods through Razorpay:</p>
              <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                <li>Credit Cards (Visa, Mastercard, RuPay, American Express)</li>
                <li>Debit Cards</li>
                <li>Net Banking</li>
                <li>UPI (Google Pay, PhonePe, Paytm, BHIM, etc.)</li>
                <li>Digital Wallets (Paytm, Mobikwik, etc.)</li>
                <li>Cash on Delivery (COD) - where available</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">4.4 Payment Security</h3>
              <p className="text-gray-700">
                Razorpay is PCI DSS Level 1 compliant, ensuring the highest level of payment security. Your card details are encrypted and directly transmitted to Razorpay's secure servers. We do NOT store your complete card information on our servers.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">4.5 Payment Confirmation</h3>
              <p className="text-gray-700">
                Once payment is successfully processed through Razorpay, you will receive a payment confirmation email along with an order confirmation. If payment fails, your order will not be processed.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">4.6 Cash on Delivery (COD)</h3>
              <p className="text-gray-700">
                COD is available for orders up to ₹25,000 in select locations. A nominal COD fee of ₹50 is applicable. Payment must be made in Indian Rupees at the time of delivery. We do not accept foreign currency or cheques.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">4.7 Order Modification and Cancellation</h3>
              <p className="text-gray-700">
                Orders can be modified or cancelled within 1 hour of placement by contacting customer support. Once the order is processed or shipped, cancellation is not possible. You may return the product as per our Return Policy after delivery.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Shipping and Delivery */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5 text-primary" />
              5. Shipping and Delivery
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">5.1 Shipping Coverage</h3>
              <p className="text-gray-700">
                We currently ship within India only. International shipping is not available at this time.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">5.2 Delivery Timeframes</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                <li><strong>Standard Shipping:</strong> 3-5 business days</li>
                <li><strong>Express Shipping:</strong> 1-2 business days</li>
                <li>Remote areas may require additional 1-2 days</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">5.3 Shipping Charges</h3>
              <p className="text-gray-700">
                Free shipping on orders above ₹999. Standard shipping (₹99) and Express shipping (₹199) charges apply for orders below ₹999.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">5.4 Delivery Responsibility</h3>
              <p className="text-gray-700">
                Once the product is delivered and signed for, the risk of loss transfers to you. We are not responsible for delays caused by courier services, natural disasters, or circumstances beyond our control.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">5.5 Failed Delivery Attempts</h3>
              <p className="text-gray-700">
                If delivery attempts fail 3 times due to your unavailability or incorrect address, the order will be returned to us. You may be charged return shipping fees.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Returns and Refunds */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5 text-primary" />
              6. Returns, Refunds, and Exchanges
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">6.1 Return Policy</h3>
              <p className="text-gray-700 mb-2">
                We offer a <strong>30-day return policy</strong> from the date of delivery. To be eligible for return:
              </p>
              <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                <li>Product must be unused and in original packaging</li>
                <li>All tags, labels, and accessories must be intact</li>
                <li>Product must be in resaleable condition</li>
                <li>Invoice/receipt must be included</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">6.2 Non-Returnable Items</h3>
              <p className="text-gray-700 mb-2">The following items cannot be returned:</p>
              <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                <li>Personal care products (bottles, nipples, etc.) once opened</li>
                <li>Innerwear and undergarments</li>
                <li>Products marked as "Non-Returnable"</li>
                <li>Customized or personalized items</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">6.3 Return Process</h3>
              <p className="text-gray-700">
                To initiate a return, log into your account, go to "My Orders", and select "Return Item". We will arrange free pickup within 2-3 business days.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">6.4 Refund Processing via Razorpay</h3>
              <p className="text-gray-700 mb-2">
                Refunds are processed within 5-7 business days after we receive and inspect the returned item. Refunds are issued through Razorpay back to your original payment method:
              </p>
              <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                <li><strong>Credit/Debit Card:</strong> 5-10 business days (depends on your bank)</li>
                <li><strong>UPI/Wallet:</strong> 3-5 business days</li>
                <li><strong>Net Banking:</strong> 5-7 business days</li>
                <li><strong>COD Orders:</strong> Bank transfer within 7-10 business days</li>
              </ul>
              <p className="text-gray-700 mt-2">
                Refund timelines are governed by Razorpay and your bank's processing time. We do not have control over banking delays.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">6.5 Exchanges</h3>
              <p className="text-gray-700">
                Exchanges are available for size/color variations of the same product. Return the original item and place a new order for your preferred variant.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">6.6 Damaged or Defective Products</h3>
              <p className="text-gray-700">
                If you receive a damaged or defective product, contact us within 24 hours with photos/videos. We will arrange immediate replacement or full refund at no additional cost.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Product Warranties */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              7. Product Warranties and Safety
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">7.1 Manufacturer Warranty</h3>
              <p className="text-gray-700">
                Most electronic products, toys, and equipment come with manufacturer warranty (6 months to 2 years). Warranty details are mentioned on each product page. For warranty claims, contact us with your order details.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">7.2 Product Safety</h3>
              <p className="text-gray-700">
                All products meet international safety standards (BIS, ISO, CE certified). Products are made from non-toxic, BPA-free materials. We partner only with certified manufacturers who prioritize child safety.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">7.3 Disclaimer of Warranties</h3>
              <p className="text-gray-700">
                Except as expressly stated, products are provided "AS IS" without warranties of any kind, either express or implied. We do not warrant that products will meet your specific requirements.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* User Conduct */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-primary" />
              8. User Conduct and Prohibited Activities
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-gray-700 mb-2">You agree NOT to:</p>
            <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
              <li>Use the Website for any illegal or unauthorized purpose</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Transmit viruses, malware, or harmful code</li>
              <li>Engage in fraudulent transactions or payment disputes</li>
              <li>Use automated systems (bots, scrapers) to access the Website</li>
              <li>Post false reviews or ratings</li>
              <li>Harass, abuse, or harm other users or our staff</li>
              <li>Violate any applicable laws or regulations</li>
            </ul>
            <p className="text-gray-700 mt-3">
              Violation of these rules may result in account suspension, legal action, and cooperation with law enforcement.
            </p>
          </CardContent>
        </Card>

        {/* Intellectual Property */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>9. Intellectual Property Rights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">9.1 Ownership</h3>
              <p className="text-gray-700">
                All content on this Website, including text, graphics, logos, images, software, and design, is the property of Baby Store or its licensors and is protected by copyright, trademark, and other intellectual property laws.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">9.2 Limited License</h3>
              <p className="text-gray-700">
                You are granted a limited, non-exclusive, non-transferable license to access and use the Website for personal, non-commercial purposes only. You may not reproduce, distribute, or create derivative works without our written permission.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">9.3 Trademarks</h3>
              <p className="text-gray-700">
                "Baby Store" and our logo are trademarks of Baby Store. All product names and brands are trademarks of their respective owners.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Limitation of Liability */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>10. Limitation of Liability</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-gray-700">
              To the fullest extent permitted by law, Baby Store shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, or goodwill, arising from:
            </p>
            <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
              <li>Your use or inability to use the Website or products</li>
              <li>Unauthorized access to your account or data</li>
              <li>Errors or interruptions in service</li>
              <li>Defects in products or services</li>
              <li>Third-party conduct or content (including Razorpay)</li>
            </ul>
            <p className="text-gray-700 mt-3">
              Our total liability shall not exceed the amount paid by you for the specific product or service giving rise to the claim.
            </p>
          </CardContent>
        </Card>

        {/* Indemnification */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>11. Indemnification</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">
              You agree to indemnify, defend, and hold harmless Baby Store, its affiliates, officers, directors, employees, and agents from any claims, liabilities, damages, losses, or expenses (including legal fees) arising from your violation of these Terms, your use of the Website, or your violation of any rights of another party.
            </p>
          </CardContent>
        </Card>

        {/* Dispute Resolution */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>12. Dispute Resolution and Governing Law</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">12.1 Governing Law</h3>
              <p className="text-gray-700">
                These Terms shall be governed by and construed in accordance with the laws of India, without regard to conflict of law provisions.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">12.2 Jurisdiction</h3>
              <p className="text-gray-700">
                Any disputes arising from these Terms or your use of the Website shall be subject to the exclusive jurisdiction of the courts in Dehradun, Uttarakhand, India.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">12.3 Informal Resolution</h3>
              <p className="text-gray-700">
                Before initiating legal proceedings, we encourage you to contact us to resolve disputes informally. Most concerns can be resolved quickly through our customer support.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Third-Party Services */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>13. Third-Party Services and Links</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">13.1 Razorpay Payment Gateway</h3>
              <p className="text-gray-700">
                We use Razorpay as our payment processor. Your use of Razorpay is subject to their Terms and Privacy Policy. We are not responsible for any issues arising from Razorpay's services.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">13.2 Third-Party Links</h3>
              <p className="text-gray-700">
                Our Website may contain links to third-party websites. We are not responsible for the content, privacy practices, or terms of these external sites.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">13.3 Courier and Logistics Partners</h3>
              <p className="text-gray-700">
                We work with third-party courier services for delivery. While we strive to ensure timely delivery, we are not liable for delays or damages caused by courier partners.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Privacy */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>14. Privacy and Data Protection</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">
              Your privacy is important to us. Please review our{' '}
              <Link href="/privacy-policy" className="text-primary hover:underline font-medium">
                Privacy Policy
              </Link>
              {' '}to understand how we collect, use, and protect your personal information, including payment data processed through Razorpay.
            </p>
          </CardContent>
        </Card>

        {/* Force Majeure */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>15. Force Majeure</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">
              We shall not be liable for any failure to perform our obligations due to circumstances beyond our reasonable control, including natural disasters, war, terrorism, strikes, pandemics, government actions, or failures of third-party services (including Razorpay or courier partners).
            </p>
          </CardContent>
        </Card>

        {/* Severability */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>16. Severability and Waiver</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">16.1 Severability</h3>
              <p className="text-gray-700">
                If any provision of these Terms is found to be invalid or unenforceable, the remaining provisions shall continue in full force and effect.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">16.2 Waiver</h3>
              <p className="text-gray-700">
                Our failure to enforce any right or provision of these Terms shall not constitute a waiver of such right or provision.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Entire Agreement */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>17. Entire Agreement</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">
              These Terms, together with our Privacy Policy and any other legal notices published on the Website, constitute the entire agreement between you and Baby Store regarding your use of the Website.
            </p>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card className="mb-6 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-primary" />
              18. Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700">
              If you have any questions about these Terms & Conditions, please contact us:
            </p>
            
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">Email</p>
                  <a href="mailto:legal@babystore.com" className="text-primary hover:underline">
                    legal@babystore.com
                  </a>
                  <p className="text-sm text-gray-600">or</p>
                  <a href="mailto:support@babystore.com" className="text-primary hover:underline">
                    support@babystore.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">Phone</p>
                  <p className="text-gray-700">+91 98765 43210</p>
                  <p className="text-sm text-gray-600">Monday-Friday: 9 AM - 6 PM IST</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">Mailing Address</p>
                  <p className="text-gray-700">
                    Baby Store<br />
                    123 Baby Street, Rajpur Road<br />
                    Dehradun, Uttarakhand 248001<br />
                    India
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t">
              <p className="text-sm text-gray-600">
                You can also reach us through our{' '}
                <Link href="/contact" className="text-primary hover:underline font-medium">
                  Contact Form
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer Note */}
        <div className="text-center text-sm text-gray-600 py-6">
          <p className="mb-2">
            By using Baby Store, you acknowledge that you have read, understood, and agree to be bound by these Terms & Conditions.
          </p>
          <p>
            These Terms are effective as of October 13, 2025.
          </p>
        </div>
      </div>
    </div>
  )
}
