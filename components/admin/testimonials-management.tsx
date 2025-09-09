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
import { Plus, Search, Edit, Trash2, Eye, EyeOff, Star, CheckCircle, XCircle } from "lucide-react"
import { toast } from "sonner"

interface Testimonial {
  id: string
  customerName: string
  customerEmail?: string
  customerLocation?: string
  customerImage?: string
  rating: number
  title: string
  content: string
  productId?: string
  isApproved: boolean
  isFeatured: boolean
  sortOrder: number
  createdAt: string
  updatedAt: string
}

interface TestimonialsResponse {
  success: boolean
  data: {
    testimonials: Testimonial[]
    pagination: {
      page: number
      limit: number
      total: number
      pages: number
    }
  }
}

export function TestimonialsManagement() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null)
  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    customerLocation: "",
    rating: 5,
    title: "",
    content: "",
    productId: "",
    isApproved: false,
    isFeatured: false,
    sortOrder: 0,
  })
  const [customerImageFile, setCustomerImageFile] = useState<File | null>(null)

  useEffect(() => {
    fetchTestimonials()
  }, [])

  const fetchTestimonials = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/admin/testimonials")
      if (response.ok) {
        const data: TestimonialsResponse = await response.json()
        setTestimonials(data.data.testimonials)
      } else {
        toast.error("Failed to fetch testimonials")
      }
    } catch (error) {
      console.error("Error fetching testimonials:", error)
      toast.error("Failed to fetch testimonials")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateTestimonial = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const formDataToSend = new FormData()
      formDataToSend.append("testimonial", JSON.stringify(formData))
      if (customerImageFile) {
        formDataToSend.append("customerImage", customerImageFile)
      }

      const response = await fetch("/api/admin/testimonials", {
        method: "POST",
        body: formDataToSend,
      })

      if (response.ok) {
        toast.success("Testimonial created successfully")
        setIsCreateDialogOpen(false)
        setFormData({ customerName: "", customerEmail: "", customerLocation: "", rating: 5, title: "", content: "", productId: "", isApproved: false, isFeatured: false, sortOrder: 0 })
        setCustomerImageFile(null)
        fetchTestimonials()
      } else {
        toast.error("Failed to create testimonial")
      }
    } catch (error) {
      console.error("Error creating testimonial:", error)
      toast.error("Failed to create testimonial")
    }
  }

  const handleEditTestimonial = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingTestimonial) return

    try {
      const formDataToSend = new FormData()
      formDataToSend.append("testimonial", JSON.stringify(formData))
      if (customerImageFile) {
        formDataToSend.append("customerImage", customerImageFile)
      }

      const response = await fetch(`/api/admin/testimonials/${editingTestimonial.id}`, {
        method: "PUT",
        body: formDataToSend,
      })

      if (response.ok) {
        toast.success("Testimonial updated successfully")
        setIsEditDialogOpen(false)
        setEditingTestimonial(null)
        setFormData({ customerName: "", customerEmail: "", customerLocation: "", rating: 5, title: "", content: "", productId: "", isApproved: false, isFeatured: false, sortOrder: 0 })
        setCustomerImageFile(null)
        fetchTestimonials()
      } else {
        toast.error("Failed to update testimonial")
      }
    } catch (error) {
      console.error("Error updating testimonial:", error)
      toast.error("Failed to update testimonial")
    }
  }

  const handleDeleteTestimonial = async (id: string) => {
    if (!confirm("Are you sure you want to delete this testimonial?")) return

    try {
      const response = await fetch(`/api/admin/testimonials/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast.success("Testimonial deleted successfully")
        fetchTestimonials()
      } else {
        toast.error("Failed to delete testimonial")
      }
    } catch (error) {
      console.error("Error deleting testimonial:", error)
      toast.error("Failed to delete testimonial")
    }
  }

  const handleToggleApproved = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/testimonials/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isApproved: !currentStatus }),
      })

      if (response.ok) {
        toast.success(`Testimonial ${!currentStatus ? "approved" : "unapproved"}`)
        fetchTestimonials()
      } else {
        toast.error("Failed to update testimonial approval status")
      }
    } catch (error) {
      console.error("Error updating testimonial approval status:", error)
      toast.error("Failed to update testimonial approval status")
    }
  }

  const handleToggleFeatured = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/testimonials/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isFeatured: !currentStatus }),
      })

      if (response.ok) {
        toast.success(`Testimonial ${!currentStatus ? "featured" : "unfeatured"}`)
        fetchTestimonials()
      } else {
        toast.error("Failed to update testimonial featured status")
      }
    } catch (error) {
      console.error("Error updating testimonial featured status:", error)
      toast.error("Failed to update testimonial featured status")
    }
  }

  const openEditDialog = (testimonial: Testimonial) => {
    setEditingTestimonial(testimonial)
    setFormData({
      customerName: testimonial.customerName,
      customerEmail: testimonial.customerEmail || "",
      customerLocation: testimonial.customerLocation || "",
      rating: testimonial.rating,
      title: testimonial.title,
      content: testimonial.content,
      productId: testimonial.productId || "",
      isApproved: testimonial.isApproved,
      isFeatured: testimonial.isFeatured,
      sortOrder: testimonial.sortOrder,
    })
    setIsEditDialogOpen(true)
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
      />
    ))
  }

  const filteredTestimonials = testimonials.filter(testimonial =>
    testimonial.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    testimonial.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    testimonial.content.toLowerCase().includes(searchTerm.toLowerCase())
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
          <h1 className="text-3xl font-bold">Testimonials Management</h1>
          <p className="text-muted-foreground">Manage customer testimonials and reviews</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Testimonial
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Testimonial</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateTestimonial} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="customerName">Customer Name</Label>
                  <Input
                    id="customerName"
                    value={formData.customerName}
                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="customerEmail">Customer Email</Label>
                  <Input
                    id="customerEmail"
                    type="email"
                    value={formData.customerEmail}
                    onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="customerLocation">Customer Location</Label>
                <Input
                  id="customerLocation"
                  value={formData.customerLocation}
                  onChange={(e) => setFormData({ ...formData, customerLocation: e.target.value })}
                />
              </div>
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
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  required
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="rating">Rating</Label>
                  <Select
                    value={formData.rating.toString()}
                    onValueChange={(value) => setFormData({ ...formData, rating: parseInt(value) })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 Star</SelectItem>
                      <SelectItem value="2">2 Stars</SelectItem>
                      <SelectItem value="3">3 Stars</SelectItem>
                      <SelectItem value="4">4 Stars</SelectItem>
                      <SelectItem value="5">5 Stars</SelectItem>
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
                  <Label htmlFor="productId">Product ID</Label>
                  <Input
                    id="productId"
                    value={formData.productId}
                    onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="isApproved">Approved</Label>
                  <Select
                    value={formData.isApproved.toString()}
                    onValueChange={(value) => setFormData({ ...formData, isApproved: value === "true" })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Approved</SelectItem>
                      <SelectItem value="false">Pending</SelectItem>
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
                <Label htmlFor="customerImage">Customer Image</Label>
                <Input
                  id="customerImage"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setCustomerImageFile(e.target.files?.[0] || null)}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Create Testimonial</Button>
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
                placeholder="Search testimonials..."
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
            {filteredTestimonials.map((testimonial) => (
              <div key={testimonial.id} className="flex items-start justify-between p-4 border rounded-lg">
                <div className="flex items-start space-x-4">
                  {testimonial.customerImage && (
                    <img
                      src={testimonial.customerImage}
                      alt={testimonial.customerName}
                      className="w-12 h-12 object-cover rounded-full"
                    />
                  )}
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-medium">{testimonial.customerName}</h3>
                      {testimonial.customerLocation && (
                        <span className="text-sm text-muted-foreground">• {testimonial.customerLocation}</span>
                      )}
                    </div>
                    <div className="flex items-center space-x-2 mb-2">
                      {renderStars(testimonial.rating)}
                    </div>
                    <h4 className="font-medium text-sm mb-1">{testimonial.title}</h4>
                    <p className="text-sm text-muted-foreground line-clamp-2">{testimonial.content}</p>
                    {testimonial.customerEmail && (
                      <p className="text-xs text-muted-foreground mt-1">{testimonial.customerEmail}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={testimonial.isApproved ? "default" : "secondary"}>
                    {testimonial.isApproved ? "Approved" : "Pending"}
                  </Badge>
                  {testimonial.isFeatured && (
                    <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                      Featured
                    </Badge>
                  )}
                  <span className="text-sm text-muted-foreground">Order: {testimonial.sortOrder}</span>
                  <div className="flex space-x-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleToggleApproved(testimonial.id, testimonial.isApproved)}
                    >
                      {testimonial.isApproved ? <XCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleToggleFeatured(testimonial.id, testimonial.isFeatured)}
                    >
                      ⭐
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => openEditDialog(testimonial)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDeleteTestimonial(testimonial.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            {filteredTestimonials.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No testimonials found
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Testimonial</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditTestimonial} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-customerName">Customer Name</Label>
                <Input
                  id="edit-customerName"
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit-customerEmail">Customer Email</Label>
                <Input
                  id="edit-customerEmail"
                  type="email"
                  value={formData.customerEmail}
                  onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="edit-customerLocation">Customer Location</Label>
              <Input
                id="edit-customerLocation"
                value={formData.customerLocation}
                onChange={(e) => setFormData({ ...formData, customerLocation: e.target.value })}
              />
            </div>
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
              <Label htmlFor="edit-content">Content</Label>
              <Textarea
                id="edit-content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                required
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="edit-rating">Rating</Label>
                <Select
                  value={formData.rating.toString()}
                  onValueChange={(value) => setFormData({ ...formData, rating: parseInt(value) })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 Star</SelectItem>
                    <SelectItem value="2">2 Stars</SelectItem>
                    <SelectItem value="3">3 Stars</SelectItem>
                    <SelectItem value="4">4 Stars</SelectItem>
                    <SelectItem value="5">5 Stars</SelectItem>
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
                <Label htmlFor="edit-productId">Product ID</Label>
                <Input
                  id="edit-productId"
                  value={formData.productId}
                  onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-isApproved">Approved</Label>
                <Select
                  value={formData.isApproved.toString()}
                  onValueChange={(value) => setFormData({ ...formData, isApproved: value === "true" })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Approved</SelectItem>
                    <SelectItem value="false">Pending</SelectItem>
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
              <Label htmlFor="edit-customerImage">Customer Image</Label>
              <Input
                id="edit-customerImage"
                type="file"
                accept="image/*"
                onChange={(e) => setCustomerImageFile(e.target.files?.[0] || null)}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Update Testimonial</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
