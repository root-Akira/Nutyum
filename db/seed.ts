import { readFileSync } from "fs";

// Load .env.local manually (tsx doesn't auto-load env files)
const env = readFileSync(".env.local", "utf8");
for (const line of env.split("\n")) {
  const m = line.match(/^([^=]+)=(.*)$/);
  if (m) process.env[m[1]] = m[2];
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const PRODUCTS = [
  {
    slug: "himalayan-sea-salt",
    name: "Himalayan Sea Salt Makhana",
    price: 299,
    original_price: null,
    description: "Lightly salted with pure Himalayan pink salt for a satisfying crunch.",
    images: ["https://jemypvfnlazkrvrmzcaz.supabase.co/storage/v1/object/public/product-images/hero-slide1.png"],
    bg_color: "#d6e8c0",
    category: "classic",
    vibes: ["Lightly Salted", "Crunchy & Light"],
    is_new: false,
    is_best_seller: true,
    is_coming_soon: false,
    launch_date: null,
    rating: 4.9,
    review_count: 84,
    weight: "100g",
    badge_label: null,
  },
  {
    slug: "peri-peri",
    name: "Peri Peri Makhana",
    price: 299,
    original_price: null,
    description: "Fiery African bird's eye chilli meets the wholesome goodness of lotus seeds.",
    images: ["https://jemypvfnlazkrvrmzcaz.supabase.co/storage/v1/object/public/product-images/hero-product.png"],
    bg_color: "#fad9c8",
    category: "spicy",
    vibes: ["Bold Heat", "Savory Twist"],
    is_new: false,
    is_best_seller: true,
    is_coming_soon: false,
    launch_date: null,
    rating: 4.7,
    review_count: 61,
    weight: "70g",
    badge_label: "BESTSELLER",
  },
  {
    slug: "dark-chocolate",
    name: "Dark Chocolate Makhana",
    price: 349,
    original_price: null,
    description: "Rich 70% dark chocolate coating on our signature roasted makhana puffs.",
    images: ["https://jemypvfnlazkrvrmzcaz.supabase.co/storage/v1/object/public/product-images/hero-slide1.png"],
    bg_color: "#e8dff0",
    category: "sweet",
    vibes: ["A Sweet Treat", "Zero Guilt"],
    is_new: true,
    is_best_seller: false,
    is_coming_soon: false,
    launch_date: null,
    rating: 5,
    review_count: 12,
    weight: "70g",
    badge_label: "NEW ARRIVAL",
  },
  {
    slug: "classic-pudina",
    name: "Classic Pudina Makhana",
    price: 279,
    original_price: null,
    description: "Fresh mint leaves sourced from the foothills of the Himalayas.",
    images: ["https://jemypvfnlazkrvrmzcaz.supabase.co/storage/v1/object/public/product-images/hero-product.png"],
    bg_color: "#c8e4f0",
    category: "classic",
    vibes: ["Classic Flavors", "Evening Munch"],
    is_new: false,
    is_best_seller: false,
    is_coming_soon: false,
    launch_date: null,
    rating: 4.8,
    review_count: 42,
    weight: "70g",
    badge_label: "CLASSIC",
  },
  {
    slug: "variety-pack",
    name: "Nutyum Variety Pack",
    price: 899,
    original_price: null,
    description: "All five of our signature flavours in one premium gift-ready set.",
    images: ["https://jemypvfnlazkrvrmzcaz.supabase.co/storage/v1/object/public/product-images/hero-slide1.png"],
    bg_color: "#f5e6c8",
    category: "gift",
    vibes: ["Perfect Gift", "Guilt-Free"],
    is_new: false,
    is_best_seller: false,
    is_coming_soon: false,
    launch_date: null,
    rating: 5,
    review_count: 8,
    weight: "350g",
    badge_label: "GIFTS & SAMPLERS",
  },
  {
    slug: "turmeric-pepper",
    name: "Turmeric & Pepper Makhana",
    price: 299,
    original_price: null,
    description: "Warm turmeric and cracked black pepper combine for an earthy, immune-boosting snack.",
    images: ["https://jemypvfnlazkrvrmzcaz.supabase.co/storage/v1/object/public/product-images/hero-product.png"],
    bg_color: "#f0e6c8",
    category: "spicy",
    vibes: ["Savory Twist", "Whole Grain"],
    is_new: true,
    is_best_seller: false,
    is_coming_soon: false,
    launch_date: null,
    rating: 4.6,
    review_count: 18,
    weight: "70g",
    badge_label: "NEW ARRIVAL",
  },
  {
    slug: "coming-soon-sample",
    name: "Coming Soon Sample",
    price: 349,
    original_price: null,
    description: "A brand new flavour coming to your snack rotation.",
    images: ["https://jemypvfnlazkrvrmzcaz.supabase.co/storage/v1/object/public/product-images/hero-slide1.png"],
    bg_color: "#f0dcc8",
    category: "classic",
    vibes: ["Crunchy & Light", "Zero Guilt"],
    is_new: false,
    is_best_seller: false,
    is_coming_soon: true,
    launch_date: "August 1",
    rating: 0,
    review_count: 0,
    weight: "70g",
    badge_label: null,
  },
];

async function seed() {
  console.log("Seeding products...\n");

  for (const product of PRODUCTS) {
    const res = await fetch(
      `${supabaseUrl}/rest/v1/products`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: serviceRoleKey,
          Authorization: `Bearer ${serviceRoleKey}`,
          Prefer: "resolution=merge-duplicates",
        },
        body: JSON.stringify(product),
      }
    );

    if (res.ok) {
      console.log(`  ✓ ${product.name}`);
    } else {
      const err = await res.text();
      console.log(`  ✗ ${product.name}: ${err}`);
    }
  }

  console.log("\nDone!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
