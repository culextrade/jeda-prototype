"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import JCBalanceHeaderChip from "./JCBalanceHeaderChip";
import Logo from "../jeda/Logo";

export const AppHeader: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();

  // If landing page, safe space, or check-in flow, hide the global header
  if (
    pathname === "/" ||
    pathname === "/safe-space" ||
    pathname?.startsWith("/check-in")
  ) {
    return null;
  }

  // Define route to title mapping
  const getHeaderDetails = () => {
    switch (pathname) {
      case "/home":
        return { title: "Beranda", showBack: false, showJC: true };
      case "/debt-map":
        return { title: "Peta Utang", showBack: false, showJC: true };
      case "/recovery":
        return { title: "Pemulihan", showBack: false, showJC: true };
      case "/wallet":
        return { title: "Dompet JEDA", showBack: false, showJC: false }; // Hide JC chip inside wallet itself
      case "/journey":
        return { title: "Perjalananku", showBack: false, showJC: true };
      case "/safe-space":
        return { title: "Safe Space", showBack: true, showJC: false };
      case "/check-in":
        return { title: "Check-In Harian", showBack: true, showJC: false };
      case "/referral":
        return { title: "Teman Bicara", showBack: true, showJC: true };
      case "/resources":
        return { title: "Kanal Resmi & Bantuan", showBack: true, showJC: true };
      case "/settings":
        return { title: "Pengaturan", showBack: true, showJC: true };
      default:
        // Handle sub-pages
        if (pathname?.startsWith("/debt-map/")) {
          return { title: "Peta Utang", showBack: true, showJC: true };
        }
        if (pathname?.startsWith("/check-in/")) {
          return { title: "Check-In Harian", showBack: true, showJC: false };
        }
        return { title: "JEDA", showBack: true, showJC: true };
    }
  };

  const { title, showBack, showJC } = getHeaderDetails();

  return (
    <header className="h-14 border-b border-line bg-surface px-4 flex items-center justify-between z-30 select-none flex-shrink-0">
      <div className="flex items-center gap-3">
        {showBack ? (
          <button
            onClick={() => router.back()}
            className="w-8 h-8 rounded-full flex items-center justify-center text-ink hover:bg-canvas active:scale-90 transition-all text-base"
          >
            ←
          </button>
        ) : (
          <Logo size={20} variant="pine" className="mr-0.5" />
        )}
        <h1 className="text-H3 font-display font-bold text-ink leading-none mt-0.5">
          {title}
        </h1>
      </div>

      <div className="flex items-center">
        {showJC && <JCBalanceHeaderChip />}
      </div>
    </header>
  );
};

export default AppHeader;
