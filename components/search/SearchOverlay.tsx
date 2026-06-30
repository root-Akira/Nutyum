"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
  CommandEmpty,
  CommandGroup,
} from "@/components/ui/command";
import { PRODUCTS as STATIC_PRODUCTS } from "@/data/products";
import type { Product } from "@/types";
import { formatPrice } from "@/lib/formatters";

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState<Product[]>(STATIC_PRODUCTS);

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data) && data.length) setProducts(data);
      })
      .catch(() => {});
  }, []);

  const filtered = query.trim()
    ? products.filter((p) => {
        const q = query.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.vibes.some((v) => v.toLowerCase().includes(q))
        );
      })
    : [];

  const handleSelect = useCallback(
    (slug: string) => {
      onClose();
      router.push(`/shop/${slug}`);
    },
    [onClose, router]
  );

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) { onClose(); setQuery(""); } }}>
      <DialogContent
        onCloseAutoFocus={(e) => { e.preventDefault(); }}
        className="sm:max-w-[550px] p-0 gap-0 overflow-hidden [&>button]:top-3 [&>button]:right-3"
      >
        <Command shouldFilter={false} loop>
          <div className="flex items-center border-b px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <CommandInput
              placeholder="Search our snacks..."
              value={query}
              onValueChange={setQuery}
              className="flex h-12 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>
          <CommandList>
            <AnimatePresence mode="wait">
              {!query.trim() ? (
                <motion.div
                  key="hint"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="py-8 text-center text-sm text-muted-foreground"
                >
                  Start typing to search our snacks...
                </motion.div>
              ) : filtered.length === 0 ? (
                <motion.div
                  key="none"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.15 }}
                >
                  <CommandEmpty>No products found</CommandEmpty>
                </motion.div>
              ) : (
                <motion.div
                  key="results"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.15 }}
                >
                  <CommandGroup heading={`${filtered.length} result${filtered.length === 1 ? "" : "s"}`}>
                    {filtered.map((product) => (
                      <CommandItem
                        key={product.id}
                        value={product.id}
                        onSelect={() => handleSelect(product.slug)}
                        className="flex items-center gap-3 py-3 px-2 cursor-pointer aria-selected:bg-accent/30"
                      >
                        <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md bg-muted">
                          <Image
                            src={product.images[0] ?? "/placeholder.svg"}
                            alt={product.name}
                            fill
                            className="object-cover"
                            sizes="40px"
                          />
                        </div>
                        <div className="flex flex-1 flex-col min-w-0">
                          <span className="text-sm font-medium truncate">
                            {product.name}
                          </span>
                          <span className="text-xs text-muted-foreground truncate">
                            {product.description}
                          </span>
                        </div>
                        <span className="shrink-0 text-sm font-semibold text-primary">
                          {formatPrice(product.price)}
                        </span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </motion.div>
              )}
            </AnimatePresence>
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
