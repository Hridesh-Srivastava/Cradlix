import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth/session"
import { hasPermission } from "@/lib/auth/permissions"

export async function POST(request: NextRequest) {
  try {
    const { requiredRole, requiredPermission } = await request.json()
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ authorized: false, reason: "Not authenticated" }, { status: 401 })
    }

    // Check role requirement
    if (requiredRole && !requiredRole.includes(user.role)) {
      return NextResponse.json({ authorized: false, reason: "Insufficient role" }, { status: 403 })
    }

    // Check permission requirement
    if (requiredPermission && !hasPermission(user.role, requiredPermission)) {
      return NextResponse.json({ authorized: false, reason: "Insufficient permissions" }, { status: 403 })
    }

    return NextResponse.json({
      authorized: true,
      user: {
        id: user.id,
        role: user.role,
        name: user.name,
        email: user.email,
      },
    })
  } catch (error) {
    console.error("Role check API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
