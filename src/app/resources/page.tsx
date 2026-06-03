"use client";

import React from "react";
import Link from "next/link";
import { ExternalLink, ShieldCheck, FileText, AlertOctagon, ArrowRight } from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import BreathingDot from "@/components/jeda/BreathingDot";
import DisclaimerNote from "@/components/jeda/DisclaimerNote";

const RESOURCES = [
  {
    icon: ShieldCheck,
    title: "Cek Pinjol Resmi OJK",
    desc: "Pastikan dan verifikasi apakah perusahaan pinjol (LPBBTI) terdaftar dan berizin resmi di OJK.",
    url: "https://www.ojk.go.id",
    color: "text-pine",
  },
  {
    icon: FileText,
    title: "iDebKu SLIK OJK",
    desc: "Ajukan permohonan informasi debitur untuk melihat riwayat kredit resmi kamu secara mandiri.",
    url: "https://idebku.ojk.go.id",
    color: "text-pine",
  },
  {
    icon: AlertOctagon,
    title: "Lapor Kontak OJK 157 / Satgas PASTI",
    desc: "Adukan aktivitas teror penagihan, bunga ilegal, atau ancaman dari pinjol tidak resmi.",
    url: "https://kontak157.ojk.go.id",
    color: "text-clay",
  },
];

export default function ResourcesPage() {
  return (
    <div className="flex-1 flex flex-col justify-between p-5 bg-canvas select-none overflow-y-auto">
      <div className="flex flex-col gap-5">
        {/* Calming First-Aid Breathing Widget */}
        <Card tone="clay" className="p-4 border border-clay/20 bg-clay-tint/50 flex flex-col items-center gap-4 text-center">
          <BreathingDot size="sm" />
          <div className="flex flex-col gap-1">
            <h3 className="text-caption font-bold text-clay tracking-wide">
              Pertolongan Pertama Stres
            </h3>
            <p className="text-[10.5px] leading-relaxed text-ink-soft max-w-xs font-semibold">
              Tarik napas dalam-dalam. Tunda keputusan mengambil pinjaman baru dalam 24 jam ke depan. Kamu tidak sendirian.
            </p>
          </div>
        </Card>

        {/* Official Directory List */}
        <div className="flex flex-col gap-1.5 text-left">
          <h2 className="text-caption font-bold text-ink-soft uppercase tracking-wider">
            Direktori Kanal Resmi
          </h2>
          <p className="text-[10.5px] text-ink-soft/80 font-medium">
            Gunakan kanal pemerintah berikut untuk memvalidasi dan mengamankan hak-hak keuanganmu:
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {RESOURCES.map((item, idx) => {
            const Icon = item.icon;
            return (
              <a
                key={idx}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block active:scale-[0.99] transition-all"
              >
                <Card className="p-4 border border-line bg-surface flex items-start gap-4 hover:border-pine/30 hover:shadow-sm">
                  <div className={`mt-0.5 p-2 rounded-full bg-canvas ${item.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 flex flex-col leading-tight pr-1">
                    <span className="text-caption font-bold text-ink flex items-center gap-1">
                      {item.title}
                      <ExternalLink className="w-3 h-3 text-ink-soft/40" />
                    </span>
                    <span className="text-[10px] text-ink-soft font-semibold leading-normal mt-1.5">
                      {item.desc}
                    </span>
                  </div>
                </Card>
              </a>
            );
          })}
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex flex-col gap-4 mt-6 items-center w-full max-w-xs mx-auto">
        <Link href="/home" className="w-full">
          <Button variant="primary" className="w-full font-bold flex items-center justify-center gap-2">
            Masuk ke Beranda
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
        <DisclaimerNote variant="general" />
      </div>
    </div>
  );
}
