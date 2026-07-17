"use client";

// Lingkaran setan finansial×mental — dari data user sendiri.
// Kartu bertumpuk + panah balik di sisi kiri (SVG) = "ini siklus".

import React from "react";
import { ArrowDown, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CycleNode {
  label: string;
  data?: string; // angka personal user
  tone: "pine" | "clay" | "amber" | "deep";
}

const TONE: Record<CycleNode["tone"], string> = {
  pine: "border-pine/30 bg-pine-tint text-pine-dark",
  clay: "border-clay/30 bg-clay-tint text-clay",
  amber: "border-amber/40 bg-amber-tint text-warn",
  deep: "border-deep/20 bg-deep text-white",
};

export default function CycleDiagram({ nodes }: { nodes: CycleNode[] }) {
  return (
    <div className="relative pl-9">
      {/* Panah balik: bawah → atas */}
      <svg
        aria-hidden
        className="absolute bottom-7 left-0 top-7 w-9"
        viewBox="0 0 36 100"
        preserveAspectRatio="none"
      >
        <path
          d="M30 96 C 4 96, 4 96, 4 50 C 4 4, 4 4, 26 4"
          fill="none"
          stroke="#CF6F55"
          strokeWidth="2"
          strokeDasharray="5 5"
          strokeLinecap="round"
        />
        <path d="M22 -1 L 30 4 L 22 9 Z" fill="#CF6F55" transform="translate(0,0)" />
      </svg>
      <span className="absolute -left-1 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-clay text-white shadow-card">
        <RefreshCw size={13} strokeWidth={2.5} />
      </span>

      <div className="flex flex-col">
        {nodes.map((n, i) => (
          <React.Fragment key={n.label}>
            <div
              className={cn(
                "rise-in rounded-lg border px-4 py-3",
                TONE[n.tone]
              )}
              style={{ ["--d" as string]: `${i * 140}ms` } as React.CSSProperties}
            >
              <p className="text-[13.5px] font-semibold leading-snug">{n.label}</p>
              {n.data && (
                <p className="mt-0.5 text-[12px] font-medium opacity-80">{n.data}</p>
              )}
            </div>
            {i < nodes.length - 1 && (
              <div
                className="fade-in flex justify-center py-1 text-ink-faint"
                style={{ ["--d" as string]: `${i * 140 + 80}ms` } as React.CSSProperties}
              >
                <ArrowDown size={15} strokeWidth={2.5} />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
