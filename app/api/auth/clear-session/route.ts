import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const response = NextResponse.json({ success: true })
    
    // Clear NextAuth session cookies
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
    
    // Clear the super admin session marker
    response.cookies.set("sa_browser_session", "", {
      path: "/",
      httpOnly: false,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      expires: new Date(0),
    })
    
    return response
  } catch (error) {
    console.error('Error clearing session:', error)
    return NextResponse.json({ error: 'Failed to clear session' }, { status: 500 })
  }
}
