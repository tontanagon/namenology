"use client";

import React from "react";

interface ScoreGaugeProps {
  score: number;
  maxScore?: number;
  size?: "sm" | "md" | "lg";
  title?: string;
  category?: string;
  showCategoryBadge?: boolean;
}

export function ScoreGauge({
  score,
  maxScore = 100,
  size = "lg",
  title = "Harmonic Resonance",
  category,
  showCategoryBadge = true,
}: ScoreGaugeProps) {
  const percentage = Math.min(100, Math.max(0, (score / maxScore) * 100));

  // Determine size dimensions
  const dimensions = {
    sm: { width: 140, radius: 52, stroke: 8, fontSize: "text-2xl" },
    md: { width: 190, radius: 72, stroke: 10, fontSize: "text-4xl" },
    lg: { width: 240, radius: 92, stroke: 12, fontSize: "text-5xl" },
  }[size];

  const circumference = 2 * Math.PI * dimensions.radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  // Determine scientific color scheme based on score
  let strokeGradientId = "gauge-blue";
  let textColorClass = "text-brand-500";
  let glowColor = "rgba(11, 92, 255, 0.15)";
  let defaultCategory = "Auspicious Synergy";
  let categoryBg = "bg-brand-50 text-brand-600 border-brand-200";

  if (score >= 85) {
    strokeGradientId = "gauge-gold";
    textColorClass = "text-brand-500";
    glowColor = "rgba(11, 92, 255, 0.2)";
    defaultCategory = "Highly Auspicious";
    categoryBg = "bg-brand-50 text-brand-600 border-brand-200";
  } else if (score >= 65) {
    strokeGradientId = "gauge-blue";
    textColorClass = "text-brand-500";
    glowColor = "rgba(11, 92, 255, 0.15)";
    defaultCategory = "Harmonious & Auspicious";
    categoryBg = "bg-indigo-50 text-indigo-600 border-indigo-200";
  } else if (score >= 50) {
    strokeGradientId = "gauge-indigo";
    textColorClass = "text-indigo-600";
    glowColor = "rgba(79, 70, 229, 0.15)";
    defaultCategory = "Moderate Alignment";
    categoryBg = "bg-slate-50 text-slate-600 border-slate-200";
  } else {
    strokeGradientId = "gauge-amber";
    textColorClass = "text-rose-500";
    glowColor = "rgba(244, 63, 94, 0.15)";
    defaultCategory = "Adjustment Recommended";
    categoryBg = "bg-rose-50 text-rose-600 border-rose-200";
  }

  const resolvedCategory = category || defaultCategory;

  return (
    <div className="flex flex-col items-center justify-center text-center p-4">
      {/* SVG Circular Gauge */}
      <div
        className="relative flex items-center justify-center transition-all duration-700"
        style={{
          filter: `drop-shadow(0 0 20px ${glowColor})`,
        }}
      >
        <svg
          width={dimensions.width}
          height={dimensions.width}
          viewBox={`0 0 ${dimensions.width} ${dimensions.width}`}
          className="transform -rotate-90"
        >
          {/* Gradient Definitions — Scientific Blue Theme */}
          <defs>
            <linearGradient id="gauge-blue" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0B5CFF" />
              <stop offset="100%" stopColor="#4F46E5" />
            </linearGradient>
            <linearGradient id="gauge-gold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0B5CFF" />
              <stop offset="50%" stopColor="#4F46E5" />
              <stop offset="100%" stopColor="#7C3AED" />
            </linearGradient>
            <linearGradient id="gauge-indigo" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4F46E5" />
              <stop offset="100%" stopColor="#7C3AED" />
            </linearGradient>
            <linearGradient id="gauge-amber" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FB7185" />
              <stop offset="100%" stopColor="#E11D48" />
            </linearGradient>
          </defs>

          {/* Background Track — Subtle Scientific Grid Pattern */}
          <circle
            cx={dimensions.width / 2}
            cy={dimensions.width / 2}
            r={dimensions.radius}
            fill="transparent"
            stroke="currentColor"
            strokeWidth={dimensions.stroke}
            strokeDasharray="3 5"
            className="text-slate-100"
          />

          {/* Progress Arc */}
          <circle
            cx={dimensions.width / 2}
            cy={dimensions.width / 2}
            r={dimensions.radius}
            fill="transparent"
            stroke={`url(#${strokeGradientId})`}
            strokeWidth={dimensions.stroke}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Center Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none">
          <div className="flex items-baseline">
            <span className={`font-black tracking-tighter ${dimensions.fontSize} ${textColorClass}`}>
              {Math.round(score)}
            </span>
            <span className="text-xs font-semibold text-muted-foreground ml-1">/100</span>
          </div>
          <span className="text-[11px] font-medium tracking-wide uppercase text-muted-foreground mt-0.5">
            {title}
          </span>
        </div>
      </div>

      {/* Category Indicator Badge */}
      {showCategoryBadge && (
        <div className="mt-4 flex items-center justify-center">
          <div
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${categoryBg}`}
          >
            <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none">
              <circle cx="6" cy="6" r="2" fill="currentColor" />
              <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="0.8" opacity="0.4" />
            </svg>
            <span>{resolvedCategory}</span>
          </div>
        </div>
      )}
    </div>
  );
}
