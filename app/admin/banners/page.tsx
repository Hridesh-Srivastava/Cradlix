import type { Metadata } from "next"
import { BannersManagement } from "@/components/admin/banners-management"

export const metadata: Metadata = {
  title: "Banners Management - Cradlix Admin",
  description: "Manage promotional banners",
}

export default function BannersPage() {
  return <BannersManagement />
}
