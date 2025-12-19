import { Metadata } from "next"
import { StoreRequestsManagement } from "@/components/admin/store-requests-management"

export const metadata: Metadata = {
  title: "Store Requests - Super Admin | Baby Ecommerce",
  description: "Manage vendor store registration requests",
}

export default function StoreRequestsPage() {
  return <StoreRequestsManagement />
}
