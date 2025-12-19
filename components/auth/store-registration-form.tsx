"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Upload, X } from "lucide-react"

const BUSINESS_TYPES = [
  { value: "sole_proprietorship", label: "Sole Proprietorship" },
  { value: "partnership", label: "Partnership" },
  { value: "llp", label: "Limited Liability Partnership (LLP)" },
  { value: "private_limited", label: "Private Limited Company" },
  { value: "public_limited", label: "Public Limited Company" },
  { value: "other", label: "Other" },
]

const BUSINESS_CATEGORIES = [
  { value: "toys", label: "Toys & Games" },
  { value: "clothing", label: "Baby Clothing" },
  { value: "feeding", label: "Feeding & Nursing" },
  { value: "gear", label: "Baby Gear" },
  { value: "furniture", label: "Baby Furniture" },
  { value: "health", label: "Health & Safety" },
  { value: "bath", label: "Bath & Potty" },
  { value: "books", label: "Books & Media" },
  { value: "other", label: "Other" },
]

interface FormData {
  businessName: string
  businessType: string
  businessCategory: string
  gstNumber: string
  panNumber: string
  contactPersonName: string
  email: string
  phone: string
  alternatePhone: string
  addressLine1: string
  addressLine2: string
  city: string
  state: string
  postalCode: string
  country: string
  bankName: string
  accountNumber: string
  ifscCode: string
  accountHolderName: string
  websiteUrl: string
  facebookUrl: string
  instagramUrl: string
  twitterUrl: string
  businessDescription: string
  yearsInBusiness: string
  expectedMonthlyRevenue: string
  productCategories: string[]
  agreedToTerms: boolean
  agreedToCommission: boolean
}

interface FileUploads {
  businessLogo: File | null
  gstCertificate: File | null
  panCard: File | null
  businessRegistration: File | null
  addressProof: File | null
  cancelledCheque: File | null
}

export function StoreRegistrationForm() {
  const router = useRouter()
  const { data: session } = useSession()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)

  const [formData, setFormData] = useState<FormData>({
    businessName: "",
    businessType: "",
    businessCategory: "",
    gstNumber: "",
    panNumber: "",
    contactPersonName: "",
    email: session?.user?.email || "",
    phone: "",
    alternatePhone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
    bankName: "",
    accountNumber: "",
    ifscCode: "",
    accountHolderName: "",
    websiteUrl: "",
    facebookUrl: "",
    instagramUrl: "",
    twitterUrl: "",
    businessDescription: "",
    yearsInBusiness: "",
    expectedMonthlyRevenue: "",
    productCategories: [],
    agreedToTerms: false,
    agreedToCommission: false,
  })

  const [files, setFiles] = useState<FileUploads>({
    businessLogo: null,
    gstCertificate: null,
    panCard: null,
    businessRegistration: null,
    addressProof: null,
    cancelledCheque: null,
  })

  const [previews, setPreviews] = useState<Record<string, string>>({})

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleFileChange = (field: keyof FileUploads, file: File | null) => {
    if (file) {
      setFiles((prev) => ({ ...prev, [field]: file }))
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviews((prev) => ({ ...prev, [field]: reader.result as string }))
      }
      reader.readAsDataURL(file)
    } else {
      setFiles((prev) => ({ ...prev, [field]: null }))
      setPreviews((prev) => {
        const newPreviews = { ...prev }
        delete newPreviews[field]
        return newPreviews
      })
    }
  }

  const uploadToCloudinary = async (file: File, folder: string) => {
    const formData = new FormData()
    formData.append("file", file)
    formData.append("folder", folder)

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      throw new Error("Failed to upload file")
    }

    const data = await response.json()
    return data.url
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!session?.user) {
      toast({
        title: "Authentication Required",
        description: "Please login to register your store",
        variant: "destructive",
      })
      router.push("/login")
      return
    }

    if (!formData.agreedToTerms || !formData.agreedToCommission) {
      toast({
        title: "Terms Required",
        description: "Please agree to terms and conditions",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      // Upload all files to Cloudinary
      const uploadedFiles: Record<string, string> = {}

      for (const [key, file] of Object.entries(files)) {
        if (file) {
          const url = await uploadToCloudinary(file, `store-documents/${key}`)
          uploadedFiles[key] = url
        }
      }

      // Submit store request
      const response = await fetch("/api/store-requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          ...uploadedFiles,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Failed to submit store request")
      }

      toast({
        title: "Store Request Submitted!",
        description: "Your request is under review. We'll notify you via email once approved.",
      })

      router.push("/account")
    } catch (error) {
      console.error("Store registration error:", error)
      toast({
        title: "Submission Failed",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(
          formData.businessName &&
          formData.businessType &&
          formData.businessCategory &&
          formData.contactPersonName &&
          formData.email &&
          formData.phone
        )
      case 2:
        return !!(
          formData.addressLine1 &&
          formData.city &&
          formData.state &&
          formData.postalCode &&
          formData.country
        )
      case 3:
        return true // Optional documents
      case 4:
        return true // Optional bank details
      case 5:
        return formData.agreedToTerms && formData.agreedToCommission
      default:
        return false
    }
  }

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 5))
    } else {
      toast({
        title: "Required Fields",
        description: "Please fill all required fields",
        variant: "destructive",
      })
    }
  }

  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1))

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          {[1, 2, 3, 4, 5].map((step) => (
            <div
              key={step}
              className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                step <= currentStep
                  ? "border-primary bg-primary text-white"
                  : "border-gray-300 text-gray-500"
              }`}
            >
              {step}
            </div>
          ))}
        </div>
        <div className="flex justify-between text-xs text-gray-600 mt-2">
          <span>Business Info</span>
          <span>Address</span>
          <span>Documents</span>
          <span>Bank Details</span>
          <span>Review</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 1: Business Information */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Business Information</h2>

            <div>
              <Label htmlFor="businessName">
                Business Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="businessName"
                value={formData.businessName}
                onChange={(e) => handleInputChange("businessName", e.target.value)}
                placeholder="Enter your business name"
                required
              />
            </div>

            <div>
              <Label htmlFor="businessType">
                Business Type <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.businessType}
                onValueChange={(value) => handleInputChange("businessType", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select business type" />
                </SelectTrigger>
                <SelectContent>
                  {BUSINESS_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="businessCategory">
                Business Category <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.businessCategory}
                onValueChange={(value) => handleInputChange("businessCategory", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {BUSINESS_CATEGORIES.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="gstNumber">GST Number (Optional)</Label>
                <Input
                  id="gstNumber"
                  value={formData.gstNumber}
                  onChange={(e) => handleInputChange("gstNumber", e.target.value)}
                  placeholder="22AAAAA0000A1Z5"
                  maxLength={15}
                />
              </div>

              <div>
                <Label htmlFor="panNumber">PAN Number (Optional)</Label>
                <Input
                  id="panNumber"
                  value={formData.panNumber}
                  onChange={(e) => handleInputChange("panNumber", e.target.value.toUpperCase())}
                  placeholder="ABCDE1234F"
                  maxLength={10}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="contactPersonName">
                Contact Person Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="contactPersonName"
                value={formData.contactPersonName}
                onChange={(e) => handleInputChange("contactPersonName", e.target.value)}
                placeholder="Full name of contact person"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">
                  Email <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="business@example.com"
                  required
                />
              </div>

              <div>
                <Label htmlFor="phone">
                  Phone <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="+91 1234567890"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="alternatePhone">Alternate Phone (Optional)</Label>
              <Input
                id="alternatePhone"
                type="tel"
                value={formData.alternatePhone}
                onChange={(e) => handleInputChange("alternatePhone", e.target.value)}
                placeholder="+91 0987654321"
              />
            </div>

            <div>
              <Label htmlFor="businessDescription">Business Description (Optional)</Label>
              <Textarea
                id="businessDescription"
                value={formData.businessDescription}
                onChange={(e) => handleInputChange("businessDescription", e.target.value)}
                placeholder="Tell us about your business..."
                rows={4}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="yearsInBusiness">Years in Business (Optional)</Label>
                <Input
                  id="yearsInBusiness"
                  type="number"
                  value={formData.yearsInBusiness}
                  onChange={(e) => handleInputChange("yearsInBusiness", e.target.value)}
                  placeholder="5"
                  min="0"
                />
              </div>

              <div>
                <Label htmlFor="expectedMonthlyRevenue">Expected Monthly Revenue (Optional)</Label>
                <Input
                  id="expectedMonthlyRevenue"
                  value={formData.expectedMonthlyRevenue}
                  onChange={(e) => handleInputChange("expectedMonthlyRevenue", e.target.value)}
                  placeholder="₹50,000 - ₹100,000"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Business Address */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Business Address</h2>

            <div>
              <Label htmlFor="addressLine1">
                Address Line 1 <span className="text-red-500">*</span>
              </Label>
              <Input
                id="addressLine1"
                value={formData.addressLine1}
                onChange={(e) => handleInputChange("addressLine1", e.target.value)}
                placeholder="Street address, building, floor"
                required
              />
            </div>

            <div>
              <Label htmlFor="addressLine2">Address Line 2 (Optional)</Label>
              <Input
                id="addressLine2"
                value={formData.addressLine2}
                onChange={(e) => handleInputChange("addressLine2", e.target.value)}
                placeholder="Apartment, suite, unit, etc."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city">
                  City <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                  placeholder="City name"
                  required
                />
              </div>

              <div>
                <Label htmlFor="state">
                  State <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="state"
                  value={formData.state}
                  onChange={(e) => handleInputChange("state", e.target.value)}
                  placeholder="State name"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="postalCode">
                  Postal Code <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="postalCode"
                  value={formData.postalCode}
                  onChange={(e) => handleInputChange("postalCode", e.target.value)}
                  placeholder="110001"
                  required
                />
              </div>

              <div>
                <Label htmlFor="country">
                  Country <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="country"
                  value={formData.country}
                  onChange={(e) => handleInputChange("country", e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="pt-4">
              <Label className="mb-2 block">Social Media & Website (Optional)</Label>

              <div className="space-y-3">
                <Input
                  placeholder="Website URL"
                  value={formData.websiteUrl}
                  onChange={(e) => handleInputChange("websiteUrl", e.target.value)}
                />
                <Input
                  placeholder="Facebook URL"
                  value={formData.facebookUrl}
                  onChange={(e) => handleInputChange("facebookUrl", e.target.value)}
                />
                <Input
                  placeholder="Instagram URL"
                  value={formData.instagramUrl}
                  onChange={(e) => handleInputChange("instagramUrl", e.target.value)}
                />
                <Input
                  placeholder="Twitter URL"
                  value={formData.twitterUrl}
                  onChange={(e) => handleInputChange("twitterUrl", e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Documents Upload */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Business Documents</h2>
            <p className="text-sm text-gray-600 mb-4">
              Upload relevant business documents (Optional but recommended for faster approval)
            </p>

            {(["businessLogo", "gstCertificate", "panCard", "businessRegistration", "addressProof"] as const).map(
              (field) => (
                <div key={field} className="border rounded-lg p-4">
                  <Label className="mb-2 block capitalize">
                    {field.replace(/([A-Z])/g, " $1").trim()}
                  </Label>
                  {previews[field] ? (
                    <div className="relative">
                      <img
                        src={previews[field]}
                        alt={field}
                        className="max-h-40 rounded border"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={() => handleFileChange(field, null)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 cursor-pointer hover:bg-gray-50">
                      <Upload className="h-8 w-8 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-600">Click to upload</span>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*,application/pdf"
                        onChange={(e) =>
                          handleFileChange(field, e.target.files?.[0] || null)
                        }
                      />
                    </label>
                  )}
                </div>
              )
            )}
          </div>
        )}

        {/* Step 4: Bank Details */}
        {currentStep === 4 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Bank Details</h2>
            <p className="text-sm text-gray-600 mb-4">
              Provide bank details for receiving payments (Optional but required before approval)
            </p>

            <div>
              <Label htmlFor="bankName">Bank Name</Label>
              <Input
                id="bankName"
                value={formData.bankName}
                onChange={(e) => handleInputChange("bankName", e.target.value)}
                placeholder="State Bank of India"
              />
            </div>

            <div>
              <Label htmlFor="accountHolderName">Account Holder Name</Label>
              <Input
                id="accountHolderName"
                value={formData.accountHolderName}
                onChange={(e) => handleInputChange("accountHolderName", e.target.value)}
                placeholder="As per bank records"
              />
            </div>

            <div>
              <Label htmlFor="accountNumber">Account Number</Label>
              <Input
                id="accountNumber"
                value={formData.accountNumber}
                onChange={(e) => handleInputChange("accountNumber", e.target.value)}
                placeholder="1234567890"
              />
            </div>

            <div>
              <Label htmlFor="ifscCode">IFSC Code</Label>
              <Input
                id="ifscCode"
                value={formData.ifscCode}
                onChange={(e) => handleInputChange("ifscCode", e.target.value.toUpperCase())}
                placeholder="SBIN0001234"
                maxLength={11}
              />
            </div>

            <div className="border rounded-lg p-4">
              <Label className="mb-2 block">Cancelled Cheque</Label>
              {previews.cancelledCheque ? (
                <div className="relative">
                  <img
                    src={previews.cancelledCheque}
                    alt="Cancelled Cheque"
                    className="max-h-40 rounded border"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={() => handleFileChange("cancelledCheque", null)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 cursor-pointer hover:bg-gray-50">
                  <Upload className="h-8 w-8 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-600">Click to upload cancelled cheque</span>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*,application/pdf"
                    onChange={(e) =>
                      handleFileChange("cancelledCheque", e.target.files?.[0] || null)
                    }
                  />
                </label>
              )}
            </div>
          </div>
        )}

        {/* Step 5: Review & Terms */}
        {currentStep === 5 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Review & Submit</h2>

            <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
              <p>
                <strong>Business Name:</strong> {formData.businessName}
              </p>
              <p>
                <strong>Contact:</strong> {formData.email} | {formData.phone}
              </p>
              <p>
                <strong>Address:</strong> {formData.addressLine1}, {formData.city},{" "}
                {formData.state} - {formData.postalCode}
              </p>
            </div>

            <div className="space-y-4 pt-4">
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="terms"
                  checked={formData.agreedToTerms}
                  onCheckedChange={(checked) =>
                    handleInputChange("agreedToTerms", checked)
                  }
                />
                <Label htmlFor="terms" className="text-sm leading-relaxed cursor-pointer">
                  I agree to the{" "}
                  <a href="/terms-conditions" className="text-primary hover:underline">
                    Terms & Conditions
                  </a>{" "}
                  and{" "}
                  <a href="/privacy-policy" className="text-primary hover:underline">
                    Privacy Policy
                  </a>
                </Label>
              </div>

              <div className="flex items-start space-x-2">
                <Checkbox
                  id="commission"
                  checked={formData.agreedToCommission}
                  onCheckedChange={(checked) =>
                    handleInputChange("agreedToCommission", checked)
                  }
                />
                <Label htmlFor="commission" className="text-sm leading-relaxed cursor-pointer">
                  I agree to the platform commission structure (10% per sale)
                </Label>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-6 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1 || loading}
          >
            Previous
          </Button>

          {currentStep < 5 ? (
            <Button type="button" onClick={nextStep} disabled={loading}>
              Next
            </Button>
          ) : (
            <Button type="submit" disabled={loading || !formData.agreedToTerms || !formData.agreedToCommission}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Request"
              )}
            </Button>
          )}
        </div>
      </form>
    </div>
  )
}
