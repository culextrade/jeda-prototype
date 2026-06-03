import React from "react";
import { formatRupiah } from "@/lib/format";
import { cn } from "@/lib/utils";

export interface RupiahTextProps {
  amount: number;
  className?: string;
}

export const RupiahText: React.FC<RupiahTextProps> = ({ amount, className }) => {
  return (
    <span className={cn("font-sans font-semibold tabular-nums text-ink", className)}>
      {formatRupiah(amount)}
    </span>
  );
};

export default RupiahText;
