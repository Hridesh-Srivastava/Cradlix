export interface User {
  id: string
  email: string
  name: string
  image?: string
  role: "customer" | "admin"
  createdAt: Date
  updatedAt: Date
}

export interface Product {
  id: string
  name: string
  slug: string
  description: string
  shortDescription?: string
  price: string
  comparePrice?: string
  inventoryQuantity: number
  isFeatured: boolean
  brand: string
  ageRange: string
  sku: string
  categoryId?: string
  category?: {
    id: string
    name: string
    slug: string
  }
  images?: {
    id: string
    url: string
    altText?: string
    isPrimary: boolean
  }[]
  safetyCertifications?: string[]
  materials?: string[]
  isActive: boolean
  metaTitle?: string
  metaDescription?: string
  createdAt: string
  updatedAt: string
}

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  image?: string
  parentId?: string
  isActive: boolean
  sortOrder: number
  createdAt: Date
  updatedAt: Date
}

export interface CartItem {
  id: string
  productId: string
  product: Product
  quantity: number
  price: number
}

export interface Order {
  id: string
  userId: string
  user: User
  items: OrderItem[]
  total: number
  subtotal: number
  tax: number
  shipping: number
  discount: number
  status: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled"
  paymentStatus: "pending" | "paid" | "failed" | "refunded"
  paymentMethod: string
  razorpayOrderId?: string
  razorpayPaymentId?: string
  shippingAddress: Address
  billingAddress: Address
  trackingNumber?: string
  notes?: string
  createdAt: Date
  updatedAt: Date
}

export interface OrderItem {
  id: string
  orderId: string
  productId: string
  product: Product
  quantity: number
  price: number
  total: number
}

export interface Address {
  id?: string
  userId?: string
  type: "shipping" | "billing"
  firstName: string
  lastName: string
  company?: string
  address1: string
  address2?: string
  city: string
  state: string
  postalCode: string
  country: string
  phone?: string
  isDefault: boolean
}

export interface Review {
  id: string
  userId: string
  user: User
  productId: string
  product: Product
  rating: number
  title: string
  comment: string
  isVerified: boolean
  isApproved: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Wishlist {
  id: string
  userId: string
  productId: string
  product: Product
  createdAt: Date
}

export interface StoreRequest {
  id: string
  userId: string
  
  // Business Information
  businessName: string
  businessType: string
  businessCategory: string
  gstNumber?: string
  panNumber?: string
  
  // Contact Information
  contactPersonName: string
  email: string
  phone: string
  alternatePhone?: string
  
  // Business Address
  addressLine1: string
  addressLine2?: string
  city: string
  state: string
  postalCode: string
  country: string
  
  // Business Documents
  businessLogo?: string
  gstCertificate?: string
  panCard?: string
  businessRegistration?: string
  addressProof?: string
  
  // Bank Details
  bankName?: string
  accountNumber?: string
  ifscCode?: string
  accountHolderName?: string
  cancelledCheque?: string
  
  // Social Media & Website
  websiteUrl?: string
  facebookUrl?: string
  instagramUrl?: string
  twitterUrl?: string
  
  // Additional Information
  businessDescription?: string
  yearsInBusiness?: number
  expectedMonthlyRevenue?: string
  productCategories?: string[]
  
  // Request Status
  status: "pending" | "approved" | "rejected"
  rejectionReason?: string
  adminNotes?: string
  reviewedBy?: string
  reviewedAt?: Date
  
  // Terms Acceptance
  agreedToTerms: boolean
  agreedToCommission: boolean
  
  createdAt: Date
  updatedAt: Date
}

export interface Store {
  id: string
  userId: string
  requestId?: string
  
  // Business Information
  businessName: string
  slug: string
  businessType: string
  businessCategory: string
  gstNumber?: string
  panNumber?: string
  
  // Contact Information
  contactPersonName: string
  email: string
  phone: string
  alternatePhone?: string
  
  // Business Address
  addressLine1: string
  addressLine2?: string
  city: string
  state: string
  postalCode: string
  country: string
  
  // Business Documents
  businessLogo?: string
  gstCertificate?: string
  panCard?: string
  businessRegistration?: string
  addressProof?: string
  
  // Bank Details
  bankName?: string
  accountNumber?: string
  ifscCode?: string
  accountHolderName?: string
  cancelledCheque?: string
  
  // Social Media & Website
  websiteUrl?: string
  facebookUrl?: string
  instagramUrl?: string
  twitterUrl?: string
  
  // Store Description
  businessDescription?: string
  yearsInBusiness?: number
  productCategories?: string[]
  
  // Store Status & Settings
  isActive: boolean
  isFeatured: boolean
  commissionRate: string
  
  // Store Statistics
  totalProducts: number
  totalOrders: number
  totalRevenue: string
  averageRating: string
  totalReviews: number
  
  // Store Verification
  isVerified: boolean
  verifiedAt?: Date
  
  createdAt: Date
  updatedAt: Date
}
