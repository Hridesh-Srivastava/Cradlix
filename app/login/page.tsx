import { Suspense } from "react"
export const dynamic = "force-dynamic"
import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth/session"
import { LoginForm } from "@/components/auth/login-form"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

interface LoginPageProps {
  searchParams: Promise<{
    callbackUrl?: string
    error?: string
  }>
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const session = await getSession()
  const params = await searchParams

  // Redirect if already authenticated
  if (session) {
    const cb = params.callbackUrl
    if (cb && cb.startsWith("/") && cb !== "/login") {
      redirect(cb)
    }
    // Default for super admin
    if ((session.user as any)?.role === 'super-admin') {
      redirect('/super-admin')
    }
    redirect("/")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Cradlix</h1>
          <p className="mt-2 text-gray-600">Your trusted partner for baby products</p>
        </div>

        <Suspense fallback={<LoadingSpinner />}>
          <LoginForm callbackUrl={params.callbackUrl} />
        </Suspense>

        {params.error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            Authentication failed. Please try again.
          </div>
        )}
      </div>
    </div>
  )
}
