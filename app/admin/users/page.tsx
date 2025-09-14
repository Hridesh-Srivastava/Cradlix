import { redirect } from "next/navigation"
import { auth } from "@/lib/auth/config"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { UsersManagement } from "@/components/admin/users-management"

export default async function AdminUsersPage() {
  const session = await auth()
  if (!session?.user || (session.user.role !== 'super-admin' && session.user.role !== 'admin')) {
    // Only super-admin by requirement; allow admin to view? We'll restrict actions to super-admin in component/API.
    redirect('/unauthorized')
  }
  if (session.user.role !== 'super-admin') {
    // Non super-admin should not access this page
    redirect('/unauthorized')
  }
  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Users Management</CardTitle>
        </CardHeader>
        <CardContent>
          <UsersManagement />
        </CardContent>
      </Card>
    </div>
  )
}
