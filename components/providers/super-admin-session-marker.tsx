"use client"

import { useEffect, useRef } from "react"
import { useSession } from "next-auth/react"

// Enforces re-login for super-admins after a browser restart and then sets a session-only marker.
export function SuperAdminSessionMarker() {
  const { data: session, status } = useSession()
  const hasForcedOnce = useRef(false)
  const hasSetMarker = useRef(false)

  useEffect(() => {
    const role = (session?.user as any)?.role
    if (role !== "super-admin") return

    if (typeof document === "undefined") return

    const hasMarker = document.cookie.includes("sa_browser_session=")
    
    // Only redirect if we have a session but no marker AND we haven't forced redirect yet
    // This prevents redirecting during active login attempts
    if (!hasMarker && !hasSetMarker.current && status === "authenticated") {
      // Set the marker first to prevent infinite redirects
      hasSetMarker.current = true
      document.cookie = `sa_browser_session=1; Path=/; SameSite=Lax${location.protocol === "https:" ? "; Secure" : ""}`
      
      // Only redirect if we haven't forced once and we're not on the login page
      if (!hasForcedOnce.current && !location.pathname.startsWith("/login")) {
        hasForcedOnce.current = true
        // Trigger a soft reload to pass through middleware.
        location.replace("/login?callbackUrl=" + encodeURIComponent(location.pathname))
      }
      return
    }

    // If we have a session and marker, ensure marker stays present during the session
    if (status === "authenticated" && hasMarker) {
      document.cookie = `sa_browser_session=1; Path=/; SameSite=Lax${location.protocol === "https:" ? "; Secure" : ""}`
    }
  }, [session, status])

  return null
}
