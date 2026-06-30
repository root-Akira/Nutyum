"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export function SignUpForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Something went wrong");
        setLoading(false);
        return;
      }

      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Account created but sign-in failed. Please sign in.");
        setLoading(false);
        return;
      }

      router.push("/");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md">
      <h1
        className="mb-2 text-center text-3xl font-bold tracking-[-0.02em] text-[#173D22]"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        Create Account
      </h1>
      <p
        className="mb-8 text-center text-sm text-[#4C5A48]"
        style={{ fontFamily: "var(--font-body)" }}
      >
        Join Nutyum and enjoy premium snacks
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="sr-only">Full Name</label>
          <input
            id="name"
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full rounded-xl border border-[rgba(23,61,34,0.2)] bg-white px-4 py-3 text-sm text-[#173D22] placeholder:text-[#4C5A48]/60 focus:border-[#173D22] focus:outline-none"
            style={{ fontFamily: "var(--font-body)" }}
          />
        </div>

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
            placeholder="Password (min. 8 characters)"
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
          {loading ? "Creating account..." : "Create Account"}
        </button>
      </form>

      <p className="mt-6 text-center text-xs text-[#4C5A48]" style={{ fontFamily: "var(--font-body)" }}>
        Already have an account?{" "}
        <Link href="/signin" className="font-semibold text-[#173D22] underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
