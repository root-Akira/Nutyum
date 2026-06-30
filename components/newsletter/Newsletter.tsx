"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) setSubmitted(true);
  };

  return (
    <section
      className="bg-[#d9eaf0] py-20 sm:py-28"
      aria-labelledby="newsletter-title"
    >
      <div className="mx-auto max-w-2xl px-6 text-center">

        {/* ── "SNACK WITH US" heading (Two Leaves "STEEP WITH US") ── */}
        <motion.p
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
          id="newsletter-title"
          className="mb-4 text-lg font-extrabold uppercase tracking-widest text-[#173D22] will-change-transform"
          style={{ fontFamily: "var(--font-body)" }}
        >
          Snack with Us
        </motion.p>

        <motion.h2
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE, delay: 0.08 }}
          className="mb-3 text-[clamp(1.6rem,3.5vw,2.8rem)] leading-snug tracking-[-0.02em] text-[#173D22] will-change-transform"
          style={{ fontFamily: "var(--font-heading, 'Cormorant Garamond', serif)" }}
        >
          Get news, snack tips, and special offers
          delivered straight to your inbox.
        </motion.h2>

        <motion.p
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE, delay: 0.14 }}
          className="mb-8 text-sm text-[#4C5A48] will-change-transform"
          style={{ fontFamily: "var(--font-body)" }}
        >
          Unsubscribe anytime. No spam, ever.
        </motion.p>

        {/* ── Email form ── */}
        <motion.form
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE, delay: 0.22 }}
          onSubmit={handleSubmit}
          className="flex flex-col gap-3 sm:flex-row will-change-transform"
          aria-label="Newsletter sign up"
        >
          {submitted ? (
            <div className="flex flex-1 items-center justify-center rounded-full bg-[#173D22] px-6 py-4 text-sm font-medium text-white">
              🎉 You&apos;re in! Welcome to the Nutyum family.
            </div>
          ) : (
            <>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
                aria-label="Email address"
                className="flex-1 rounded-full border border-[rgba(23,61,34,0.2)] bg-white px-6 py-4 text-sm text-[#173D22] outline-none placeholder:text-[#4C5A48]/60 focus:border-[#173D22] focus:ring-2 focus:ring-[#173D22]/20"
                style={{ fontFamily: "var(--font-body)" }}
              />
              <button
                type="submit"
                className="group flex items-center justify-center gap-2 rounded-full bg-[#173D22] px-7 py-4 text-sm font-semibold text-white transition-all hover:bg-[#0e2616]"
                style={{ fontFamily: "var(--font-body)" }}
              >
                Subscribe
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </button>
            </>
          )}
        </motion.form>

        {/* ── Social links ── */}
        <motion.div
          initial={false}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, ease: EASE, delay: 0.32 }}
          className="mt-10 flex items-center justify-center gap-6 will-change-transform"
        >
          {["Instagram", "TikTok", "Pinterest", "Facebook"].map((s) => (
            <a
              key={s}
              href={`https://${s.toLowerCase()}.com`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold uppercase tracking-wider text-[#173D22] transition-colors hover:text-[#E0961A]"
              style={{ fontFamily: "var(--font-body)" }}
              aria-label={`Follow us on ${s}`}
            >
              {s}
            </a>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
