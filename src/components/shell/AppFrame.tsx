"use client";

import React, { useEffect } from "react";

/**
 * Bingkai perangkat: full-screen di ponsel, device frame 430px di desktop.
 * id="device" menjadi target portal untuk Sheet/overlay agar tetap
 * berada di dalam layar perangkat.
 */
export default function AppFrame({ children }: { children: React.ReactNode }) {
  // Mode capture screenshot: ?noanim=1 mematikan animasi entri (deterministik).
  useEffect(() => {
    if (window.location.search.includes("noanim")) {
      document.documentElement.classList.add("noanim");
    }
  }, []);
  return (
    <div className="flex h-dvh w-full items-center justify-center bg-[#EBE8DF] sm:p-6">
      <div className="relative flex h-full w-full flex-col sm:h-[860px] sm:max-h-[92vh] sm:w-[430px]">
        <div
          id="device"
          className="relative flex h-full w-full flex-col overflow-hidden bg-canvas sm:rounded-[44px] sm:border-[10px] sm:border-[#171E1C] sm:shadow-float"
        >
          {/* Island */}
          <div className="pointer-events-none absolute left-1/2 top-2.5 z-50 hidden h-[26px] w-[110px] -translate-x-1/2 rounded-full bg-[#171E1C] sm:block" />
          <div className="flex h-full flex-col overflow-hidden sm:pt-10">
            {children}
          </div>
        </div>
        <p className="mt-4 hidden text-center text-xs tracking-wide text-ink-faint sm:block">
          JEDA · prototype v2 — data tersimpan hanya di perangkat ini
        </p>
      </div>
    </div>
  );
}
