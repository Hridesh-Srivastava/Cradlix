import type { Metadata } from "next"
import { SuperAdminProfile } from "@/components/admin/super-admin-profile"

export const metadata: Metadata = {
  title: "Super Admin Profile - Baby Store",
  description: "Profile page for Super Admin",
}

export default function SuperAdminProfilePage() {
  return <SuperAdminProfile />
}
