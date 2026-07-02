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
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#173D22] transition-colors hover:text-[#E0961A]"
            aria-label="Follow us on Instagram"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
            </svg>
          </a>
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#173D22] transition-colors hover:text-[#E0961A]"
            aria-label="Follow us on Facebook"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
            </svg>
          </a>
          <a
            href="https://youtube.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#173D22] transition-colors hover:text-[#E0961A]"
            aria-label="Follow us on YouTube"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.94 2C5.12 20 12 20 12 20s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
              <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" />
            </svg>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
