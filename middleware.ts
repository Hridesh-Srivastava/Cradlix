import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

// Define protected routes
const protectedRoutes = ["/dashboard", "/admin", "/account", "/checkout", "/settings"]
const adminRoutes = ["/admin"]
const moderatorRoutes = ["/admin/products", "/admin/reviews", "/admin/users"]
const authRoutes = ["/login", "/register"]

// Define public routes that don't need authentication
const publicRoutes = ["/", "/products", "/categories", "/brands", "/sale", "/api/products", "/api/categories", "/api/brands"]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Get the token from the request
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  })

  // Check if the current path is protected
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route))
  const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route))
  const isModeratorRoute = moderatorRoutes.some((route) => pathname.startsWith(route))
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route))
  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route))

  // Allow public routes without authentication
  if (isPublicRoute && !isProtectedRoute) {
    return NextResponse.next()
  }

  // Redirect to login if accessing protected route without token
  if (isProtectedRoute && !token) {
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Redirect to home if accessing auth routes with valid token
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  // Admin route protection
  if (isAdminRoute && (!token || token.role !== "admin")) {
    return NextResponse.redirect(new URL("/unauthorized", request.url))
  }

  // Moderator route protection
  if (isModeratorRoute && (!token || !["admin", "moderator"].includes(token.role as string))) {
    return NextResponse.redirect(new URL("/unauthorized", request.url))
  }

  // User isolation for account routes
  if (pathname.startsWith("/account") && token) {
    // Check if user is trying to access another user's data
    const pathSegments = pathname.split("/")
    if (pathSegments.length > 2) {
      const userId = pathSegments[2]
      if (userId && userId !== token.id) {
        return NextResponse.redirect(new URL("/unauthorized", request.url))
      }
    }
  }

  // Add security headers
  const response = NextResponse.next()

  response.headers.set("X-Frame-Options", "DENY")
  response.headers.set("X-Content-Type-Options", "nosniff")
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin")
  response.headers.set("X-XSS-Protection", "1; mode=block")
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()")

  // Enhanced CSP header for security
  response.headers.set(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://checkout.razorpay.com https://apis.google.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: https: blob:; font-src 'self' data: https://fonts.gstatic.com; connect-src 'self' https://api.razorpay.com https://accounts.google.com; frame-src https://checkout.razorpay.com https://accounts.google.com;",
  )

  return response
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)"],
}
