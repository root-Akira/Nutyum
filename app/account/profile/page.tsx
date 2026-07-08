"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    fetch("/api/profile")
      .then((r) => r.json())
      .then((data) => {
        if (data.error) return;
        setName(data.name || "");
        setPhone(data.phone || "");
        setEmail(data.email || "");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#173D22] border-t-transparent" />
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: EASE }}
    >
      {/* Avatar + Name */}
      <div className="mb-6 flex items-center gap-5 rounded-2xl border border-[rgba(23,61,34,0.1)] bg-white p-6 sm:p-8">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#173D22] text-2xl font-bold text-white">
          {name.charAt(0) || "U"}
        </div>
        <div>
          <p className="text-xl font-semibold text-[#173D22]" style={{ fontFamily: "var(--font-heading)" }}>
            {name}
          </p>
          <p className="text-sm text-[#4C5A48]" style={{ fontFamily: "var(--font-body)" }}>
            {email}
          </p>
        </div>
      </div>

      {/* Info Fields */}
      <div className="rounded-2xl border border-[rgba(23,61,34,0.1)] bg-white p-6 sm:p-8">
        <h2 className="mb-6 text-lg font-semibold text-[#173D22]" style={{ fontFamily: "var(--font-heading)" }}>
          Account Details
        </h2>
        <div className="space-y-5">
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-[#4C5A48]" style={{ fontFamily: "var(--font-body)" }}>
              Email
            </label>
            <p className="text-sm text-[#173D22]">{email}</p>
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-[#4C5A48]" style={{ fontFamily: "var(--font-body)" }}>
              Name
            </label>
            <p className="text-sm text-[#173D22]">{name}</p>
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-[#4C5A48]" style={{ fontFamily: "var(--font-body)" }}>
              Phone
            </label>
            <p className="text-sm text-[#173D22]">{phone || "Not set"}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
