import React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "warm" | "credit";
  size?: "sm" | "md" | "lg";
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className,
  variant = "primary",
  size = "lg",
  iconLeft,
  iconRight,
  loading = false,
  disabled,
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center font-sans font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-98 disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100 min-h-[44px]";

  const variants = {
    primary:
      "bg-pine text-surface hover:bg-pine-dark focus:ring-pine active:bg-pine-dark",
    secondary:
      "border border-pine text-pine bg-transparent hover:bg-pine/5 focus:ring-pine",
    ghost:
      "text-pine bg-transparent hover:bg-pine/5 focus:ring-pine active:bg-pine/10 min-h-0",
    warm:
      "bg-clay text-surface hover:bg-clay/90 focus:ring-clay active:bg-clay/95",
    credit:
      "bg-amber text-surface hover:bg-amber/90 focus:ring-amber active:bg-amber/95",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm rounded-sm",
    md: "px-4 py-2 text-md rounded-md",
    lg: "w-full px-6 py-3 text-lg rounded-full shadow-sm", // CTA utama = full width + rounded-full
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <svg
          className="animate-spin -ml-1 mr-2 h-5 w-5 text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      ) : iconLeft ? (
        <span className="mr-2 inline-flex">{iconLeft}</span>
      ) : null}
      
      {children}
      
      {!loading && iconRight && (
        <span className="ml-2 inline-flex">{iconRight}</span>
      )}
    </button>
  );
};

export default Button;
