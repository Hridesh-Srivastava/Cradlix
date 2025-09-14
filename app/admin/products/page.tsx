import type { Metadata } from "next"
import { ProductManagement } from "@/components/admin/product-management"

export const metadata: Metadata = {
  title: "Products - Admin",
  description: "Create, edit, and manage products",
}

export default function AdminProductsPage() {
  return <ProductManagement />
}
