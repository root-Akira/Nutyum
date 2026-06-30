import { Metadata } from "next";
import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "My Account | Nutyum",
  description: "Manage your Nutyum account, orders, and preferences.",
};

export default async function AccountPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/signin");
  }

  return (
    <main className="min-h-[60vh] bg-[#FAF7EE] px-6 py-20">
      <div className="mx-auto max-w-2xl">
        <h1
          className="mb-8 text-4xl font-bold tracking-[-0.02em] text-[#173D22]"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          My Account
        </h1>

        <div className="rounded-2xl border border-[rgba(23,61,34,0.1)] bg-white p-8">
          <div className="mb-6 flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#173D22] text-lg font-bold text-white">
              {session.user.name?.charAt(0) || "U"}
            </div>
            <div>
              <p className="text-lg font-semibold text-[#173D22]" style={{ fontFamily: "var(--font-heading)" }}>
                {session.user.name}
              </p>
              <p className="text-sm text-[#4C5A48]" style={{ fontFamily: "var(--font-body)" }}>
                {session.user.email}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[#4C5A48]" style={{ fontFamily: "var(--font-body)" }}>
              Account Settings
            </h2>
            <p className="text-sm text-[#4C5A48]" style={{ fontFamily: "var(--font-body)" }}>
              Order history, saved addresses, and preferences will be available soon.
            </p>
          </div>

          <div className="mt-8 border-t border-[rgba(23,61,34,0.1)] pt-6">
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/" });
              }}
            >
              <button
                type="submit"
                className="rounded-full border border-red-300 px-6 py-2 text-sm font-medium text-red-600 transition-all hover:bg-red-50"
                style={{ fontFamily: "var(--font-body)" }}
              >
                Sign Out
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
