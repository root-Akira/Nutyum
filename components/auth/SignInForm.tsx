"use client";

import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function SignInContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const resetSuccess = searchParams.get("reset") === "success";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Invalid email or password");
      return;
    }

    router.push(callbackUrl);
    router.refresh();
  }

  return (
    <div className="w-full max-w-md">
      <h1
        className="mb-2 text-center text-3xl font-bold tracking-[-0.02em] text-[#173D22]"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        Welcome Back
      </h1>
      <p
        className="mb-8 text-center text-sm text-[#4C5A48]"
        style={{ fontFamily: "var(--font-body)" }}
      >
        Sign in to your Nutyum account
      </p>

      {resetSuccess && (
        <div className="mb-6 rounded-xl bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700" style={{ fontFamily: "var(--font-body)" }}>
          Password reset successful. Sign in with your new password.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="sr-only">Email</label>
          <input
            id="email"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-xl border border-[rgba(23,61,34,0.2)] bg-white px-4 py-3 text-sm text-[#173D22] placeholder:text-[#4C5A48]/60 focus:border-[#173D22] focus:outline-none"
            style={{ fontFamily: "var(--font-body)" }}
          />
        </div>

        <div>
          <label htmlFor="password" className="sr-only">Password</label>
          <input
            id="password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full rounded-xl border border-[rgba(23,61,34,0.2)] bg-white px-4 py-3 text-sm text-[#173D22] placeholder:text-[#4C5A48]/60 focus:border-[#173D22] focus:outline-none"
            style={{ fontFamily: "var(--font-body)" }}
          />
        </div>

        {error && (
          <p className="text-sm text-red-600" style={{ fontFamily: "var(--font-body)" }}>
            {error}
          </p>
        )}

        <div className="flex items-center justify-end">
          <Link
            href="/forgot-password"
            className="text-xs text-[#4C5A48] underline hover:text-[#173D22]"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Forgot password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-[#173D22] px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-[#0e2616] disabled:opacity-50"
          style={{ fontFamily: "var(--font-body)" }}
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[rgba(23,61,34,0.15)]" />
        </div>
        <div className="relative flex justify-center text-xs uppercase text-[#4C5A48]">
          <span className="bg-[#FAF7EE] px-2" style={{ fontFamily: "var(--font-body)" }}>or</span>
        </div>
      </div>

      <button
        type="button"
        onClick={() => signIn("google", { callbackUrl })}
        className="w-full rounded-full border border-[rgba(23,61,34,0.2)] bg-white px-6 py-3 text-sm font-semibold text-[#173D22] transition-all hover:bg-[rgba(23,61,34,0.04)]"
        style={{ fontFamily: "var(--font-body)" }}
      >
        Continue with Google
      </button>

      <p className="mt-6 text-center text-xs text-[#4C5A48]" style={{ fontFamily: "var(--font-body)" }}>
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="font-semibold text-[#173D22] underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}

export function SignInForm() {
  return (
    <Suspense>
      <SignInContent />
    </Suspense>
  );
}
