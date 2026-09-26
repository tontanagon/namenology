import React from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  glass?: boolean;
  glow?: "blue" | "indigo" | "violet" | "cyan" | "gold" | "none";
  variant?: "default" | "science" | "elevated";
}

export const Card: React.FC<CardProps> = ({
  className,
  glass = false,
  glow = "none",
  variant = "default",
  children,
  ...props
}) => {
  return (
    <div
      className={cn(
        "rounded-2xl p-6 transition-all duration-300",
        variant === "default" && "bg-white border border-border shadow-card",
        variant === "science" && "bg-white border border-border shadow-science hover:shadow-science-hover hover:-translate-y-0.5",
        variant === "elevated" && "bg-white border border-border/60 shadow-glass",
        glass && "glass-panel shadow-glass",
        glow === "blue" && "hover:shadow-glow-blue hover:border-brand-300/40",
        glow === "indigo" && "hover:shadow-glow-indigo hover:border-indigo-300/40",
        glow === "violet" && "hover:shadow-glow-violet hover:border-violet-300/40",
        glow === "cyan" && "hover:shadow-glow-cyan hover:border-cyan-300/40",
        glow === "gold" && "hover:shadow-[0_0_20px_-4px_rgba(214,168,79,0.2)] hover:border-gold/30",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
