import { pgTable, uuid, text, integer, boolean, real, timestamp, jsonb } from "drizzle-orm/pg-core";

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
  status: text("status").default("pending"),
  subtotal: integer("subtotal"),
  shipping: integer("shipping").default(0),
  total: integer("total"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const orderItems = pgTable("order_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  orderId: uuid("order_id").references(() => orders.id),
  productId: uuid("product_id").references(() => products.id),
  quantity: integer("quantity").notNull(),
  price: integer("price").notNull(),
});

export const addresses = pgTable("addresses", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id"),
  line1: text("line1"),
  line2: text("line2"),
  city: text("city"),
  state: text("state"),
  pincode: text("pincode"),
  phone: text("phone"),
});
