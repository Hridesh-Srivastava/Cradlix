"use client"

import Link from "next/link"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { UsersManagement } from "@/components/admin/users-management"
import { ArrowRight, Shield } from "lucide-react"

export function SuperAdminDashboard() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Super Admin</h1>
          <p className="text-muted-foreground">Manage users and high-privilege operations</p>
        </div>
        <Shield className="h-6 w-6 text-purple-600" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
        </CardHeader>
        <CardContent>
          <UsersManagement />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Quick Links</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <Link href="/admin/products">
              <Button variant="outline" className="w-full justify-between">
                Go to Products
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/admin/categories">
              <Button variant="outline" className="w-full justify-between">
                Manage Categories
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/admin/brands">
              <Button variant="outline" className="w-full justify-between">
                Manage Brands
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
