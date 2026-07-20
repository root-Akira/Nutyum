"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle } from "lucide-react";
import { useUIStore } from "@/hooks/use-ui-store";

export function Toast() {
  const { toast, hideToast } = useUIStore();

  useEffect(() => {
    if (toast.visible) {
      const timer = setTimeout(hideToast, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast.visible, hideToast]);

  return (
    <AnimatePresence>
      {toast.visible && (
        <motion.div
          initial={{ opacity: 0, y: 50, x: "-50%" }}
          animate={{ opacity: 1, y: 0, x: "-50%" }}
          exit={{ opacity: 0, y: 20, x: "-50%" }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="fixed bottom-6 left-1/2 z-50 flex items-center gap-2.5 rounded-2xl bg-[#173D22] px-5 py-3 text-sm font-medium text-white shadow-lg"
        >
          <CheckCircle size={18} className="text-green-300" />
          {toast.message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
