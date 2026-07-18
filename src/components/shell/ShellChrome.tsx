"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Home,
  ClipboardList,
  BookOpen,
  LifeBuoy,
  ArrowLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PauseMark } from "./Logo";

/**
 * Chrome kondisional:
 * - Rute hub (pasca-onboarding): TopBar + BottomNav + FAB Tombol Jeda
 * - Rute alur (landing → rencana) dan /jeda: layar penuh tanpa chrome
 */

const HUB_TITLES: Record<string, string> = {
  "/home": "",
  "/rencana": "Rencana Pemulihan",
  "/jurnal": "Jurnal Mood × Uang",
  "/bantuan": "Bantuan & Rujukan",
  "/dc": "Mode Tenang",
  "/tidur": "Modul Tidur",
  "/tentang": "Tentang Prototype",
  "/laporan": "Laporan Jeda",
  "/kelas": "Kelas Jeda",
  "/lingkar": "Lingkar Saksi",
};

const NAV = [
  { href: "/home", label: "Beranda", icon: Home },
  { href: "/rencana", label: "Rencana", icon: ClipboardList },
  { href: "/jurnal", label: "Jurnal", icon: BookOpen },
  { href: "/bantuan", label: "Bantuan", icon: LifeBuoy },
];

const BACK_TARGET: Record<string, string> = {
  "/dc": "/bantuan",
  "/tidur": "/rencana",
  "/tentang": "/home",
  "/laporan": "/home",
  "/kelas": "/home",
  "/lingkar": "/home",
};

export default function ShellChrome({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname() ?? "/";
  const router = useRouter();
  const isHub = pathname in HUB_TITLES;
  const title = HUB_TITLES[pathname];

  if (!isHub) {
    return (
      <div className="relative flex h-full flex-col overflow-hidden">
        {children}
      </div>
    );
  }

  return (
    <div className="relative flex h-full flex-col overflow-hidden">
      {/* TopBar */}
      <header className="z-20 flex items-center justify-between gap-3 px-5 pb-3 pt-4">
        <div className="flex min-w-0 items-center gap-2.5">
          {BACK_TARGET[pathname] ? (
            <button
              aria-label="Kembali"
              onClick={() => router.push(BACK_TARGET[pathname])}
              className="-ml-2 flex h-9 w-9 items-center justify-center rounded-full text-ink-soft transition-transform duration-150 ease-out active:scale-97"
            >
              <ArrowLeft size={19} strokeWidth={2.2} />
            </button>
          ) : (
            <PauseMark className="h-[18px] w-[15px]" />
          )}
          {title ? (
            <h1 className="truncate font-display text-[19px] font-semibold tracking-tight">
              {title}
            </h1>
          ) : (
            <span className="font-display text-[19px] font-semibold tracking-tight">
              jeda
            </span>
          )}
        </div>
        <Link
          href="/krisis"
          className="rounded-full border border-clay/40 bg-clay-tint px-3 py-1.5 text-[12px] font-semibold text-clay transition-transform duration-150 ease-out active:scale-97"
        >
          Butuh bantuan?
        </Link>
      </header>

      {/* Konten */}
      <main className="relative flex-1 overflow-y-auto overflow-x-hidden overscroll-contain">
        {children}
        <div className="h-28" />
      </main>

      {/* Bottom nav + FAB */}
      <nav className="absolute inset-x-0 bottom-0 z-30">
        <div className="relative mx-auto">
          {/* FAB Tombol Jeda */}
          <Link
            href="/jeda"
            aria-label="Tombol Jeda"
            className="absolute -top-7 left-1/2 z-10 flex h-16 w-16 -translate-x-1/2 items-center justify-center rounded-full bg-pine shadow-float ring-4 ring-canvas transition-transform duration-150 ease-out active:scale-97"
          >
            <PauseMark className="h-6 w-5" bar="bg-white" />
          </Link>
          <div className="border-t border-line/80 bg-surface/95 px-2 pb-[max(10px,env(safe-area-inset-bottom))] pt-2 backdrop-blur-sm">
            <div className="grid grid-cols-5 items-center">
              {NAV.slice(0, 2).map((item) => (
                <NavItem key={item.href} {...item} active={pathname === item.href} />
              ))}
              <div aria-hidden className="flex flex-col items-center justify-end self-stretch pb-0.5 pt-[34px]">
                <span className="text-[10px] font-semibold text-pine">Jeda dulu</span>
              </div>
              {NAV.slice(2).map((item) => (
                <NavItem key={item.href} {...item} active={pathname === item.href} />
              ))}
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}

function NavItem({
  href,
  label,
  icon: Icon,
  active,
}: {
  href: string;
  label: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex flex-col items-center gap-0.5 rounded-md py-1 transition-transform duration-150 ease-out active:scale-97",
        active ? "text-pine" : "text-ink-faint"
      )}
    >
      <Icon size={21} strokeWidth={active ? 2.4 : 2} />
      <span className={cn("text-[10px]", active ? "font-semibold" : "font-medium")}>
        {label}
      </span>
    </Link>
  );
}
