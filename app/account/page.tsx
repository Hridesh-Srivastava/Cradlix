import type { Metadata } from "next"
import { auth } from "@/lib/auth/config"
import { authOptions } from "@/lib/auth/config"
import { ProfileForm } from "@/components/account/profile-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "Profile - Cradlix",
  description: "Manage your account profile",
}

export default async function AccountPage() {
  const session = await auth()

  if (!session?.user) {
    return null
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Profile</h1>
        <p className="text-muted-foreground">Manage your account information</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent>
          <ProfileForm user={session.user} />
        </CardContent>
      </Card>
    </div>
  )
}
