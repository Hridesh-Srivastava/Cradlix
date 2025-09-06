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
  description: string
  price: number
  comparePrice?: number
  images: string[]
  category: string
  subcategory?: string
  brand: string
  sku: string
  stock: number
  isActive: boolean
  tags: string[]
  rating: number
  reviewCount: number
  ageRange: string
  weight?: number
  dimensions?: {
    length: number
    width: number
    height: number
  }
  createdAt: Date
  updatedAt: Date
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
