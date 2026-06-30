import type { Product } from "@/types";

/**
 * ── DEMO / TEST PRODUCT DATA ──────────────────────────────────────────────
 *
 * These 6 products are placeholders for client preview and local testing.
 * They use stock images (hero-slide1.png, hero-product.png) and sample prices.
 *
 * TO REPLACE WITH REAL PRODUCTS:
 *   1. Edit the array below — swap out each item with your real product data.
 *   2. Upload real product images to `public/` and update the `images` paths.
 *   3. Everything else (shop page, detail page, cart, search) updates
 *      automatically — this file is the **single source of truth**.
 *
 * Type reference: import { Product } from "@/types"
 *
 * ── FIELDS ──
 *   id          – unique key (kebab-case)
 *   slug        – URL path segment (must be unique)
 *   name        – display name
 *   price       – in INR (₹)
 *   description – short product blurb
 *   images      – array of paths to /public/ images
 *   bgColor     – hex background for cards
 *   category    – "classic" | "spicy" | "sweet" | "gift"
 *   vibes       – filter tags (max 2)
 *   isNew       – shows "NEW ARRIVAL" badge
 *   isBestSeller – shows "BESTSELLER" badge
 *   rating      – 0–5
 *   reviewCount – number of reviews
 *   weight      – pack size string (e.g. "100g")
 *   badgeLabel  – uppercase badge text
 */
export const PRODUCTS: Product[] = [
  {
    id: "sea-salt",
    slug: "himalayan-sea-salt",
    name: "Himalayan Sea Salt Makhana",
    price: 299,
    description: "Lightly salted with pure Himalayan pink salt for a satisfying crunch.",
    images: ["/hero-slide1.png"],
    bgColor: "#d6e8c0",
    category: "classic",
    vibes: ["Lightly Salted", "Crunchy & Light"],
    isNew: false,
    isBestSeller: true,
    rating: 4.9,
    reviewCount: 84,
    weight: "100g",
  },
  {
    id: "peri-peri",
    slug: "peri-peri",
    name: "Peri Peri Makhana",
    price: 299,
    description: "Fiery African bird's eye chilli meets the wholesome goodness of lotus seeds.",
    images: ["/hero-product.png"],
    bgColor: "#fad9c8",
    category: "spicy",
    vibes: ["Bold Heat", "Savory Twist"],
    isNew: false,
    isBestSeller: true,
    rating: 4.7,
    reviewCount: 61,
    weight: "70g",
    badgeLabel: "BESTSELLER",
  },
  {
    id: "dark-choc",
    slug: "dark-chocolate",
    name: "Dark Chocolate Makhana",
    price: 349,
    description: "Rich 70% dark chocolate coating on our signature roasted makhana puffs.",
    images: ["/hero-slide1.png"],
    bgColor: "#e8dff0",
    category: "sweet",
    vibes: ["A Sweet Treat", "Zero Guilt"],
    isNew: true,
    isBestSeller: false,
    rating: 5,
    reviewCount: 12,
    weight: "70g",
    badgeLabel: "NEW ARRIVAL",
  },
  {
    id: "pudina",
    slug: "classic-pudina",
    name: "Classic Pudina Makhana",
    price: 279,
    description: "Fresh mint leaves sourced from the foothills of the Himalayas.",
    images: ["/hero-product.png"],
    bgColor: "#c8e4f0",
    category: "classic",
    vibes: ["Classic Flavors", "Evening Munch"],
    isNew: false,
    isBestSeller: false,
    rating: 4.8,
    reviewCount: 42,
    weight: "70g",
    badgeLabel: "CLASSIC",
  },
  {
    id: "variety",
    slug: "variety-pack",
    name: "Nutyum Variety Pack",
    price: 899,
    description: "All five of our signature flavours in one premium gift-ready set.",
    images: ["/hero-slide1.png"],
    bgColor: "#f5e6c8",
    category: "gift",
    vibes: ["Perfect Gift", "Guilt-Free"],
    isNew: false,
    isBestSeller: false,
    rating: 5,
    reviewCount: 8,
    weight: "350g",
    badgeLabel: "GIFTS & SAMPLERS",
  },
  {
    id: "turmeric",
    slug: "turmeric-pepper",
    name: "Turmeric & Pepper Makhana",
    price: 299,
    description: "Warm turmeric and cracked black pepper combine for an earthy, immune-boosting snack.",
    images: ["/hero-product.png"],
    bgColor: "#f0e6c8",
    category: "spicy",
    vibes: ["Savory Twist", "Whole Grain"],
    isNew: true,
    isBestSeller: false,
    rating: 4.6,
    reviewCount: 18,
    weight: "70g",
    badgeLabel: "NEW ARRIVAL",
  },
];
