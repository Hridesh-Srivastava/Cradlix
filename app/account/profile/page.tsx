"use client"

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { useToast } from '@/hooks/use-toast'
import { 
  User, 
  Mail, 
  Calendar, 
  Camera, 
  Save, 
  Trash2,
  MapPin,
  Phone,
  Edit,
  Cloud
} from 'lucide-react'
import { Switch } from '@/components/ui/switch'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { signOut } from 'next-auth/react'

interface UserProfile {
  id: string
  name: string
  email: string
  image: string | null
  role: string
  emailVerified: string
  createdAt: string
  addresses: Address[]
}

interface Address {
  id: string
  type: 'home' | 'work' | 'other'
  name: string
  phone: string
  address: string
  city: string
  state: string
  pincode: string
  isDefault: boolean
}

export default function ProfilePage() {
  const { data: session, update } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [avatarUploading, setAvatarUploading] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  })
  const [addresses, setAddresses] = useState<Address[]>([])
  const [addrForm, setAddrForm] = useState({
    id: '',
    type: 'home' as 'home' | 'work' | 'other',
    name: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    isDefault: false,
  })
  const [addrLoading, setAddrLoading] = useState(false)

  useEffect(() => {
    if (session?.user) {
      fetchProfile()
    }
  }, [session])

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/user/profile')
      if (response.ok) {
        const data = await response.json()
        setProfile(data.profile)
        setFormData({
          name: data.profile.name,
          email: data.profile.email,
        })
        // Also fetch addresses via dedicated endpoint for real-time refresh
        try {
          const ar = await fetch('/api/user/addresses')
          if (ar.ok) {
            const a = await ar.json()
            setAddresses(a.addresses || [])
          }
        } catch {}
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
    } finally {
      setLoading(false)
    }
  }

  // Address CRUD helpers
  const refreshAddresses = async () => {
    try {
      const ar = await fetch('/api/user/addresses')
      if (ar.ok) {
        const a = await ar.json()
        setAddresses(a.addresses || [])
      }
    } catch {}
  }

  const saveAddress = async () => {
    setAddrLoading(true)
    try {
      const payload = { ...addrForm }
      if (payload.id) {
        await fetch('/api/user/addresses', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
      } else {
        await fetch('/api/user/addresses', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
      }
      setAddrForm({ id: '', type: 'home', name: '', phone: '', address: '', city: '', state: '', pincode: '', isDefault: false })
      await refreshAddresses()
    } finally {
      setAddrLoading(false)
    }
  }

  const editAddress = (a: Address) => setAddrForm({ ...a })
  const deleteAddress = async (id: string) => {
    await fetch(`/api/user/addresses?id=${id}`, { method: 'DELETE' })
    await refreshAddresses()
  }

  const handleSaveProfile = async () => {
    try {
      setSaving(true)
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const data = await response.json()
        setProfile(data.profile)
        setIsEditing(false)
        toast({
          title: 'Profile updated successfully',
          description: 'Your profile has been updated.',
        })
        // Update session
        await update()
      } else {
        throw new Error('Failed to update profile')
      }
    } catch (error) {
      toast({
        title: 'Error updating profile',
        description: 'Please try again later.',
        variant: 'destructive',
      })
    } finally {
      setSaving(false)
    }
  }

  const handleAvatarUpload = async (file: File) => {
    try {
      setAvatarUploading(true)
      const formData = new FormData()
      formData.append('avatar', file)

      const response = await fetch('/api/user/avatar', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        setProfile(prev => prev ? { ...prev, image: data.avatarUrl } : null)
        toast({
          title: 'Avatar updated successfully',
          description: 'Your profile picture has been updated.',
        })
        // Update session
        await update()
      } else {
        throw new Error('Failed to upload avatar')
      }
    } catch (error) {
      toast({
        title: 'Error uploading avatar',
        description: 'Please try again later.',
        variant: 'destructive',
      })
    } finally {
      setAvatarUploading(false)
    }
  }

  const handleSyncGoogleAvatar = async () => {
    try {
      setAvatarUploading(true)
      const response = await fetch('/api/user/avatar/sync-google', {
        method: 'POST',
      })

      if (response.ok) {
        const data = await response.json()
        setProfile(prev => prev ? { ...prev, image: data.avatarUrl } : null)
        toast({
          title: 'Google avatar synced successfully',
          description: 'Your Google avatar has been synced to Cloudinary.',
        })
        // Update session
        await update()
      } else {
        const error = await response.json()
        toast({
          title: 'Error',
          description: error.error || 'Failed to sync Google avatar',
          variant: 'destructive',
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to sync Google avatar',
        variant: 'destructive',
      })
    } finally {
      setAvatarUploading(false)
    }
  }

  const handleDeleteAvatar = async () => {
    try {
      setAvatarUploading(true)
      const response = await fetch('/api/user/avatar', {
        method: 'DELETE',
      })

      if (response.ok) {
        setProfile(prev => prev ? { ...prev, image: null } : null)
        toast({
          title: 'Avatar deleted successfully',
          description: 'Your profile picture has been removed.',
        })
        // Update session
        await update()
      } else {
        const error = await response.json()
        toast({
          title: 'Error',
          description: error.error || 'Failed to delete avatar',
          variant: 'destructive',
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete avatar',
        variant: 'destructive',
      })
    } finally {
      setAvatarUploading(false)
    }
  }

  const handleDeleteAccount = async () => {
    try {
      const response = await fetch('/api/user/delete-account', { method: 'DELETE' })
      if (response.ok) {
        toast({ title: 'Account deleted', description: 'Your account has been deleted successfully.' })
        // Sign out to clear any client/session state, then go home
        await signOut({ callbackUrl: '/' })
      } else {
        throw new Error('Failed to delete account')
      }
    } catch (error) {
      toast({ title: 'Error deleting account', description: 'Please try again later.', variant: 'destructive' })
    }
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

  if (!profile) {
    return (
      <div className="container py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Profile not found</h2>
          <p className="text-muted-foreground">Please try logging in again.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Profile</h1>
          <p className="text-muted-foreground">Manage your account settings and preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Overview */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="relative">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={profile.image || ''} alt={profile.name} />
                      <AvatarFallback className="text-lg">
                        {profile.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          size="sm"
                          className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full"
                          disabled={avatarUploading}
                        >
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
                              <AvatarImage src={profile.image || ''} alt={profile.name} />
                              <AvatarFallback>
                                {profile.name.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                          </div>
                          <div>
                            <Label htmlFor="avatar">Choose new avatar</Label>
                            <Input
                              id="avatar"
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0]
                                if (file) {
                                  handleAvatarUpload(file)
                                }
                              }}
                              disabled={avatarUploading}
                            />
                          </div>
                          {profile.image && profile.image.includes('googleusercontent.com') && (
                            <div>
                              <Button
                                variant="outline"
                                onClick={handleSyncGoogleAvatar}
                                disabled={avatarUploading}
                                className="w-full"
                              >
                                <Cloud className="h-4 w-4 mr-2" />
                                Sync Google Avatar to Cloudinary
                              </Button>
                            </div>
                          )}
                          {profile.image && (
                            <div>
                              <Button
                                variant="destructive"
                                onClick={handleDeleteAvatar}
                                disabled={avatarUploading}
                                className="w-full"
                              >
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
                  <span className="text-sm">
                    Member since {new Date(profile.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Profile Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Personal Information</CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    {isEditing ? 'Cancel' : 'Edit'}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
                {isEditing && (
                  <div className="flex gap-2">
                    <Button onClick={handleSaveProfile} disabled={saving}>
                      <Save className="h-4 w-4 mr-2" />
                      {saving ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Addresses - dynamic with CRUD */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Saved Addresses</CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setAddrForm({ id: '', type: 'home', name: '', phone: '', address: '', city: '', state: '', pincode: '', isDefault: false })}
                  >
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
                    <Button variant="destructive" onClick={async () => { await deleteAddress(addrForm.id); setAddrForm({ id: '', type: 'home', name: '', phone: '', address: '', city: '', state: '', pincode: '', isDefault: false }) }}>Delete</Button>
                  )}
                </div>

                {addresses && addresses.length > 0 ? (
                  <div className="space-y-4">
                    {addresses.map((a) => (
                      <div key={a.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {/* Type badge omitted for simplicity */}
                            {a.isDefault && <span className="text-xs px-2 py-0.5 rounded bg-primary text-white">Default</span>}
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => editAddress(a)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => deleteAddress(a.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
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
                  <div className="text-center py-8">
                    <MapPin className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No saved addresses</p>
                    <Button variant="outline" className="mt-4" onClick={() => setAddrForm({ id: '', type: 'home', name: '', phone: '', address: '', city: '', state: '', pincode: '', isDefault: false })}>
                      Add Your First Address
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Account Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Account Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Delete Account</h4>
                    <p className="text-sm text-muted-foreground">
                      Permanently delete your account and all associated data
                    </p>
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Account
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete your account?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action permanently deletes your account and associated data. This cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteAccount} className="bg-red-600 text-white hover:bg-red-600/90">
                          Yes, delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
