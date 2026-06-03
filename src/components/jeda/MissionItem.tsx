"use client";

import React from "react";
import { Mission, MissionKey } from "@/lib/types";
import { getMissionLabel } from "@/lib/missions";
import JCAmount from "../ui/JCAmount";
import Button from "../ui/Button";
import { cn } from "@/lib/utils";
import { CheckCircle2, Lock } from "lucide-react";

export interface MissionItemProps {
  mission: Mission;
  onClaim: (key: MissionKey) => void;
}

export const MissionItem: React.FC<MissionItemProps> = ({
  mission,
  onClaim,
}) => {
  const { key, status, progress, target, reward } = mission;

  const getStatusStyles = () => {
    switch (status) {
      case "claimed":
        return "border-line bg-canvas/40 opacity-70";
      case "completed":
        return "border-amber/30 bg-amber-tint/10 shadow-sm";
      case "in-progress":
        return "border-line bg-surface";
      default:
        return "border-line/60 bg-surface opacity-80";
    }
  };

  return (
    <div
      className={cn(
        "flex flex-col gap-3 p-4 rounded-md border select-none transition-all text-left",
        getStatusStyles()
      )}
    >
      {/* Top row: Title and Reward */}
      <div className="flex justify-between items-start gap-2 select-none">
        <div className="flex flex-col gap-0.5 text-left">
          <h4 className="text-caption font-bold text-ink leading-snug">
            {getMissionLabel(key)}
          </h4>
          <span className="text-[11px] text-ink-soft select-none font-medium">
            Progres: {progress}/{target}
          </span>
        </div>
        <JCAmount amount={reward} size="sm" className="flex-shrink-0" />
      </div>

      {/* Bottom row: Action or Status */}
      <div className="flex justify-between items-center select-none pt-1">
        {/* Simple Progress Bar */}
        <div className="w-2/3 h-1.5 rounded-full bg-line overflow-hidden">
          <div
            className={cn(
              "h-full rounded-full transition-all duration-300",
              status === "claimed" ? "bg-ink-soft/40" : "bg-amber"
            )}
            style={{ width: `${Math.min(100, (progress / target) * 100)}%` }}
          />
        </div>

        {/* Claim / Status Button */}
        {status === "claimed" ? (
          <span className="flex items-center gap-1 text-[11px] font-bold text-ink-soft">
            <CheckCircle2 className="w-3.5 h-3.5 text-ink-soft/60" />
            Selesai
          </span>
        ) : status === "completed" ? (
          <Button
            variant="credit"
            size="sm"
            onClick={() => onClaim(key)}
            className="px-3 py-1.5 h-auto min-h-0 text-[11px] rounded-full font-bold shadow-sm"
          >
            Klaim
          </Button>
        ) : status === "locked" ? (
          <span className="flex items-center gap-1 text-[11px] font-medium text-ink-soft/40">
            <Lock className="w-3 h-3" />
            Terkunci
          </span>
        ) : (
          <span className="text-[11px] font-semibold text-ink-soft">
            Dalam Progres
          </span>
        )}
      </div>
    </div>
  );
};

export default MissionItem;
