import { StoreRegistrationForm } from "@/components/auth/store-registration-form"

export const metadata = {
  title: "Register Your Store | Baby Ecommerce",
  description: "Join our marketplace as a vendor and start selling your products",
}

export default function RegisterStorePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Register Your Store</h1>
          <p className="mt-2 text-sm text-gray-600">
            Join our marketplace and start selling your products to thousands of customers
          </p>
        </div>
        <StoreRegistrationForm />
      </div>
    </div>
  )
}
