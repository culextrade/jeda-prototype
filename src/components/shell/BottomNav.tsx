"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Home, ClipboardList, Compass, Coins, User } from "lucide-react";

export const BottomNav: React.FC = () => {
  const pathname = usePathname();

  // Hide BottomNav on onboarding, Safe Space, and check-in pages
  if (
    pathname === "/" ||
    pathname === "/safe-space" ||
    pathname?.startsWith("/check-in")
  ) {
    return null;
  }

  const tabs = [
    { label: "Beranda", icon: Home, route: "/home" },
    { label: "Peta Utang", icon: ClipboardList, route: "/debt-map" },
    { label: "Pemulihan", icon: Compass, route: "/recovery" },
    { label: "Dompet", icon: Coins, route: "/wallet" },
    { label: "Saya", icon: User, route: "/journey" },
  ];

  return (
    <nav className="h-16 border-t border-line bg-surface flex items-center justify-around pb-safe z-30 select-none flex-shrink-0">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = pathname === tab.route || (tab.route !== "/home" && pathname?.startsWith(tab.route));

        return (
          <Link
            key={tab.route}
            href={tab.route}
            className="flex flex-col items-center justify-center flex-1 h-full py-1 active:scale-95 transition-all select-none"
          >
            <Icon
              className={cn(
                "w-5 h-5 mb-0.5 transition-colors",
                isActive ? "text-pine" : "text-ink-soft"
              )}
            />
            <span
              className={cn(
                "text-[10px] font-sans font-medium tracking-wide transition-colors",
                isActive ? "text-pine font-semibold" : "text-ink-soft"
              )}
            >
              {tab.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
};

export default BottomNav;
