import { Suspense } from "react"
import type { Metadata } from "next"
import { CheckoutForm } from "@/components/checkout/checkout-form"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import Script from "next/script"

export const metadata: Metadata = {
  title: "Checkout - Baby Store",
  description: "Complete your purchase securely",
}

export default function CheckoutPage() {
  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Checkout</h1>

          <Suspense
            fallback={
              <div className="flex justify-center items-center h-64">
                <LoadingSpinner className="h-8 w-8" />
              </div>
            }
          >
            <CheckoutForm />
          </Suspense>
        </div>
      </div>
    </>
  )
}
