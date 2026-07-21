import { Metadata } from "next";
import Link from "next/link";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Contact Us | Nutyum",
  description: "Get in touch with the Nutyum team — we'd love to hear from you.",
};

interface SiteSettings {
  store_name: string;
  store_email: string;
  store_phone: string;
  store_address: string;
  gst_number: string;
}

async function getSiteSettings(): Promise<SiteSettings | null> {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceRoleKey) return null;

  try {
    const res = await fetch(
      `${supabaseUrl}/rest/v1/site_settings?select=store_name,store_email,store_phone,store_address,gst_number&limit=1`,
      {
        headers: {
          apikey: serviceRoleKey,
          Authorization: `Bearer ${serviceRoleKey}`,
        },
        next: { revalidate: 60 },
      },
    );
    if (!res.ok) return null;
    const data: SiteSettings[] = await res.json();
    return data?.[0] ?? null;
  } catch {
    return null;
  }
}

export default async function ContactPage() {
  const settings = await getSiteSettings();

  return (
    <main className="min-h-screen bg-[#FAF7EE] px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-3xl">
        <Link href="/" className="mb-8 inline-block text-sm text-[#4C5A48] underline hover:text-[#173D22]" style={{ fontFamily: "var(--font-body)" }}>
          ← Back to Home
        </Link>
        <h1 className="mb-6 text-4xl font-bold tracking-[-0.02em] text-[#173D22]" style={{ fontFamily: "var(--font-heading)" }}>
          Contact Us
        </h1>
        <p className="mb-10 text-[#4C5A48]" style={{ fontFamily: "var(--font-body)" }}>
          We&apos;re here to help. Reach out to us anytime.
        </p>

        <div className="space-y-10">
          {settings?.store_email && (
            <div className="rounded-2xl border border-[rgba(23,61,34,0.1)] bg-white p-8">
              <h2 className="mb-4 text-xl font-semibold text-[#173D22]" style={{ fontFamily: "var(--font-heading)" }}>
                Email
              </h2>
              <p className="text-sm text-[#4C5A48]" style={{ fontFamily: "var(--font-body)" }}>
                For general inquiries, orders, or feedback:<br />
                <a href={`mailto:${settings.store_email}`} className="text-[#173D22] underline hover:opacity-60">{settings.store_email}</a>
              </p>
            </div>
          )}

          {settings?.store_phone && (
            <div className="rounded-2xl border border-[rgba(23,61,34,0.1)] bg-white p-8">
              <h2 className="mb-4 text-xl font-semibold text-[#173D22]" style={{ fontFamily: "var(--font-heading)" }}>
                Phone
              </h2>
              <p className="text-sm text-[#4C5A48]" style={{ fontFamily: "var(--font-body)" }}>
                <a href={`tel:${settings.store_phone}`} className="text-[#173D22] underline hover:opacity-60">{settings.store_phone}</a>
              </p>
            </div>
          )}

          {settings?.store_address && (
            <div className="rounded-2xl border border-[rgba(23,61,34,0.1)] bg-white p-8">
              <h2 className="mb-4 text-xl font-semibold text-[#173D22]" style={{ fontFamily: "var(--font-heading)" }}>
                Address
              </h2>
              <p className="whitespace-pre-line text-sm text-[#4C5A48]" style={{ fontFamily: "var(--font-body)" }}>
                {settings.store_address}
              </p>
            </div>
          )}

          {settings?.gst_number && (
            <div className="rounded-2xl border border-[rgba(23,61,34,0.1)] bg-white p-8">
              <h2 className="mb-4 text-xl font-semibold text-[#173D22]" style={{ fontFamily: "var(--font-heading)" }}>
                GST Number
              </h2>
              <p className="whitespace-pre-line text-sm text-[#4C5A48]" style={{ fontFamily: "var(--font-body)" }}>
                {settings.gst_number}
              </p>
            </div>
          )}

          <div className="rounded-2xl border border-[rgba(23,61,34,0.1)] bg-white p-8">
            <h2 className="mb-4 text-xl font-semibold text-[#173D22]" style={{ fontFamily: "var(--font-heading)" }}>
              Wholesale & Bulk Orders
            </h2>
            <p className="text-sm text-[#4C5A48]" style={{ fontFamily: "var(--font-body)" }}>
              Interested in stocking Nutyum or placing a bulk order?<br />
              <a href="mailto:wholesale@nutyum.in" className="text-[#173D22] underline hover:opacity-60">wholesale@nutyum.in</a>
            </p>
          </div>

          <div className="rounded-2xl border border-[rgba(23,61,34,0.1)] bg-white p-8">
            <h2 className="mb-4 text-xl font-semibold text-[#173D22]" style={{ fontFamily: "var(--font-heading)" }}>
              Social
            </h2>
            <p className="text-sm text-[#4C5A48]" style={{ fontFamily: "var(--font-body)" }}>
              Follow us for updates, recipes, and more:<br />
              <span className="text-[#4C5A48]">@nutyumindia (Instagram, Twitter)</span>
            </p>
          </div>
        </div>

        <p className="mt-10 text-xs text-[#4C5A48]" style={{ fontFamily: "var(--font-body)" }}>
          We aim to respond within 24 hours on business days. For urgent order issues, please include your order number.
        </p>
      </div>
    </main>
  );
}
