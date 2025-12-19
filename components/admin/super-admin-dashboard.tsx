"use client"

import Link from "next/link"
import { useSession } from "next-auth/react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { UsersManagement } from "@/components/admin/users-management"
import { ArrowRight, Store } from "lucide-react"
import { UserMenu } from "@/components/auth/user-menu"
import type { ExtendedUser } from "@/lib/auth/session"

export function SuperAdminDashboard() {
  const { data: session } = useSession()
  const user = session?.user as ExtendedUser | undefined
  return (
    <div className="container px-4 md:px-6 lg:px-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Super Admin</h1>
          <p className="text-muted-foreground">Manage users and high-privilege operations</p>
        </div>
        {/* Replace purple shield with profile menu */}
        {user ? (
          <UserMenu user={user} />
        ) : (
          <div className="text-sm text-muted-foreground">Loading...</div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Store className="h-5 w-5" />
              Store Requests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Review and approve vendor store registration requests
            </p>
            <Button asChild className="w-full">
              <Link href="/super-admin/store-requests">
                Manage Requests <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
        </CardHeader>
        <CardContent>
          <UsersManagement />
        </CardContent>
      </Card>
    </div>
  )
}
