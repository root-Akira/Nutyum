import { Metadata } from "next";
import Link from "next/link";
import { getCmsContent } from "@/lib/cms";
import { notFound } from "next/navigation";

function sanitizeHtml(html: string): string {
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/on\w+="[^"]*"/gi, "")
    .replace(/on\w+='[^']*'/gi, "")
    .replace(/on\w+=\S+/gi, "");
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const page = await getCmsContent(slug);
  if (!page) return { title: "Page Not Found | Nutyum" };
  return { title: `${page.title} | Nutyum`, description: page.title };
}

export default async function CmsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = await getCmsContent(slug);
  if (!page) notFound();

  return (
    <main className="min-h-screen bg-[#FAF7EE] px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-3xl">
        <Link href="/" className="mb-8 inline-block text-sm text-[#4C5A48] underline hover:text-[#173D22]">
          ← Back to Home
        </Link>
        <h1 className="mb-8 text-4xl font-bold tracking-[-0.02em] text-[#173D22]" style={{ fontFamily: "var(--font-heading)" }}>
          {page.title}
        </h1>
        <div
          className="prose prose-sm max-w-none text-[#4C5A48] [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-[#173D22] [&_h2]:mt-8 [&_h2]:mb-3 [&_p]:leading-relaxed [&_a]:text-[#173D22] [&_a]:underline"
          dangerouslySetInnerHTML={{ __html: sanitizeHtml(page.content) }}
        />
      </div>
    </main>
  );
}
