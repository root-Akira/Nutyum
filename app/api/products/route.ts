import { NextResponse } from "next/server";
import { getProducts, getProduct } from "@/lib/products";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug");

  if (slug) {
    const product = await getProduct(slug);
    if (!product) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(product);
  }

  const products = await getProducts();
  return NextResponse.json(products);
}
