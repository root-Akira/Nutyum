import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { supabaseFetch, getErrorMessage } from "@/lib/supabase-fetch";
import { orderConfirmationEmail, sendEmail } from "@/lib/email";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: orders, error } = await supabaseFetch(
    `orders?user_id=eq.${session.user.id}&select=*,order_items(*)&order=created_at.desc`
  );

  if (error || !Array.isArray(orders)) {
    return NextResponse.json({ error: error ? getErrorMessage(error) : "Orders not found" }, { status: error ? 500 : 404 });
  }

  // Collect all product IDs to fetch images in one batch
  const allProductIds = new Set<string>();
  for (const o of orders as Record<string, unknown>[]) {
    const items = (o.order_items as Record<string, unknown>[]) || [];
    for (const i of items) {
      const pid = i.product_id as string;
      if (pid) allProductIds.add(pid);
    }
  }

  // Fetch product images
  const imageMap: Record<string, string> = {};
  if (allProductIds.size > 0) {
    const ids = Array.from(allProductIds);
    // Fetch in chunks of 50 to avoid URL length limits
    for (let i = 0; i < ids.length; i += 50) {
      const chunk = ids.slice(i, i + 50);
      const orClause = chunk.map((id) => `id.eq.${id}`).join(",");
      const { data: products } = await supabaseFetch(
        `products?or=(${orClause})&select=id,images`
      );
      if (Array.isArray(products)) {
        for (const p of products as Record<string, unknown>[]) {
          const imgs = p.images as string[] | undefined;
          if (imgs && imgs.length > 0) {
            imageMap[p.id as string] = imgs[0];
          }
        }
      }
    }
  }

  const mapped = orders.map((o: Record<string, unknown>) => ({
    id: o.id,
    status: o.status,
    subtotal: o.subtotal,
    shipping: o.shipping,
    discountAmount: o.discount,
    total: o.total,
    items: (o.order_items as Record<string, unknown>[])?.map((i: Record<string, unknown>) => ({
      id: i.id,
      productId: i.product_id,
      variantName: i.variant_name,
      productName: i.product_name,
      productImage: imageMap[i.product_id as string] || "",
      quantity: i.quantity,
      price: i.price,
    })) || [],
    createdAt: o.created_at,
  }));

  return NextResponse.json(mapped);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { addressId, couponCode, discountAmount, paymentMethod } = body;
    const isCOD = paymentMethod === "cod";

    // Validate address
    const { data: addresses, error: addrErr } = await supabaseFetch(
      `addresses?id=eq.${addressId}&user_id=eq.${session.user.id}&select=*`
    );
    if (addrErr || !Array.isArray(addresses) || addresses.length === 0) {
      return NextResponse.json({ error: "Invalid address" }, { status: 400 });
    }
    const address = addresses[0] as Record<string, unknown>;

    // Fetch cart items
    const { data: cartData, error: cartErr } = await supabaseFetch(
      `cart_items?user_id=eq.${session.user.id}&select=*`
    );
    if (cartErr || !Array.isArray(cartData) || cartData.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    const items: {
      productId: string;
      variantId: string | null;
      variantName: string | null;
      productName: string;
      productImage: string | null;
      price: number;
      quantity: number;
    }[] = [];

    let subtotal = 0;

    for (const cartItem of cartData as Record<string, unknown>[]) {
      const pd = cartItem.product_data as Record<string, unknown>;
      const compositeId = cartItem.product_id as string;
      const [productId, variantId] = compositeId.split("::");
      const qty = (cartItem.quantity as number) || 1;
      const price = (pd.price as number) || 0;

      items.push({
        productId: productId || compositeId,
        variantId: variantId || null,
        variantName: (pd.variantName as string) || null,
        productName: (pd.name as string) || "Product",
        productImage: (pd.images as string[])?.[0] || null,
        price,
        quantity: qty,
      });
      subtotal += price * qty;
    }

    const FREE_SHIPPING_THRESHOLD = 999
    let shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 49;
    const discount = discountAmount || 0;
    let codCharge = 0;
    if (isCOD) {
      const { data: settingsArr } = await supabaseFetch(
        "site_settings?select=cod_charge&limit=1&order=updated_at.desc"
      );
      const settings = (Array.isArray(settingsArr) ? settingsArr[0] : null) as Record<string, unknown> | null;
      codCharge = Number(settings?.cod_charge) || 0;
      if (codCharge > 0) {
        shipping = codCharge;
      }
    }
    const total = Math.max(0, subtotal + shipping - discount);

    // Create order via REST API
    const orderId = crypto.randomUUID();
    const now = new Date().toISOString();

    const notes = couponCode ? `Coupon: ${couponCode}` : null;
    const { data: order, error: orderErr } = await supabaseFetch("orders", {
      method: "POST",
      headers: { "Content-Type": "application/json", Prefer: "return=representation" },
      body: JSON.stringify({
        id: orderId,
        user_id: session.user.id,
        status: "placed",
        payment_method: isCOD ? "cod" : "razorpay",
        subtotal,
        shipping,
        discount: discount,
        total,
        notes,
        shipping_address: JSON.stringify({
          line1: address.line1,
          line2: address.line2,
          city: address.city,
          state: address.state,
          pincode: address.pincode,
          phone: address.phone,
          recipient_name: body.recipientName || "",
          recipient_email: body.recipientEmail || "",
          recipient_phone: body.recipientPhone || "",
        }),
      }),
    });

    if (orderErr) {
      return NextResponse.json({ error: getErrorMessage(orderErr) || "Failed to create order" }, { status: 500 });
    }

    // Create order items
    for (const item of items) {
      const { error: itemErr } = await supabaseFetch("order_items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order_id: orderId,
          product_id: item.productId,
          variant_name: item.variantName,
          product_name: item.productName,
          quantity: item.quantity,
          price: item.price,
        }),
      });
      if (itemErr) {
        console.error("Failed to create order item:", itemErr);
      }
    }

    // Create initial status log
    await supabaseFetch("order_status_logs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        order_id: orderId,
        status: "placed",
        note: isCOD ? "Order placed (COD)" : "Order placed",
      }),
    });

    if (isCOD) {
      // Confirm order immediately
      await supabaseFetch(`orders?id=eq.${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "confirmed", total }),
      });
      await supabaseFetch("order_status_logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order_id: orderId,
          status: "confirmed",
          note: "Order placed (COD)",
        }),
      });

      // Send confirmation email
      const emailItems = items.map((i) => ({
        name: i.productName,
        qty: i.quantity,
        price: i.price,
        variant: i.variantName || undefined,
      }));
      const { to, subject, html } = orderConfirmationEmail(orderId, session.user.email || "", emailItems, total);
      await sendEmail(to, subject, html);

      // Clear cart
      await supabaseFetch(`cart_items?user_id=eq.${session.user.id}`, { method: "DELETE" });

      return NextResponse.json({ orderId, paymentMethod: "cod" });
    }

    // Create Razorpay order
    const razorpayKeyId = process.env.RAZORPAY_KEY_ID;
    const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!razorpayKeyId || !razorpayKeySecret) {
      return NextResponse.json({ error: "Payment not configured" }, { status: 500 });
    }

    const razorpayRes = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${Buffer.from(`${razorpayKeyId}:${razorpayKeySecret}`).toString("base64")}`,
      },
      body: JSON.stringify({
        amount: total * 100,
        currency: "INR",
        receipt: orderId,
        notes: { order_id: orderId },
      }),
    });

    if (!razorpayRes.ok) {
      const errText = await razorpayRes.text();
      console.error("Razorpay order creation failed:", errText);
      return NextResponse.json({ error: "Payment gateway error" }, { status: 500 });
    }

    const razorpayOrder = await razorpayRes.json();

    // Save razorpay_order_id in tracking_number and update payment_status
    const { error: updateErr } = await supabaseFetch(
      `orders?id=eq.${orderId}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tracking_number: razorpayOrder.id, payment_status: "pending" }),
      }
    );
    if (updateErr) console.error("Failed to save razorpay order info:", updateErr);

    // Clear cart
    await supabaseFetch(
      `cart_items?user_id=eq.${session.user.id}`,
      { method: "DELETE" }
    );

    return NextResponse.json({
      orderId,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      key: razorpayKeyId,
    });
  } catch (err) {
    console.error("Checkout error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
