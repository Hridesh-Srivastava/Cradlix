import type { Metadata } from "next"
import { ProductCreateForm } from "../../../../components/admin/product-form"

export const metadata: Metadata = {
  title: "Add Product - Admin",
  description: "Create a new product and publish it",
}

export default function AddProductPage() {
  return <ProductCreateForm />
}
