import type { Metadata } from "next"
import { BrandsManagement } from "@/components/admin/brands-management"

export const metadata: Metadata = {
  title: "Brands Management - Baby Store Admin",
  description: "Manage product brands",
}

export default function BrandsPage() {
  return <BrandsManagement />
}
