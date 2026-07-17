import NextAuth, { CredentialsSignin } from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

class BlockedError extends CredentialsSignin {
  code = "blocked";
}

const hasSupabase = !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);

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
            // Also check if sign-in failed because user is banned
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
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
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
      return session;
    },
  },
});
