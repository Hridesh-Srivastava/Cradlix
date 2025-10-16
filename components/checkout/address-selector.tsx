"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { Loader2, Plus, Trash2, Check } from 'lucide-react'

interface Address {
  id: string
  firstName: string
  middleName?: string
  lastName: string
  email?: string
  phone: string
  countryCode: string
  addressLine1: string
  addressLine2?: string
  city: string
  state: string
  postalCode: string
  country: string
  isDefault: boolean
}

interface AddressFormData {
  firstName: string
  middleName: string
  lastName: string
  email: string
  phone: string
  countryCode: string
  addressLine1: string
  addressLine2: string
  city: string
  state: string
  postalCode: string
  country: string
}

interface AddressSelectorProps {
  onAddressSelect: (address: Address | null) => void
  onFormDataChange: (formData: AddressFormData) => void
  selectedAddressId?: string
}

const COUNTRY_CODES = [
  { code: '+91', country: 'India', flag: '🇮🇳' },
  { code: '+1', country: 'USA', flag: '🇺🇸' },
  { code: '+44', country: 'UK', flag: '🇬🇧' },
  { code: '+971', country: 'UAE', flag: '🇦🇪' },
  { code: '+65', country: 'Singapore', flag: '🇸🇬' },
]

export function AddressSelector({ onAddressSelect, onFormDataChange, selectedAddressId }: AddressSelectorProps) {
  const { toast } = useToast()
  const [savedAddresses, setSavedAddresses] = useState<Address[]>([])
  const [loading, setLoading] = useState(true)
  const [showNewAddressForm, setShowNewAddressForm] = useState(false)
  const [selectedAddress, setSelectedAddress] = useState<string | null>(selectedAddressId || null)
  const [formData, setFormData] = useState<AddressFormData>({
    firstName: '',
    middleName: '',
    lastName: '',
    email: '',
    phone: '',
    countryCode: '+91',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
  })
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof AddressFormData, string>>>({})

  useEffect(() => {
    fetchSavedAddresses()
  }, [])

  useEffect(() => {
    onFormDataChange(formData)
  }, [formData, onFormDataChange])

  const fetchSavedAddresses = async () => {
    try {
      const response = await fetch('/api/user/addresses')
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setSavedAddresses(data.addresses)
          // Auto-select default address
          const defaultAddr = data.addresses.find((addr: Address) => addr.isDefault)
          if (defaultAddr && !selectedAddress) {
            handleAddressSelect(defaultAddr.id)
          }
        }
      }
    } catch (error) {
      console.error('Failed to fetch addresses:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddressSelect = (addressId: string) => {
    setSelectedAddress(addressId)
    setShowNewAddressForm(false)
    const address = savedAddresses.find(addr => addr.id === addressId)
    if (address) {
      onAddressSelect(address)
      // Populate form with selected address
      setFormData({
        firstName: address.firstName,
        middleName: address.middleName || '',
        lastName: address.lastName,
        email: address.email || '',
        phone: address.phone,
        countryCode: address.countryCode || '+91',
        addressLine1: address.addressLine1,
        addressLine2: address.addressLine2 || '',
        city: address.city,
        state: address.state,
        postalCode: address.postalCode,
        country: address.country,
      })
    }
  }

  const handleNewAddress = () => {
    setSelectedAddress(null)
    setShowNewAddressForm(true)
    onAddressSelect(null)
    setFormData({
      firstName: '',
      middleName: '',
      lastName: '',
      email: '',
      phone: '',
      countryCode: '+91',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'India',
    })
  }

  const handleDeleteAddress = async (addressId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    
    if (!confirm('Are you sure you want to delete this address?')) return

    try {
      const response = await fetch(`/api/user/addresses/${addressId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setSavedAddresses(prev => prev.filter(addr => addr.id !== addressId))
        if (selectedAddress === addressId) {
          setSelectedAddress(null)
          handleNewAddress()
        }
        toast({
          title: 'Address deleted',
          description: 'Address has been removed successfully.',
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete address.',
        variant: 'destructive',
      })
    }
  }

  const validateForm = (): boolean => {
    const errors: Partial<Record<keyof AddressFormData, string>> = {}

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!formData.email || !emailRegex.test(formData.email)) {
      errors.email = 'Please enter a valid email address'
    }

    // Phone validation (10 digits)
    const phoneRegex = /^\d{10}$/
    if (!formData.phone || !phoneRegex.test(formData.phone)) {
      errors.phone = 'Please enter a valid 10-digit phone number'
    }

    // Required fields
    if (!formData.firstName.trim()) errors.firstName = 'First name is required'
    if (!formData.lastName.trim()) errors.lastName = 'Last name is required'
    if (!formData.addressLine1.trim()) errors.addressLine1 = 'Address is required'
    if (!formData.city.trim()) errors.city = 'City is required'
    if (!formData.state.trim()) errors.state = 'State is required'
    if (!formData.postalCode.trim()) errors.postalCode = 'Postal code is required'

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleInputChange = (field: keyof AddressFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  return (
    <div className="space-y-4">
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      ) : (
        <>
          {/* Saved Addresses */}
          {savedAddresses.length > 0 && (
            <div className="space-y-3">
              <Label className="text-base font-semibold">Saved Addresses</Label>
              <RadioGroup value={selectedAddress || ''} onValueChange={handleAddressSelect}>
                {savedAddresses.map((address) => (
                  <Card 
                    key={address.id} 
                    className={`cursor-pointer transition-all ${
                      selectedAddress === address.id ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => handleAddressSelect(address.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <RadioGroupItem value={address.id} id={address.id} />
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <p className="font-semibold">
                                {address.firstName} {address.middleName && `${address.middleName} `}{address.lastName}
                              </p>
                              {address.isDefault && (
                                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                                  Default
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              {address.addressLine1}
                              {address.addressLine2 && `, ${address.addressLine2}`}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {address.city}, {address.state} - {address.postalCode}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {address.countryCode} {address.phone}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => handleDeleteAddress(address.id, e)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </RadioGroup>
            </div>
          )}

          {/* Add New Address Button */}
          {!showNewAddressForm && (
            <Button
              variant="outline"
              onClick={handleNewAddress}
              className="w-full"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add New Address
            </Button>
          )}

          {/* New Address Form */}
          {(showNewAddressForm || savedAddresses.length === 0) && (
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-semibold">
                    {savedAddresses.length === 0 ? 'Shipping Information' : 'New Address'}
                  </Label>
                  {savedAddresses.length > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowNewAddressForm(false)}
                    >
                      Cancel
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      className={formErrors.firstName ? 'border-red-500' : ''}
                    />
                    {formErrors.firstName && (
                      <p className="text-xs text-red-500 mt-1">{formErrors.firstName}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="middleName">Middle Name</Label>
                    <Input
                      id="middleName"
                      value={formData.middleName}
                      onChange={(e) => handleInputChange('middleName', e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      className={formErrors.lastName ? 'border-red-500' : ''}
                    />
                    {formErrors.lastName && (
                      <p className="text-xs text-red-500 mt-1">{formErrors.lastName}</p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={formErrors.email ? 'border-red-500' : ''}
                  />
                  {formErrors.email && (
                    <p className="text-xs text-red-500 mt-1">{formErrors.email}</p>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="countryCode">Country Code *</Label>
                    <Select
                      value={formData.countryCode}
                      onValueChange={(value) => handleInputChange('countryCode', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {COUNTRY_CODES.map((country) => (
                          <SelectItem key={country.code} value={country.code}>
                            {country.flag} {country.code} {country.country}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="col-span-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="10-digit number"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value.replace(/\D/g, '').slice(0, 10))}
                      className={formErrors.phone ? 'border-red-500' : ''}
                    />
                    {formErrors.phone && (
                      <p className="text-xs text-red-500 mt-1">{formErrors.phone}</p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="addressLine1">Address Line 1 *</Label>
                  <Input
                    id="addressLine1"
                    value={formData.addressLine1}
                    onChange={(e) => handleInputChange('addressLine1', e.target.value)}
                    className={formErrors.addressLine1 ? 'border-red-500' : ''}
                  />
                  {formErrors.addressLine1 && (
                    <p className="text-xs text-red-500 mt-1">{formErrors.addressLine1}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="addressLine2">Address Line 2</Label>
                  <Input
                    id="addressLine2"
                    value={formData.addressLine2}
                    onChange={(e) => handleInputChange('addressLine2', e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      className={formErrors.city ? 'border-red-500' : ''}
                    />
                    {formErrors.city && (
                      <p className="text-xs text-red-500 mt-1">{formErrors.city}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="state">State *</Label>
                    <Input
                      id="state"
                      value={formData.state}
                      onChange={(e) => handleInputChange('state', e.target.value)}
                      className={formErrors.state ? 'border-red-500' : ''}
                    />
                    {formErrors.state && (
                      <p className="text-xs text-red-500 mt-1">{formErrors.state}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="postalCode">Postal Code *</Label>
                    <Input
                      id="postalCode"
                      value={formData.postalCode}
                      onChange={(e) => handleInputChange('postalCode', e.target.value)}
                      className={formErrors.postalCode ? 'border-red-500' : ''}
                    />
                    {formErrors.postalCode && (
                      <p className="text-xs text-red-500 mt-1">{formErrors.postalCode}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  )
}

export { validateForm } from './utils'
