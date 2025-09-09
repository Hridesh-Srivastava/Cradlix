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
import { Plus, Search, Edit, Trash2, Eye, EyeOff, Calendar } from "lucide-react"
import { toast } from "sonner"

interface Banner {
  id: string
  title: string
  subtitle?: string
  description?: string
  buttonText?: string
  buttonLink?: string
  position: string
  image?: string
  mobileImage?: string
  isActive: boolean
  startDate?: string
  endDate?: string
  sortOrder: number
  createdAt: string
  updatedAt: string
}

interface BannersResponse {
  success: boolean
  data: {
    banners: Banner[]
    pagination: {
      page: number
      limit: number
      total: number
      pages: number
    }
  }
}

export function BannersManagement() {
  const [banners, setBanners] = useState<Banner[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    description: "",
    buttonText: "",
    buttonLink: "",
    position: "hero",
    isActive: true,
    startDate: "",
    endDate: "",
    sortOrder: 0,
  })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [mobileImageFile, setMobileImageFile] = useState<File | null>(null)

  useEffect(() => {
    fetchBanners()
  }, [])

  const fetchBanners = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/admin/banners")
      if (response.ok) {
        const data: BannersResponse = await response.json()
        setBanners(data.data.banners)
      } else {
        toast.error("Failed to fetch banners")
      }
    } catch (error) {
      console.error("Error fetching banners:", error)
      toast.error("Failed to fetch banners")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateBanner = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const formDataToSend = new FormData()
      formDataToSend.append("banner", JSON.stringify(formData))
      if (imageFile) {
        formDataToSend.append("image", imageFile)
      }
      if (mobileImageFile) {
        formDataToSend.append("mobileImage", mobileImageFile)
      }

      const response = await fetch("/api/admin/banners", {
        method: "POST",
        body: formDataToSend,
      })

      if (response.ok) {
        toast.success("Banner created successfully")
        setIsCreateDialogOpen(false)
        setFormData({ title: "", subtitle: "", description: "", buttonText: "", buttonLink: "", position: "hero", isActive: true, startDate: "", endDate: "", sortOrder: 0 })
        setImageFile(null)
        setMobileImageFile(null)
        fetchBanners()
      } else {
        toast.error("Failed to create banner")
      }
    } catch (error) {
      console.error("Error creating banner:", error)
      toast.error("Failed to create banner")
    }
  }

  const handleEditBanner = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingBanner) return

    try {
      const formDataToSend = new FormData()
      formDataToSend.append("banner", JSON.stringify(formData))
      if (imageFile) {
        formDataToSend.append("image", imageFile)
      }
      if (mobileImageFile) {
        formDataToSend.append("mobileImage", mobileImageFile)
      }

      const response = await fetch(`/api/admin/banners/${editingBanner.id}`, {
        method: "PUT",
        body: formDataToSend,
      })

      if (response.ok) {
        toast.success("Banner updated successfully")
        setIsEditDialogOpen(false)
        setEditingBanner(null)
        setFormData({ title: "", subtitle: "", description: "", buttonText: "", buttonLink: "", position: "hero", isActive: true, startDate: "", endDate: "", sortOrder: 0 })
        setImageFile(null)
        setMobileImageFile(null)
        fetchBanners()
      } else {
        toast.error("Failed to update banner")
      }
    } catch (error) {
      console.error("Error updating banner:", error)
      toast.error("Failed to update banner")
    }
  }

  const handleDeleteBanner = async (id: string) => {
    if (!confirm("Are you sure you want to delete this banner?")) return

    try {
      const response = await fetch(`/api/admin/banners/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast.success("Banner deleted successfully")
        fetchBanners()
      } else {
        toast.error("Failed to delete banner")
      }
    } catch (error) {
      console.error("Error deleting banner:", error)
      toast.error("Failed to delete banner")
    }
  }

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/banners/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !currentStatus }),
      })

      if (response.ok) {
        toast.success(`Banner ${!currentStatus ? "activated" : "deactivated"}`)
        fetchBanners()
      } else {
        toast.error("Failed to update banner status")
      }
    } catch (error) {
      console.error("Error updating banner status:", error)
      toast.error("Failed to update banner status")
    }
  }

  const openEditDialog = (banner: Banner) => {
    setEditingBanner(banner)
    setFormData({
      title: banner.title,
      subtitle: banner.subtitle || "",
      description: banner.description || "",
      buttonText: banner.buttonText || "",
      buttonLink: banner.buttonLink || "",
      position: banner.position,
      isActive: banner.isActive,
      startDate: banner.startDate ? new Date(banner.startDate).toISOString().split('T')[0] : "",
      endDate: banner.endDate ? new Date(banner.endDate).toISOString().split('T')[0] : "",
      sortOrder: banner.sortOrder,
    })
    setIsEditDialogOpen(true)
  }

  const filteredBanners = banners.filter(banner =>
    banner.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    banner.subtitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    banner.description?.toLowerCase().includes(searchTerm.toLowerCase())
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
          <h1 className="text-3xl font-bold">Banners Management</h1>
          <p className="text-muted-foreground">Manage promotional banners and advertisements</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Banner
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Create New Banner</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateBanner} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="subtitle">Subtitle</Label>
                  <Input
                    id="subtitle"
                    value={formData.subtitle}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="buttonText">Button Text</Label>
                  <Input
                    id="buttonText"
                    value={formData.buttonText}
                    onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="buttonLink">Button Link</Label>
                  <Input
                    id="buttonLink"
                    type="url"
                    value={formData.buttonLink}
                    onChange={(e) => setFormData({ ...formData, buttonLink: e.target.value })}
                    placeholder="https://example.com"
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="position">Position</Label>
                  <Select
                    value={formData.position}
                    onValueChange={(value) => setFormData({ ...formData, position: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hero">Hero</SelectItem>
                      <SelectItem value="top">Top</SelectItem>
                      <SelectItem value="middle">Middle</SelectItem>
                      <SelectItem value="bottom">Bottom</SelectItem>
                      <SelectItem value="sidebar">Sidebar</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
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
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="image">Desktop Image</Label>
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                  />
                </div>
                <div>
                  <Label htmlFor="mobileImage">Mobile Image</Label>
                  <Input
                    id="mobileImage"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setMobileImageFile(e.target.files?.[0] || null)}
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Create Banner</Button>
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
                placeholder="Search banners..."
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
            {filteredBanners.map((banner) => (
              <div key={banner.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  {banner.image && (
                    <img
                      src={banner.image}
                      alt={banner.title}
                      className="w-16 h-12 object-cover rounded-lg"
                    />
                  )}
                  <div>
                    <h3 className="font-medium">{banner.title}</h3>
                    {banner.subtitle && (
                      <p className="text-sm text-muted-foreground">{banner.subtitle}</p>
                    )}
                    {banner.description && (
                      <p className="text-sm text-muted-foreground mt-1">{banner.description}</p>
                    )}
                    <div className="flex items-center space-x-4 mt-2">
                      <Badge variant="outline">{banner.position}</Badge>
                      {banner.startDate && banner.endDate && (
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Calendar className="h-3 w-3 mr-1" />
                          {new Date(banner.startDate).toLocaleDateString()} - {new Date(banner.endDate).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={banner.isActive ? "default" : "secondary"}>
                    {banner.isActive ? "Active" : "Inactive"}
                  </Badge>
                  <span className="text-sm text-muted-foreground">Order: {banner.sortOrder}</span>
                  <div className="flex space-x-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleToggleActive(banner.id, banner.isActive)}
                    >
                      {banner.isActive ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => openEditDialog(banner)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDeleteBanner(banner.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            {filteredBanners.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No banners found
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Edit Banner</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditBanner} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-title">Title</Label>
                <Input
                  id="edit-title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit-subtitle">Subtitle</Label>
                <Input
                  id="edit-subtitle"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
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
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-buttonText">Button Text</Label>
                <Input
                  id="edit-buttonText"
                  value={formData.buttonText}
                  onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-buttonLink">Button Link</Label>
                <Input
                  id="edit-buttonLink"
                  type="url"
                  value={formData.buttonLink}
                  onChange={(e) => setFormData({ ...formData, buttonLink: e.target.value })}
                  placeholder="https://example.com"
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="edit-position">Position</Label>
                <Select
                  value={formData.position}
                  onValueChange={(value) => setFormData({ ...formData, position: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hero">Hero</SelectItem>
                    <SelectItem value="top">Top</SelectItem>
                    <SelectItem value="middle">Middle</SelectItem>
                    <SelectItem value="bottom">Bottom</SelectItem>
                    <SelectItem value="sidebar">Sidebar</SelectItem>
                  </SelectContent>
                </Select>
              </div>
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
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-startDate">Start Date</Label>
                <Input
                  id="edit-startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-endDate">End Date</Label>
                <Input
                  id="edit-endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-image">Desktop Image</Label>
                <Input
                  id="edit-image"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                />
              </div>
              <div>
                <Label htmlFor="edit-mobileImage">Mobile Image</Label>
                <Input
                  id="edit-mobileImage"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setMobileImageFile(e.target.files?.[0] || null)}
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Update Banner</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
