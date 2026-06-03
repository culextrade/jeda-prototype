import React from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  tone?: "default" | "pine" | "amber" | "clay";
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  tone = "default",
  ...props
}) => {
  const baseStyles = "rounded-md p-5 border border-line transition-all duration-200";

  const tones = {
    default: "bg-surface shadow-card border-line",
    pine: "bg-pine-tint border-pine/20 text-pine-dark",
    amber: "bg-amber-tint border-amber/20 text-ink",
    clay: "bg-clay-tint border-clay/20 text-ink",
  };

  return (
    <div
      className={cn(baseStyles, tones[tone], className)}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
