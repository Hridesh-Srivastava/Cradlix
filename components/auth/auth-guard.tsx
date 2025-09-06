"use client"

import type React from "react"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { hasPermission, type UserRole } from "@/lib/auth/permissions"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

interface AuthGuardProps {
  children: React.ReactNode
  requireAuth?: boolean
  requiredRole?: UserRole[]
  requiredPermission?: string
  fallback?: React.ReactNode
  redirectTo?: string
}

export function AuthGuard({
  children,
  requireAuth = false,
  requiredRole = [],
  requiredPermission,
  fallback,
  redirectTo = "/login",
}: AuthGuardProps) {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "loading") return

    // Check if authentication is required
    if (requireAuth && !session) {
      router.push(redirectTo)
      return
    }

    // Check role requirements
    if (requiredRole.length > 0 && session?.user) {
      const userRole = session.user.role as UserRole
      if (!requiredRole.includes(userRole)) {
        router.push("/unauthorized")
        return
      }
    }

    // Check permission requirements
    if (requiredPermission && session?.user) {
      const userRole = session.user.role as UserRole
      if (!hasPermission(userRole, requiredPermission as any)) {
        router.push("/unauthorized")
        return
      }
    }
  }, [session, status, requireAuth, requiredRole, requiredPermission, router, redirectTo])

  // Show loading state
  if (status === "loading") {
    return fallback || <LoadingSpinner />
  }

  // Show fallback if not authenticated and auth is required
  if (requireAuth && !session) {
    return fallback || <LoadingSpinner />
  }

  // Show fallback if role requirements not met
  if (requiredRole.length > 0 && session?.user) {
    const userRole = session.user.role as UserRole
    if (!requiredRole.includes(userRole)) {
      return fallback || <div>Access denied</div>
    }
  }

  // Show fallback if permission requirements not met
  if (requiredPermission && session?.user) {
    const userRole = session.user.role as UserRole
    if (!hasPermission(userRole, requiredPermission as any)) {
      return fallback || <div>Access denied</div>
    }
  }

  return <>{children}</>
}
