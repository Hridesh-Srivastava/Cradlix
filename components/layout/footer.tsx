"use client"

import Link from "next/link"
import Image from "next/image"
import { Facebook, Twitter, Instagram, Youtube } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { useRecaptcha } from "@/hooks/use-recaptcha"

const footerLinks = {
  company: [
    { name: "About Us", href: "/about" },
    { name: "Contact", href: "/contact" },
    { name: "Careers", href: "/careers" },
    { name: "Press", href: "/press" },
  ],
  support: [
    { name: "Help Center", href: "/help" },
    { name: "Refund Request", href: "/refund-request" },
    { name: "Shipping Policy", href: "/shipping-policy" },
    { name: "Cancellation Policy", href: "/cancellation-policy" },
  ],
  legal: [
    { name: "Privacy Policy", href: "/privacy-policy" },
    { name: "Terms & Conditions", href: "/terms-conditions" },
    { name: "FAQs", href: "/faqs" },
  ],
  categories: [
    { name: "Baby Toys", href: "/categories/toys" },
    { name: "Baby Care", href: "/categories/care" },
    { name: "Feeding", href: "/categories/feeding" },
    { name: "Clothing", href: "/categories/clothing" },
  ],
}

export function Footer() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const { execute: recaptcha } = useRecaptcha()

  const subscribe = async () => {
    setError(null)
    setSuccess(null)
    const isValid = /[^@\s]+@[^@\s]+\.[^@\s]+/.test(email)
    if (!isValid) {
      setError("Please enter a valid email")
      return
    }
    try {
      setLoading(true)
      const captcha = await recaptcha?.('newsletter').catch(() => null)
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "footer", captchaToken: captcha || null })
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || "Subscription failed")
      }
      setSuccess(`Thanks for subscribing to our newsletter!`)
      setEmail("")
    } catch (e) {
      setError(e instanceof Error ? e.message : "Subscription failed")
    } finally {
      setLoading(false)
    }
  }
  return (
    <footer className="bg-muted/50 border-t">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <Image 
                src="/cradlix-logo.png" 
                alt="Cradlix Logo" 
                width={32} 
                height={32} 
                className="h-8 w-8"
              />
              <span className="text-xl font-bold">Cradlix</span>
            </Link>
            <p className="text-muted-foreground mb-4 max-w-md">
              Your trusted partner for premium baby products and toys. Safe, high-quality, and affordable products for
              your little ones.
            </p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="icon">
                <Facebook className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Twitter className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Instagram className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Youtube className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-muted-foreground hover:text-foreground transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-muted-foreground hover:text-foreground transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-semibold mb-4">Categories</h3>
            <ul className="space-y-2">
              {footerLinks.categories.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-muted-foreground hover:text-foreground transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="border-t mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="font-semibold mb-2">Subscribe to our newsletter</h3>
              <p className="text-muted-foreground">Get the latest updates on new products and exclusive offers.</p>
            </div>
            <div className="flex w-full max-w-sm space-x-2">
              <Input placeholder="Enter your email" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} onKeyDown={(e)=>{ if(e.key==='Enter'){ e.preventDefault(); subscribe(); }}} />
              <Button onClick={subscribe} disabled={loading}>{loading? '...' : 'Subscribe'}</Button>
            </div>
          </div>
          {success && (
            <div className="mt-4 rounded-md bg-green-500/10 border border-green-600/30 text-green-800 px-4 py-3">
              {success}
            </div>
          )}
          {error && (
            <div className="mt-4 rounded-md bg-red-500/10 border border-red-600/30 text-red-800 px-4 py-3">
              {error}
            </div>
          )}
        </div>

        {/* Bottom Section */}
        <div className="border-t mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-muted-foreground text-sm">© {new Date().getFullYear()} Cradlix. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            {footerLinks.legal.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-muted-foreground hover:text-foreground transition-colors text-sm"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
