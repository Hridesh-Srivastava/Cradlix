import type React from "react"
import { Suspense } from "react"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth/config"
import { authOptions } from "@/lib/auth/config"
import { AccountSidebar } from "@/components/account/account-sidebar"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()

  if (!session) {
    redirect("/login?callbackUrl=/account")
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <AccountSidebar />
        </div>
        <div className="lg:col-span-3">
          <Suspense
            fallback={
              <div className="flex justify-center items-center h-64">
                <LoadingSpinner className="h-8 w-8" />
              </div>
            }
          >
            {children}
          </Suspense>
        </div>
      </div>
    </div>
  )
}
