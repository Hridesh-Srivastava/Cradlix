"use client"

import { useEffect, useRef } from "react"
import { useSession, signOut } from "next-auth/react"

// Enforces re-login for super-admins after a browser restart and then sets a session-only marker.
export function SuperAdminSessionMarker() {
  const { data: session } = useSession()
  const hasForcedOnce = useRef(false)

  useEffect(() => {
    const role = (session?.user as any)?.role
    if (role !== "super-admin") return

    if (typeof document === "undefined") return

    const hasMarker = document.cookie.includes("sa_browser_session=")
    if (!hasMarker) {
      // Fresh session: set the marker and ask middleware to handle redirect/clears once.
      // Avoid calling signOut on tab switches or transient states.
      if (!hasForcedOnce.current) {
        hasForcedOnce.current = true
        // Set the marker so the middleware can pick it up next request-cycle if needed.
        document.cookie = `sa_browser_session=1; Path=/; SameSite=Lax${location.protocol === "https:" ? "; Secure" : ""}`
        // Trigger a soft reload to pass through middleware.
        location.replace("/login?callbackUrl=" + encodeURIComponent(location.pathname))
      }
      return
    }

    // Ensure marker stays present during the session
    document.cookie = `sa_browser_session=1; Path=/; SameSite=Lax${location.protocol === "https:" ? "; Secure" : ""}`
  }, [session])

  return null
}
