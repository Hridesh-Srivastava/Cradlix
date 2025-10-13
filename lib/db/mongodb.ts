import mongoose from "mongoose"

declare global {
  // eslint-disable-next-line no-var
  var mongoose: {
    conn: typeof import('mongoose') | null
    promise: Promise<typeof import('mongoose')> | null
  } | undefined
}

// MongoDB connection string
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/baby-ecommerce"

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable")
}

// Global mongoose connection
let cached = global.mongoose

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null }
}

export async function connectMongoDB() {
  // After the guard above, cached is defined
  const cache = cached!
  if (cache.conn) {
    return cache.conn
  }

  if (!cache.promise) {
    const opts = {
      bufferCommands: false,
    }

    cache.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose
    })
  }

  try {
    cache.conn = await cache.promise
  } catch (e) {
    cache.promise = null
    throw e
  }

  return cache.conn
}

// Contact form schema
const contactFormSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: String,
  subject: String,
  message: { type: String, required: true },
  status: { type: String, enum: ["new", "read", "replied", "closed"], default: "new" },
  ipAddress: String,
  userAgent: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

// Newsletter subscription schema
const newsletterSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  status: { type: String, enum: ["subscribed", "unsubscribed"], default: "subscribed" },
  source: String, // Where they subscribed from
  preferences: {
    productUpdates: { type: Boolean, default: true },
    promotions: { type: Boolean, default: true },
    newsletter: { type: Boolean, default: true },
  },
  subscribedAt: { type: Date, default: Date.now },
  unsubscribedAt: Date,
})

// Analytics events schema
const analyticsEventSchema = new mongoose.Schema({
  eventType: { type: String, required: true }, // 'page_view', 'product_view', 'add_to_cart', etc.
  userId: String,
  sessionId: String,
  productId: String,
  categoryId: String,
  eventData: mongoose.Schema.Types.Mixed, // Flexible data storage
  ipAddress: String,
  userAgent: String,
  referrer: String,
  timestamp: { type: Date, default: Date.now },
})

// Site feedback schema
const feedbackSchema = new mongoose.Schema({
  type: { type: String, enum: ["bug", "feature", "general", "complaint"], required: true },
  rating: { type: Number, min: 1, max: 5 },
  message: { type: String, required: true },
  userId: String,
  email: String,
  page: String, // Which page the feedback was submitted from
  status: { type: String, enum: ["new", "in_progress", "resolved", "closed"], default: "new" },
  adminNotes: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

// Search queries schema (for analytics)
const searchQuerySchema = new mongoose.Schema({
  query: { type: String, required: true },
  userId: String,
  sessionId: String,
  resultsCount: Number,
  clickedProductId: String,
  ipAddress: String,
  timestamp: { type: Date, default: Date.now },
})

// Export models
export const ContactForm = mongoose.models.ContactForm || mongoose.model("ContactForm", contactFormSchema)
export const Newsletter = mongoose.models.Newsletter || mongoose.model("Newsletter", newsletterSchema)
export const AnalyticsEvent = mongoose.models.AnalyticsEvent || mongoose.model("AnalyticsEvent", analyticsEventSchema)
export const Feedback = mongoose.models.Feedback || mongoose.model("Feedback", feedbackSchema)
export const SearchQuery = mongoose.models.SearchQuery || mongoose.model("SearchQuery", searchQuerySchema)

// Pending registration schema (for OTP verification before creating SQL user)
const pendingRegistrationSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  passwordHash: { type: String, required: true },
  otp: { type: String, required: true }, // 6-digit string
  otpExpiresAt: { type: Date, required: true },
  resendAvailableAt: { type: Date, required: true },
  attempts: { type: Number, default: 0 },
  ipAddress: String,
  userAgent: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

export const PendingRegistration = mongoose.models.PendingRegistration || mongoose.model("PendingRegistration", pendingRegistrationSchema)

// Utility functions
export async function trackEvent(eventType: string, data: any) {
  try {
    await connectMongoDB()
    const event = new AnalyticsEvent({
      eventType,
      ...data,
      timestamp: new Date(),
    })
    await event.save()
  } catch (error) {
    console.error("Failed to track event:", error)
  }
}

export async function saveContactForm(formData: any) {
  try {
    await connectMongoDB()
    const contact = new ContactForm(formData)
    return await contact.save()
  } catch (error) {
    console.error("Failed to save contact form:", error)
    throw error
  }
}

export async function subscribeToNewsletter(email: string, source?: string) {
  try {
    await connectMongoDB()
    const subscription = await Newsletter.findOneAndUpdate(
      { email },
      {
        email,
        source,
        status: "subscribed",
        subscribedAt: new Date(),
      },
      { upsert: true, new: true },
    )
    return subscription
  } catch (error) {
    console.error("Failed to subscribe to newsletter:", error)
    throw error
  }
}
