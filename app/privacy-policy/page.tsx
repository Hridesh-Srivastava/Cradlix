import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Shield, Lock, Eye, Database, CreditCard, Mail, Phone, MapPin } from 'lucide-react'
import Link from 'next/link'

export const metadata = {
  title: 'Privacy Policy - Cradlix',
  description: 'Learn how Cradlix collects, uses, and protects your personal information.',
}

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
          <p className="text-lg text-gray-600">
            Last Updated: October 13, 2025
          </p>
        </div>

        {/* Introduction */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <p className="text-gray-700 leading-relaxed">
              At <strong>Cradlix</strong>, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and make purchases from our online store.
            </p>
            <p className="text-gray-700 leading-relaxed mt-4">
              By using our website, you consent to the practices described in this Privacy Policy. Please read this policy carefully to understand our views and practices regarding your personal data.
            </p>
          </CardContent>
        </Card>

        {/* Information We Collect */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5 text-primary" />
              1. Information We Collect
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">1.1 Personal Information</h3>
              <p className="text-gray-700 mb-2">When you register, place an order, or contact us, we may collect:</p>
              <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                <li>Name and contact details (email, phone number)</li>
                <li>Billing and shipping addresses</li>
                <li>Payment information (processed securely through Razorpay)</li>
                <li>Order history and preferences</li>
                <li>Account credentials (username, password)</li>
                <li>Date of birth (optional, for special offers)</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">1.2 Automatically Collected Information</h3>
              <p className="text-gray-700 mb-2">We automatically collect certain information when you visit our website:</p>
              <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                <li>IP address and browser type</li>
                <li>Device information and operating system</li>
                <li>Pages visited and time spent on our website</li>
                <li>Referring website addresses</li>
                <li>Cookies and similar tracking technologies</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">1.3 Information from Third Parties</h3>
              <p className="text-gray-700">
                We may receive information from third-party services including social media platforms (if you choose to sign in using social accounts), analytics providers, and our payment processor <strong>Razorpay</strong>.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* How We Use Your Information */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-primary" />
              2. How We Use Your Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-3">We use the collected information for the following purposes:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li><strong>Order Processing:</strong> To process and fulfill your orders, including payment processing through Razorpay, shipping, and customer support</li>
              <li><strong>Account Management:</strong> To create and manage your account, including authentication and security</li>
              <li><strong>Communication:</strong> To send order confirmations, shipping updates, promotional emails, and respond to inquiries</li>
              <li><strong>Personalization:</strong> To personalize your shopping experience and provide product recommendations</li>
              <li><strong>Analytics:</strong> To analyze website usage, improve our services, and understand customer preferences</li>
              <li><strong>Legal Compliance:</strong> To comply with legal obligations, resolve disputes, and enforce our agreements</li>
              <li><strong>Marketing:</strong> To send newsletters, promotional offers, and targeted advertising (with your consent)</li>
              <li><strong>Security:</strong> To detect and prevent fraud, unauthorized access, and other illegal activities</li>
            </ul>
          </CardContent>
        </Card>

        {/* Payment Information & Razorpay */}
        <Card className="mb-6 border-primary/30 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" />
              3. Payment Information & Razorpay Integration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">3.1 Payment Processing</h3>
              <p className="text-gray-700">
                We use <strong>Razorpay</strong>, a leading payment gateway in India, to securely process all online payments. Razorpay is PCI DSS Level 1 compliant, ensuring the highest level of security for your payment information.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">3.2 What Payment Information is Collected</h3>
              <p className="text-gray-700 mb-2">
                When you make a payment through Razorpay, they collect:
              </p>
              <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                <li>Credit/Debit card details (card number, CVV, expiry date)</li>
                <li>UPI IDs and bank account information</li>
                <li>Digital wallet information</li>
                <li>Billing address</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">3.3 How We Handle Payment Data</h3>
              <p className="text-gray-700 mb-2">
                <strong>Important:</strong> We do NOT store your complete card details, CVV, or UPI PIN on our servers. All sensitive payment information is encrypted and processed directly by Razorpay's secure servers.
              </p>
              <p className="text-gray-700 mt-2">
                We only receive and store:
              </p>
              <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                <li>Transaction ID and payment status</li>
                <li>Last 4 digits of your card (for reference)</li>
                <li>Payment method used (card/UPI/wallet)</li>
                <li>Transaction amount and timestamp</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">3.4 Razorpay's Privacy Policy</h3>
              <p className="text-gray-700">
                Razorpay has its own privacy policy governing the collection and use of payment information. We encourage you to review Razorpay's Privacy Policy at:{' '}
                <a 
                  href="https://razorpay.com/privacy" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline font-medium"
                >
                  https://razorpay.com/privacy
                </a>
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">3.5 Refund Information</h3>
              <p className="text-gray-700">
                For refunds, Razorpay processes the refund back to your original payment method. Refund timelines depend on your bank and typically take 5-7 business days.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Information Sharing */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-primary" />
              4. Information Sharing and Disclosure
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700">We may share your information with:</p>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">4.1 Service Providers</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                <li><strong>Razorpay:</strong> For payment processing and transaction management</li>
                <li><strong>Shipping Partners:</strong> For order delivery and logistics</li>
                <li><strong>Email Service Providers:</strong> For sending transactional and marketing emails</li>
                <li><strong>Analytics Providers:</strong> For website analytics and performance monitoring</li>
                <li><strong>Cloud Storage Providers:</strong> For data hosting and backup</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">4.2 Legal Requirements</h3>
              <p className="text-gray-700">
                We may disclose your information if required by law, court order, or government request, or to protect our rights, property, or safety.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">4.3 Business Transfers</h3>
              <p className="text-gray-700">
                In case of merger, acquisition, or sale of assets, your information may be transferred to the new entity, subject to this Privacy Policy.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">4.4 What We Don't Do</h3>
              <p className="text-gray-700 font-medium">
                We will NEVER sell, rent, or lease your personal information to third parties for their marketing purposes without your explicit consent.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Data Security */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              5. Data Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-gray-700">
              We implement industry-standard security measures to protect your personal information:
            </p>
            <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
              <li>SSL/TLS encryption for all data transmission</li>
              <li>Secure payment processing through PCI DSS compliant Razorpay</li>
              <li>Regular security audits and vulnerability assessments</li>
              <li>Restricted access to personal data (need-to-know basis)</li>
              <li>Encrypted data storage and secure backup systems</li>
              <li>Two-factor authentication for admin access</li>
            </ul>
            <p className="text-gray-700 mt-3">
              However, no method of transmission over the internet is 100% secure. While we strive to protect your information, we cannot guarantee absolute security.
            </p>
          </CardContent>
        </Card>

        {/* Cookies */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>6. Cookies and Tracking Technologies</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-gray-700">
              We use cookies and similar technologies to enhance your browsing experience:
            </p>
            <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
              <li><strong>Essential Cookies:</strong> Required for website functionality and security</li>
              <li><strong>Analytics Cookies:</strong> Help us understand how visitors use our website</li>
              <li><strong>Marketing Cookies:</strong> Used for personalized advertising (with consent)</li>
              <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
            </ul>
            <p className="text-gray-700 mt-3">
              You can control cookie settings through your browser. However, disabling cookies may affect website functionality.
            </p>
          </CardContent>
        </Card>

        {/* Your Rights */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>7. Your Rights and Choices</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-gray-700 mb-2">You have the following rights regarding your personal information:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li><strong>Access:</strong> Request a copy of your personal data we hold</li>
              <li><strong>Correction:</strong> Update or correct inaccurate information</li>
              <li><strong>Deletion:</strong> Request deletion of your account and personal data (subject to legal requirements)</li>
              <li><strong>Opt-out:</strong> Unsubscribe from marketing emails at any time</li>
              <li><strong>Data Portability:</strong> Request your data in a structured, machine-readable format</li>
              <li><strong>Withdraw Consent:</strong> Withdraw consent for data processing (may affect service availability)</li>
            </ul>
            <p className="text-gray-700 mt-3">
              To exercise these rights, contact us at <a href="mailto:privacy@cradlix.com" className="text-primary hover:underline">privacy@cradlix.com</a>
            </p>
          </CardContent>
        </Card>

        {/* Data Retention */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>8. Data Retention</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">
              We retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy, comply with legal obligations, resolve disputes, and enforce our agreements. Typically:
            </p>
            <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4 mt-2">
              <li>Account information: Until you request deletion</li>
              <li>Order history: 7 years (for tax and accounting purposes)</li>
              <li>Marketing data: Until you unsubscribe</li>
              <li>Payment transaction records: As required by Razorpay and applicable laws</li>
            </ul>
          </CardContent>
        </Card>

        {/* Children's Privacy */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>9. Children's Privacy</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">
              While we sell baby products, our website is intended for use by adults (18+). We do not knowingly collect personal information from children under 18 without parental consent. If you believe we have collected information from a child, please contact us immediately.
            </p>
          </CardContent>
        </Card>

        {/* Third-Party Links */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>10. Third-Party Links</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">
              Our website may contain links to third-party websites (including Razorpay's payment pages). We are not responsible for the privacy practices of these external sites. Please review their privacy policies before providing any information.
            </p>
          </CardContent>
        </Card>

        {/* International Transfers */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>11. International Data Transfers</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">
              Your information may be transferred to and processed in countries outside India, including by our service providers. We ensure appropriate safeguards are in place to protect your data in compliance with applicable laws.
            </p>
          </CardContent>
        </Card>

        {/* Changes to Policy */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>12. Changes to This Privacy Policy</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">
              We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on this page with an updated "Last Updated" date. Your continued use of our website after changes constitutes acceptance of the updated policy.
            </p>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card className="mb-6 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-primary" />
              13. Contact Us
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700">
              If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:
            </p>
            
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">Email</p>
                  <a href="mailto:privacy@cradlix.com" className="text-primary hover:underline">
                    privacy@cradlix.com
                  </a>
                  <p className="text-sm text-gray-600">or</p>
                  <a href="mailto:support@cradlix.com" className="text-primary hover:underline">
                    support@cradlix.com
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
                    Cradlix<br />
                    Rajpur Road<br />
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
          <p>
            By using Cradlix, you acknowledge that you have read and understood this Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  )
}
