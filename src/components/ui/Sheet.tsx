"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Bottom sheet yang tampil di dalam bingkai perangkat (portal ke #device).
 * Enter/exit pakai transisi transform + kurva drawer iOS.
 */
export default function Sheet({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}) {
  const [host, setHost] = useState<HTMLElement | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setHost(document.getElementById("device"));
  }, []);

  useEffect(() => {
    if (open) {
      const t = requestAnimationFrame(() => setMounted(true));
      return () => cancelAnimationFrame(t);
    }
    setMounted(false);
  }, [open]);

  if (!host || !open) return null;

  return createPortal(
    <div className="absolute inset-0 z-[60] flex flex-col justify-end">
      {/* Backdrop */}
      <button
        aria-label="Tutup"
        onClick={onClose}
        className={cn(
          "absolute inset-0 bg-deep/45 transition-opacity duration-300",
          mounted ? "opacity-100" : "opacity-0"
        )}
      />
      {/* Panel */}
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          "relative max-h-[86%] overflow-y-auto rounded-t-[26px] bg-surface px-5 pb-[max(20px,env(safe-area-inset-bottom))] pt-3 shadow-float transition-transform duration-[420ms] ease-drawer",
          mounted ? "translate-y-0" : "translate-y-full"
        )}
      >
        <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-line" />
        <div className="mb-3 flex items-center justify-between gap-3">
          {title ? (
            <h3 className="font-display text-[18px] font-semibold tracking-tight">
              {title}
            </h3>
          ) : (
            <span />
          )}
          <button
            aria-label="Tutup"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-canvas text-ink-soft transition-transform duration-150 ease-out active:scale-97"
          >
            <X size={16} />
          </button>
        </div>
        {children}
      </div>
    </div>,
    host
  );
}
