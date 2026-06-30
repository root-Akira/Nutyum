"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export function ResetPasswordForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setLoading(true);

    const { error: err } = await supabase.auth.updateUser({ password });

    setLoading(false);

    if (err) {
      setError(err.message);
      return;
    }

    router.push("/signin?reset=success");
  }

  return (
    <div className="w-full max-w-md">
      <h1 className="mb-2 text-center text-3xl font-bold tracking-[-0.02em] text-[#173D22]" style={{ fontFamily: "var(--font-heading)" }}>
        Set New Password
      </h1>
      <p className="mb-8 text-center text-sm text-[#4C5A48]" style={{ fontFamily: "var(--font-body)" }}>
        Enter your new password below
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="password" className="sr-only">New Password</label>
          <input
            id="password"
            type="password"
            placeholder="New password (min. 8 characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
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
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
}
