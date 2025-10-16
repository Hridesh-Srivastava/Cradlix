import type { Metadata } from "next"
import { AdminDashboard } from "@/components/admin/admin-dashboard"

export const metadata: Metadata = {
  title: "Admin Dashboard - Cradlix",
  description: "Admin dashboard for managing the store",
}

export default function AdminPage() {
  return <AdminDashboard />
}
