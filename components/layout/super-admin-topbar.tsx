"use client"

import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { UserMenu } from "@/components/auth/user-menu"
import type { ExtendedUser } from "@/lib/auth/session"

// A minimal top bar for the Super Admin pages that only shows the profile menu on the right.
export function SuperAdminTopbar() {
  const { data: session } = useSession()

  const user = session?.user as ExtendedUser | undefined

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-end">
        {/* Only the profile menu on the right. If not logged in (shouldn't happen here), show Sign in. */}
        {user ? (
          <UserMenu user={user} />
        ) : (
          <Button variant="ghost" size="sm" asChild>
            <Link href="/login">Sign in</Link>
          </Button>
        )}
      </div>
    </header>
  )
}
