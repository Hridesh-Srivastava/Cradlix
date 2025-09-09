import type React from "react"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth/config"
import { authOptions } from "@/lib/auth/config"
import { AdminSidebar } from "@/components/admin/admin-sidebar"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()

  if (!session || (session.user.role !== "admin" && session.user.role !== "moderator")) {
    redirect("/")
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">{children}</div>
      </main>
    </div>
  )
}
