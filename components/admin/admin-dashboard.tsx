"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Package, ShoppingCart, Users, DollarSign, Tag, Award, Image, MessageSquare, Star, ArrowRight } from "lucide-react"
import Link from "next/link"

interface DashboardStats {
  totalProducts: number
  totalOrders: number
  totalUsers: number
  totalRevenue: number
  recentOrders: Array<{
    id: string
    customerName: string
    amount: number
    status: string
    createdAt: string
  }>
}

export function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/admin/dashboard")
        if (response.ok) {
          const data = await response.json()
          setStats(data)
        }
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner className="h-8 w-8" />
      </div>
    )
  }

  if (!stats) {
    return <div>Failed to load dashboard data</div>
  }

  const statCards = [
    {
      title: "Total Products",
      value: stats.totalProducts,
      icon: Package,
      color: "text-blue-600",
    },
    {
      title: "Total Orders",
      value: stats.totalOrders,
      icon: ShoppingCart,
      color: "text-green-600",
    },
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      color: "text-purple-600",
    },
    {
      title: "Total Revenue",
      value: `₹${stats.totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      color: "text-orange-600",
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your store performance</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Management Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link href="/admin/categories">
              <Button variant="outline" className="w-full justify-start h-auto p-4">
                <div className="flex items-center space-x-3">
                  <Tag className="h-5 w-5 text-blue-600" />
                  <div className="text-left">
                    <p className="font-medium">Categories</p>
                    <p className="text-sm text-muted-foreground">Manage product categories</p>
                  </div>
                  <ArrowRight className="h-4 w-4 ml-auto" />
                </div>
              </Button>
            </Link>
            
            <Link href="/admin/brands">
              <Button variant="outline" className="w-full justify-start h-auto p-4">
                <div className="flex items-center space-x-3">
                  <Award className="h-5 w-5 text-purple-600" />
                  <div className="text-left">
                    <p className="font-medium">Brands</p>
                    <p className="text-sm text-muted-foreground">Manage product brands</p>
                  </div>
                  <ArrowRight className="h-4 w-4 ml-auto" />
                </div>
              </Button>
            </Link>
            
            <Link href="/admin/banners">
              <Button variant="outline" className="w-full justify-start h-auto p-4">
                <div className="flex items-center space-x-3">
                  <Image className="h-5 w-5 text-green-600" />
                  <div className="text-left">
                    <p className="font-medium">Banners</p>
                    <p className="text-sm text-muted-foreground">Manage promotional banners</p>
                  </div>
                  <ArrowRight className="h-4 w-4 ml-auto" />
                </div>
              </Button>
            </Link>
            
            <Link href="/admin/testimonials">
              <Button variant="outline" className="w-full justify-start h-auto p-4">
                <div className="flex items-center space-x-3">
                  <MessageSquare className="h-5 w-5 text-orange-600" />
                  <div className="text-left">
                    <p className="font-medium">Testimonials</p>
                    <p className="text-sm text-muted-foreground">Manage customer reviews</p>
                  </div>
                  <ArrowRight className="h-4 w-4 ml-auto" />
                </div>
              </Button>
            </Link>
            
            <Link href="/admin/hero-images">
              <Button variant="outline" className="w-full justify-start h-auto p-4">
                <div className="flex items-center space-x-3">
                  <Star className="h-5 w-5 text-yellow-600" />
                  <div className="text-left">
                    <p className="font-medium">Hero Images</p>
                    <p className="text-sm text-muted-foreground">Manage homepage content</p>
                  </div>
                  <ArrowRight className="h-4 w-4 ml-auto" />
                </div>
              </Button>
            </Link>
            
            <Link href="/admin/products">
              <Button variant="outline" className="w-full justify-start h-auto p-4">
                <div className="flex items-center space-x-3">
                  <Package className="h-5 w-5 text-indigo-600" />
                  <div className="text-left">
                    <p className="font-medium">Products</p>
                    <p className="text-sm text-muted-foreground">Manage product catalog</p>
                  </div>
                  <ArrowRight className="h-4 w-4 ml-auto" />
                </div>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats.recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{order.customerName}</p>
                  <p className="text-sm text-muted-foreground">
                    Order #{order.id.slice(-8)} • {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">₹{order.amount.toFixed(2)}</p>
                  <p className="text-sm text-muted-foreground">{order.status}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
