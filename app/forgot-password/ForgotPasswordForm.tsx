"use client";

import { useState } from "react";
import Link from "next/link";
import { getSupabase } from "@/lib/supabase";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error: err } = await getSupabase().auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
    });

    setLoading(false);

    if (err) {
      setError(err.message);
      return;
    }

    setSent(true);
  }

  if (sent) {
    return (
      <div className="w-full max-w-md text-center">
        <h1 className="mb-4 text-3xl font-bold tracking-[-0.02em] text-[#173D22]" style={{ fontFamily: "var(--font-heading)" }}>
          Check Your Email
        </h1>
        <p className="mb-8 text-sm text-[#4C5A48]" style={{ fontFamily: "var(--font-body)" }}>
          We&apos;ve sent a password reset link to <strong>{email}</strong>
        </p>
        <Link
          href="/signin"
          className="text-sm font-semibold text-[#173D22] underline"
          style={{ fontFamily: "var(--font-body)" }}
        >
          Back to Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md">
      <h1 className="mb-2 text-center text-3xl font-bold tracking-[-0.02em] text-[#173D22]" style={{ fontFamily: "var(--font-heading)" }}>
        Forgot Password
      </h1>
      <p className="mb-8 text-center text-sm text-[#4C5A48]" style={{ fontFamily: "var(--font-body)" }}>
        Enter your email and we&apos;ll send you a reset link
      </p>

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

        {error && (
          <p className="text-sm text-red-600" style={{ fontFamily: "var(--font-body)" }}>
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-[#173D22] px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-[#0e2616] disabled:opacity-50"
          style={{ fontFamily: "var(--font-body)" }}
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>
      </form>

      <p className="mt-6 text-center text-xs text-[#4C5A48]" style={{ fontFamily: "var(--font-body)" }}>
        Remember your password?{" "}
        <Link href="/signin" className="font-semibold text-[#173D22] underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
