import React from "react";
import Button from "../ui/Button";
import { ClipboardList } from "lucide-react";
import { cn } from "@/lib/utils";

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  ctaText?: string;
  onCtaClick?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  ctaText,
  onCtaClick,
  className,
}) => {
  return (
    <div className={cn("flex flex-col items-center text-center justify-center p-8 select-none my-auto gap-4", className)}>
      <div className="w-16 h-16 rounded-full bg-line/30 flex items-center justify-center text-ink-soft/40 mb-2">
        {icon || <ClipboardList className="w-8 h-8" />}
      </div>
      
      <div className="flex flex-col gap-1.5">
        <h3 className="text-H2 font-display font-bold text-ink">{title}</h3>
        <p className="text-caption text-ink-soft max-w-[260px] leading-relaxed mx-auto">
          {description}
        </p>
      </div>

      {ctaText && onCtaClick && (
        <Button variant="primary" onClick={onCtaClick} className="mt-2 min-w-[160px]">
          {ctaText}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
