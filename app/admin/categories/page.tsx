import type { Metadata } from "next"
import { CategoriesManagement } from "@/components/admin/categories-management"

export const metadata: Metadata = {
  title: "Categories Management - Cradlix Admin",
  description: "Manage product categories",
}

export default function CategoriesPage() {
  return <CategoriesManagement />
}
