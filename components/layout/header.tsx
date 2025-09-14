"use client"

import Link from "next/link"
import { useState } from "react"
import { useSession } from "next-auth/react"
import { ShoppingCart, Search, Menu, Heart, Baby, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useCart } from "@/components/providers/cart-provider"
import { UserMenu } from "@/components/auth/user-menu"
import type { ExtendedUser } from "@/lib/auth/session"

const navigation = [
  { name: "Home", href: "/" },
  { name: "Products", href: "/products" },
  { name: "Categories", href: "/categories" },
  { name: "Brands", href: "/brands" },
  { name: "Sale", href: "/sale" },
]

export function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const { data: session } = useSession()
  const { state: cartState } = useCart()
  const role = (session?.user as any)?.role as string | undefined
  const canManageProducts = role === 'admin' || role === 'moderator' || role === 'super-admin'

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <Baby className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold">Baby Store</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {navigation.map((item) => (
            <Link key={item.name} href={item.href} className="text-sm font-medium transition-colors hover:text-primary">
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Search Bar */}
        <div className="hidden lg:flex flex-1 max-w-sm mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              className="pl-10"
              onFocus={() => setIsSearchOpen(true)}
              onBlur={() => setIsSearchOpen(false)}
            />
          </div>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center space-x-4">
          {/* Quick Add Product for admins (desktop) */}
          {canManageProducts && (
            <Button size="sm" variant="default" asChild className="hidden md:inline-flex">
              <Link href="/admin/products/new" className="inline-flex items-center gap-1">
                <Plus className="h-4 w-4" />
                Add Product
              </Link>
            </Button>
          )}
          {/* Search Icon for Mobile */}
          <Button variant="ghost" size="icon" className="lg:hidden">
            <Search className="h-5 w-5" />
          </Button>

          {/* Wishlist */}
          <Button variant="ghost" size="icon" asChild>
            <Link href="/wishlist">
              <Heart className="h-5 w-5" />
            </Link>
          </Button>

          {/* Cart */}
          <Button variant="ghost" size="icon" className="relative" asChild>
            <Link href="/cart">
              <ShoppingCart className="h-5 w-5" />
              {cartState.itemCount > 0 && (
                <Badge variant="destructive" className="absolute -right-2 -top-2 h-5 w-5 rounded-full p-0 text-xs">
                  {cartState.itemCount}
                </Badge>
              )}
            </Link>
          </Button>

          {session?.user ? (
            <UserMenu user={session.user as ExtendedUser} />
          ) : (
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/login">Sign in</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/login">Sign up</Link>
              </Button>
            </div>
          )}

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <div className="flex flex-col space-y-4 mt-8">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-lg font-medium transition-colors hover:text-primary"
                  >
                    {item.name}
                  </Link>
                ))}

                {canManageProducts && (
                  <>
                    <hr className="my-4" />
                    <Link href="/admin/products/new" className="text-lg font-medium transition-colors hover:text-primary">
                      Add Product
                    </Link>
                  </>
                )}

                {!session?.user && (
                  <>
                    <hr className="my-4" />
                    <Link href="/login" className="text-lg font-medium transition-colors hover:text-primary">
                      Sign In
                    </Link>
                    <Link href="/login" className="text-lg font-medium transition-colors hover:text-primary">
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
