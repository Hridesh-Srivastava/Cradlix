"use client"

import { useEffect } from "react"
import { useSession } from "next-auth/react"

// Sends a beacon to clear NextAuth cookies when a super-admin closes the tab/window.
export function SuperAdminLogoutOnClose() {
  const { data: session } = useSession()

  useEffect(() => {
    const role = (session?.user as any)?.role
    if (role !== "super-admin") return

    const url = "/api/clear-auth"

    const sendClear = () => {
      try {
        if (navigator.sendBeacon) {
          const blob = new Blob([], { type: "application/json" })
          navigator.sendBeacon(url, blob)
        } else {
          // Fallback for older browsers
          fetch(url, { method: "POST", keepalive: true })
        }
      } catch {}
    }

    const onPageHide = () => sendClear()
    const onBeforeUnload = () => sendClear()

    // pagehide/beforeunload are triggered on actual tab close or navigation,
    // not merely when switching tabs.
    window.addEventListener("pagehide", onPageHide)
    window.addEventListener("beforeunload", onBeforeUnload)

    return () => {
      window.removeEventListener("pagehide", onPageHide)
      window.removeEventListener("beforeunload", onBeforeUnload)
    }
  }, [session])

  return null
}
