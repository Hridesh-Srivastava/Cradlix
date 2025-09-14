"use client"

import { useEffect, useMemo, useState } from "react"
import { Plus, Search, Edit, Trash2, Eye, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

interface AdminProductRow {
  id: string
  name: string
  sku: string
  price: string | number
  inventory_quantity: number
  category_name?: string | null
  is_active?: boolean
  created_at?: string
  images?: Array<{ id: string; url: string; isPrimary?: boolean }>
}

export function ProductManagement() {
  const [products, setProducts] = useState<AdminProductRow[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [page, setPage] = useState(1)
  const [limit] = useState(10)
  const [total, setTotal] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    const controller = new AbortController()
    const load = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const params = new URLSearchParams({ page: String(page), limit: String(limit) })
        if (searchQuery.trim()) params.set("search", searchQuery.trim())
        const res = await fetch(`/api/admin/products?${params.toString()}`, { signal: controller.signal })
        if (!res.ok) {
          if (res.status === 401) throw new Error("Unauthorized. Please login as admin.")
          throw new Error(`Failed to load products (${res.status})`)
        }
        const json = await res.json()
        const rows: AdminProductRow[] = json.data.products
        setProducts(rows)
        setTotal(json.data.pagination.total)
      } catch (e: any) {
        if (e.name === "AbortError") return
        setError(e.message || "Failed to load products")
      } finally {
        setIsLoading(false)
      }
    }
    load()
    return () => controller.abort()
  }, [page, limit, searchQuery])

  const pages = useMemo(() => Math.max(1, Math.ceil(total / limit)), [total, limit])

  const handleDeleteProduct = (productId: string) => {
    setProducts(products.filter((p) => p.id !== productId))
    toast({
      title: "Product deleted",
      description: "The product has been successfully deleted.",
    })
  }

  const handleToggleStatus = (productId: string) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId ? { ...p, is_active: p.is_active ? false : true } as AdminProductRow : p,
      ),
    )
    toast({
      title: "Status updated",
      description: "Product status has been updated.",
    })
  }

  const getStatusBadge = (active: boolean | undefined, inventory: number) => {
    if (inventory <= 0) {
      return <Badge variant="destructive">Out of Stock</Badge>
    }
    if (active) {
      return <Badge variant="default">Active</Badge>
    }
    return <Badge variant="secondary">Inactive</Badge>
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Product Management</CardTitle>
              <CardDescription>Manage your product catalog, inventory, and pricing</CardDescription>
            </div>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search and Filters */}
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Products Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Image</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Inventory</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[70px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center">
                      <LoadingSpinner />
                    </TableCell>
                  </TableRow>
                ) : products.length > 0 ? (
                  products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="relative h-12 w-12 rounded-md overflow-hidden">
                        <Image
                          src={product.images?.find((i) => i.isPrimary)?.url || product.images?.[0]?.url || "/placeholder.svg"}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{product.name}</div>
                        <div className="text-sm text-muted-foreground">Created {product.created_at ? new Date(product.created_at).toLocaleDateString() : "-"}</div>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm">{product.sku}</TableCell>
                    <TableCell>{product.category_name || "-"}</TableCell>
                    <TableCell className="font-medium">₹{product.price}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span>{product.inventory_quantity}</span>
                        {product.inventory_quantity <= 5 && product.inventory_quantity > 0 && (
                          <Badge variant="outline" className="text-xs">
                            Low
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(product.is_active ?? true, product.inventory_quantity)}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleToggleStatus(product.id)}>
                            {product.is_active ? "Deactivate" : "Activate"}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeleteProduct(product.id)}
                            className="text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      <p className="text-muted-foreground">No products found.</p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between py-4">
            <div className="text-sm text-muted-foreground">
              Page {page} of {pages} • {total} total
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
                Previous
              </Button>
              <Button variant="outline" size="sm" disabled={page >= pages} onClick={() => setPage((p) => Math.min(pages, p + 1))}>
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
