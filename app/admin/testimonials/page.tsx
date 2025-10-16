import type { Metadata } from "next"
import { TestimonialsManagement } from "@/components/admin/testimonials-management"

export const metadata: Metadata = {
  title: "Testimonials Management - Cradlix Admin",
  description: "Manage customer testimonials",
}

export default function TestimonialsPage() {
  return <TestimonialsManagement />
}
