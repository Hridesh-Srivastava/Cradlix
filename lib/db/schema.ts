import { pgTable, uuid, varchar, text, timestamp, boolean, integer, decimal, jsonb, index } from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm"

// Users table
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  image: text("image"),
  role: varchar("role", { length: 50 }).default("customer"),
  emailVerified: timestamp("email_verified"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

// Categories table
export const categories = pgTable(
  "categories",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 255 }).notNull().unique(),
    description: text("description"),
    imageUrl: text("image_url"),
    parentId: uuid("parent_id").references(() => categories.id),
    isActive: boolean("is_active").default(true),
    sortOrder: integer("sort_order").default(0),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => ({
    slugIdx: index("idx_categories_slug").on(table.slug),
  }),
)

// Products table
export const products = pgTable(
  "products",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 255 }).notNull().unique(),
    description: text("description"),
    shortDescription: text("short_description"),
    sku: varchar("sku", { length: 100 }).notNull().unique(),
    price: decimal("price", { precision: 10, scale: 2 }).notNull(),
    comparePrice: decimal("compare_price", { precision: 10, scale: 2 }),
    costPrice: decimal("cost_price", { precision: 10, scale: 2 }),
    trackInventory: boolean("track_inventory").default(true),
    inventoryQuantity: integer("inventory_quantity").default(0),
    lowStockThreshold: integer("low_stock_threshold").default(5),
    weight: decimal("weight", { precision: 8, scale: 2 }),
    dimensions: jsonb("dimensions"),
    categoryId: uuid("category_id").references(() => categories.id),
    brand: varchar("brand", { length: 255 }),
    ageRange: varchar("age_range", { length: 100 }),
    safetyCertifications: text("safety_certifications").array(),
    materials: text("materials").array(),
    isActive: boolean("is_active").default(true),
    isFeatured: boolean("is_featured").default(false),
    metaTitle: varchar("meta_title", { length: 255 }),
    metaDescription: text("meta_description"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => ({
    categoryIdx: index("idx_products_category_id").on(table.categoryId),
    activeIdx: index("idx_products_is_active").on(table.isActive),
    featuredIdx: index("idx_products_is_featured").on(table.isFeatured),
    slugIdx: index("idx_products_slug").on(table.slug),
  }),
)

// Product images table
export const productImages = pgTable(
  "product_images",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    productId: uuid("product_id").references(() => products.id, { onDelete: "cascade" }),
    url: text("url").notNull(),
    altText: varchar("alt_text", { length: 255 }),
    sortOrder: integer("sort_order").default(0),
    isPrimary: boolean("is_primary").default(false),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => ({
    productIdx: index("idx_product_images_product_id").on(table.productId),
  }),
)

// Orders table
export const orders = pgTable(
  "orders",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    orderNumber: varchar("order_number", { length: 50 }).notNull().unique(),
    userId: uuid("user_id").references(() => users.id),
    status: varchar("status", { length: 50 }).default("pending"),
    paymentStatus: varchar("payment_status", { length: 50 }).default("pending"),
    paymentMethod: varchar("payment_method", { length: 100 }),
    paymentId: varchar("payment_id", { length: 255 }),
    subtotal: decimal("subtotal", { precision: 10, scale: 2 }).notNull(),
    taxAmount: decimal("tax_amount", { precision: 10, scale: 2 }).default("0"),
    shippingAmount: decimal("shipping_amount", { precision: 10, scale: 2 }).default("0"),
    discountAmount: decimal("discount_amount", { precision: 10, scale: 2 }).default("0"),
    totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
    currency: varchar("currency", { length: 3 }).default("INR"),
    shippingAddress: jsonb("shipping_address").notNull(),
    billingAddress: jsonb("billing_address").notNull(),
    notes: text("notes"),
    shippedAt: timestamp("shipped_at"),
    deliveredAt: timestamp("delivered_at"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => ({
    userIdx: index("idx_orders_user_id").on(table.userId),
    statusIdx: index("idx_orders_status").on(table.status),
    orderNumberIdx: index("idx_orders_order_number").on(table.orderNumber),
  }),
)

// Cart items table
export const cartItems = pgTable(
  "cart_items",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
    sessionId: varchar("session_id", { length: 255 }),
    productId: uuid("product_id").references(() => products.id, { onDelete: "cascade" }),
    quantity: integer("quantity").notNull().default(1),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => ({
    userIdx: index("idx_cart_items_user_id").on(table.userId),
    sessionIdx: index("idx_cart_items_session_id").on(table.sessionId),
  }),
)

// Product reviews table
export const productReviews = pgTable(
  "product_reviews",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    productId: uuid("product_id").references(() => products.id, { onDelete: "cascade" }),
    userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
    orderId: uuid("order_id").references(() => orders.id),
    rating: integer("rating").notNull(),
    title: varchar("title", { length: 255 }),
    comment: text("comment"),
    isVerifiedPurchase: boolean("is_verified_purchase").default(false),
    isApproved: boolean("is_approved").default(false),
    helpfulCount: integer("helpful_count").default(0),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => ({
    productIdx: index("idx_product_reviews_product_id").on(table.productId),
    userIdx: index("idx_product_reviews_user_id").on(table.userId),
  }),
)

// Define relations
export const usersRelations = relations(users, ({ many }) => ({
  orders: many(orders),
  cartItems: many(cartItems),
  reviews: many(productReviews),
}))

export const categoriesRelations = relations(categories, ({ one, many }) => ({
  parent: one(categories, {
    fields: [categories.parentId],
    references: [categories.id],
  }),
  children: many(categories),
  products: many(products),
}))

export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  images: many(productImages),
  cartItems: many(cartItems),
  reviews: many(productReviews),
  orderItems: many(orderItems),
}))

export const productImagesRelations = relations(productImages, ({ one }) => ({
  product: one(products, {
    fields: [productImages.productId],
    references: [products.id],
  }),
}))

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
  items: many(orderItems),
}))

export const cartItemsRelations = relations(cartItems, ({ one }) => ({
  user: one(users, {
    fields: [cartItems.userId],
    references: [users.id],
  }),
  product: one(products, {
    fields: [cartItems.productId],
    references: [products.id],
  }),
}))

export const productReviewsRelations = relations(productReviews, ({ one }) => ({
  product: one(products, {
    fields: [productReviews.productId],
    references: [products.id],
  }),
  user: one(users, {
    fields: [productReviews.userId],
    references: [users.id],
  }),
  order: one(orders, {
    fields: [productReviews.orderId],
    references: [orders.id],
  }),
}))

// Order items table
export const orderItems = pgTable(
  "order_items",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    orderId: uuid("order_id").references(() => orders.id, { onDelete: "cascade" }),
    productId: uuid("product_id").references(() => products.id),
    quantity: integer("quantity").notNull(),
    price: decimal("price", { precision: 10, scale: 2 }).notNull(),
    totalPrice: decimal("total_price", { precision: 10, scale: 2 }).notNull(),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => ({
    orderIdx: index("idx_order_items_order_id").on(table.orderId),
    productIdx: index("idx_order_items_product_id").on(table.productId),
  }),
)

// Reviews alias for productReviews table
export const reviews = productReviews

// Order items relations
export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
}))
