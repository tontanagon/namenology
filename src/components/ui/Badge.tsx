import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "brand" | "indigo" | "violet" | "cyan" | "gold" | "outline" | "success" | "neutral";
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = "brand",
  children,
  ...props
}) => {
  const variantStyles = {
    brand: "bg-brand-50 text-brand-600 border-brand-200",
    indigo: "bg-indigo-50 text-indigo-600 border-indigo-200",
    violet: "bg-violet-50 text-violet-600 border-violet-200",
    cyan: "bg-cyan-50 text-cyan-600 border-cyan-200",
    gold: "bg-[#FEF7E8] text-[#8B6914] border-[#E8D5A0]",
    outline: "border-border text-foreground bg-transparent",
    success: "bg-emerald-50 text-emerald-700 border-emerald-200",
    neutral: "bg-slate-50 text-slate-600 border-slate-200",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};
