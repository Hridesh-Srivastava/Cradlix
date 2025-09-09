"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Plus, Search, Edit, Trash2, Eye, EyeOff, ExternalLink } from "lucide-react"
import { toast } from "sonner"

interface Brand {
  id: string
  name: string
  slug: string
  description?: string
  website?: string
  logo?: string
  isActive: boolean
  isFeatured: boolean
  sortOrder: number
  createdAt: string
  updatedAt: string
}

interface BrandsResponse {
  success: boolean
  data: {
    brands: Brand[]
    pagination: {
      page: number
      limit: number
      total: number
      pages: number
    }
  }
}

export function BrandsManagement() {
  const [brands, setBrands] = useState<Brand[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    website: "",
    isActive: true,
    isFeatured: false,
    sortOrder: 0,
  })
  const [logoFile, setLogoFile] = useState<File | null>(null)

  useEffect(() => {
    fetchBrands()
  }, [])

  const fetchBrands = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/admin/brands")
      if (response.ok) {
        const data: BrandsResponse = await response.json()
        setBrands(data.data.brands)
      } else {
        toast.error("Failed to fetch brands")
      }
    } catch (error) {
      console.error("Error fetching brands:", error)
      toast.error("Failed to fetch brands")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateBrand = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const formDataToSend = new FormData()
      formDataToSend.append("brand", JSON.stringify(formData))
      if (logoFile) {
        formDataToSend.append("logo", logoFile)
      }

      const response = await fetch("/api/admin/brands", {
        method: "POST",
        body: formDataToSend,
      })

      if (response.ok) {
        toast.success("Brand created successfully")
        setIsCreateDialogOpen(false)
        setFormData({ name: "", slug: "", description: "", website: "", isActive: true, isFeatured: false, sortOrder: 0 })
        setLogoFile(null)
        fetchBrands()
      } else {
        toast.error("Failed to create brand")
      }
    } catch (error) {
      console.error("Error creating brand:", error)
      toast.error("Failed to create brand")
    }
  }

  const handleEditBrand = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingBrand) return

    try {
      const formDataToSend = new FormData()
      formDataToSend.append("brand", JSON.stringify(formData))
      if (logoFile) {
        formDataToSend.append("logo", logoFile)
      }

      const response = await fetch(`/api/admin/brands/${editingBrand.id}`, {
        method: "PUT",
        body: formDataToSend,
      })

      if (response.ok) {
        toast.success("Brand updated successfully")
        setIsEditDialogOpen(false)
        setEditingBrand(null)
        setFormData({ name: "", slug: "", description: "", website: "", isActive: true, isFeatured: false, sortOrder: 0 })
        setLogoFile(null)
        fetchBrands()
      } else {
        toast.error("Failed to update brand")
      }
    } catch (error) {
      console.error("Error updating brand:", error)
      toast.error("Failed to update brand")
    }
  }

  const handleDeleteBrand = async (id: string) => {
    if (!confirm("Are you sure you want to delete this brand?")) return

    try {
      const response = await fetch(`/api/admin/brands/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast.success("Brand deleted successfully")
        fetchBrands()
      } else {
        toast.error("Failed to delete brand")
      }
    } catch (error) {
      console.error("Error deleting brand:", error)
      toast.error("Failed to delete brand")
    }
  }

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/brands/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !currentStatus }),
      })

      if (response.ok) {
        toast.success(`Brand ${!currentStatus ? "activated" : "deactivated"}`)
        fetchBrands()
      } else {
        toast.error("Failed to update brand status")
      }
    } catch (error) {
      console.error("Error updating brand status:", error)
      toast.error("Failed to update brand status")
    }
  }

  const handleToggleFeatured = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/brands/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isFeatured: !currentStatus }),
      })

      if (response.ok) {
        toast.success(`Brand ${!currentStatus ? "featured" : "unfeatured"}`)
        fetchBrands()
      } else {
        toast.error("Failed to update brand featured status")
      }
    } catch (error) {
      console.error("Error updating brand featured status:", error)
      toast.error("Failed to update brand featured status")
    }
  }

  const openEditDialog = (brand: Brand) => {
    setEditingBrand(brand)
    setFormData({
      name: brand.name,
      slug: brand.slug,
      description: brand.description || "",
      website: brand.website || "",
      isActive: brand.isActive,
      isFeatured: brand.isFeatured,
      sortOrder: brand.sortOrder,
    })
    setIsEditDialogOpen(true)
  }

  const filteredBrands = brands.filter(brand =>
    brand.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    brand.description?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner className="h-8 w-8" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Brands Management</h1>
          <p className="text-muted-foreground">Manage product brands and manufacturers</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Brand
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Brand</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateBrand} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="slug">Slug</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="website">Website URL</Label>
                <Input
                  id="website"
                  type="url"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  placeholder="https://example.com"
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="sortOrder">Sort Order</Label>
                  <Input
                    id="sortOrder"
                    type="number"
                    value={formData.sortOrder}
                    onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div>
                  <Label htmlFor="isActive">Status</Label>
                  <Select
                    value={formData.isActive.toString()}
                    onValueChange={(value) => setFormData({ ...formData, isActive: value === "true" })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Active</SelectItem>
                      <SelectItem value="false">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="isFeatured">Featured</Label>
                  <Select
                    value={formData.isFeatured.toString()}
                    onValueChange={(value) => setFormData({ ...formData, isFeatured: value === "true" })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Featured</SelectItem>
                      <SelectItem value="false">Not Featured</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="logo">Brand Logo</Label>
                <Input
                  id="logo"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Create Brand</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <Input
                placeholder="Search brands..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
            <Search className="h-4 w-4 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredBrands.map((brand) => (
              <div key={brand.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  {brand.logo && (
                    <img
                      src={brand.logo}
                      alt={brand.name}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                  )}
                  <div>
                    <h3 className="font-medium">{brand.name}</h3>
                    <p className="text-sm text-muted-foreground">{brand.slug}</p>
                    {brand.description && (
                      <p className="text-sm text-muted-foreground mt-1">{brand.description}</p>
                    )}
                    {brand.website && (
                      <a
                        href={brand.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline flex items-center mt-1"
                      >
                        <ExternalLink className="h-3 w-3 mr-1" />
                        {brand.website}
                      </a>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={brand.isActive ? "default" : "secondary"}>
                    {brand.isActive ? "Active" : "Inactive"}
                  </Badge>
                  {brand.isFeatured && (
                    <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                      Featured
                    </Badge>
                  )}
                  <span className="text-sm text-muted-foreground">Order: {brand.sortOrder}</span>
                  <div className="flex space-x-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleToggleActive(brand.id, brand.isActive)}
                    >
                      {brand.isActive ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleToggleFeatured(brand.id, brand.isFeatured)}
                    >
                      ⭐
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => openEditDialog(brand)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDeleteBrand(brand.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            {filteredBrands.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No brands found
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Brand</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditBrand} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-name">Name</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit-slug">Slug</Label>
                <Input
                  id="edit-slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  required
                />
              </div>
            </div>
            <div>
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="edit-website">Website URL</Label>
              <Input
                id="edit-website"
                type="url"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                placeholder="https://example.com"
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="edit-sortOrder">Sort Order</Label>
                <Input
                  id="edit-sortOrder"
                  type="number"
                  value={formData.sortOrder}
                  onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div>
                <Label htmlFor="edit-isActive">Status</Label>
                <Select
                  value={formData.isActive.toString()}
                  onValueChange={(value) => setFormData({ ...formData, isActive: value === "true" })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Active</SelectItem>
                    <SelectItem value="false">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-isFeatured">Featured</Label>
                <Select
                  value={formData.isFeatured.toString()}
                  onValueChange={(value) => setFormData({ ...formData, isFeatured: value === "true" })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Featured</SelectItem>
                    <SelectItem value="false">Not Featured</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="edit-logo">Brand Logo</Label>
              <Input
                id="edit-logo"
                type="file"
                accept="image/*"
                onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Update Brand</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
