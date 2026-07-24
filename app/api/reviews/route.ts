import { NextResponse } from "next/server";

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function GET() {
  try {
    const res = await fetch(
      `${supabaseUrl}/rest/v1/reviews?select=*&is_approved=eq.true&order=created_at.desc`,
      {
        headers: {
          apikey: serviceRoleKey,
          Authorization: `Bearer ${serviceRoleKey}`,
        },
      }
    );

    if (!res.ok) return NextResponse.json([], { status: 200 });
    const reviews = await res.json();
    if (!Array.isArray(reviews)) return NextResponse.json(reviews);

    // Fetch product names for UUID product IDs
    const nameMap: Record<string, string> = {};
    const pRes = await fetch(
      `${supabaseUrl}/rest/v1/products?select=id,name`,
      {
        headers: {
          apikey: serviceRoleKey,
          Authorization: `Bearer ${serviceRoleKey}`,
        },
      }
    );
    if (pRes.ok) {
      const products = await pRes.json();
      if (Array.isArray(products)) {
        for (const p of products) {
          nameMap[p.id] = p.name;
        }
      }
    }

    const enriched = reviews.map((r: Record<string, unknown>) => {
      const product = r.product as string;
      const isUuid = /^[0-9a-f-]{36}$/i.test(product);
      return {
        ...r,
        product_name: isUuid ? (nameMap[product] || product) : product,
      };
    });

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
      headers: {
        "Content-Type": "application/json",
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
      },
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
