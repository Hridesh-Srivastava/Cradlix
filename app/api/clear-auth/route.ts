import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST() {
  try {
    const cookieStore = await cookies()
    
    // Clear NextAuth cookies
    const response = NextResponse.json({ success: true, message: "Auth cookies cleared" })
    
    // Clear all NextAuth related cookies
    response.cookies.set("next-auth.session-token", "", {
      expires: new Date(0),
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax"
    })
    
    response.cookies.set("__Secure-next-auth.session-token", "", {
      expires: new Date(0),
      path: "/",
      httpOnly: true,
      secure: true,
      sameSite: "lax"
    })
    
    return response
  } catch (error) {
    console.error("Error clearing auth cookies:", error)
    return NextResponse.json({ success: false, error: "Failed to clear cookies" }, { status: 500 })
  }
}
