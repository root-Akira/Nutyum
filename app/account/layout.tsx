import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { User, Package, Heart, Settings, MapPin, Tag, Star } from "lucide-react";
import { SidebarSignOut } from "@/components/auth/SidebarSignOut";

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/signin");

  return (
    <main className="min-h-[70vh] bg-[#FAF7EE]">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="mb-8 text-[clamp(1.8rem,3vw,2.8rem)] font-medium tracking-[-0.02em] text-[#173D22]" style={{ fontFamily: "var(--font-heading)" }}>
          My Account
        </h1>

        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Sidebar */}
          <nav className="w-full shrink-0 lg:w-56 lg:sticky lg:top-24 lg:self-start" aria-label="Account navigation">
            <div className="rounded-2xl border border-[rgba(23,61,34,0.1)] bg-white p-2">
              <Link
                href="/account/profile"
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-[#4C5A48] transition-colors hover:bg-[#FAF7EE] hover:text-[#173D22]"
              >
                <User className="h-4 w-4" />
                Profile
              </Link>

              <Link
                href="/account/account-settings"
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-[#4C5A48] transition-colors hover:bg-[#FAF7EE] hover:text-[#173D22]"
              >
                <Settings className="h-4 w-4" />
                Account Settings
              </Link>

              <hr className="my-2 border-[rgba(23,61,34,0.08)]" />

              <p className="px-4 pb-1 pt-1 text-[10px] font-semibold uppercase tracking-widest text-[#8A9A8C]" style={{ fontFamily: "var(--font-body)" }}>
                My Activity
              </p>
              <Link
                href="/account/orders"
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-[#4C5A48] transition-colors hover:bg-[#FAF7EE] hover:text-[#173D22]"
              >
                <Package className="h-4 w-4" />
                Orders
              </Link>
              <Link
                href="/account/reviews"
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-[#4C5A48] transition-colors hover:bg-[#FAF7EE] hover:text-[#173D22]"
              >
                <Star className="h-4 w-4" />
                My Reviews &amp; Ratings
              </Link>

              <hr className="my-2 border-[rgba(23,61,34,0.08)]" />

              <p className="px-4 pb-1 pt-1 text-[10px] font-semibold uppercase tracking-widest text-[#8A9A8C]" style={{ fontFamily: "var(--font-body)" }}>
                Address &amp; Offers
              </p>
              <Link
                href="/account/addresses"
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-[#4C5A48] transition-colors hover:bg-[#FAF7EE] hover:text-[#173D22]"
              >
                <MapPin className="h-4 w-4" />
                Manage Addresses
              </Link>
              <Link
                href="/account/coupons"
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-[#4C5A48] transition-colors hover:bg-[#FAF7EE] hover:text-[#173D22]"
              >
                <Tag className="h-4 w-4" />
                My Coupons
              </Link>

              <hr className="my-2 border-[rgba(23,61,34,0.08)]" />

              <Link
                href="/account/wishlist"
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-[#4C5A48] transition-colors hover:bg-[#FAF7EE] hover:text-[#173D22]"
              >
                <Heart className="h-4 w-4" />
                Wishlist
              </Link>

              <hr className="my-2 border-[rgba(23,61,34,0.08)]" />
              <SidebarSignOut />
            </div>
          </nav>

          {/* Content */}
          <div className="min-w-0 flex-1">
            {children}
          </div>
        </div>
      </div>
    </main>
  );
}
