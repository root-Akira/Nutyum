"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export default function SettingsPage() {
  // ─── Profile ───
  const [profileLoading, setProfileLoading] = useState(true);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState("");
  const [profileErr, setProfileErr] = useState("");

  // ─── Change Password ───
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);
  const [pwMsg, setPwMsg] = useState("");
  const [pwErr, setPwErr] = useState("");

  useEffect(() => {
    fetch("/api/profile")
      .then((r) => r.json())
      .then((data) => {
        if (data.error) return;
        setName(data.name || "");
        setPhone(data.phone || "");
        setEmail(data.email || "");
      })
      .finally(() => setProfileLoading(false));
  }, []);

  // ─── Profile Save ───
  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    setSavingProfile(true);
    setProfileMsg("");
    setProfileErr("");
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone }),
      });
      const data = await res.json();
      if (data.error) setProfileErr(data.error);
      else { setProfileMsg("Profile updated"); setTimeout(() => setProfileMsg(""), 3000); }
    } catch { setProfileErr("Something went wrong"); }
    finally { setSavingProfile(false); }
  }

  // ─── Change Password ───
  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    if (newPassword !== confirmPassword) { setPwErr("Passwords don't match"); return; }
    if (newPassword.length < 8) { setPwErr("Password must be at least 8 characters"); return; }
    setChangingPassword(true);
    setPwMsg("");
    setPwErr("");
    try {
      const res = await fetch("/api/profile/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (data.error) setPwErr(data.error);
      else {
        setPwMsg("Password changed");
        setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
      }
    } catch { setPwErr("Something went wrong"); }
    finally { setChangingPassword(false); }
  }

  if (profileLoading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#173D22] border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="space-y-8">

      {/* ─────────────── Edit Profile ─────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: EASE }}
        className="rounded-2xl border border-[rgba(23,61,34,0.1)] bg-white p-6 sm:p-8"
      >
        <h2 className="mb-6 text-xl font-semibold text-[#173D22]" style={{ fontFamily: "var(--font-heading)" }}>
          Edit Profile
        </h2>

        {profileMsg && <p className="mb-4 rounded-lg bg-green-50 px-4 py-2 text-sm text-green-700">{profileMsg}</p>}
        {profileErr && <p className="mb-4 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">{profileErr}</p>}

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-[#4C5A48]" style={{ fontFamily: "var(--font-body)" }}>
              Email
            </label>
            <input type="email" value={email} disabled
              className="w-full rounded-xl border border-[rgba(23,61,34,0.15)] bg-[#FAF7EE] px-4 py-2.5 text-sm text-[#4C5A48] outline-none" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-[#173D22]" style={{ fontFamily: "var(--font-body)" }}>
              Name
            </label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-[rgba(23,61,34,0.15)] bg-white px-4 py-2.5 text-sm text-[#173D22] outline-none focus:border-[#173D22]" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-[#173D22]" style={{ fontFamily: "var(--font-body)" }}>
              Phone
            </label>
            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded-xl border border-[rgba(23,61,34,0.15)] bg-white px-4 py-2.5 text-sm text-[#173D22] outline-none focus:border-[#173D22]" />
          </div>
          <button type="submit" disabled={savingProfile}
            className="rounded-full bg-[#173D22] px-8 py-2.5 text-sm font-semibold text-white transition-all hover:bg-[#0e2616] disabled:opacity-50">
            {savingProfile ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </motion.div>

      {/* ─────────────── Change Password ─────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1, ease: EASE }}
        className="rounded-2xl border border-[rgba(23,61,34,0.1)] bg-white p-6 sm:p-8"
      >
        <h2 className="mb-6 text-xl font-semibold text-[#173D22]" style={{ fontFamily: "var(--font-heading)" }}>
          Change Password
        </h2>

        {pwMsg && <p className="mb-4 rounded-lg bg-green-50 px-4 py-2 text-sm text-green-700">{pwMsg}</p>}
        {pwErr && <p className="mb-4 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">{pwErr}</p>}

        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-[#173D22]" style={{ fontFamily: "var(--font-body)" }}>
              Current Password
            </label>
            <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required
              className="w-full rounded-xl border border-[rgba(23,61,34,0.15)] bg-white px-4 py-2.5 text-sm text-[#173D22] outline-none focus:border-[#173D22]" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-[#173D22]" style={{ fontFamily: "var(--font-body)" }}>
              New Password
            </label>
            <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required minLength={8}
              className="w-full rounded-xl border border-[rgba(23,61,34,0.15)] bg-white px-4 py-2.5 text-sm text-[#173D22] outline-none focus:border-[#173D22]" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-[#173D22]" style={{ fontFamily: "var(--font-body)" }}>
              Confirm New Password
            </label>
            <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required
              className="w-full rounded-xl border border-[rgba(23,61,34,0.15)] bg-white px-4 py-2.5 text-sm text-[#173D22] outline-none focus:border-[#173D22]" />
          </div>
          <button type="submit" disabled={changingPassword}
            className="rounded-full bg-[#173D22] px-8 py-2.5 text-sm font-semibold text-white transition-all hover:bg-[#0e2616] disabled:opacity-50">
            {changingPassword ? "Changing..." : "Change Password"}
          </button>
        </form>
      </motion.div>

    </div>
  );
}
