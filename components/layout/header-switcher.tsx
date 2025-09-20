"use client"

import { usePathname } from "next/navigation"
import { Header } from "@/components/layout/header"
import { SuperAdminTopbar } from "@/components/layout/super-admin-topbar"

export function HeaderSwitcher() {
  const pathname = usePathname()

  // On Super Admin pages, do not render any header at all.
  if (pathname?.startsWith("/super-admin")) return null

  // Default header for all other pages
  return <Header />
}
