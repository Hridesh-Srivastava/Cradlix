import type { Metadata } from "next"
import { SuperAdminDashboard } from "../../components/admin/super-admin-dashboard"

export const metadata: Metadata = {
  title: "Super Admin Dashboard - Cradlix",
  description: "Super Admin panel for managing users and high-privilege actions",
}

export default function SuperAdminPage() {
  return <SuperAdminDashboard />
}
