"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { RefreshCw, CreditCard, AlertCircle, CheckCircle2, Clock, Shield } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { useRecaptcha } from '@/hooks/use-recaptcha'

export default function RefundRequestPage() {
  const { toast } = useToast()
  const { execute: recaptcha } = useRecaptcha()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    paymentId: '',
    subject: '',
    refundAmount: '',
    complaint: '',
  })
  const [submitted, setSubmitted] = useState<null | { name: string; email: string }>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Validation
      if (!/.+@.+\..+/.test(formData.email)) {
        throw new Error('Please enter a valid email address.')
      }

      const amount = parseFloat(formData.refundAmount)
      if (isNaN(amount) || amount <= 0) {
        throw new Error('Please enter a valid refund amount.')
      }

      const captcha = await recaptcha?.('refund').catch(() => null)
      const res = await fetch('/api/refund-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, captchaToken: captcha || null }),
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err?.error || `Failed (${res.status})`)
      }

      toast({
        title: 'Refund request submitted successfully!',
        description: "We'll review your request and get back to you within 5-7 business days.",
      })

      setSubmitted({ name: formData.name, email: formData.email })
      setFormData({ name: '', email: '', phone: '', paymentId: '', subject: '', refundAmount: '', complaint: '' })
    } catch (error) {
      toast({
        title: 'Error submitting request',
        description: error instanceof Error ? error.message : 'Please try again later.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
            <RefreshCw className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Request a Refund</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We're sorry you had an issue with your order. Please fill out the form below and we'll process your refund request promptly.
          </p>
        </div>

        {submitted && (
          <div className="mb-8">
            <Alert className="border-emerald-200/60 bg-emerald-50/60 text-emerald-800">
              <CheckCircle2 className="h-4 w-4" />
              <AlertTitle>Thank you{submitted.name ? `, ${submitted.name}` : ''}!</AlertTitle>
              <AlertDescription>
                Your refund request has been submitted successfully. We've sent a confirmation email to <strong>{submitted.email}</strong>. Our team will review your request and get back to you within 5-7 business days.
              </AlertDescription>
            </Alert>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Refund Request Form */}
          <Card>
            <CardHeader>
              <CardTitle>Refund Request Form</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Your full name"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="your.email@example.com"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+91 98765 43210"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="paymentId">Payment/Transaction ID *</Label>
                  <Input
                    id="paymentId"
                    name="paymentId"
                    value={formData.paymentId}
                    onChange={handleInputChange}
                    placeholder="pay_xxxxxxxxxxxxx"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Find this in your order confirmation email or Razorpay receipt
                  </p>
                </div>

                <div>
                  <Label htmlFor="subject">Subject/Reason *</Label>
                  <Input
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    placeholder="e.g., Product defective, Wrong item received"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="refundAmount">Refund Amount (₹) *</Label>
                  <Input
                    id="refundAmount"
                    name="refundAmount"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.refundAmount}
                    onChange={handleInputChange}
                    placeholder="1500.00"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Enter the amount you paid for this order
                  </p>
                </div>

                <div>
                  <Label htmlFor="complaint">Complaint / Remarks *</Label>
                  <Textarea
                    id="complaint"
                    name="complaint"
                    value={formData.complaint}
                    onChange={handleInputChange}
                    placeholder="Please describe the issue in detail. Include order details, what went wrong, and any other relevant information..."
                    rows={6}
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    The more details you provide, the faster we can process your refund
                  </p>
                </div>

                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? (
                    'Submitting...'
                  ) : (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Submit Refund Request
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Refund Information */}
          <div className="space-y-6">
            {/* Razorpay Information */}
            <Card className="border-primary/30 bg-primary/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-primary" />
                  Payment Processing via Razorpay
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Secure Refund Processing</h3>
                  <p className="text-gray-700 text-sm">
                    All refunds are processed securely through <strong>Razorpay</strong>, our trusted payment gateway partner. Your refund will be credited back to your original payment method.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Refund Timeline</h3>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start gap-2">
                      <Clock className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span><strong>Credit/Debit Cards:</strong> 5-10 business days</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Clock className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span><strong>UPI/Wallets:</strong> 3-5 business days</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Clock className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span><strong>Net Banking:</strong> 5-7 business days</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Clock className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span><strong>Cash on Delivery:</strong> Bank transfer in 7-10 business days</span>
                    </li>
                  </ul>
                  <p className="text-xs text-gray-600 mt-3">
                    Timeline starts after we approve your refund request. Actual credit depends on your bank's processing time.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Razorpay Refund Policy</h3>
                  <p className="text-gray-700 text-sm">
                    Refunds are processed in compliance with Razorpay's refund policies and guidelines. For more information, visit{' '}
                    <a 
                      href="https://razorpay.com/refund-policy/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline font-medium"
                    >
                      Razorpay Refund Policy
                    </a>
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Refund Policy */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  Our Refund Policy
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-gray-700">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Eligible for Refund</h4>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li>Product received is damaged or defective</li>
                    <li>Wrong product delivered</li>
                    <li>Product not as described</li>
                    <li>Quality issues within 30 days of delivery</li>
                    <li>Order cancelled before shipment</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Processing Time</h4>
                  <p>We review all refund requests within 2-3 business days. Once approved, refunds are initiated through Razorpay and credited as per the timeline above.</p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Need Help?</h4>
                  <p>Contact our customer support:</p>
                  <p className="mt-1">📧 Email: support@babystore.com</p>
                  <p>📞 Phone: +91 98765 43210</p>
                  <p className="text-xs text-gray-600 mt-2">Monday-Friday: 9 AM - 6 PM IST</p>
                </div>
              </CardContent>
            </Card>

            {/* Important Notice */}
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Important Notice</AlertTitle>
              <AlertDescription>
                Please ensure all information provided is accurate. Incorrect payment IDs or details may delay processing. Keep your order confirmation email handy for reference.
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </div>
    </div>
  )
}
