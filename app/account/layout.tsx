import type React from "react"
export const dynamic = "force-dynamic"
import { Suspense } from "react"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth/config"
import { authOptions } from "@/lib/auth/config"
// Removed sidebar to simplify account layout
import { LoadingSpinner } from "@/components/ui/loading-spinner"

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()

  if (!session) {
    redirect("/login?callbackUrl=/account")
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 gap-8">
        <div className="col-span-1">
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
