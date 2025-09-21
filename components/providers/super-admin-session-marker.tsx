"use client"

import { useSession } from "next-auth/react"
import { useEffect, useRef } from "react"

export function SuperAdminSessionMarker() {
  const { data: session, status } = useSession()
  const hasSetMarker = useRef(false)
  const isInitialLoad = useRef(true)

  useEffect(() => {
    // Only handle super admin sessions
    if (status !== "authenticated" || session?.user?.role !== "super-admin") {
      return
    }

    // Set marker immediately when super admin is authenticated
    if (!hasSetMarker.current) {
      hasSetMarker.current = true
      document.cookie = `sa_browser_session=1; Path=/; SameSite=Lax${location.protocol === "https:" ? "; Secure" : ""}`
    }

    // Mark that initial load is complete
    if (isInitialLoad.current) {
      isInitialLoad.current = false
    }

    // If we have a session, ensure marker stays present during the session
    if (status === "authenticated") {
      document.cookie = `sa_browser_session=1; Path=/; SameSite=Lax${location.protocol === "https:" ? "; Secure" : ""}`
    }
  }, [session, status])

  return null
}