CREATE TABLE "account" (
	"userId" uuid NOT NULL,
	"type" varchar(255) NOT NULL,
	"provider" varchar(255) NOT NULL,
	"providerAccountId" varchar(255) NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" varchar(255),
	"scope" varchar(255),
	"id_token" text,
	"session_state" varchar(255)
);
--> statement-breakpoint
CREATE TABLE "banners" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(255) NOT NULL,
	"subtitle" varchar(255),
	"description" text,
	"button_text" varchar(100),
	"button_link" varchar(500),
	"position" varchar(50) DEFAULT 'hero',
	"image" text,
	"mobile_image" text,
	"is_active" boolean DEFAULT true,
	"start_date" timestamp,
	"end_date" timestamp,
	"sort_order" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "brands" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"description" text,
	"website" varchar(500),
	"logo" text,
	"is_active" boolean DEFAULT true,
	"is_featured" boolean DEFAULT false,
	"sort_order" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "brands_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "cart_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"session_id" varchar(255),
	"product_id" uuid,
	"quantity" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"description" text,
	"image_url" text,
	"parent_id" uuid,
	"is_active" boolean DEFAULT true,
	"sort_order" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "categories_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "hero_images" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(255) NOT NULL,
	"subtitle" varchar(255),
	"description" text,
	"button_text" varchar(100),
	"button_link" varchar(500),
	"position" varchar(50) DEFAULT 'main',
	"image" text,
	"mobile_image" text,
	"is_active" boolean DEFAULT true,
	"start_date" timestamp,
	"end_date" timestamp,
	"sort_order" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "order_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_id" uuid,
	"product_id" uuid,
	"quantity" integer NOT NULL,
	"price" numeric(10, 2) NOT NULL,
	"total_price" numeric(10, 2) NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_number" varchar(50) NOT NULL,
	"user_id" uuid,
	"status" varchar(50) DEFAULT 'pending',
	"payment_status" varchar(50) DEFAULT 'pending',
	"payment_method" varchar(100),
	"payment_id" varchar(255),
	"subtotal" numeric(10, 2) NOT NULL,
	"tax_amount" numeric(10, 2) DEFAULT '0',
	"shipping_amount" numeric(10, 2) DEFAULT '0',
	"discount_amount" numeric(10, 2) DEFAULT '0',
	"total_amount" numeric(10, 2) NOT NULL,
	"currency" varchar(3) DEFAULT 'INR',
	"shipping_address" jsonb NOT NULL,
	"billing_address" jsonb NOT NULL,
	"notes" text,
	"shipped_at" timestamp,
	"delivered_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "orders_order_number_unique" UNIQUE("order_number")
);
--> statement-breakpoint
CREATE TABLE "product_images" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_id" uuid,
	"url" text NOT NULL,
	"alt_text" varchar(255),
	"sort_order" integer DEFAULT 0,
	"is_primary" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "product_reviews" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_id" uuid,
	"user_id" uuid,
	"order_id" uuid,
	"rating" integer NOT NULL,
	"title" varchar(255),
	"comment" text,
	"is_verified_purchase" boolean DEFAULT false,
	"is_approved" boolean DEFAULT false,
	"helpful_count" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"description" text,
	"short_description" text,
	"sku" varchar(100) NOT NULL,
	"price" numeric(10, 2) NOT NULL,
	"compare_price" numeric(10, 2),
	"inventory_quantity" integer DEFAULT 0,
	"category_id" uuid,
	"brand_id" uuid,
	"brand" varchar(255),
	"age_range" varchar(100),
	"safety_certifications" text[],
	"materials" text[],
	"is_active" boolean DEFAULT true,
	"is_featured" boolean DEFAULT false,
	"meta_title" varchar(255),
	"meta_description" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "products_slug_unique" UNIQUE("slug"),
	CONSTRAINT "products_sku_unique" UNIQUE("sku")
);
--> statement-breakpoint
CREATE TABLE "session" (
	"sessionToken" varchar(255) PRIMARY KEY NOT NULL,
	"userId" uuid NOT NULL,
	"expires" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "testimonials" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"customer_name" varchar(255) NOT NULL,
	"customer_email" varchar(255),
	"customer_location" varchar(255),
	"customer_image" text,
	"rating" integer NOT NULL,
	"title" varchar(255) NOT NULL,
	"content" text NOT NULL,
	"product_id" uuid,
	"is_approved" boolean DEFAULT false,
	"is_featured" boolean DEFAULT false,
	"sort_order" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "user_addresses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"type" varchar(20) DEFAULT 'home' NOT NULL,
	"name" varchar(255) NOT NULL,
	"phone" varchar(30) NOT NULL,
	"address" text NOT NULL,
	"city" varchar(120) NOT NULL,
	"state" varchar(120) NOT NULL,
	"pincode" varchar(20) NOT NULL,
	"is_default" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(255) NOT NULL,
	"name" varchar(255) NOT NULL,
	"password" text,
	"image" text,
	"role" varchar(50) DEFAULT 'customer',
	"status" varchar(50) DEFAULT 'approved',
	"emailVerified" timestamp,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now(),
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verificationToken" (
	"identifier" varchar(255) NOT NULL,
	"token" varchar(255) NOT NULL,
	"expires" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "wishlist_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"product_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "categories" ADD CONSTRAINT "categories_parent_id_categories_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_images" ADD CONSTRAINT "product_images_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_reviews" ADD CONSTRAINT "product_reviews_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_reviews" ADD CONSTRAINT "product_reviews_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_reviews" ADD CONSTRAINT "product_reviews_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_brand_id_brands_id_fk" FOREIGN KEY ("brand_id") REFERENCES "public"."brands"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "testimonials" ADD CONSTRAINT "testimonials_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_addresses" ADD CONSTRAINT "user_addresses_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wishlist_items" ADD CONSTRAINT "wishlist_items_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wishlist_items" ADD CONSTRAINT "wishlist_items_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "account_provider_providerAccountId_idx" ON "account" USING btree ("provider","providerAccountId");--> statement-breakpoint
CREATE INDEX "idx_banners_position" ON "banners" USING btree ("position");--> statement-breakpoint
CREATE INDEX "idx_banners_is_active" ON "banners" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "idx_banners_dates" ON "banners" USING btree ("start_date","end_date");--> statement-breakpoint
CREATE INDEX "idx_brands_slug" ON "brands" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "idx_brands_is_active" ON "brands" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "idx_brands_is_featured" ON "brands" USING btree ("is_featured");--> statement-breakpoint
CREATE INDEX "idx_cart_items_user_id" ON "cart_items" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_cart_items_session_id" ON "cart_items" USING btree ("session_id");--> statement-breakpoint
CREATE INDEX "idx_categories_slug" ON "categories" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "idx_hero_images_position" ON "hero_images" USING btree ("position");--> statement-breakpoint
CREATE INDEX "idx_hero_images_is_active" ON "hero_images" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "idx_hero_images_dates" ON "hero_images" USING btree ("start_date","end_date");--> statement-breakpoint
CREATE INDEX "idx_order_items_order_id" ON "order_items" USING btree ("order_id");--> statement-breakpoint
CREATE INDEX "idx_order_items_product_id" ON "order_items" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX "idx_orders_user_id" ON "orders" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_orders_status" ON "orders" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_orders_order_number" ON "orders" USING btree ("order_number");--> statement-breakpoint
CREATE INDEX "idx_product_images_product_id" ON "product_images" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX "idx_product_reviews_product_id" ON "product_reviews" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX "idx_product_reviews_user_id" ON "product_reviews" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_products_category_id" ON "products" USING btree ("category_id");--> statement-breakpoint
CREATE INDEX "idx_products_is_active" ON "products" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "idx_products_is_featured" ON "products" USING btree ("is_featured");--> statement-breakpoint
CREATE INDEX "idx_products_slug" ON "products" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "idx_testimonials_product_id" ON "testimonials" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX "idx_testimonials_is_approved" ON "testimonials" USING btree ("is_approved");--> statement-breakpoint
CREATE INDEX "idx_testimonials_is_featured" ON "testimonials" USING btree ("is_featured");--> statement-breakpoint
CREATE INDEX "idx_testimonials_rating" ON "testimonials" USING btree ("rating");--> statement-breakpoint
CREATE INDEX "idx_user_addresses_user_id" ON "user_addresses" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_user_addresses_default" ON "user_addresses" USING btree ("is_default");--> statement-breakpoint
CREATE INDEX "verificationToken_identifier_token_idx" ON "verificationToken" USING btree ("identifier","token");--> statement-breakpoint
CREATE INDEX "wishlist_user_product_idx" ON "wishlist_items" USING btree ("user_id","product_id");