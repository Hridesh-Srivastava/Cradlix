"use client"

import { useState, useEffect } from "react"
import { signOut, useSession } from "next-auth/react"
import { usePathname } from "next/navigation"
import { User, LogOut, Settings, ShoppingBag, Heart, Shield, PlusCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useRouter } from "next/navigation"
import type { ExtendedUser } from "@/lib/auth/session"

interface UserMenuProps {
  user: ExtendedUser
}

export function UserMenu({ user }: UserMenuProps) {
  const router = useRouter()
  const pathname = usePathname()
  const isSuperAdminPage = pathname?.startsWith("/super-admin")
  const { data: session, update } = useSession()
  const [currentUser, setCurrentUser] = useState<ExtendedUser>(user)
  const [version, setVersion] = useState<number>(0)

  // Listen for avatar updates
  useEffect(() => {
    const handleAvatarUpdate = (event: CustomEvent) => {
      console.log('UserMenu received avatar update event:', event.detail)
      const { avatarUrl } = event.detail
      setCurrentUser(prev => ({ ...prev, image: avatarUrl }))
      setVersion(v => v + 1)
      // Also update the session
      update()
    }

    window.addEventListener('avatarUpdated', handleAvatarUpdate as EventListener)
    
    return () => {
      window.removeEventListener('avatarUpdated', handleAvatarUpdate as EventListener)
    }
  }, [update])

  // Listen for profile updates (name/email)
  useEffect(() => {
    const handleProfileUpdated = (event: CustomEvent) => {
      const { name, email } = event.detail || {}
      setCurrentUser(prev => ({ ...prev, name: name ?? prev.name, email: email ?? prev.email }))
      update()
    }
    window.addEventListener('profileUpdated', handleProfileUpdated as EventListener)
    return () => window.removeEventListener('profileUpdated', handleProfileUpdated as EventListener)
  }, [update])

  // Update current user when session changes
  useEffect(() => {
    if (session?.user) {
      setCurrentUser(session.user as ExtendedUser)
      setVersion(v => v + 1)
    }
  }, [session])

  // Also update when the user prop changes (fallback)
  useEffect(() => {
    if (user) {
      setCurrentUser(user)
    }
  }, [user])

  const handleSignOut = async () => {
    try {
      // Proactively clear the super-admin session marker (if present)
      if (typeof document !== "undefined") {
        document.cookie = `sa_browser_session=; Path=/; Max-Age=0; SameSite=Lax${location.protocol === "https:" ? "; Secure" : ""}`
      }
    } catch {}
    await signOut({ callbackUrl: "/" })
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={currentUser.image ? `${currentUser.image}${currentUser.image.includes('?') ? '&' : '?'}v=${version}` : ""} alt={currentUser.name || ""} />
            <AvatarFallback>{getInitials(currentUser.name || "U")}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{currentUser.name}</p>
            <p className="text-xs leading-none text-muted-foreground">{currentUser.email}</p>
            {currentUser.role !== "customer" && (
              <p className="text-xs leading-none text-primary font-medium capitalize">{currentUser.role}</p>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={() => router.push(isSuperAdminPage ? "/super-admin/profile" : "/account/profile")}>
          <User className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>

        {!isSuperAdminPage && (
          <DropdownMenuItem onClick={() => router.push("/account/orders")}>
            <ShoppingBag className="mr-2 h-4 w-4" />
            <span>My Orders</span>
          </DropdownMenuItem>
        )}

        {!isSuperAdminPage && (
          <DropdownMenuItem onClick={() => router.push("/account/wishlist")}>
            <Heart className="mr-2 h-4 w-4" />
            <span>Wishlist</span>
          </DropdownMenuItem>
        )}

        {!isSuperAdminPage && (
          <DropdownMenuItem onClick={() => router.push("/settings")}>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
        )}

        {(currentUser.role === "admin" || currentUser.role === "moderator" || currentUser.role === "super-admin") && !isSuperAdminPage && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push("/admin")}>
              <Shield className="mr-2 h-4 w-4" />
              <span>Admin Panel</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push("/admin/products/new")}>
              <PlusCircle className="mr-2 h-4 w-4" />
              <span>Add Product</span>
            </DropdownMenuItem>
          </>
        )}

        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
