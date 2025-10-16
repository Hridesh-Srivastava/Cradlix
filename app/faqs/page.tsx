"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ChevronDown, ChevronUp, Search, HelpCircle, Package, CreditCard, RefreshCw, Shield, Truck, Phone } from 'lucide-react'
import Link from 'next/link'

interface FAQ {
  id: number
  question: string
  answer: string
  category: string
  icon: React.ReactNode
}

const faqs: FAQ[] = [
  // Shipping & Delivery
  {
    id: 1,
    question: "How long does shipping take?",
    answer: "Standard shipping takes 3-5 business days across India. Express shipping is available for 1-2 days delivery. Orders placed before 2 PM are processed on the same day. Remote areas may require additional 1-2 days for delivery.",
    category: "Shipping & Delivery",
    icon: <Truck className="h-5 w-5" />
  },
  {
    id: 2,
    question: "What are the shipping charges?",
    answer: "We offer free shipping on orders above ₹399. For orders below ₹399, standard shipping costs ₹99 and express shipping costs ₹199. Shipping is calculated at checkout based on your location and chosen delivery speed.",
    category: "Shipping & Delivery",
    icon: <Truck className="h-5 w-5" />
  },
  {
    id: 3,
    question: "Do you ship internationally?",
    answer: "Currently, we only ship within India. We are working on expanding our services internationally. Sign up for our newsletter to be notified when international shipping becomes available.",
    category: "Shipping & Delivery",
    icon: <Truck className="h-5 w-5" />
  },
  {
    id: 4,
    question: "Can I track my order?",
    answer: "Yes! Once your order is shipped, you'll receive a tracking number via email and SMS. You can track your order in real-time through our website by going to 'My Orders' in your account or using the tracking link provided in the shipping confirmation email.",
    category: "Shipping & Delivery",
    icon: <Package className="h-5 w-5" />
  },
  
  // Returns & Refunds
  {
    id: 5,
    question: "What is your return policy?",
    answer: "We offer a 30-day return policy for unused items in original packaging with all tags attached. Products must be in resaleable condition. Simply initiate a return from your account, and we'll arrange for pickup at no additional cost.",
    category: "Returns & Refunds",
    icon: <RefreshCw className="h-5 w-5" />
  },
  {
    id: 6,
    question: "How do I return a product?",
    answer: "To return a product: 1) Log into your account and go to 'My Orders', 2) Select the order and click 'Return Item', 3) Choose a reason for return and upload photos if applicable, 4) We'll arrange a free pickup within 5-7 business days. Once we receive and inspect the item, your refund will be processed.",
    category: "Returns & Refunds",
    icon: <RefreshCw className="h-5 w-5" />
  },
  {
    id: 7,
    question: "When will I receive my refund?",
    answer: "Refunds are processed within 5-7 business days after we receive and inspect the returned item. The amount will be credited to your original payment method. For prepaid orders, refunds appear in your account within 5-7 business days depending on your bank. For COD orders, we'll transfer the amount to your bank account.",
    category: "Returns & Refunds",
    icon: <CreditCard className="h-5 w-5" />
  },
  {
    id: 8,
    question: "Can I exchange a product?",
    answer: "Yes, we offer exchanges for size or color variations of the same product. To exchange, return the original item and place a new order for your preferred variant. If there's a price difference, we'll adjust it in your refund or request additional payment.",
    category: "Returns & Refunds",
    icon: <RefreshCw className="h-5 w-5" />
  },

  // Payment & Pricing
  {
    id: 9,
    question: "What payment methods do you accept?",
    answer: "We accept multiple payment methods including: Credit/Debit Cards (Visa, Mastercard, RuPay, American Express), Net Banking, UPI (Google Pay, PhonePe, Paytm), Digital Wallets, and Cash on Delivery (COD) for eligible orders. All transactions are secured with 256-bit SSL encryption.",
    category: "Payment & Pricing",
    icon: <CreditCard className="h-5 w-5" />
  },
  {
    id: 10,
    question: "Is Cash on Delivery (COD) available?",
    answer: "Yes, COD is available for orders up to ₹25,000. A nominal COD fee of ₹50 is applicable. COD may not be available for certain pin codes or during promotional sales. You'll see COD availability at checkout.",
    category: "Payment & Pricing",
    icon: <CreditCard className="h-5 w-5" />
  },
  {
    id: 11,
    question: "Are there any hidden charges?",
    answer: "No, we believe in complete transparency. The price you see at checkout is the final price including all taxes. Shipping charges (if applicable) are clearly mentioned before payment. There are no hidden fees or surprise charges.",
    category: "Payment & Pricing",
    icon: <Shield className="h-5 w-5" />
  },
  {
    id: 12,
    question: "Do you offer discounts or coupon codes?",
    answer: "Yes! We regularly offer promotional discounts, seasonal sales, and exclusive coupon codes. Subscribe to our newsletter or follow us on social media to stay updated about ongoing offers. You can also check the 'Sale' section on our website for discounted products.",
    category: "Payment & Pricing",
    icon: <CreditCard className="h-5 w-5" />
  },

  // Products & Quality
  {
    id: 13,
    question: "Are your products safe for babies?",
    answer: "Absolutely! All our products meet international safety standards (BIS, ISO, CE certified). Our baby products are made from non-toxic, BPA-free materials. We conduct rigorous quality checks and only partner with certified manufacturers who prioritize child safety.",
    category: "Products & Quality",
    icon: <Shield className="h-5 w-5" />
  },
  {
    id: 14,
    question: "Do you sell authentic branded products?",
    answer: "Yes, we are authorized retailers/distributors for all brands we carry. Every product comes with original packaging, warranty cards, and authenticity certificates where applicable. We source directly from manufacturers or authorized distributors.",
    category: "Products & Quality",
    icon: <Shield className="h-5 w-5" />
  },
  {
    id: 15,
    question: "What if I receive a damaged or defective product?",
    answer: "If you receive a damaged or defective product, please contact us within 24 hours with photos/videos. We'll arrange for immediate replacement at no cost or issue a full refund including shipping charges. Your satisfaction is our priority.",
    category: "Products & Quality",
    icon: <Package className="h-5 w-5" />
  },
  {
    id: 16,
    question: "Do products come with warranty?",
    answer: "Yes, most electronic products, toys, and equipment come with manufacturer warranty ranging from 6 months to 2 years. Warranty details are mentioned on each product page. For warranty claims, contact us with your order details and we'll assist you with the process.",
    category: "Products & Quality",
    icon: <Shield className="h-5 w-5" />
  },

  // Account & Orders
  {
    id: 17,
    question: "Do I need to create an account to order?",
    answer: "While you can browse products without an account, creating one offers several benefits: faster checkout, order tracking, exclusive offers, wishlist feature, and easy returns/exchanges. Guest checkout is also available if you prefer not to create an account.",
    category: "Account & Orders",
    icon: <HelpCircle className="h-5 w-5" />
  },
  {
    id: 18,
    question: "Can I modify or cancel my order?",
    answer: "You can modify or cancel your order within 1 hour of placing it by contacting customer support. Once the order is processed and shipped, cancellation is not possible, but you can return it after delivery as per our return policy.",
    category: "Account & Orders",
    icon: <Package className="h-5 w-5" />
  },
  {
    id: 19,
    question: "How can I change my delivery address?",
    answer: "You can change your delivery address before the order is shipped by contacting customer support immediately. Once shipped, the address cannot be changed. For future orders, you can manage multiple addresses in your account settings.",
    category: "Account & Orders",
    icon: <Truck className="h-5 w-5" />
  },
  {
    id: 20,
    question: "What if I miss my delivery?",
    answer: "If you miss your delivery, our courier partner will attempt redelivery on the next business day. You'll receive notifications for each attempt. After 3 failed attempts, the order will be returned to us. You can also contact the courier directly to reschedule or choose a pickup location.",
    category: "Account & Orders",
    icon: <Truck className="h-5 w-5" />
  },

  // Customer Support
  {
    id: 21,
    question: "How can I contact customer support?",
    answer: "You can reach us through multiple channels: Email at support@cradlix.com, Call/WhatsApp at +91 98765 43210, or use our Contact Form on the website. Our business hours are Monday-Friday: 9 AM-6 PM, Saturday: 10 AM-4 PM. We respond to all queries within 24 hours.",
    category: "Customer Support",
    icon: <Phone className="h-5 w-5" />
  },
  {
    id: 22,
    question: "Do you have a physical store?",
    answer: "Yes, you can visit our store at: 123 Baby Street, Rajpur Road, Dehradun, Uttarakhand 248001. Store hours: Monday-Friday: 9 AM-6 PM, Saturday: 10 AM-4 PM, Sunday: Closed. Walk-ins are welcome! You can also order online and pick up from our store.",
    category: "Customer Support",
    icon: <Phone className="h-5 w-5" />
  },
  {
    id: 23,
    question: "Can I request a product that's out of stock?",
    answer: "Yes! Click 'Notify Me' on the product page to get an email when it's back in stock. You can also contact customer support to check restock dates or request special orders for bulk purchases. We do our best to restock popular items quickly.",
    category: "Customer Support",
    icon: <Package className="h-5 w-5" />
  },
  {
    id: 24,
    question: "How do I subscribe to your newsletter?",
    answer: "You can subscribe to our newsletter by entering your email in the footer section of our website. Subscribers get exclusive access to early sales, special discount codes, parenting tips, and new product launches. You can unsubscribe anytime.",
    category: "Customer Support",
    icon: <HelpCircle className="h-5 w-5" />
  },
]

const categories = Array.from(new Set(faqs.map(faq => faq.category)))

export default function FAQsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [openFAQ, setOpenFAQ] = useState<number | null>(null)

  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = !selectedCategory || faq.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const toggleFAQ = (id: number) => {
    setOpenFAQ(openFAQ === id ? null : id)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
            <HelpCircle className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Find answers to common questions about our products, shipping, returns, and more.
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Search for questions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 py-6 text-lg"
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              onClick={() => setSelectedCategory(null)}
              size="sm"
            >
              All Categories
            </Button>
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                size="sm"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* FAQ List */}
        <div className="space-y-4 mb-12">
          {filteredFAQs.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <HelpCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 text-lg">No FAQs found matching your search.</p>
                <p className="text-gray-500 text-sm mt-2">Try different keywords or browse all categories.</p>
              </CardContent>
            </Card>
          ) : (
            filteredFAQs.map((faq) => (
              <Card key={faq.id} className="overflow-hidden transition-shadow hover:shadow-md">
                <button
                  onClick={() => toggleFAQ(faq.id)}
                  className="w-full text-left p-6 flex items-start gap-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-shrink-0 mt-1 text-primary">
                    {faq.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
                          {faq.category}
                        </span>
                        <h3 className="font-semibold text-lg text-gray-900 mt-2">
                          {faq.question}
                        </h3>
                      </div>
                      <div className="flex-shrink-0">
                        {openFAQ === faq.id ? (
                          <ChevronUp className="h-5 w-5 text-gray-500" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-gray-500" />
                        )}
                      </div>
                    </div>
                    {openFAQ === faq.id && (
                      <div className="mt-4 text-gray-600 leading-relaxed animate-in slide-in-from-top-2 duration-200">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                </button>
              </Card>
            ))
          )}
        </div>

        {/* Contact CTA */}
        <Card className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-primary/20">
          <CardContent className="py-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Still have questions?</h2>
            <p className="text-gray-600 mb-6">
              Can't find the answer you're looking for? Our customer support team is here to help.
            </p>
            <Link href="/contact">
              <Button size="lg" className="gap-2">
                <Phone className="h-5 w-5" />
                Contact Support
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

