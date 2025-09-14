import { type MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXTAUTH_URL || process.env.VERCEL_URL || "http://localhost:3000"
  const baseUrl = base.startsWith("http") ? base : `https://${base}`
  return {
    rules: {
      userAgent: "*",
      allow: ["/"],
      disallow: ["/admin", "/api/*", "/login", "/register", "/account"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
