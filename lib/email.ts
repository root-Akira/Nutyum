const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = "Nutyum <noreply@mail.nutyum.in>";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://nutyum.in";
const LOGO_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/product-images/logo.png`
  : "https://jemypvfnlazkrvrmzcaz.supabase.co/storage/v1/object/public/product-images/logo.png";

function heroHtml(title: string, subtitle: string) {
  return `
    <!-- HERO -->
    <tr>
        <td align="center" style="background:linear-gradient(135deg,#173D22,#2F6A42);padding:60px 40px;">
            <table role="presentation" cellpadding="0" cellspacing="0">
                <tr>
                    <td align="center"
                        style="background:#ffffff;border-radius:50%;padding:16px;box-shadow:0 8px 20px rgba(0,0,0,.15);">
                        <img
                            src="${LOGO_URL}"
                            width="72"
                            alt="Nutyum"
                            style="display:block;border:0;">
                    </td>
                </tr>
            </table>
            <h1 style="margin:30px 0 12px;color:#ffffff;font-size:34px;font-weight:700;line-height:1.2;">
                ${title}
            </h1>
            <p style="margin:0;color:#E8F2EB;font-size:16px;line-height:28px;max-width:420px;">
                ${subtitle}
            </p>
        </td>
    </tr>`;
}

function footerHtml() {
  return `
    <!-- DIVIDER -->
    <tr>
        <td style="padding:0 48px;">
            <div style="height:1px;background:#ECECEC;"></div>
        </td>
    </tr>
    <!-- FOOTER -->
    <tr>
        <td style="padding:28px 40px;background:#FAFAF8;text-align:center;">
            <img
                src="${LOGO_URL}"
                width="36"
                alt="Nutyum"
                style="display:block;margin:0 auto 14px;">
            <p style="margin:0;font-size:14px;font-weight:600;color:#173D22;">
                Nutyum
            </p>
            <p style="margin:8px 0 0;font-size:13px;color:#7A7A7A;line-height:22px;">
                Premium Roasted Makhana for a healthier lifestyle.
            </p>
            <p style="margin:20px 0 0;font-size:12px;color:#A0A0A0;">
                &copy; 2026 Nutyum. All rights reserved.
            </p>
        </td>
    </tr>`;
}

function baseHtml(content: string) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Nutyum</title>
</head>
<body style="margin:0;padding:0;background:#F6F5F0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F6F5F0;padding:40px 20px;">
<tr>
<td align="center">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:24px;overflow:hidden;max-width:600px;box-shadow:0 12px 30px rgba(0,0,0,.08);">
    ${content}
</table>
</td>
</tr>
</table>
</body>
</html>`;
}

function btnHtml(url: string, text: string) {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:45px;">
                <tr>
                    <td align="center">
                        <a href="${url}"
                           style="
                           background:#E59A17;
                           color:#ffffff;
                           text-decoration:none;
                           display:inline-block;
                           padding:18px 42px;
                           border-radius:999px;
                           font-size:16px;
                           font-weight:700;">
                            ${text}
                        </a>
                    </td>
                </tr>
            </table>`;
}

function bodyHtml(title: string, messageHtml: string, buttonHtml: string) {
  return `
    <!-- CONTENT -->
    <tr>
        <td style="padding:50px 48px;">
            <p style="margin:0;font-size:18px;font-weight:600;color:#173D22;">
                ${title}
            </p>
            <div style="margin:18px 0 36px;font-size:16px;line-height:30px;color:#5C665E;">
                ${messageHtml}
            </div>
            ${buttonHtml}
        </td>
    </tr>`;
}

function orderItemsHtml(items: { name: string; qty: number; price: number; variant?: string }[], total: number, deliveryDate?: string) {
  const rows = items.map(i => `<tr>
                    <td style="padding:12px 0;border-bottom:1px solid #ECECEC;">
                        <p style="margin:0;font-size:15px;font-weight:600;color:#173D22;">${i.name}${i.variant ? ` <span style="font-weight:400;color:#7A7A7A;">— ${i.variant}</span>` : ""}</p>
                        <p style="margin:4px 0 0;font-size:13px;color:#7A7A7A;">Qty: ${i.qty}</p>
                    </td>
                    <td style="padding:12px 0;border-bottom:1px solid #ECECEC;text-align:right;vertical-align:top;">
                        <p style="margin:0;font-size:15px;font-weight:600;color:#173D22;">₹${i.price}</p>
                    </td>
                </tr>`).join("");

  return `
    <tr>
        <td style="padding:0 48px 50px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                ${rows}
                <tr>
                    <td style="padding:16px 0 0;">
                        <p style="margin:0;font-size:16px;font-weight:700;color:#173D22;">Total</p>
                    </td>
                    <td style="padding:16px 0 0;text-align:right;">
                        <p style="margin:0;font-size:16px;font-weight:700;color:#173D22;">₹${total}</p>
                    </td>
                </tr>
            </table>
            ${deliveryDate ? `<p style="margin:20px 0 0;font-size:14px;color:#7A7A7A;">Expected delivery: <strong>${deliveryDate}</strong></p>` : ""}
        </td>
    </tr>`;
}

export async function sendEmail(to: string, subject: string, html: string) {
  if (!RESEND_API_KEY) {
    console.warn("RESEND_API_KEY not set — email not sent");
    return;
  }
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from: FROM_EMAIL, to, subject, html }),
    });
    if (!res.ok) {
      const err = await res.text();
      console.error("Resend error:", err);
    }
  } catch (err) {
    console.error("Failed to send email:", err);
  }
}

export function orderConfirmationEmail(
  orderNumber: string,
  email: string,
  items: { name: string; qty: number; price: number; variant?: string }[],
  total: number,
  deliveryDate?: string,
) {
  return {
    to: email,
    subject: `Order Confirmed — #${orderNumber}`,
    html: baseHtml(`
      ${heroHtml("Order Confirmed!", "Your premium makhana is on its way.")}
      ${bodyHtml(
        "Thank you for your order!",
        `Your order <strong>#${orderNumber}</strong> has been placed successfully. We've received it and will start packing soon.`,
        btnHtml(`${BASE_URL}/account/orders/${orderNumber}`, "View Order"),
      )}
      ${orderItemsHtml(items, total, deliveryDate)}
      ${footerHtml()}
    `),
  };
}

export function orderShippedEmail(
  orderNumber: string,
  email: string,
  items: { name: string; qty: number; price: number; variant?: string }[],
  total: number,
  courier: string,
  trackingId: string,
) {
  return {
    to: email,
    subject: `Order Shipped — #${orderNumber}`,
    html: baseHtml(`
      ${heroHtml("Your Order is On Its Way!", "Get ready for some crunchy goodness.")}
      ${bodyHtml(
        "Great news!",
        `Your order <strong>#${orderNumber}</strong> has been shipped via <strong>${courier}</strong>.<br/><br/>
         Tracking ID: <strong>${trackingId}</strong>`,
        btnHtml(`${BASE_URL}/account/orders/${orderNumber}`, "Track Order"),
      )}
      ${orderItemsHtml(items, total)}
      ${footerHtml()}
    `),
  };
}

export function orderOutForDeliveryEmail(
  orderNumber: string,
  email: string,
  items: { name: string; qty: number; price: number; variant?: string }[],
  total: number,
) {
  return {
    to: email,
    subject: `Out for Delivery — #${orderNumber}`,
    html: baseHtml(`
      ${heroHtml("Your Order is Out for Delivery!", "It's almost at your doorstep.")}
      ${bodyHtml(
        "Your order is on its way!",
        `Your order <strong>#${orderNumber}</strong> is out for delivery and will reach you shortly. Get ready!`,
        btnHtml(`${BASE_URL}/account/orders/${orderNumber}`, "Track Order"),
      )}
      ${orderItemsHtml(items, total)}
      ${footerHtml()}
    `),
  };
}

export function orderCancelledEmail(
  orderNumber: string,
  email: string,
  items: { name: string; qty: number; price: number; variant?: string }[],
  total: number,
) {
  return {
    to: email,
    subject: `Order Cancelled — #${orderNumber}`,
    html: baseHtml(`
      ${heroHtml("Order Cancelled", "We're sorry to see you go.")}
      ${bodyHtml(
        "Your order has been cancelled.",
        `Your order <strong>#${orderNumber}</strong> has been cancelled as requested. If a payment was made, the refund will be processed within 5-7 business days.`,
        btnHtml(`${BASE_URL}/account/orders/${orderNumber}`, "View Details"),
      )}
      ${orderItemsHtml(items, total)}
      ${footerHtml()}
    `),
  };
}

function passwordChangeHtml() {
  return `
    <!-- CONTENT -->
    <tr>
        <td style="padding:50px 48px;">
            <p style="margin:0;font-size:18px;font-weight:600;color:#173D22;">
                Password Changed
            </p>
            <p style="margin:18px 0 36px;font-size:16px;line-height:30px;color:#5C665E;">
                The password for your Nutyum account was successfully changed.
            </p>
            <p style="margin:18px 0 0;font-size:14px;line-height:24px;color:#7A7A7A;">
                If you didn't make this change, please contact us immediately.
            </p>
        </td>
    </tr>`;
}

export async function sendPasswordChangeEmail(email: string) {
  await sendEmail(
    email,
    "Password Changed — Nutyum",
    baseHtml(`
      ${heroHtml("Password Changed", "Your account security is important to us.")}
      ${passwordChangeHtml()}
      ${footerHtml()}
    `),
  );
}

function welcomeHtml(name?: string) {
  return `
    <!-- CONTENT -->
    <tr>
        <td style="padding:50px 48px;">
            <p style="margin:0;font-size:18px;font-weight:600;color:#173D22;">
                Welcome${name ? `, ${name}` : ""}!
            </p>
            <p style="margin:18px 0 36px;font-size:16px;line-height:30px;color:#5C665E;">
                Thank you for joining Nutyum! You're now part of a community that loves premium, healthy makhana snacks. Start exploring our delicious collection.
            </p>
            ${btnHtml(`${BASE_URL}/shop`, "Start Shopping")}
        </td>
    </tr>`;
}

export async function sendWelcomeEmail(email: string, name?: string) {
  await sendEmail(
    email,
    "Welcome to Nutyum!",
    baseHtml(`
      ${heroHtml("Welcome to Nutyum", "Premium roasted makhana crafted for healthier snacking.")}
      ${welcomeHtml(name)}
      ${footerHtml()}
    `),
  );
}
