import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { User, Package, Heart, Settings } from "lucide-react";
import { SidebarSignOut } from "@/components/auth/SidebarSignOut";

const NAV_ITEMS = [
  { label: "Profile", href: "/account/profile", icon: User },
  { label: "Orders", href: "/account/orders", icon: Package },
  { label: "Wishlist", href: "/account/wishlist", icon: Heart },
  { label: "Account Settings", href: "/account/account-settings", icon: Settings },
];

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
          <nav className="w-full shrink-0 lg:w-56" aria-label="Account navigation">
            <div className="rounded-2xl border border-[rgba(23,61,34,0.1)] bg-white p-2">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-[#4C5A48] transition-colors hover:bg-[#FAF7EE] hover:text-[#173D22]"
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              ))}

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
