"use client";

// Rute utilitas demo: muat persona Raka lalu alihkan.
// /demo?to=/home · /demo?to=/jurnal&advance=1 (maju 7 hari) · /demo?reset=1&to=/

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { advanceDemoWeek, resetAll, seedDemo } from "@/lib/store";

export default function DemoPage() {
  const router = useRouter();
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;
    const q = new URLSearchParams(window.location.search);
    if (q.get("reset") === "1") {
      resetAll();
    } else {
      seedDemo();
      if (q.get("advance") === "1") advanceDemoWeek();
    }
    router.replace(q.get("to") || "/home");
  }, [router]);

  return (
    <div className="flex h-full items-center justify-center bg-canvas">
      <p className="text-[13px] text-ink-faint">Menyiapkan demo…</p>
    </div>
  );
}
