import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

// Define protected routes
const protectedRoutes = ["/dashboard", "/admin", "/account", "/checkout", "/settings", "/super-admin"]
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

  // Super Admin fresh-session enforcement
  // We use a session-lifetime marker cookie (no Expires) to detect new browser sessions.
  // If a super-admin has a valid auth token but the session marker is missing,
  // assume this is a fresh browser session and force re-authentication by clearing auth cookies.
  const isSuperAdmin = !!token && (token.role as string) === "super-admin"
  const hasSessionMarker = request.cookies.get("sa_browser_session")
  
  // Only enforce session marker for super admin if they're trying to access protected routes
  // This prevents redirecting during login process
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route))
  const isLoginPage = pathname.startsWith("/login")
  
  if (isSuperAdmin && !hasSessionMarker && isProtectedRoute && !isLoginPage) {
    const loginUrl = new URL("/login", request.url)
    // Preserve destination so after re-login they can be routed appropriately
    if (pathname && pathname !== "/login") {
      loginUrl.searchParams.set("callbackUrl", pathname)
    }
    const response = NextResponse.redirect(loginUrl)
    // Set session-scoped marker (no expires -> cleared on browser close)
    response.cookies.set("sa_browser_session", "1", {
      path: "/",
      httpOnly: false,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    })
    // Proactively clear NextAuth cookies so the session is invalidated
    response.cookies.set("next-auth.session-token", "", {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      expires: new Date(0),
    })
    // Also clear the secure-prefixed cookie variant (used in HTTPS / production)
    response.cookies.set("__Secure-next-auth.session-token", "", {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      expires: new Date(0),
    })
    return response
  }

  // If super-admin is logged in and marker exists, ensure NextAuth cookie is session-scoped
  if (isSuperAdmin && hasSessionMarker) {
    const response = NextResponse.next()
    const tokenValue = request.cookies.get("next-auth.session-token")?.value
    if (tokenValue) {
      response.cookies.set("next-auth.session-token", tokenValue, {
        path: "/",
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        // no expires -> becomes a session cookie
      } as any)
      return response
    }
  }

  // Check if the current path is protected (already defined above)
  const isAdminRoot = pathname === "/admin"
  const isAdminSection = pathname.startsWith("/admin/")
  const isSuperAdminRoot = pathname === "/super-admin"
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

  // Admin section protection
  if (isSuperAdminRoot) {
    // Only super-admin can access the dedicated super admin dashboard
    if (!token || token.role !== 'super-admin') {
      return NextResponse.redirect(new URL("/unauthorized", request.url))
    }
  } else if (isAdminRoot) {
    // Only admins or super-admins can view the root admin dashboard
    if (!token || !["admin", "super-admin"].includes(token.role as string)) {
      return NextResponse.redirect(new URL("/unauthorized", request.url))
    }
  } else if (isAdminSection) {
    // Super-admin only for users management pages
    if (pathname.startsWith('/admin/users')) {
      if (!token || token.role !== 'super-admin') {
        return NextResponse.redirect(new URL("/unauthorized", request.url))
      }
    }
    // Require approved status for admin access (defense-in-depth)
    if (!token || (token as any).status && (token as any).status !== 'approved') {
      return NextResponse.redirect(new URL("/unauthorized", request.url))
    }
    // Admin subpages: allow admin, super-admin, or moderator
    if (!token || !["admin", "super-admin", "moderator"].includes(token.role as string)) {
      return NextResponse.redirect(new URL("/unauthorized", request.url))
    }
  }

  // User isolation for account routes (only when a UUID-like userId is present)
  if (pathname.startsWith("/account/") && token) {
    const segments = pathname.split("/").filter(Boolean) // e.g. ["account", "<maybe-id>", ...]
    const maybeId = segments[1]
    // Strict UUID v4 pattern (accepts lowercase/uppercase hex)
    const uuidV4 = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/
    if (maybeId && uuidV4.test(maybeId)) {
      if (!token.id || maybeId !== (token.id as string)) {
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
