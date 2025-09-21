"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Mail, Calendar, Edit, Save, MapPin, Trash2, Camera, Cloud, ArrowLeft } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"

interface Address {
  id: string
  type: "home" | "work" | "other"
  name: string
  phone: string
  address: string
  city: string
  state: string
  pincode: string
  isDefault: boolean
}

interface UserProfile {
  id: string
  name: string
  email: string
  image: string
  role: string
  emailVerified: string
  createdAt: string
  addresses: Address[]
}

export function SuperAdminProfile() {
  const { data: session, update } = useSession()
  const { toast } = useToast()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({ name: "", email: "" })
  const [avatarUploading, setAvatarUploading] = useState(false)
  const [addresses, setAddresses] = useState<Address[]>([])
  const [addrForm, setAddrForm] = useState({
    id: "",
    type: "home" as "home" | "work" | "other",
    name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    isDefault: false,
  })
  const [addrLoading, setAddrLoading] = useState(false)

  // Simple, robust session handling
  useEffect(() => {
    if (session?.user) {
      fetchProfile()
    } else {
      setLoading(false)
    }
  }, [session])

  const fetchProfile = async () => {
    try {
      setLoading(true)
      
      const res = await fetch("/api/user/profile")
      
      if (res.ok) {
        const data = await res.json()
        if (data.profile) {
          setProfile(data.profile)
          setFormData({ name: data.profile.name, email: data.profile.email })
        }
      } else {
        console.error('Failed to fetch profile:', res.status)
        toast({ 
          title: "Error", 
          description: "Failed to load profile data", 
          variant: "destructive" 
        })
      }
      
      // fetch addresses
      const ar = await fetch("/api/user/addresses")
      if (ar.ok) {
        const a = await ar.json()
        setAddresses(a.addresses || [])
      }
    } catch (e) {
      console.error('Profile fetch error:', e)
      toast({ 
        title: "Error", 
        description: "Failed to load profile data", 
        variant: "destructive" 
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        // Email is locked; only send name and existing email to satisfy API
        body: JSON.stringify({ name: formData.name, email: formData.email }),
      })
      if (res.ok) {
        const data = await res.json()
        setProfile(data.profile)
        toast({ title: "Profile updated successfully" })
        setIsEditing(false)
        await update()
      }
    } finally {
      setSaving(false)
    }
  }

  // Avatar handlers (reuse existing endpoints)
  const handleAvatarUpload = async (file: File) => {
    try {
      setAvatarUploading(true)
      const fd = new FormData()
      fd.append("avatar", file)
      
      const res = await fetch("/api/user/avatar", { 
        method: "POST", 
        body: fd,
        credentials: 'include' // Ensure cookies are sent
      })
      
      if (res.ok) {
        const data = await res.json()
        setProfile((prev) => (prev ? { ...prev, image: data.avatarUrl } : prev))
        toast({ title: "Avatar updated successfully" })
        // Force session update to sync avatar across all components
        await update()
        
        // Dispatch custom event for real-time avatar sync
        const event = new CustomEvent('avatarUpdated', { 
          detail: { avatarUrl: data.avatarUrl } 
        })
        window.dispatchEvent(event)
      } else {
        const errorData = await res.json().catch(() => ({ error: 'Unknown error' }))
        toast({ 
          title: "Failed to upload avatar", 
          description: errorData.error || 'Please try again',
          variant: "destructive" 
        })
      }
    } catch (error) {
      console.error('Avatar upload error:', error)
      toast({ 
        title: "Upload failed", 
        description: "Network error. Please check your connection and try again.",
        variant: "destructive" 
      })
    } finally {
      setAvatarUploading(false)
    }
  }

  const handleSyncGoogleAvatar = async () => {
    try {
      setAvatarUploading(true)
      const res = await fetch("/api/user/avatar/sync-google", { 
        method: "POST",
        credentials: 'include' // Ensure cookies are sent
      })
      if (res.ok) {
        const data = await res.json()
        setProfile((prev) => (prev ? { ...prev, image: data.avatarUrl } : prev))
        toast({ title: "Google avatar synced to Cloudinary" })
        await update()
        
        // Dispatch custom event for real-time avatar sync
        const event = new CustomEvent('avatarUpdated', { 
          detail: { avatarUrl: data.avatarUrl } 
        })
        window.dispatchEvent(event)
      } else {
        const errorData = await res.json().catch(() => ({ error: 'Unknown error' }))
        toast({ 
          title: "Failed to sync Google avatar", 
          description: errorData.error || 'Please try again',
          variant: "destructive" 
        })
      }
    } catch (error) {
      console.error('Google avatar sync error:', error)
      toast({ 
        title: "Sync failed", 
        description: "Network error. Please check your connection and try again.",
        variant: "destructive" 
      })
    } finally {
      setAvatarUploading(false)
    }
  }

  const handleDeleteAvatar = async () => {
    try {
      setAvatarUploading(true)
      const res = await fetch("/api/user/avatar", { 
        method: "DELETE",
        credentials: 'include' // Ensure cookies are sent
      })
      if (res.ok) {
        setProfile((prev) => (prev ? { ...prev, image: null as any } : prev))
        toast({ title: "Avatar deleted" })
        await update()
        
        // Dispatch custom event for real-time avatar sync
        const event = new CustomEvent('avatarUpdated', { 
          detail: { avatarUrl: null } 
        })
        window.dispatchEvent(event)
      } else {
        const errorData = await res.json().catch(() => ({ error: 'Unknown error' }))
        toast({ 
          title: "Failed to delete avatar", 
          description: errorData.error || 'Please try again',
          variant: "destructive" 
        })
      }
    } catch (error) {
      console.error('Avatar delete error:', error)
      toast({ 
        title: "Delete failed", 
        description: "Network error. Please check your connection and try again.",
        variant: "destructive" 
      })
    } finally {
      setAvatarUploading(false)
    }
  }

  // Address CRUD
  const refreshAddresses = async () => {
    const ar = await fetch("/api/user/addresses")
    if (ar.ok) {
      const a = await ar.json()
      setAddresses(a.addresses || [])
    }
  }

  const saveAddress = async () => {
    setAddrLoading(true)
    try {
      const payload = { ...addrForm }
      if (payload.id) {
        await fetch("/api/user/addresses", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })
      } else {
        await fetch("/api/user/addresses", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })
      }
      setAddrForm({ id: "", type: "home", name: "", phone: "", address: "", city: "", state: "", pincode: "", isDefault: false })
      await refreshAddresses()
    } finally {
      setAddrLoading(false)
    }
  }

  const editAddress = (a: Address) => setAddrForm({ ...a })
  const deleteAddress = async (id: string) => {
    await fetch(`/api/user/addresses?id=${id}`, { method: "DELETE" })
    await refreshAddresses()
  }

  if (loading) {
    return (
      <div className="container py-8">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  if (!profile && !loading) {
    return (
      <div className="container py-8">
        <p className="text-center text-muted-foreground">Profile not found.</p>
      </div>
    )
  }

  return (
    <div className="container px-4 md:px-6 lg:px-8 py-6 space-y-8">
      {/* Top heading like the super admin dashboard, without header */}
      <div className="flex items-center justify-start gap-3">
        <Button onClick={() => window.history.back()} className="bg-black hover:bg-black/90 text-white">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Super Admin</h1>
          <p className="text-muted-foreground">Manage your account settings and preferences</p>
        </div>
      </div>

      {/* My Profile section (trimmed to only profile + personal info) */}
  <div className="max-w-5xl mx-auto w-full">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-1">My Profile</h2>
          <p className="text-muted-foreground">Only visible here for Super Admin</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Overview */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="relative">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={profile.image} alt={profile.name} />
                      <AvatarFallback className="text-lg">{profile.name?.[0]?.toUpperCase() || "U"}</AvatarFallback>
                    </Avatar>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full" disabled={avatarUploading}>
                          <Camera className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Update Avatar</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="text-center">
                            <Avatar className="h-20 w-20 mx-auto mb-4">
                              <AvatarImage src={profile.image} alt={profile.name} />
                              <AvatarFallback>{profile.name?.[0]?.toUpperCase() || "U"}</AvatarFallback>
                            </Avatar>
                          </div>
                          <div>
                            <Label htmlFor="avatar">Choose new avatar</Label>
                            <Input id="avatar" type="file" accept="image/*" onChange={(e) => {
                              const file = e.target.files?.[0]
                              if (file) handleAvatarUpload(file)
                            }} disabled={avatarUploading} />
                          </div>
                          {profile.image && profile.image.includes('googleusercontent.com') && (
                            <div>
                              <Button variant="outline" onClick={handleSyncGoogleAvatar} disabled={avatarUploading} className="w-full">
                                <Cloud className="h-4 w-4 mr-2" />
                                Sync Google Avatar to Cloudinary
                              </Button>
                            </div>
                          )}
                          {profile.image && (
                            <div>
                              <Button variant="destructive" onClick={handleDeleteAvatar} disabled={avatarUploading} className="w-full">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete Avatar
                              </Button>
                            </div>
                          )}
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
                <CardTitle className="text-xl">{profile.name}</CardTitle>
                <div className="flex justify-center">
                  <Badge variant="secondary">{profile.role}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{profile.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Member since {new Date(profile.createdAt).toLocaleDateString()}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Personal Information only */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Personal Information</CardTitle>
                  <Button variant="outline" size="sm" onClick={() => setIsEditing((v) => !v)}>
                    <Edit className="h-4 w-4 mr-2" />
                    {isEditing ? "Cancel" : "Edit"}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} disabled={!isEditing} />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    {/* Email is locked for Super Admin; keep it read-only */}
                    <Input id="email" type="email" value={formData.email} disabled readOnly />
                  </div>
                </div>
                {isEditing && (
                  <div className="flex gap-2">
                    <Button onClick={handleSave} disabled={saving}>
                      <Save className="h-4 w-4 mr-2" />
                      {saving ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
            {/* Addresses management */}
            <Card className="mt-6">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Saved Addresses</CardTitle>
                  <Button variant="outline" size="sm" onClick={() => setAddrForm({ id: "", type: "home", name: "", phone: "", address: "", city: "", state: "", pincode: "", isDefault: false })}>
                    <MapPin className="h-4 w-4 mr-2" />
                    Add / Edit Address
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="aname">Full Name</Label>
                    <Input id="aname" value={addrForm.name} onChange={(e) => setAddrForm({ ...addrForm, name: e.target.value })} />
                  </div>
                  <div>
                    <Label htmlFor="aphone">Phone</Label>
                    <Input id="aphone" value={addrForm.phone} onChange={(e) => setAddrForm({ ...addrForm, phone: e.target.value })} />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="aaddress">Address</Label>
                    <Input id="aaddress" value={addrForm.address} onChange={(e) => setAddrForm({ ...addrForm, address: e.target.value })} />
                  </div>
                  <div>
                    <Label htmlFor="acity">City</Label>
                    <Input id="acity" value={addrForm.city} onChange={(e) => setAddrForm({ ...addrForm, city: e.target.value })} />
                  </div>
                  <div>
                    <Label htmlFor="astate">State</Label>
                    <Input id="astate" value={addrForm.state} onChange={(e) => setAddrForm({ ...addrForm, state: e.target.value })} />
                  </div>
                  <div>
                    <Label htmlFor="apincode">Pincode</Label>
                    <Input id="apincode" value={addrForm.pincode} onChange={(e) => setAddrForm({ ...addrForm, pincode: e.target.value })} />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Switch id="aisDefault" checked={addrForm.isDefault} onCheckedChange={(v) => setAddrForm({ ...addrForm, isDefault: v })} />
                  <Label htmlFor="aisDefault">Set as default address</Label>
                </div>
                <div className="flex gap-2">
                  <Button onClick={saveAddress} disabled={addrLoading}>{addrForm.id ? 'Update Address' : 'Add Address'}</Button>
                  {addrForm.id && (
                    <Button variant="destructive" onClick={async () => { await deleteAddress(addrForm.id); setAddrForm({ id: "", type: "home", name: "", phone: "", address: "", city: "", state: "", pincode: "", isDefault: false }) }}>Delete</Button>
                  )}
                </div>

                {addresses && addresses.length > 0 ? (
                  <div className="space-y-4">
                    {addresses.map((a) => (
                      <div key={a.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{a.type}</Badge>
                            {a.isDefault && <Badge variant="default">Default</Badge>}
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => editAddress(a)}>Edit</Button>
                            <Button variant="outline" size="sm" onClick={() => deleteAddress(a.id)}><Trash2 className="h-4 w-4" /></Button>
                          </div>
                        </div>
                        <div className="space-y-1 text-sm">
                          <p className="font-medium">{a.name}</p>
                          <p className="text-muted-foreground">{a.phone}</p>
                          <p className="text-muted-foreground">{a.address}</p>
                          <p className="text-muted-foreground">{a.city}, {a.state} - {a.pincode}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground">No addresses added yet.</div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
