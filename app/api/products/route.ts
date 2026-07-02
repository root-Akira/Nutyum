import { NextResponse } from "next/server";
import { getProducts, getProduct } from "@/lib/products";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

async function computeRatings() {
  try {
    const res = await fetch(`${supabaseUrl}/rest/v1/reviews?select=product,rating&is_approved=eq.true`, {
      headers: { apikey: serviceRoleKey, Authorization: `Bearer ${serviceRoleKey}` },
    });
    if (!res.ok) return {};
    const reviews: { product: string; rating: number }[] = await res.json();
    if (!Array.isArray(reviews) || reviews.length === 0) return {};

    const groups: Record<string, { sum: number; count: number }> = {};
    for (const r of reviews) {
      if (!r.product) continue;
      if (!groups[r.product]) groups[r.product] = { sum: 0, count: 0 };
      groups[r.product].sum += Number(r.rating) || 0;
      groups[r.product].count += 1;
    }

    const result: Record<string, { rating: number; reviewCount: number }> = {};
    for (const [product, g] of Object.entries(groups)) {
      result[product] = {
        rating: Math.round((g.sum / g.count) * 10) / 10,
        reviewCount: g.count,
      };
    }
    return result;
  } catch {
    return {};
  }
}

function applyRatings(products: any[], ratings: Record<string, { rating: number; reviewCount: number }>) {
  return products.map((p) => {
    const r = ratings[p.name];
    if (r) {
      return { ...p, rating: r.rating, reviewCount: r.reviewCount };
    }
    return p;
  });
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug");

  if (slug) {
    const product = await getProduct(slug);
    if (!product) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    const ratings = await computeRatings();
    return NextResponse.json(applyRatings([product], ratings)[0]);
  }

  const products = await getProducts();
  const ratings = await computeRatings();
  return NextResponse.json(applyRatings(products, ratings));
}
