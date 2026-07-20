import type { Product, ProductCategory, VibeTag } from "@/types";
import { PRODUCTS as FALLBACK_PRODUCTS } from "@/data/products";

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

type DbProduct = Record<string, unknown>;

function mapDbToProduct(row: DbProduct): Product {
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
    isNew: row.is_new as boolean,
    isBestSeller: row.is_best_seller as boolean,
    isComingSoon: (row.is_coming_soon as boolean) || (row.badge_label === "COMING SOON") || false,
    launchDate: (row.launch_date as string | null) ?? undefined,
    rating: row.rating as number,
    reviewCount: row.review_count as number,
    weight: row.weight as string,
    badgeLabel: (row.badge_label as string | null) ?? undefined,
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

export async function getProducts(): Promise<Product[]> {
  try {
    const data: DbProduct[] | null = await fetchFromDb(
      "products?order=price.asc"
    );
    if (data && data.length > 0) {
      return data.map(mapDbToProduct);
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
      return mapDbToProduct(data[0]);
    }
  } catch {
    // fall through to static data
  }
  return FALLBACK_PRODUCTS.find((p) => p.slug === slug) ?? null;
}
