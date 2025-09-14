import { type MetadataRoute } from "next"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXTAUTH_URL || process.env.VERCEL_URL || "http://localhost:3000"
  const baseUrl = base.startsWith("http") ? base : `https://${base}`

  const staticRoutes = [
    "",
    "/products",
    "/categories",
    "/brands",
    "/sale",
    "/contact",
  ]

  const now = new Date().toISOString()

  return staticRoutes.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: path === "" ? 1 : 0.7,
  }))
}
