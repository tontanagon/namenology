"use client";

import React from "react";
import { Sparkles } from "lucide-react";

interface CosmicPreloaderProps {
  label?: string;
  subtitle?: string;
  fullScreen?: boolean;
  size?: "sm" | "md" | "lg";
}

export const CosmicPreloader: React.FC<CosmicPreloaderProps> = ({
  label = "NAMENOLOGY",
  subtitle = "Aligning cosmic harmonics & destiny intelligence...",
  fullScreen = false,
  size = "md",
}) => {
  const sizeClasses = {
    sm: {
      wrapper: "w-16 h-16",
      center: "w-8 h-8 text-xs",
      logo: "text-sm",
    },
    md: {
      wrapper: "w-24 h-24",
      center: "w-12 h-12 text-sm",
      logo: "text-base",
    },
    lg: {
      wrapper: "w-32 h-32",
      center: "w-16 h-16 text-base",
      logo: "text-lg",
    },
  }[size];

  const content = (
    <div className="flex flex-col items-center justify-center p-6 text-center select-none">
      {/* Planetary Orbit Ring Animation */}
      <div className={`relative ${sizeClasses.wrapper} flex items-center justify-center mb-6`}>
        {/* Outer orbital halo */}
        <div className="absolute inset-0 rounded-full border border-blue-400/20 animate-ping opacity-30" />

        {/* Outer rotating dashed celestial ring */}
        <div className="absolute inset-0 rounded-full border border-dashed border-indigo-400/40 animate-[spin_10s_linear_infinite]" />

        {/* Inner rotating gradient arc */}
        <div className="absolute inset-2 rounded-full border-2 border-transparent border-t-blue-600 border-r-indigo-500 animate-[spin_2.5s_cubic-bezier(0.4,0,0.2,1)_infinite]" />

        {/* Reverse rotating counter-arc */}
        <div className="absolute inset-3 rounded-full border-2 border-transparent border-b-purple-500 border-l-cyan-400 animate-[spin_3.5s_linear_infinite_reverse]" />

        {/* Center Glowing Core */}
        <div
          className={`${sizeClasses.center} rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/30 animate-pulse`}
        >
          <Sparkles className="w-5 h-5 animate-spin text-white" />
        </div>
      </div>

      {/* Brand Identity & Status Label */}
      <div className="space-y-1.5 max-w-sm">
        <div className="flex items-center justify-center gap-1">
          <span className="font-extrabold tracking-tight text-blue-600 font-outfit text-sm">
            NAME
          </span>
          <span className="font-extrabold tracking-tight bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent font-outfit text-sm">
            NOLOGY
          </span>
        </div>
        <p className="text-xs font-semibold text-slate-700 tracking-wide">
          {label}
        </p>
        {subtitle && (
          <p className="text-[11px] text-slate-400 leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>

      {/* Cosmic light pulse indicator dots */}
      <div className="flex items-center gap-1.5 mt-4">
        <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-bounce [animation-delay:-0.3s]" />
        <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-bounce [animation-delay:-0.15s]" />
        <span className="w-1.5 h-1.5 rounded-full bg-purple-600 animate-bounce" />
      </div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/85 backdrop-blur-md">
        {content}
      </div>
    );
  }

  return <div className="w-full flex items-center justify-center py-16">{content}</div>;
};
