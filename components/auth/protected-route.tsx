"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { hasPermission, type UserRole } from "@/lib/auth/permissions"

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: UserRole[]
  requiredPermission?: string
  fallback?: React.ReactNode
  redirectTo?: string
}

export function ProtectedRoute({
  children,
  requiredRole = [],
  requiredPermission,
  fallback,
  redirectTo = "/login",
}: ProtectedRouteProps) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null)

  useEffect(() => {
    if (status === "loading") return

    if (!session) {
      router.push(redirectTo)
      return
    }

    const userRole = session.user.role as UserRole

    // Check role requirements
    if (requiredRole.length > 0 && !requiredRole.includes(userRole)) {
      setIsAuthorized(false)
      router.push("/unauthorized")
      return
    }

    // Check permission requirements
    if (requiredPermission && !hasPermission(userRole, requiredPermission as any)) {
      setIsAuthorized(false)
      router.push("/unauthorized")
      return
    }

    setIsAuthorized(true)
  }, [session, status, requiredRole, requiredPermission, router, redirectTo])

  if (status === "loading" || isAuthorized === null) {
    return fallback || <LoadingSpinner />
  }

  if (!isAuthorized) {
    return fallback || <div>Access denied</div>
  }

  return <>{children}</>
}
