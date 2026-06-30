import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { auth } from "@/auth";
import { db } from "@/db";
import { cartItems } from "@/db/schema";

export async function GET() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return NextResponse.json({ items: [] });
  }

  const rows = await db
    .select()
    .from(cartItems)
    .where(eq(cartItems.userId, userId));

  const items = rows.map((r) => ({
    productId: (r.productData as Record<string, unknown>).id as string,
    quantity: r.quantity,
    product: r.productData as Record<string, unknown>,
  }));

  return NextResponse.json({ items });
}

export async function POST(req: Request) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { items } = await req.json() as { items: { productId: string; quantity: number; product: Record<string, unknown> }[] };

  // Replace all cart items for this user in a single transaction
  await db.transaction(async (tx) => {
    await tx.delete(cartItems).where(eq(cartItems.userId, userId));

    if (items.length > 0) {
      await tx.insert(cartItems).values(
        items.map((item) => ({
          userId: userId,
          productId: item.productId,
          productData: item.product,
          quantity: item.quantity,
        }))
      );
    }
  });

  return NextResponse.json({ ok: true });
}
