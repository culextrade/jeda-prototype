"use client";

import React from "react";
import Link from "next/link";
import { useCredit } from "@/lib/provider";
import { formatJc } from "@/lib/format";

export const JCBalanceHeaderChip: React.FC = () => {
  const { balance } = useCredit();

  return (
    <Link
      href="/wallet"
      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-tint border border-amber/20 hover:bg-amber/10 active:scale-95 transition-all select-none duration-150"
    >
      <span className="flex items-center justify-center w-4 h-4 rounded-full bg-amber text-surface text-[9px] font-extrabold">
        JC
      </span>
      <span className="text-caption font-bold text-amber tabular-nums">
        {formatJc(balance)}
      </span>
    </Link>
  );
};

export default JCBalanceHeaderChip;
