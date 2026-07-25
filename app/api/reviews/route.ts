import { NextResponse } from "next/server";
import { auth } from "@/auth";

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const headers = {
  "Content-Type": "application/json",
  apikey: serviceRoleKey,
  Authorization: `Bearer ${serviceRoleKey}`,
};

async function enrichReviews(reviews: Record<string, unknown>[]) {
  const nameMap: Record<string, string> = {};
  const pRes = await fetch(
    `${supabaseUrl}/rest/v1/products?select=id,name`,
    { headers }
  );
  if (pRes.ok) {
    const products = await pRes.json();
    if (Array.isArray(products)) {
      for (const p of products) nameMap[p.id] = p.name;
    }
  }
  return reviews.map((r) => {
    const product = r.product as string;
    const isUuid = /^[0-9a-f-]{36}$/i.test(product);
    return { ...r, product_name: isUuid ? (nameMap[product] || product) : product };
  });
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const mine = searchParams.get("mine");

    let email: string | undefined;
    if (mine === "1") {
      const session = await auth();
      if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      email = session.user.email;
    }

    const filter = email
      ? `?select=*&email=eq.${encodeURIComponent(email)}&order=created_at.desc`
      : `?select=*&is_approved=eq.true&order=created_at.desc`;

    const res = await fetch(`${supabaseUrl}/rest/v1/reviews${filter}`, { headers });
    if (!res.ok) return NextResponse.json([], { status: 200 });
    const reviews = await res.json();
    if (!Array.isArray(reviews)) return NextResponse.json(reviews);

    const enriched = await enrichReviews(reviews);
    return NextResponse.json(enriched);
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, rating, title, comment, product, city, state } = body;
    const location = [city, state].filter(Boolean).join(", ");

    if (!name || !email || !rating || !title || !comment || !product) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const res = await fetch(`${supabaseUrl}/rest/v1/reviews`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        name,
        email,
        rating,
        title,
        comment,
        product,
        location,
        is_approved: true,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      return NextResponse.json({ error: err }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
