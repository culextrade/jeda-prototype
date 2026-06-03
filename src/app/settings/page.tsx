"use client";

import React from "react";
import { useJeda } from "@/lib/provider";
import { ConsentTier } from "@/lib/types";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import DisclaimerNote from "@/components/jeda/DisclaimerNote";

export default function SettingsPage() {
  const { state, setState, resetState, seedDemoState } = useJeda();
  const consentTier = state.profile?.consentTier ?? 0;

  const handleTierChange = (tier: ConsentTier) => {
    if (state.profile) {
      setState({
        profile: {
          ...state.profile,
          consentTier: tier,
        },
      });
    }
  };

  const handleReset = () => {
    if (window.confirm("Apakah kamu yakin ingin menghapus seluruh data di perangkat ini? Tindakan tidak bisa dibatalkan.")) {
      resetState();
    }
  };

  return (
    <div className="flex-1 flex flex-col gap-5 p-5 bg-canvas overflow-y-auto select-none">
      {/* Profil Section */}
      <Card tone="default" className="flex flex-col gap-3">
        <h3 className="text-body font-display font-bold text-ink">Profil Pengguna</h3>
        <div className="flex flex-col gap-1 text-left">
          <span className="text-caption text-ink-soft">ID Perangkat Anonim:</span>
          <code className="text-xs font-mono bg-canvas p-2 rounded border border-line select-all overflow-x-auto whitespace-nowrap block">
            {state.profile?.anonId || "Belum diatur"}
          </code>
        </div>
      </Card>

      {/* Consent Ladder Section */}
      <Card tone="default" className="flex flex-col gap-4">
        <div className="flex flex-col gap-0.5">
          <h3 className="text-body font-display font-bold text-ink">Tangga Persetujuan (Consent Ladder)</h3>
          <p className="text-caption text-ink-soft leading-relaxed">
            Pilih tingkat pembagian data yang nyaman untukmu. Semua data tetap tersimpan di perangkat ini.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {/* Tier 0 */}
          <button
            onClick={() => handleTierChange(0)}
            className={`text-left p-3.5 rounded-md border transition-all ${
              consentTier === 0
                ? "bg-pine-tint border-pine text-pine-dark"
                : "bg-surface border-line hover:bg-canvas"
            }`}
          >
            <div className="flex justify-between items-center mb-1">
              <span className="text-caption font-bold">Tier 0: Anonim Penuh</span>
              {consentTier === 0 && <span className="text-xs font-bold">Aktif</span>}
            </div>
            <p className="text-[11px] leading-normal text-ink-soft/90">
              Datamu diproses lokal. Tidak ada pengiriman ke jaringan apa pun.
            </p>
          </button>

          {/* Tier 1 */}
          <button
            onClick={() => handleTierChange(1)}
            className={`text-left p-3.5 rounded-md border transition-all ${
              consentTier === 1
                ? "bg-pine-tint border-pine text-pine-dark"
                : "bg-surface border-line hover:bg-canvas"
            }`}
          >
            <div className="flex justify-between items-center mb-1">
              <span className="text-caption font-bold">Tier 1: Simpan Progres</span>
              {consentTier === 1 && <span className="text-xs font-bold">Aktif</span>}
            </div>
            <p className="text-[11px] leading-normal text-ink-soft/90">
              Menyimpan riwayat check-in emosional dan peta utang agar tidak terhapus.
            </p>
          </button>

          {/* Tier 2 */}
          <button
            onClick={() => handleTierChange(2)}
            className={`text-left p-3.5 rounded-md border transition-all ${
              consentTier === 2
                ? "bg-pine-tint border-pine text-pine-dark"
                : "bg-surface border-line hover:bg-canvas"
            }`}
          >
            <div className="flex justify-between items-center mb-1">
              <span className="text-caption font-bold">Tier 2: Pengingat Aktif (Email/WA)</span>
              {consentTier === 2 && <span className="text-xs font-bold">Aktif</span>}
            </div>
            <p className="text-[11px] leading-normal text-ink-soft/90">
              Menerima pengingat harian menenangkan agar streak dan komitmen pulih terjaga.
            </p>
          </button>

          {/* Tier 3 */}
          <button
            onClick={() => handleTierChange(3)}
            className={`text-left p-3.5 rounded-md border transition-all ${
              consentTier === 3
                ? "bg-pine-tint border-pine text-pine-dark"
                : "bg-surface border-line hover:bg-canvas"
            }`}
          >
            <div className="flex justify-between items-center mb-1">
              <span className="text-caption font-bold">Tier 3: Referral Kemitraan</span>
              {consentTier === 3 && <span className="text-xs font-bold">Aktif</span>}
            </div>
            <p className="text-[11px] leading-normal text-ink-soft/90">
              Izinkan penyaluran data aman ke mitra konselor/hukum ketika kamu memintanya.
            </p>
          </button>
        </div>
      </Card>

      {/* Demo Controls */}
      <Card tone="amber" className="flex flex-col gap-3 py-5 border border-amber/25 bg-amber-tint/40">
        <div className="flex flex-col gap-0.5">
          <h3 className="text-body font-display font-bold text-amber-dark">Mode Demo & Verifikasi</h3>
          <p className="text-caption text-ink-soft leading-normal">
            Gunakan tombol di bawah ini untuk menguji fungsionalitas visual prototype ( Lampiran H ).
          </p>
        </div>

        <div className="flex flex-col gap-2.5 pt-1">
          <Button
            variant="credit"
            size="md"
            onClick={seedDemoState}
            className="w-full text-caption font-bold shadow-sm"
          >
            ⚡ Seed Data Demo Juri (Lampiran H)
          </Button>
          <Button
            variant="secondary"
            size="md"
            onClick={handleReset}
            className="w-full text-caption font-semibold bg-surface hover:bg-canvas"
          >
            🗑️ Hapus Semua Data Lokal
          </Button>
        </div>
      </Card>

      <DisclaimerNote variant="general" className="mt-1" />
    </div>
  );
}
