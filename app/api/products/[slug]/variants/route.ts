import { NextRequest, NextResponse } from "next/server";
import { supabaseFetch } from "@/lib/supabase-fetch";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const { data: products } = await supabaseFetch(
    `products?slug=eq.${slug}&select=id`
  );

  if (!Array.isArray(products) || products.length === 0) {
    return NextResponse.json({ variants: [] });
  }

  const productId = (products[0] as Record<string, string>).id;

  const { data: variants, error } = await supabaseFetch(
    `product_variants?product_id=eq.${productId}&is_active=eq.true&select=*&order=name.asc`
  );

  if (error || !Array.isArray(variants)) {
    if (error) console.error("Variants fetch error:", error);
    return NextResponse.json({ variants: [] });
  }

  return NextResponse.json({ variants });
}
