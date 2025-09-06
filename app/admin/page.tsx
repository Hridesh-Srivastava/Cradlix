import type { Metadata } from "next"
import { AdminDashboard } from "@/components/admin/admin-dashboard"

export const metadata: Metadata = {
  title: "Admin Dashboard - Baby Store",
  description: "Admin dashboard for managing the store",
}

export default function AdminPage() {
  return <AdminDashboard />
}
