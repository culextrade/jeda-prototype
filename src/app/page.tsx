"use client";

import React from "react";
import Link from "next/link";
import Logo from "@/components/jeda/Logo";
import Button from "@/components/ui/Button";
import DisclaimerNote from "@/components/jeda/DisclaimerNote";

export default function LandingPage() {
  return (
    <div className="flex-1 flex flex-col justify-between p-6 bg-canvas select-none">
      {/* Brand Header */}
      <div className="flex flex-col items-center pt-10 gap-2">
        <Logo size={48} variant="pine" />
        <span className="text-H3 font-display font-bold text-pine tracking-widest mt-1">
          J E D A
        </span>
      </div>

      {/* Hero Section */}
      <div className="flex flex-col items-center text-center gap-4 my-auto py-10 px-2 select-none">
        <h2 className="text-Display font-display font-extrabold text-ink leading-tight">
          Berhenti sejenak sebelum memutuskan.
        </h2>
        <p className="text-body-lg text-ink-soft leading-relaxed max-w-sm px-1">
          JEDA menemani kamu menata utang dengan tenang — tanpa login, tanpa dihakimi.
        </p>
      </div>

      {/* Action Footer */}
      <div className="flex flex-col gap-6 w-full max-w-xs mx-auto pb-4 items-center">
        <Link href="/safe-space" className="w-full">
          <Button variant="primary" className="w-full">
            Mulai dari sini
          </Button>
        </Link>
        
        <span className="text-caption text-ink-soft font-medium">
          Tanpa akun. Datamu tetap di perangkatmu.
        </span>

        <DisclaimerNote variant="general" className="mt-2" />
      </div>
    </div>
  );
}
