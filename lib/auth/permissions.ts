export type UserRole = "customer" | "moderator" | "admin" | "super-admin"

export const PERMISSIONS = {
  // Customer permissions
  CUSTOMER: {
    VIEW_PRODUCTS: true,
    ADD_TO_CART: true,
    PLACE_ORDER: true,
    VIEW_OWN_ORDERS: true,
    WRITE_REVIEWS: true,
    MANAGE_OWN_PROFILE: true,
  },
  // Moderator permissions (includes customer permissions)
  MODERATOR: {
    VIEW_PRODUCTS: true,
    ADD_TO_CART: true,
    PLACE_ORDER: true,
    VIEW_OWN_ORDERS: true,
    WRITE_REVIEWS: true,
    MANAGE_OWN_PROFILE: true,
    MODERATE_REVIEWS: true,
    VIEW_USER_LIST: true,
    MANAGE_PRODUCTS: true,
  },
  // Admin permissions (includes all permissions)
  ADMIN: {
    VIEW_PRODUCTS: true,
    ADD_TO_CART: true,
    PLACE_ORDER: true,
    VIEW_OWN_ORDERS: true,
    WRITE_REVIEWS: true,
    MANAGE_OWN_PROFILE: true,
    MODERATE_REVIEWS: true,
    VIEW_USER_LIST: true,
    MANAGE_PRODUCTS: true,
    MANAGE_CATEGORIES: true,
    MANAGE_ORDERS: true,
    VIEW_ANALYTICS: true,
    MANAGE_USERS: true,
    MANAGE_COUPONS: true,
    SYSTEM_SETTINGS: true,
  },
} as const

export function hasPermission(userRole: UserRole, permission: keyof typeof PERMISSIONS.ADMIN): boolean {
  switch (userRole) {
    case "super-admin":
    case "admin":
      return !!PERMISSIONS.ADMIN[permission]
    case "moderator": {
      const map = PERMISSIONS.MODERATOR as Record<string, boolean>
      return !!map[permission as string]
    }
    case "customer": {
      const map = PERMISSIONS.CUSTOMER as Record<string, boolean>
      return !!map[permission as string]
    }
    default:
      return false
  }
}

export function requireRole(allowedRoles: UserRole[]) {
  return (userRole: UserRole) => allowedRoles.includes(userRole)
}

export function isAdmin(userRole: UserRole): boolean {
  return userRole === "admin" || userRole === "super-admin"
}

export function isModerator(userRole: UserRole): boolean {
  return userRole === "moderator" || userRole === "admin" || userRole === "super-admin"
}

export function isCustomer(userRole: UserRole): boolean {
  return userRole === "customer"
}
