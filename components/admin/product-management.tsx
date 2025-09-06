"use client"

import { useState } from "react"
import { Plus, Search, Edit, Trash2, Eye, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"

// Mock products data for admin
const mockAdminProducts = [
  {
    id: "1",
    name: "Organic Cotton Teddy Bear",
    sku: "TOY-TEDDY-001",
    price: "24.99",
    inventoryQuantity: 15,
    category: "Soft Toys",
    status: "active",
    image: "/organic-cotton-teddy-bear-soft-toy.jpg",
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    name: "Wooden Stacking Rings",
    sku: "TOY-STACK-001",
    price: "18.99",
    inventoryQuantity: 8,
    category: "Educational Toys",
    status: "active",
    image: "/wooden-stacking-rings-educational-toy.jpg",
    createdAt: "2024-01-10",
  },
  {
    id: "3",
    name: "Baby Bottle Set",
    sku: "FEED-BOTTLE-001",
    price: "32.99",
    inventoryQuantity: 0,
    category: "Feeding",
    status: "out_of_stock",
    image: "/baby-bottle-feeding-set-bpa-free.jpg",
    createdAt: "2024-01-05",
  },
]

export function ProductManagement() {
  const [products, setProducts] = useState(mockAdminProducts)
  const [searchQuery, setSearchQuery] = useState("")
  const { toast } = useToast()

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleDeleteProduct = (productId: string) => {
    setProducts(products.filter((p) => p.id !== productId))
    toast({
      title: "Product deleted",
      description: "The product has been successfully deleted.",
    })
  }

  const handleToggleStatus = (productId: string) => {
    setProducts(
      products.map((p) => (p.id === productId ? { ...p, status: p.status === "active" ? "inactive" : "active" } : p)),
    )
    toast({
      title: "Status updated",
      description: "Product status has been updated.",
    })
  }

  const getStatusBadge = (status: string, inventory: number) => {
    if (inventory === 0) {
      return <Badge variant="destructive">Out of Stock</Badge>
    }
    if (status === "active") {
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
                {filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="relative h-12 w-12 rounded-md overflow-hidden">
                        <Image
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{product.name}</div>
                        <div className="text-sm text-muted-foreground">Created {product.createdAt}</div>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm">{product.sku}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell className="font-medium">₹{product.price}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span>{product.inventoryQuantity}</span>
                        {product.inventoryQuantity <= 5 && product.inventoryQuantity > 0 && (
                          <Badge variant="outline" className="text-xs">
                            Low
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(product.status, product.inventoryQuantity)}</TableCell>
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
                            {product.status === "active" ? "Deactivate" : "Activate"}
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
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No products found matching your search.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
