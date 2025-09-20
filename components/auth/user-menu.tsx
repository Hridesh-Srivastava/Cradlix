"use client"

import { signOut } from "next-auth/react"
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

  const handleSignOut = async () => {
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
            <AvatarImage src={user.image || ""} alt={user.name || ""} />
            <AvatarFallback>{getInitials(user.name || "U")}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
            {user.role !== "customer" && (
              <p className="text-xs leading-none text-primary font-medium capitalize">{user.role}</p>
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

        {(user.role === "admin" || user.role === "moderator" || user.role === "super-admin") && !isSuperAdminPage && (
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
