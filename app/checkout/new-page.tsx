import { Suspense } from 'react'
import { ComprehensiveCheckout } from '@/components/checkout/comprehensive-checkout'
import { LoadingSpinner } from '@/components/ui/loading-spinner'

export const metadata = {
  title: 'Checkout | Cradlix',
  description: 'Complete your purchase securely',
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner className="h-8 w-8" />
      </div>
    }>
      <ComprehensiveCheckout />
    </Suspense>
  )
}
