"use client";

import React from "react";
import { RecoveryTask } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

export interface RecoveryTaskItemProps {
  task: RecoveryTask;
  onToggle: (id: string, done: boolean) => void;
}

export const RecoveryTaskItem: React.FC<RecoveryTaskItemProps> = ({
  task,
  onToggle,
}) => {
  const { id, text, category, done } = task;

  const categoryStyles = {
    regulatif: "bg-success/10 text-success border-success/10",
    operasional: "bg-pine-tint text-pine-dark border-pine/10",
    sosial: "bg-amber-tint text-amber border-amber/10",
    emosional: "bg-clay-tint text-clay border-clay/10",
  };

  const categoryLabels = {
    regulatif: "Regulatif",
    operasional: "Operasional",
    sosial: "Sosial",
    emosional: "Emosional",
  };

  return (
    <div
      onClick={() => onToggle(id, !done)}
      className={cn(
        "flex items-start gap-3.5 p-4 rounded-md border select-none transition-all duration-200 cursor-pointer bg-surface",
        done 
          ? "border-line/40 opacity-70 bg-canvas/30" 
          : "border-line shadow-card hover:bg-canvas/10"
      )}
    >
      {/* Circular Checkbox */}
      <div
        className={cn(
          "w-5 h-5 rounded-full border flex items-center justify-center transition-all flex-shrink-0 mt-0.5",
          done
            ? "bg-pine border-pine text-surface"
            : "border-ink-soft/40 bg-surface hover:border-pine"
        )}
      >
        {done && <Check className="w-3.5 h-3.5 stroke-[3]" />}
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-start gap-1.5 text-left select-none">
        <span
          className={cn(
            "text-caption font-medium leading-relaxed select-none",
            done ? "line-through text-ink-soft/60" : "text-ink"
          )}
        >
          {text}
        </span>
        
        {/* Category Tag */}
        <span
          className={cn(
            "text-[9px] font-sans font-bold px-2 py-0.5 rounded border tracking-wide uppercase",
            categoryStyles[category]
          )}
        >
          {categoryLabels[category]}
        </span>
      </div>
    </div>
  );
};

export default RecoveryTaskItem;
