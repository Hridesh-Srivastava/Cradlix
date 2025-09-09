import type { Metadata } from "next"
import { HeroImagesManagement } from "@/components/admin/hero-images-management"

export const metadata: Metadata = {
  title: "Hero Images Management - Baby Store Admin",
  description: "Manage hero images and featured content",
}

export default function HeroImagesPage() {
  return <HeroImagesManagement />
}
