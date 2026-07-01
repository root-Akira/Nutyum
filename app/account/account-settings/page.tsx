"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, MapPin, Pencil, Trash2, Star } from "lucide-react";
import { CITIES_BY_STATE, STATES } from "@/lib/locations";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

type Address = {
  id: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  isDefault?: boolean;
};

const emptyAddrForm = { line1: "", line2: "", city: "", state: "", pincode: "", phone: "", isDefault: false };

export default function SettingsPage() {
  // ─── Profile ───
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

  // ─── Addresses ───
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loadingAddr, setLoadingAddr] = useState(true);
  const [showAddrForm, setShowAddrForm] = useState(false);
  const [editingAddrId, setEditingAddrId] = useState<string | null>(null);
  const [addrForm, setAddrForm] = useState(emptyAddrForm);
  const [savingAddr, setSavingAddr] = useState(false);
  const [addrErr, setAddrErr] = useState("");

  useEffect(() => {
    fetch("/api/profile")
      .then((r) => r.json())
      .then((data) => {
        if (data.error) return;
        setName(data.name || "");
        setPhone(data.phone || "");
        setEmail(data.email || "");
      });
    loadAddresses();
  }, []);

  async function loadAddresses() {
    try {
      const res = await fetch("/api/addresses");
      const data = await res.json();
      if (Array.isArray(data)) setAddresses(data);
    } catch { /* ignore */ }
    finally { setLoadingAddr(false); }
  }

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

  // ─── Address Handlers ───
  function openNewAddr() { setAddrForm(emptyAddrForm); setEditingAddrId(null); setShowAddrForm(true); setAddrErr(""); }
  function openEditAddr(addr: Address) {
    setAddrForm({ line1: addr.line1, line2: addr.line2 || "", city: addr.city, state: addr.state, pincode: addr.pincode, phone: addr.phone, isDefault: !!addr.isDefault });
    setEditingAddrId(addr.id); setShowAddrForm(true); setAddrErr("");
  }

  async function handleSaveAddr(e: React.FormEvent) {
    e.preventDefault();
    setSavingAddr(true); setAddrErr("");
    try {
      const url = editingAddrId ? `/api/addresses/${editingAddrId}` : "/api/addresses";
      const method = editingAddrId ? "PUT" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(addrForm) });
      const data = await res.json();
      if (data.error) setAddrErr(data.error);
      else { setShowAddrForm(false); setEditingAddrId(null); loadAddresses(); }
    } catch { setAddrErr("Something went wrong"); }
    finally { setSavingAddr(false); }
  }

  async function handleDeleteAddr(id: string) {
    if (!confirm("Delete this address?")) return;
    const res = await fetch(`/api/addresses/${id}`, { method: "DELETE" });
    if (res.ok) setAddresses((prev) => prev.filter((a) => a.id !== id));
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

      {/* ─────────────── Addresses ─────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2, ease: EASE }}
        className="rounded-2xl border border-[rgba(23,61,34,0.1)] bg-white p-6 sm:p-8"
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-[#173D22]" style={{ fontFamily: "var(--font-heading)" }}>
            Addresses
          </h2>
          {!showAddrForm && (
            <button onClick={openNewAddr}
              className="inline-flex items-center gap-2 rounded-full bg-[#173D22] px-5 py-2 text-sm font-semibold text-white transition-all hover:bg-[#0e2616]">
              <Plus className="h-4 w-4" /> Add
            </button>
          )}
        </div>

        {/* Address Form */}
        <AnimatePresence>
          {showAddrForm && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
              className="mb-6 overflow-hidden">
              <div className="rounded-xl border border-[rgba(23,61,34,0.1)] bg-[#FAF7EE] p-5">
                <h3 className="mb-4 text-lg font-semibold text-[#173D22]" style={{ fontFamily: "var(--font-heading)" }}>
                  {editingAddrId ? "Edit Address" : "New Address"}
                </h3>
                {addrErr && <p className="mb-4 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">{addrErr}</p>}
                <form onSubmit={handleSaveAddr} className="space-y-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-[#173D22]">Street Address *</label>
                    <input type="text" value={addrForm.line1} onChange={(e) => setAddrForm({ ...addrForm, line1: e.target.value })} required
                      className="w-full rounded-xl border border-[rgba(23,61,34,0.15)] bg-white px-4 py-2.5 text-sm text-[#173D22] outline-none focus:border-[#173D22]" />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-[#173D22]">Apartment / Landmark</label>
                    <input type="text" value={addrForm.line2} onChange={(e) => setAddrForm({ ...addrForm, line2: e.target.value })}
                      className="w-full rounded-xl border border-[rgba(23,61,34,0.15)] bg-white px-4 py-2.5 text-sm text-[#173D22] outline-none focus:border-[#173D22]" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-[#173D22]">City *</label>
                      <select value={addrForm.city} onChange={(e) => setAddrForm({ ...addrForm, city: e.target.value })} required
                        className="w-full rounded-xl border border-[rgba(23,61,34,0.15)] bg-white px-4 py-2.5 text-sm text-[#173D22] outline-none focus:border-[#173D22]">
                        <option value="">Select city</option>
                        {(CITIES_BY_STATE[addrForm.state] || []).map((c) => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-[#173D22]">State *</label>
                      <select value={addrForm.state} onChange={(e) => setAddrForm({ ...addrForm, state: e.target.value, city: "" })} required
                        className="w-full rounded-xl border border-[rgba(23,61,34,0.15)] bg-white px-4 py-2.5 text-sm text-[#173D22] outline-none focus:border-[#173D22]">
                        <option value="">Select state</option>
                        {STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-[#173D22]">Pincode *</label>
                      <input type="text" value={addrForm.pincode} onChange={(e) => setAddrForm({ ...addrForm, pincode: e.target.value })} required
                        className="w-full rounded-xl border border-[rgba(23,61,34,0.15)] bg-white px-4 py-2.5 text-sm text-[#173D22] outline-none focus:border-[#173D22]" />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-[#173D22]">Phone</label>
                      <input type="tel" value={addrForm.phone} onChange={(e) => setAddrForm({ ...addrForm, phone: e.target.value })}
                        className="w-full rounded-xl border border-[rgba(23,61,34,0.15)] bg-white px-4 py-2.5 text-sm text-[#173D22] outline-none focus:border-[#173D22]" />
                    </div>
                  </div>
                  <label className="flex items-center gap-2 text-sm text-[#173D22]">
                    <input type="checkbox" checked={addrForm.isDefault} onChange={(e) => setAddrForm({ ...addrForm, isDefault: e.target.checked })}
                      className="h-4 w-4 rounded border-[rgba(23,61,34,0.3)] accent-[#173D22]" />
                    Set as default address
                  </label>
                  <div className="flex gap-3">
                    <button type="submit" disabled={savingAddr}
                      className="rounded-full bg-[#173D22] px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-[#0e2616] disabled:opacity-50">
                      {savingAddr ? "Saving..." : editingAddrId ? "Update" : "Add Address"}
                    </button>
                    <button type="button" onClick={() => { setShowAddrForm(false); setEditingAddrId(null); }}
                      className="rounded-full border border-[rgba(23,61,34,0.2)] px-6 py-2.5 text-sm font-medium text-[#4C5A48] transition-all hover:bg-[#FAF7EE]">
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Address List */}
        {loadingAddr ? (
          <div className="flex justify-center py-8">
            <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-[rgba(23,61,34,0.15)] border-t-[#173D22]" />
          </div>
        ) : addresses.length === 0 && !showAddrForm ? (
          <div className="py-6 text-center">
            <MapPin className="mx-auto mb-3 h-10 w-10 text-[#4C5A48]" />
            <p className="text-sm text-[#4C5A48]">No saved addresses yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {addresses.map((addr, i) => (
              <div key={addr.id}
                className="group relative rounded-xl border border-[rgba(23,61,34,0.1)] bg-[#FAF7EE] p-4">
                {addr.isDefault && (
                  <span className="absolute -right-1 -top-1 flex items-center gap-1 rounded-full bg-[#173D22] px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white">
                    <Star className="h-2.5 w-2.5 fill-white" /> Default
                  </span>
                )}
                <div className="pr-14">
                  <p className="text-sm font-medium text-[#173D22]">{addr.line1}</p>
                  {addr.line2 && <p className="text-xs text-[#4C5A48]">{addr.line2}</p>}
                  <p className="text-xs text-[#4C5A48]">{addr.city}, {addr.state} - {addr.pincode}</p>
                  {addr.phone && <p className="mt-0.5 text-xs text-[#4C5A48]">Phone: {addr.phone}</p>}
                </div>
                <div className="absolute right-3 top-3 flex gap-1.5 opacity-0 transition-opacity group-hover:opacity-100">
                  <button onClick={() => openEditAddr(addr)}
                    className="flex h-7 w-7 items-center justify-center rounded-full border border-[rgba(23,61,34,0.15)] bg-white text-[#4C5A48] hover:border-[#173D22] hover:text-[#173D22]">
                    <Pencil className="h-3 w-3" />
                  </button>
                  <button onClick={() => handleDeleteAddr(addr.id)}
                    className="flex h-7 w-7 items-center justify-center rounded-full border border-red-200 bg-white text-red-500 hover:border-red-400 hover:bg-red-50">
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
