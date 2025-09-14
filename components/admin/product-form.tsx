"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

export function ProductCreateForm() {
  const router = useRouter()
  const { toast } = useToast()
  const [creating, setCreating] = useState(false)
  const [images, setImages] = useState<File[]>([])
  const MAX_IMAGES = 10
  const [brandOptions, setBrandOptions] = useState<{ id: string; name: string }[]>([])
  const [categoryOptions, setCategoryOptions] = useState<{ id: string; name: string }[]>([])
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
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Slug helper
  const slugify = (s: string) =>
    s
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .slice(0, 120)

  // Auto-generate slug if empty when name changes
  useEffect(() => {
    if (form.name && !form.slug) {
      setForm((prev) => ({ ...prev, slug: slugify(form.name) }))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.name])

  // Load brands and categories
  useEffect(() => {
    let aborted = false
    const loadOptions = async () => {
      try {
        const [brandsRes, catsRes] = await Promise.all([
          fetch(`/api/brands`),
          fetch(`/api/categories?active=true`),
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
    return () => { aborted = true }
  }, [])

  const submit = async () => {
    // Client-side validation
    const vErrors: Record<string, string> = {}
    if (!form.name.trim()) vErrors.name = "Name is required"
    const slug = form.slug.trim() || slugify(form.name)
    if (!slug) vErrors.slug = "Slug is required"
    if (!form.sku.trim()) vErrors.sku = "SKU is required"
    if (!form.price || isNaN(Number(form.price))) vErrors.price = "Valid price is required"
    if (!form.categoryId) vErrors.categoryId = "Category is required"
    if (!form.brand) vErrors.brand = "Brand is required"
    setErrors(vErrors)
    if (Object.keys(vErrors).length > 0) {
      toast({ title: "Please fix form errors", description: Object.values(vErrors).join(" • "), variant: "destructive" })
      return
    }

    setCreating(true)
    try {
      const fd = new FormData()
      const payload = {
        ...form,
        slug,
        materials: form.materials
          ? form.materials.split(",").map((s) => s.trim()).filter(Boolean)
          : undefined,
        safetyCertifications: form.safetyCertifications
          ? form.safetyCertifications.split(",").map((s) => s.trim()).filter(Boolean)
          : undefined,
        isFeatured: Boolean(form.isFeatured),
        isActive: Boolean(form.isActive),
        price: String(Number(form.price).toFixed(2)),
        comparePrice: form.comparePrice ? String(Number(form.comparePrice).toFixed(2)) : undefined,
      }
      fd.append("product", JSON.stringify(payload))
      images.forEach((img) => fd.append("images", img))
      const res = await fetch("/api/admin/products", { method: "POST", body: fd })
      if (!res.ok) {
        const j = await res.json().catch(() => ({}))
        throw new Error(j.error || `Failed (${res.status})`)
      }
      toast({ title: "Product created", description: "The product has been created and can be published." })
      router.push("/admin/products")
      router.refresh()
    } catch (e: any) {
      toast({ title: "Create failed", description: e.message, variant: "destructive" })
    } finally {
      setCreating(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add Product</CardTitle>
          <CardDescription>Fill in all details to add a new product and publish</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Name</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              {errors.name && <p className="text-xs text-destructive mt-1">{errors.name}</p>}
            </div>
            <div>
              <Label>Slug</Label>
              <Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
              {errors.slug && <p className="text-xs text-destructive mt-1">{errors.slug}</p>}
            </div>
            <div className="md:col-span-2">
              <Label>Description</Label>
              <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
            <div className="md:col-span-2">
              <Label>Short Description</Label>
              <Textarea value={form.shortDescription} onChange={(e) => setForm({ ...form, shortDescription: e.target.value })} />
            </div>
            <div>
              <Label>SKU</Label>
              <Input value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} />
              {errors.sku && <p className="text-xs text-destructive mt-1">{errors.sku}</p>}
            </div>
            <div>
              <Label>Price</Label>
              <Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
              {errors.price && <p className="text-xs text-destructive mt-1">{errors.price}</p>}
            </div>
            <div>
              <Label>Compare Price</Label>
              <Input type="number" value={form.comparePrice} onChange={(e) => setForm({ ...form, comparePrice: e.target.value })} />
            </div>
            <div>
              <Label>Inventory Quantity</Label>
              <Input type="number" value={form.inventoryQuantity} onChange={(e) => setForm({ ...form, inventoryQuantity: Number(e.target.value) })} />
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
              {errors.brand && <p className="text-xs text-destructive mt-1">{errors.brand}</p>}
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
              {errors.categoryId && <p className="text-xs text-destructive mt-1">{errors.categoryId}</p>}
            </div>
            <div>
              <Label>Materials (comma separated)</Label>
              <Input value={form.materials} onChange={(e) => setForm({ ...form, materials: e.target.value })} />
            </div>
            <div>
              <Label>Safety Certifications (comma separated)</Label>
              <Input value={form.safetyCertifications} onChange={(e) => setForm({ ...form, safetyCertifications: e.target.value })} />
            </div>
            <div className="md:col-span-2 space-y-2">
              <Label>Images</Label>
              <Input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => {
                  const selected = Array.from(e.target.files || [])
                  if (selected.length === 0) return
                  const available = Math.max(0, MAX_IMAGES - images.length)
                  const next = selected.slice(0, available)
                  if (selected.length > available) {
                    toast({ title: `Max ${MAX_IMAGES} images`, description: `Only the first ${available} file(s) were added.`, variant: "destructive" })
                  }
                  setImages((prev) => [...prev, ...next])
                }}
              />
              <p className="text-xs text-muted-foreground">Upload up to {MAX_IMAGES} images. First image is primary.</p>
              {images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                  {images.map((file, idx) => (
                    <div key={idx} className="relative border rounded overflow-hidden">
                      <img src={URL.createObjectURL(file)} alt={`image-${idx}`} className="h-24 w-full object-cover" />
                      <div className="absolute top-1 left-1">
                        {idx === 0 ? (
                          <span className="px-1.5 py-0.5 text-[10px] rounded bg-primary text-white">Primary</span>
                        ) : (
                          <button
                            type="button"
                            className="px-1.5 py-0.5 text-[10px] rounded bg-secondary"
                            onClick={() => setImages((prev) => {
                              const copy = [...prev]
                              const [item] = copy.splice(idx, 1)
                              copy.unshift(item)
                              return copy
                            })}
                          >
                            Make primary
                          </button>
                        )}
                      </div>
                      <button
                        type="button"
                        className="absolute top-1 right-1 px-1.5 py-0.5 text-[10px] rounded bg-destructive text-white"
                        onClick={() => setImages((prev) => prev.filter((_, i) => i !== idx))}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <div className="text-xs text-muted-foreground">Selected {images.length}/{MAX_IMAGES}</div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={submit} disabled={creating}>{creating ? "Creating..." : "Create Product"}</Button>
            <Button variant="outline" onClick={() => router.push("/admin/products")}>Cancel</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
