"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Pause } from "lucide-react";
import { cn } from "@/lib/utils";

export const FabJedaDulu: React.FC = () => {
  const pathname = usePathname();

  // Hide on onboarding, Safe Space, and check-in pages
  if (
    pathname === "/" ||
    pathname === "/safe-space" ||
    pathname?.startsWith("/check-in")
  ) {
    return null;
  }

  return (
    <Link
      href="/safe-space"
      className={cn(
        "absolute bottom-20 right-4 z-40",
        "flex items-center gap-1.5 px-4 py-3 rounded-full bg-clay text-surface shadow-lg hover:bg-clay/90 active:scale-95 transition-all select-none duration-150"
      )}
    >
      <span className="flex items-center justify-center animate-pulse">
        <Pause className="w-4 h-4 fill-current" />
      </span>
      <span className="text-caption font-bold tracking-wide">
        Jeda Dulu
      </span>
    </Link>
  );
};

export default FabJedaDulu;
