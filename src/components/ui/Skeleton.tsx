import React from "react";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  variant?: "default" | "circular" | "text" | "card";
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = "",
  variant = "default",
  ...props
}) => {
  const baseClasses = "relative overflow-hidden bg-slate-200/60 animate-pulse";

  const variantClasses = {
    default: "rounded-xl",
    circular: "rounded-full",
    text: "rounded-md h-4 my-1",
    card: "rounded-2xl border border-indigo-100/60 p-6 bg-white/70 shadow-sm",
  }[variant];

  return (
    <div
      aria-hidden="true"
      role="status"
      className={`${baseClasses} ${variantClasses} ${className}`}
      {...props}
    >
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.8s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
    </div>
  );
};
