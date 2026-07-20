import type { Product, ProductCategory, VibeTag } from "@/types";
import { PRODUCTS as FALLBACK_PRODUCTS } from "@/data/products";

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

if (!supabaseUrl || !serviceRoleKey) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY env vars");
}

type DbProduct = Record<string, unknown>;

function mapDbToProduct(row: DbProduct): Product {
  const badge = row.badge_label as string | undefined
  const hasBadge = !!badge
  return {
    id: row.id as string,
    slug: row.slug as string,
    name: row.name as string,
    price: row.price as number,
    originalPrice: (row.original_price as number | null) ?? undefined,
    description: row.description as string,
    ingredients: (row.ingredients as string[]) ?? undefined,
    nutritionalInfo: (row.nutritional_info as Product["nutritionalInfo"]) ?? undefined,
    images: row.images as string[],
    bgColor: row.bg_color as string,
    category: row.category as ProductCategory,
    vibes: row.vibes as VibeTag[],
    badgeLabel: badge ?? undefined,
    isNew: hasBadge ? badge === "NEW" || badge === "NEW ARRIVAL" : (row.is_new as boolean) || false,
    isBestSeller: hasBadge ? badge === "BESTSELLER" : (row.is_best_seller as boolean) || false,
    isComingSoon: hasBadge ? badge === "COMING SOON" : (row.is_coming_soon as boolean) || false,
    launchDate: (row.launch_date as string | null) ?? undefined,
    rating: row.rating as number,
    reviewCount: row.review_count as number,
    weight: row.weight as string,
    isOutOfStock: (row.is_out_of_stock as boolean) ?? undefined,
    imageAlts: (row.image_alts as string[]) ?? undefined,
    comparePrice: (row.compare_price as number | null) ?? undefined,
    sku: (row.sku as string) ?? undefined,
    stock: (row.stock as number) ?? undefined,
  };
}

async function fetchFromDb(path: string) {
  const res = await fetch(`${supabaseUrl}/rest/v1/${path}`, {
    headers: {
      "apikey": serviceRoleKey,
      "Authorization": `Bearer ${serviceRoleKey}`,
      "Accept": "application/json",
    },
  });
  if (!res.ok) return null;
  return res.json();
}

async function enrichPrices(products: Product[]): Promise<Product[]> {
  const ids = products.filter(p => !p.price).map(p => p.id)
  if (ids.length === 0) return products
  const data = await fetchFromDb(
    `product_variants?product_id=in.(${ids.map(id => `"${id}"`).join(',')})&select=product_id,price`
  )
  if (!Array.isArray(data)) return products
  const minPrices: Record<string, number> = {}
  for (const row of data) {
    const pid = row.product_id as string
    const price = Number(row.price) || 0
    if (!minPrices[pid] || price < minPrices[pid]) minPrices[pid] = price
  }
  return products.map(p => ({
    ...p,
    price: p.price || minPrices[p.id] || 0,
  }))
}

export async function getProducts(): Promise<Product[]> {
  try {
    const data: DbProduct[] | null = await fetchFromDb(
      "products?order=price.asc"
    );
    if (data && data.length > 0) {
      return enrichPrices(data.map(mapDbToProduct));
    }
  } catch {
    // fall through to static data
  }
  return FALLBACK_PRODUCTS;
}

export async function getProduct(slug: string): Promise<Product | null> {
  try {
    const data: DbProduct[] | null = await fetchFromDb(
      `products?slug=eq.${slug}&limit=1`
    );
    if (data && data.length > 0) {
      const products = await enrichPrices([mapDbToProduct(data[0])])
      return products[0] ?? null
    }
  } catch {
    // fall through to static data
  }
  return FALLBACK_PRODUCTS.find((p) => p.slug === slug) ?? null;
}
