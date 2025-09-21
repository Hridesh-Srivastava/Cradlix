"use client"

import { useSession } from "next-auth/react"
import { useEffect, useRef } from "react"

export function SuperAdminLogoutOnClose() {
  const { data: session } = useSession()
  const isTabVisible = useRef(true)
  const hasCleared = useRef(false)

  useEffect(() => {
    // Only handle super admin sessions
    if (!session?.user || session.user.role !== "super-admin") {
      return
    }

    const sendClear = () => {
      if (hasCleared.current) return
      hasCleared.current = true
      
      // Send a beacon to clear NextAuth cookies
      if (navigator.sendBeacon) {
        navigator.sendBeacon('/api/auth/clear-session', JSON.stringify({}))
      } else {
        // Fallback for browsers that don't support sendBeacon
        fetch('/api/auth/clear-session', {
          method: 'POST',
          body: JSON.stringify({}),
          keepalive: true,
          headers: {
            'Content-Type': 'application/json',
          },
        }).catch(() => {}) // Ignore errors
      }
    }

    // Only clear on actual window close, not on tab switch or refresh
    const onPageHide = (e: PageTransitionEvent) => {
      // persisted is false when the page is being unloaded (browser/tab close)
      // persisted is true when the page is being cached (tab switch, navigation)
      if (!e.persisted) {
        sendClear()
      }
    }

    // Listen for page hide (most reliable for actual close)
    window.addEventListener("pagehide", onPageHide)

    return () => {
      window.removeEventListener("pagehide", onPageHide)
    }
  }, [session])

  return null
}