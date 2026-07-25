"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

function nameParts(full: string) {
  const parts = full.trim().split(/\s+/);
  return { first: parts[0] || "", last: parts.slice(1).join(" ") };
}

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const [editName, setEditName] = useState(false);
  const [editEmail, setEditEmail] = useState(false);
  const [editPhone, setEditPhone] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [phoneInput, setPhoneInput] = useState("");

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

  function startEditName() {
    const { first, last } = nameParts(name);
    setFirstName(first);
    setLastName(last);
    setEditName(true);
  }

  function startEditEmail() {
    setEmailInput(email);
    setEditEmail(true);
  }

  function startEditPhone() {
    setPhoneInput(phone);
    setEditPhone(true);
  }

  async function saveName() {
    const newName = `${firstName} ${lastName}`.trim();
    setSaving("name");
    try {
      const r = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName }),
      });
      const data = await r.json();
      if (data.error) { alert(data.error); return; }
      setName(newName);
      setEditName(false);
    } finally {
      setSaving(null);
    }
  }

  async function saveEmail() {
    setSaving("email");
    try {
      const r = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailInput }),
      });
      const data = await r.json();
      if (data.error) { alert(data.error); return; }
      setEmail(emailInput);
      setEditEmail(false);
    } finally {
      setSaving(null);
    }
  }

  async function savePhone() {
    setSaving("phone");
    try {
      const r = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: phoneInput }),
      });
      const data = await r.json();
      if (data.error) { alert(data.error); return; }
      setPhone(phoneInput);
      setEditPhone(false);
    } finally {
      setSaving(null);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#173D22] border-t-transparent" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: EASE }}
      className="space-y-6"
    >
      {/* Avatar + Name */}
      <div className="flex items-center gap-5 rounded-2xl border border-[rgba(23,61,34,0.1)] bg-white p-6 sm:p-8">
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

      {/* Personal Information */}
      <div className="rounded-2xl border border-[rgba(23,61,34,0.1)] bg-white p-6 sm:p-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-[#173D22]" style={{ fontFamily: "var(--font-heading)" }}>
            Personal Information
          </h2>
          {!editName && (
            <button onClick={startEditName} className="text-xs font-semibold uppercase tracking-wider text-[#E0961A] hover:text-[#c47e12] transition-colors">
              Edit
            </button>
          )}
        </div>
        {editName ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-[#4C5A48]" style={{ fontFamily: "var(--font-body)" }}>
                  First Name
                </label>
                <input
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full rounded-xl border border-[rgba(23,61,34,0.15)] bg-white px-4 py-2.5 text-sm text-[#173D22] outline-none transition-colors focus:border-[#173D22]"
                  style={{ fontFamily: "var(--font-body)" }}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-[#4C5A48]" style={{ fontFamily: "var(--font-body)" }}>
                  Last Name
                </label>
                <input
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full rounded-xl border border-[rgba(23,61,34,0.15)] bg-white px-4 py-2.5 text-sm text-[#173D22] outline-none transition-colors focus:border-[#173D22]"
                  style={{ fontFamily: "var(--font-body)" }}
                />
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={saveName}
                disabled={saving === "name"}
                className="rounded-xl bg-[#173D22] px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#1f4f2e] disabled:opacity-50"
                style={{ fontFamily: "var(--font-body)" }}
              >
                {saving === "name" ? "Saving..." : "Save"}
              </button>
              <button
                onClick={() => setEditName(false)}
                className="rounded-xl border border-[rgba(23,61,34,0.15)] px-5 py-2 text-sm font-medium text-[#4C5A48] transition-colors hover:bg-[#FAF7EE]"
                style={{ fontFamily: "var(--font-body)" }}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <p className="text-sm text-[#173D22]" style={{ fontFamily: "var(--font-body)" }}>
            {name || "Not set"}
          </p>
        )}
      </div>

      {/* Email Address */}
      <div className="rounded-2xl border border-[rgba(23,61,34,0.1)] bg-white p-6 sm:p-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-[#173D22]" style={{ fontFamily: "var(--font-heading)" }}>
            Email Address
          </h2>
          {!editEmail && (
            <button onClick={startEditEmail} className="text-xs font-semibold uppercase tracking-wider text-[#E0961A] hover:text-[#c47e12] transition-colors">
              Edit
            </button>
          )}
        </div>
        {editEmail ? (
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-[#4C5A48]" style={{ fontFamily: "var(--font-body)" }}>
                Email
              </label>
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="w-full rounded-xl border border-[rgba(23,61,34,0.15)] bg-white px-4 py-2.5 text-sm text-[#173D22] outline-none transition-colors focus:border-[#173D22]"
                style={{ fontFamily: "var(--font-body)" }}
              />
            </div>
            <p className="text-xs text-[#8A9A8C]" style={{ fontFamily: "var(--font-body)" }}>
              A verification email will be sent to the new address.
            </p>
            <div className="flex gap-3">
              <button
                onClick={saveEmail}
                disabled={saving === "email"}
                className="rounded-xl bg-[#173D22] px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#1f4f2e] disabled:opacity-50"
                style={{ fontFamily: "var(--font-body)" }}
              >
                {saving === "email" ? "Saving..." : "Save"}
              </button>
              <button
                onClick={() => setEditEmail(false)}
                className="rounded-xl border border-[rgba(23,61,34,0.15)] px-5 py-2 text-sm font-medium text-[#4C5A48] transition-colors hover:bg-[#FAF7EE]"
                style={{ fontFamily: "var(--font-body)" }}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <p className="text-sm text-[#173D22]" style={{ fontFamily: "var(--font-body)" }}>
            {email}
          </p>
        )}
      </div>

      {/* Mobile Number */}
      <div className="rounded-2xl border border-[rgba(23,61,34,0.1)] bg-white p-6 sm:p-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-[#173D22]" style={{ fontFamily: "var(--font-heading)" }}>
            Mobile Number
          </h2>
          {!editPhone && (
            <button onClick={startEditPhone} className="text-xs font-semibold uppercase tracking-wider text-[#E0961A] hover:text-[#c47e12] transition-colors">
              Edit
            </button>
          )}
        </div>
        {editPhone ? (
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-[#4C5A48]" style={{ fontFamily: "var(--font-body)" }}>
                Phone
              </label>
              <input
                type="tel"
                value={phoneInput}
                onChange={(e) => setPhoneInput(e.target.value)}
                className="w-full rounded-xl border border-[rgba(23,61,34,0.15)] bg-white px-4 py-2.5 text-sm text-[#173D22] outline-none transition-colors focus:border-[#173D22]"
                style={{ fontFamily: "var(--font-body)" }}
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={savePhone}
                disabled={saving === "phone"}
                className="rounded-xl bg-[#173D22] px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#1f4f2e] disabled:opacity-50"
                style={{ fontFamily: "var(--font-body)" }}
              >
                {saving === "phone" ? "Saving..." : "Save"}
              </button>
              <button
                onClick={() => setEditPhone(false)}
                className="rounded-xl border border-[rgba(23,61,34,0.15)] px-5 py-2 text-sm font-medium text-[#4C5A48] transition-colors hover:bg-[#FAF7EE]"
                style={{ fontFamily: "var(--font-body)" }}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <p className="text-sm text-[#173D22]" style={{ fontFamily: "var(--font-body)" }}>
            {phone || "Not set"}
          </p>
        )}
      </div>
    </motion.div>
  );
}
