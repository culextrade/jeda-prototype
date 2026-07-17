"use client";

// Peta Kondisi 2×2: beban finansial (x) × distres psikologis (y).
// Titik user diletakkan dari indeks 0–3 hasil engine — bukan perasaan-perasaanan.

import React from "react";
import { Sev } from "@/lib/types";

export default function MatrixMap({
  burden,
  distress,
}: {
  burden: Sev;
  distress: Sev;
}) {
  const W = 320;
  const H = 260;
  const PAD_L = 34;
  const PAD_B = 34;
  const PAD_T = 14;
  const PAD_R = 14;
  const plotW = W - PAD_L - PAD_R;
  const plotH = H - PAD_T - PAD_B;

  // indeks 0..3 → posisi (offset supaya tidak menempel tepi)
  const px = PAD_L + ((burden + 0.5) / 4) * plotW;
  const py = PAD_T + plotH - ((distress + 0.5) / 4) * plotH;

  const midX = PAD_L + plotW / 2;
  const midY = PAD_T + plotH / 2;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="w-full"
      role="img"
      aria-label={`Peta kondisi: beban finansial ${burden} dari 3, distres psikologis ${distress} dari 3`}
    >
      {/* Kuadran */}
      <rect x={PAD_L} y={PAD_T} width={plotW / 2} height={plotH / 2} rx="10" fill="#F9EAE2" opacity="0.55" />
      <rect x={midX} y={PAD_T} width={plotW / 2} height={plotH / 2} rx="10" fill="#F7E7E1" />
      <rect x={PAD_L} y={midY} width={plotW / 2} height={plotH / 2} rx="10" fill="#E3EEE9" />
      <rect x={midX} y={midY} width={plotW / 2} height={plotH / 2} rx="10" fill="#FBF1DE" opacity="0.9" />

      {/* Label kuadran */}
      <text x={PAD_L + plotW / 4} y={midY + plotH / 4} textAnchor="middle" fontSize="11" fontWeight="600" fill="#1F6F65">
        Terjaga
      </text>
      <text x={midX + plotW / 4} y={midY + plotH / 4} textAnchor="middle" fontSize="11" fontWeight="600" fill="#C9842B">
        Tekanan finansial
      </text>
      <text x={PAD_L + plotW / 4} y={PAD_T + plotH / 4} textAnchor="middle" fontSize="11" fontWeight="600" fill="#CF6F55">
        Tekanan batin
      </text>
      <text x={midX + plotW / 4} y={PAD_T + plotH / 4} textAnchor="middle" fontSize="11" fontWeight="600" fill="#B4533A">
        Tekanan ganda
      </text>

      {/* Sumbu */}
      <line x1={PAD_L} y1={PAD_T + plotH} x2={PAD_L + plotW} y2={PAD_T + plotH} stroke="#B9C4BE" strokeWidth="1.5" />
      <line x1={PAD_L} y1={PAD_T} x2={PAD_L} y2={PAD_T + plotH} stroke="#B9C4BE" strokeWidth="1.5" />
      <text x={PAD_L + plotW / 2} y={H - 8} textAnchor="middle" fontSize="10.5" fill="#5A6B66">
        Beban finansial →
      </text>
      <text
        x={12}
        y={PAD_T + plotH / 2}
        textAnchor="middle"
        fontSize="10.5"
        fill="#5A6B66"
        transform={`rotate(-90 12 ${PAD_T + plotH / 2})`}
      >
        Distres psikologis →
      </text>

      {/* Titik user */}
      <circle cx={px} cy={py} r="16" fill="#1F6F65" opacity="0.15">
        <animate attributeName="r" values="13;19;13" dur="2.8s" repeatCount="indefinite" />
      </circle>
      <circle cx={px} cy={py} r="7" fill="#1F6F65" stroke="#FFFFFF" strokeWidth="2.5" />
      <g transform={`translate(${Math.min(px, W - 92)}, ${Math.max(py - 30, 12)})`}>
        <rect width="78" height="20" rx="10" fill="#1B2A27" />
        <text x="39" y="13.5" textAnchor="middle" fontSize="10.5" fontWeight="600" fill="#fff">
          kamu di sini
        </text>
      </g>
    </svg>
  );
}
