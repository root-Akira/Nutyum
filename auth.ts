import NextAuth, { CredentialsSignin } from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { sendWelcomeEmail } from "@/lib/email";

class BlockedError extends CredentialsSignin {
  code = "blocked";
}

const hasSupabase = !!((process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL) && process.env.SUPABASE_SERVICE_ROLE_KEY);

async function getOrCreateSupabaseUser(email: string, name?: string | null): Promise<string | null> {
  // 1. Look up existing user in public.users table
  const { data: existing } = await getSupabaseAdmin()
    .from("users")
    .select("id")
    .eq("email", email)
    .maybeSingle();
  if (existing?.id) return existing.id;

  // 2. Create user in Supabase Auth
  const { data: created, error } = await getSupabaseAdmin().auth.admin.createUser({
    email,
    email_confirm: true,
    user_metadata: { name: name ?? undefined },
  });
  if (error || !created?.user?.id) {
    console.error("Failed to create Supabase user:", error?.message || "Unknown error");
    return null;
  }

  // Send welcome email to new Google sign-up users
  sendWelcomeEmail(email, created.user.user_metadata?.name as string | undefined).catch(
    (e) => console.error("Failed to send welcome email:", e),
  );

  return created.user.id;
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google,
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        // Use Supabase Auth when connected
        if (hasSupabase) {
          const email = credentials.email as string;

          // Check if user is blocked
          const { data: userCheck } = await getSupabaseAdmin()
            .from("users")
            .select("is_blocked")
            .eq("email", email)
            .maybeSingle();
          if (userCheck?.is_blocked) throw new BlockedError();

          const { data, error } = await getSupabaseAdmin().auth.signInWithPassword({
            email,
            password: credentials.password as string,
          });
          if (error || !data?.user) {
            console.error("Supabase signInWithPassword error:", error?.message || error?.name || JSON.stringify(error));
            const { data: bannedCheck } = await getSupabaseAdmin()
              .from("users")
              .select("is_blocked")
              .eq("email", email)
              .maybeSingle();
            if (bannedCheck?.is_blocked) throw new BlockedError();
            return null;
          }
          return {
            id: data.user.id,
            email: data.user.email!,
            name: data.user.user_metadata?.name || data.user.email?.split("@")[0],
          };
        }

        // Fallback: demo store
        if (!hasSupabase) console.warn("Supabase env vars missing, using demo store fallback");
        const { findUser } = await import("@/lib/demo-user-store");
        const user = findUser(credentials.email as string);
        if (!user || user.password !== credentials.password) return null;
        return { id: user.id, email: user.email, name: user.name };
      },
    }),
  ],
  pages: {
    signIn: "/signin",
  },
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        if (account?.provider === "google" && hasSupabase && user.email) {
          const supabaseId = await getOrCreateSupabaseUser(user.email, user.name ?? undefined);
          token.id = supabaseId || user.id;
        } else {
          token.id = user.id;
        }
        return token;
      }
      if (!token.id || !hasSupabase) return token;
      // Check if user was blocked since token was issued
      const { data: userCheck } = await getSupabaseAdmin()
        .from("users")
        .select("is_blocked")
        .eq("id", token.id)
        .maybeSingle();
      if (userCheck?.is_blocked) return {};
      return token;
    },
    async session({ session, token }) {
      if (!token.id || !session.user) return session;
      session.user.id = token.id as string;
      session.user.email = token.email as string;
      return session;
    },
  },
});
