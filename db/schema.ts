import { pgTable, uuid, text, integer, boolean, real, timestamp, jsonb, unique } from "drizzle-orm/pg-core";

export const products = pgTable("products", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: text("slug").unique().notNull(),
  name: text("name").notNull(),
  price: integer("price").notNull(),
  originalPrice: integer("original_price"),
  description: text("description"),
  ingredients: text("ingredients").array(),
  images: text("images").array(),
  bgColor: text("bg_color"),
  category: text("category"),
  vibes: text("vibes").array(),
  isNew: boolean("is_new").default(false),
  isBestSeller: boolean("is_best_seller").default(false),
  isComingSoon: boolean("is_coming_soon").default(false),
  launchDate: text("launch_date"),
  rating: real("rating").default(0),
  reviewCount: integer("review_count").default(0),
  weight: text("weight"),
  badgeLabel: text("badge_label"),
  nutritionalInfo: jsonb("nutritional_info"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const orders = pgTable("orders", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id"),
  email: text("email"),
  phone: text("phone"),
  status: text("status").default("pending"),
  subtotal: integer("subtotal"),
  shipping: integer("shipping").default(0),
  total: integer("total"),
  discountAmount: integer("discount_amount").default(0),
  couponCode: text("coupon_code"),
  shippingAddress: jsonb("shipping_address"),
  razorpayOrderId: text("razorpay_order_id"),
  razorpayPaymentId: text("razorpay_payment_id"),
  razorpaySignature: text("razorpay_signature"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const orderItems = pgTable("order_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  orderId: uuid("order_id").references(() => orders.id),
  productId: uuid("product_id").references(() => products.id),
  variantId: text("variant_id"),
  variantName: text("variant_name"),
  productName: text("product_name"),
  productImage: text("product_image"),
  quantity: integer("quantity").notNull(),
  price: integer("price").notNull(),
});

export const orderStatusLogs = pgTable("order_status_logs", {
  id: uuid("id").defaultRandom().primaryKey(),
  orderId: uuid("order_id").references(() => orders.id),
  status: text("status").notNull(),
  note: text("note"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const cartItems = pgTable("cart_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id").notNull(),
  productId: text("product_id").notNull(),
  productData: jsonb("product_data").notNull(),
  quantity: integer("quantity").notNull().default(1),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => ({
  userProductUnq: unique().on(table.userId, table.productId),
}));

export const addresses = pgTable("addresses", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id"),
  line1: text("line1"),
  line2: text("line2"),
  city: text("city"),
  state: text("state"),
  pincode: text("pincode"),
  phone: text("phone"),
  isDefault: boolean("is_default").default(false),
});

export const wishlist = pgTable("wishlist", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id").notNull(),
  productId: text("product_id").notNull(),
  productData: jsonb("product_data").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => ({
  userProductUnq: unique().on(table.userId, table.productId),
}));

export const reviews = pgTable("reviews", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  rating: integer("rating").notNull(),
  title: text("title").notNull(),
  comment: text("comment").notNull(),
  product: text("product").notNull(),
  location: text("location").default(""),
  isApproved: boolean("is_approved").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});
