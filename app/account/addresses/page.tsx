"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, MapPin, Pencil, Trash2, Star } from "lucide-react";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan",
  "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh",
  "Uttarakhand", "West Bengal", "Andaman and Nicobar Islands", "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Jammu and Kashmir",
  "Ladakh", "Lakshadweep", "Puducherry",
];

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

const emptyForm = { line1: "", line2: "", city: "", state: "", pincode: "", phone: "", isDefault: false };

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => { loadAddresses(); }, []);

  async function loadAddresses() {
    try {
      const res = await fetch("/api/addresses");
      const data = await res.json();
      if (Array.isArray(data)) setAddresses(data);
    } catch { /* ignore */ }
    finally { setLoading(false); }
  }

  function openNew() {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
    setError("");
  }

  function openEdit(addr: Address) {
    setForm({
      line1: addr.line1,
      line2: addr.line2 || "",
      city: addr.city,
      state: addr.state,
      pincode: addr.pincode,
      phone: addr.phone,
      isDefault: !!addr.isDefault,
    });
    setEditingId(addr.id);
    setShowForm(true);
    setError("");
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const url = editingId ? `/api/addresses/${editingId}` : "/api/addresses";
      const method = editingId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.error) {
        setError(data.error);
      } else {
        setShowForm(false);
        setEditingId(null);
        loadAddresses();
      }
    } catch {
      setError("Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this address?")) return;
    const res = await fetch(`/api/addresses/${id}`, { method: "DELETE" });
    if (res.ok) {
      setAddresses((prev) => prev.filter((a) => a.id !== id));
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-10 w-10 animate-spin rounded-full border-[3px] border-[rgba(23,61,34,0.15)] border-t-[#173D22]" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-[#173D22]" style={{ fontFamily: "var(--font-heading)" }}>
          Saved Addresses
        </h2>
        {!showForm && (
          <button
            onClick={openNew}
            className="inline-flex items-center gap-2 rounded-full bg-[#173D22] px-5 py-2 text-sm font-semibold text-white transition-all hover:bg-[#0e2616]"
            style={{ fontFamily: "var(--font-body)" }}
          >
            <Plus className="h-4 w-4" /> Add
          </button>
        )}
      </div>

      {/* Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 overflow-hidden"
          >
            <div className="rounded-2xl border border-[rgba(23,61,34,0.1)] bg-white p-6 sm:p-8">
              <h3 className="mb-4 text-lg font-semibold text-[#173D22]" style={{ fontFamily: "var(--font-heading)" }}>
                {editingId ? "Edit Address" : "New Address"}
              </h3>

              {error && (
                <p className="mb-4 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">{error}</p>
              )}

              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-[#173D22]">Street Address *</label>
                  <input type="text" value={form.line1} onChange={(e) => setForm({ ...form, line1: e.target.value })} required
                    className="w-full rounded-xl border border-[rgba(23,61,34,0.15)] bg-white px-4 py-2.5 text-sm text-[#173D22] outline-none focus:border-[#173D22]" />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-[#173D22]">Apartment / Landmark</label>
                  <input type="text" value={form.line2} onChange={(e) => setForm({ ...form, line2: e.target.value })}
                    className="w-full rounded-xl border border-[rgba(23,61,34,0.15)] bg-white px-4 py-2.5 text-sm text-[#173D22] outline-none focus:border-[#173D22]" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-[#173D22]">City *</label>
                    <input type="text" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} required
                      className="w-full rounded-xl border border-[rgba(23,61,34,0.15)] bg-white px-4 py-2.5 text-sm text-[#173D22] outline-none focus:border-[#173D22]" />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-[#173D22]">State *</label>
                    <select value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} required
                      className="w-full rounded-xl border border-[rgba(23,61,34,0.15)] bg-white px-4 py-2.5 text-sm text-[#173D22] outline-none focus:border-[#173D22]">
                      <option value="">Select state</option>
                      {INDIAN_STATES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-[#173D22]">Pincode *</label>
                    <input type="text" value={form.pincode} onChange={(e) => setForm({ ...form, pincode: e.target.value })} required
                      className="w-full rounded-xl border border-[rgba(23,61,34,0.15)] bg-white px-4 py-2.5 text-sm text-[#173D22] outline-none focus:border-[#173D22]" />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-[#173D22]">Phone</label>
                    <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full rounded-xl border border-[rgba(23,61,34,0.15)] bg-white px-4 py-2.5 text-sm text-[#173D22] outline-none focus:border-[#173D22]" />
                  </div>
                </div>
                <label className="flex items-center gap-2 text-sm text-[#173D22]">
                  <input type="checkbox" checked={form.isDefault} onChange={(e) => setForm({ ...form, isDefault: e.target.checked })}
                    className="h-4 w-4 rounded border-[rgba(23,61,34,0.3)] accent-[#173D22]" />
                  Set as default address
                </label>
                <div className="flex gap-3">
                  <button type="submit" disabled={saving}
                    className="rounded-full bg-[#173D22] px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-[#0e2616] disabled:opacity-50">
                    {saving ? "Saving..." : editingId ? "Update" : "Add Address"}
                  </button>
                  <button type="button" onClick={() => { setShowForm(false); setEditingId(null); }}
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
      {addresses.length === 0 && !showForm ? (
        <div className="rounded-2xl border border-[rgba(23,61,34,0.1)] bg-white p-8 text-center">
          <MapPin className="mx-auto mb-4 h-12 w-12 text-[#4C5A48]" />
          <p className="text-sm text-[#4C5A48]" style={{ fontFamily: "var(--font-body)" }}>
            No saved addresses yet.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {addresses.map((addr, i) => (
            <motion.div
              key={addr.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.05, ease: EASE }}
              className="group relative rounded-2xl border border-[rgba(23,61,34,0.1)] bg-white p-5 sm:p-6"
            >
              {addr.isDefault && (
                <span className="absolute -right-1 -top-1 flex items-center gap-1 rounded-full bg-[#173D22] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                  <Star className="h-3 w-3 fill-white" /> Default
                </span>
              )}
              <div className="pr-16">
                <p className="text-sm font-medium text-[#173D22]" style={{ fontFamily: "var(--font-heading)" }}>
                  {addr.line1}
                </p>
                {addr.line2 && (
                  <p className="text-sm text-[#4C5A48]">{addr.line2}</p>
                )}
                <p className="text-sm text-[#4C5A48]">
                  {addr.city}, {addr.state} - {addr.pincode}
                </p>
                {addr.phone && (
                  <p className="mt-1 text-xs text-[#4C5A48]">Phone: {addr.phone}</p>
                )}
              </div>
              <div className="absolute right-5 top-5 flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                <button onClick={() => openEdit(addr)}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-[rgba(23,61,34,0.15)] bg-white text-[#4C5A48] transition-all hover:border-[#173D22] hover:text-[#173D22]">
                  <Pencil className="h-3.5 w-3.5" />
                </button>
                <button onClick={() => handleDelete(addr.id)}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-red-200 bg-white text-red-500 transition-all hover:border-red-400 hover:bg-red-50">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
