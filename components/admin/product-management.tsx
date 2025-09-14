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
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

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
  const router = useRouter()

  // Create form state
  const [showCreate, setShowCreate] = useState(false)
  const [creating, setCreating] = useState(false)
  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    shortDescription: "",
    sku: "",
    price: "",
    comparePrice: "",
    inventoryQuantity: 0,
    isFeatured: false,
    brand: "",
    ageRange: "",
    categoryId: "",
    materials: "",
    safetyCertifications: "",
    isActive: true,
    metaTitle: "",
    metaDescription: "",
  })
  const [images, setImages] = useState<File[]>([])
  const [brandOptions, setBrandOptions] = useState<{ id: string; name: string }[]>([])
  const [categoryOptions, setCategoryOptions] = useState<{ id: string; name: string }[]>([])

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

  // Load brands and categories for dropdowns
  useEffect(() => {
    let aborted = false
    const loadOptions = async () => {
      try {
        const [brandsRes, catsRes] = await Promise.all([
          fetch(`/api/brands`), // public brands summary
          fetch(`/api/categories?active=true`), // public categories
        ])
        const brandsJson = await brandsRes.json().catch(() => ({}))
        const catsJson = await catsRes.json().catch(() => ({}))
        if (aborted) return
        const b = (brandsJson.brands || []).filter((x: any) => x.name).map((x: any) => ({ id: x.id || x.name, name: x.name }))
        const c = (catsJson.categories || []).filter((x: any) => x.isActive !== false).map((x: any) => ({ id: x.id, name: x.name }))
        setBrandOptions(b)
        setCategoryOptions(c)
      } catch {
        // ignore
      }
    }
    loadOptions()
    return () => {
      aborted = true
    }
  }, [])

  const pages = useMemo(() => Math.max(1, Math.ceil(total / limit)), [total, limit])

  const handleDeleteProduct = async (productId: string) => {
    try {
      const res = await fetch(`/api/admin/products/${productId}`, { method: "DELETE" })
      if (!res.ok) throw new Error(`Delete failed (${res.status})`)
      setProducts((prev) => prev.filter((p) => p.id !== productId))
      toast({ title: "Product deleted", description: "The product has been successfully deleted." })
    } catch (e: any) {
      toast({ title: "Delete failed", description: e.message, variant: "destructive" })
    }
  }

  const handleToggleStatus = async (productId: string) => {
    try {
      const current = products.find((p) => p.id === productId)
      if (!current) return
      const fd = new FormData()
      fd.append("product", JSON.stringify({ isActive: !(current.is_active ?? true) }))
      fd.append("imagesToDelete", JSON.stringify([]))
      const res = await fetch(`/api/admin/products/${productId}`, { method: "PUT", body: fd })
      if (!res.ok) throw new Error(`Update failed (${res.status})`)
      setProducts((prev) => prev.map((p) => (p.id === productId ? { ...p, is_active: !(current.is_active ?? true) } : p)))
      toast({ title: "Status updated", description: "Product status has been updated." })
    } catch (e: any) {
      toast({ title: "Update failed", description: e.message, variant: "destructive" })
    }
  }

  const getStatusBadge = (active: boolean | undefined, inventory: number) => {
    if (inventory <= 0) {
      return <Badge variant="destructive">Out of Stock</Badge>
    }
    if (active) {
      return <Badge variant="default">Published</Badge>
    }
    return <Badge variant="secondary">Unpublished</Badge>
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
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => router.push('/admin/products/new')}>
                <Plus className="mr-2 h-4 w-4" />
                Add Product
              </Button>
              <Button onClick={() => setShowCreate(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Product
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search and Create */}
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

          {showCreate && (
            <div className="mb-8 rounded-md border p-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Name</Label>
                  <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </div>
                <div>
                  <Label>Slug</Label>
                  <Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
                </div>
                <div className="md:col-span-2">
                  <Label>Description</Label>
                  <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                </div>
                <div className="md:col-span-2">
                  <Label>Short Description</Label>
                  <Textarea
                    value={form.shortDescription}
                    onChange={(e) => setForm({ ...form, shortDescription: e.target.value })}
                  />
                </div>
                <div>
                  <Label>SKU</Label>
                  <Input value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} />
                </div>
                <div>
                  <Label>Price</Label>
                  <Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
                </div>
                <div>
                  <Label>Compare Price</Label>
                  <Input
                    type="number"
                    value={form.comparePrice}
                    onChange={(e) => setForm({ ...form, comparePrice: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Inventory Quantity</Label>
                  <Input
                    type="number"
                    value={form.inventoryQuantity}
                    onChange={(e) => setForm({ ...form, inventoryQuantity: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <Label>Brand</Label>
                  <Select value={form.brand} onValueChange={(v) => setForm({ ...form, brand: v })}>
                    <SelectTrigger className="w-full"><SelectValue placeholder="Select a brand" /></SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {brandOptions.map((b) => (
                          <SelectItem key={b.id} value={b.name}>{b.name}</SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Age Range</Label>
                  <Input value={form.ageRange} onChange={(e) => setForm({ ...form, ageRange: e.target.value })} />
                </div>
                <div className="md:col-span-2">
                  <Label>Category</Label>
                  <Select value={form.categoryId} onValueChange={(v) => setForm({ ...form, categoryId: v })}>
                    <SelectTrigger className="w-full"><SelectValue placeholder="Select a category" /></SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {categoryOptions.map((c) => (
                          <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Materials (comma separated)</Label>
                  <Input value={form.materials} onChange={(e) => setForm({ ...form, materials: e.target.value })} />
                </div>
                <div>
                  <Label>Safety Certifications (comma separated)</Label>
                  <Input
                    value={form.safetyCertifications}
                    onChange={(e) => setForm({ ...form, safetyCertifications: e.target.value })}
                  />
                </div>
                <div className="md:col-span-2">
                  <Label>Images</Label>
                  <Input type="file" multiple accept="image/*" onChange={(e) => setImages(Array.from(e.target.files || []))} />
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  disabled={creating}
                  onClick={async () => {
                    setCreating(true)
                    try {
                      const fd = new FormData()
                      const payload = {
                        ...form,
                        materials: form.materials
                          ? form.materials
                              .split(",")
                              .map((s) => s.trim())
                              .filter(Boolean)
                          : undefined,
                        safetyCertifications: form.safetyCertifications
                          ? form.safetyCertifications
                              .split(",")
                              .map((s) => s.trim())
                              .filter(Boolean)
                          : undefined,
                        isFeatured: Boolean(form.isFeatured),
                        isActive: Boolean(form.isActive),
                      }
                      fd.append("product", JSON.stringify(payload))
                      images.forEach((img) => fd.append("images", img))
                      const res = await fetch("/api/admin/products", { method: "POST", body: fd })
                      if (!res.ok) {
                        const j = await res.json().catch(() => ({}))
                        throw new Error(j.error || `Failed (${res.status})`)
                      }
                      toast({ title: "Product created" })
                      setShowCreate(false)
                      setImages([])
                      setForm({
                        name: "",
                        slug: "",
                        description: "",
                        shortDescription: "",
                        sku: "",
                        price: "",
                        comparePrice: "",
                        inventoryQuantity: 0,
                        isFeatured: false,
                        brand: "",
                        ageRange: "",
                        categoryId: "",
                        materials: "",
                        safetyCertifications: "",
                        isActive: true,
                        metaTitle: "",
                        metaDescription: "",
                      })
                      // refresh list
                      setPage(1)
                      router.refresh()
                    } catch (e: any) {
                      toast({ title: "Create failed", description: e.message, variant: "destructive" })
                    } finally {
                      setCreating(false)
                    }
                  }}
                >
                  {creating ? "Creating..." : "Create Product"}
                </Button>
                <Button variant="outline" onClick={() => setShowCreate(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}

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
                            src={
                              product.images?.find((i) => i.isPrimary)?.url ||
                              product.images?.[0]?.url ||
                              "/placeholder.svg"
                            }
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{product.name}</div>
                          <div className="text-sm text-muted-foreground">
                            Created {product.created_at ? new Date(product.created_at).toLocaleDateString() : "-"}
                          </div>
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
                              {product.is_active ? "Unpublish" : "Publish"}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDeleteProduct(product.id)} className="text-destructive">
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
