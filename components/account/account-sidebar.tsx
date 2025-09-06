"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession } from "next-auth/react"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { User, Package, Heart, Settings, Shield, BarChart3 } from "lucide-react"

const userMenuItems = [
  { href: "/account", label: "Profile", icon: User },
  { href: "/account/orders", label: "Orders", icon: Package },
  { href: "/account/wishlist", label: "Wishlist", icon: Heart },
  { href: "/account/settings", label: "Settings", icon: Settings },
]

const adminMenuItems = [
  { href: "/admin", label: "Dashboard", icon: BarChart3 },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/orders", label: "Orders", icon: Package },
  { href: "/admin/users", label: "Users", icon: User },
]

export function AccountSidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()

  if (!session?.user) return null

  const isAdmin = session.user.role === "admin" || session.user.role === "moderator"

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center space-x-4 mb-6">
          <Avatar className="h-16 w-16">
            <AvatarImage src={session.user.image || ""} alt={session.user.name || ""} />
            <AvatarFallback>{session.user.name?.charAt(0) || "U"}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold">{session.user.name}</h3>
            <p className="text-sm text-muted-foreground">{session.user.email}</p>
            <Badge variant="secondary" className="mt-1">
              {session.user.role}
            </Badge>
          </div>
        </div>

        <nav className="space-y-2">
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2">Account</h4>
            {userMenuItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center space-x-3 px-3 py-2 rounded-md text-sm transition-colors",
                    pathname === item.href
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted text-muted-foreground hover:text-foreground",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </div>

          {isAdmin && (
            <div className="pt-4">
              <h4 className="text-sm font-medium text-muted-foreground mb-2 flex items-center">
                <Shield className="h-4 w-4 mr-2" />
                Admin
              </h4>
              {adminMenuItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center space-x-3 px-3 py-2 rounded-md text-sm transition-colors",
                      pathname === item.href
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted text-muted-foreground hover:text-foreground",
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
            </div>
          )}
        </nav>
      </CardContent>
    </Card>
  )
}
