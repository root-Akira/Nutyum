"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Tag } from "lucide-react";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export default function CouponsPage() {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/coupons/available", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subtotal: 0 }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data.coupons)) setCoupons(data.coupons);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#173D22] border-t-transparent" />
      </div>
    );
  }

  const eligible = coupons.filter((c) => c.eligible);
  const others = coupons.filter((c) => !c.eligible);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: EASE }}
    >
      <div className="rounded-2xl border border-[rgba(23,61,34,0.1)] bg-white p-6 sm:p-8">
        <h2 className="mb-6 text-lg font-semibold text-[#173D22]" style={{ fontFamily: "var(--font-heading)" }}>
          My Coupons
        </h2>
        {coupons.length === 0 ? (
          <p className="text-sm text-[#4C5A48]" style={{ fontFamily: "var(--font-body)" }}>
            No coupons available right now. Check back later for offers!
          </p>
        ) : (
          <div className="space-y-6">
            {eligible.length > 0 && (
              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#8A9A8C]" style={{ fontFamily: "var(--font-body)" }}>
                  Available
                </p>
                <div className="space-y-3">
                  {eligible.map((c: any) => (
                    <div
                      key={c.code}
                      className="flex items-center gap-4 rounded-xl border border-[rgba(23,61,34,0.1)] bg-[#FAF7EE] p-4"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#173D22]/10">
                        <Tag className="h-5 w-5 text-[#173D22]" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-[#173D22]" style={{ fontFamily: "var(--font-heading)" }}>
                          {c.code}
                        </p>
                        <p className="text-xs text-[#4C5A48]" style={{ fontFamily: "var(--font-body)" }}>
                          {c.type === "flat" ? `₹${c.value} off` : `${c.value}% off`}
                          {c.minOrder > 0 ? ` • Min. order ₹${c.minOrder}` : ""}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {others.length > 0 && (
              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#8A9A8C]" style={{ fontFamily: "var(--font-body)" }}>
                  Unavailable
                </p>
                <div className="space-y-3">
                  {others.map((c: any) => (
                    <div
                      key={c.code}
                      className="flex items-center gap-4 rounded-xl border border-[rgba(23,61,34,0.06)] bg-white p-4 opacity-60"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[rgba(23,61,34,0.05)]">
                        <Tag className="h-5 w-5 text-[rgba(23,61,34,0.3)]" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-[#173D22]" style={{ fontFamily: "var(--font-heading)" }}>
                          {c.code}
                        </p>
                        <p className="text-xs text-[#8A9A8C]" style={{ fontFamily: "var(--font-body)" }}>
                          {c.reason || "Not applicable"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
