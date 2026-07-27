import { Clock } from "lucide-react";

export default function WholesalePage() {
  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-[#FAF7EE] px-6">
      <div className="text-center max-w-md">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#173D22]">
          <Clock className="h-8 w-8 text-[#FAF7EE]" />
        </div>
        <h1 className="mt-6 text-3xl font-semibold text-[#173D22] sm:text-4xl" style={{ fontFamily: "var(--font-heading)" }}>
          Bulk Orders — Coming Soon
        </h1>
        <p className="mt-4 text-[#4C5A48]" style={{ fontFamily: "var(--font-body)" }}>
          We&rsquo;re putting together something special for bulk and wholesale orders. 
          Leave your email and we&rsquo;ll notify you the moment it&rsquo;s ready.
        </p>
      </div>
    </main>
  );
}
