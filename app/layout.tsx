import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Toaster } from "@/components/ui/sonner"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/components/providers/auth-provider"
import { CartProvider } from "@/components/providers/cart-provider"
import { AuthErrorBoundary } from "@/components/auth/error-boundary"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Suspense } from "react"
import "./globals.css"

export const metadata: Metadata = {
  title: {
    default: "Baby Store - Premium Baby Products & Toys",
    template: "%s | Baby Store",
  },
  description:
    "Discover the best baby products and toys for your little ones. Safe, high-quality, and affordable products with fast delivery.",
  keywords: "baby products, baby toys, infant care, toddler toys, baby accessories, online baby store",
  authors: [{ name: "Baby Store Team" }],
  creator: "Baby Store",
  publisher: "Baby Store",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://your-domain.com"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://your-domain.com",
    title: "Baby Store - Premium Baby Products & Toys",
    description: "Discover the best baby products and toys for your little ones.",
    siteName: "Baby Store",
  },
  twitter: {
    card: "summary_large_image",
    title: "Baby Store - Premium Baby Products & Toys",
    description: "Discover the best baby products and toys for your little ones.",
    creator: "@babystore",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} antialiased`}>
  <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} storageKey="baby-store-theme" disableTransitionOnChange>
          <AuthErrorBoundary>
            <AuthProvider>
              <CartProvider>
                <Suspense fallback={null}>
                  <div className="relative flex min-h-screen flex-col">
                    <Header />
                    <main className="flex-1">{children}</main>
                    <Footer />
                  </div>
                  <Toaster />
                </Suspense>
              </CartProvider>
            </AuthProvider>
          </AuthErrorBoundary>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
