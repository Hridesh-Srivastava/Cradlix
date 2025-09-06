import { getServerSession } from "next-auth/next"
import { authOptions } from "./config"
import type { UserRole } from "./permissions"

export interface ExtendedUser {
  id: string
  name?: string | null
  email?: string | null
  image?: string | null
  role: UserRole
}

export interface ExtendedSession {
  user: ExtendedUser
  expires: string
}

export async function getSession(): Promise<ExtendedSession | null> {
  const session = await getServerSession(authOptions)
  return session as ExtendedSession | null
}

export async function getCurrentUser(): Promise<ExtendedUser | null> {
  const session = await getSession()
  return session?.user || null
}

export async function requireAuth(): Promise<ExtendedUser> {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error("Authentication required")
  }
  return user
}

export async function requireRole(allowedRoles: UserRole[]): Promise<ExtendedUser> {
  const user = await requireAuth()
  if (!allowedRoles.includes(user.role)) {
    throw new Error("Insufficient permissions")
  }
  return user
}

export async function requireAdmin(): Promise<ExtendedUser> {
  return requireRole(["admin"])
}

export async function requireModerator(): Promise<ExtendedUser> {
  return requireRole(["admin", "moderator"])
}
