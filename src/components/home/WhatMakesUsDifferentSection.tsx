"use client";

import React, { useState } from "react";
import { ShieldCheck, Sparkles } from "lucide-react";

/* ═══════════════════════════════════════════════════════════════
   5 COSMIC BLUE-PURPLE-WHITE SVG ILLUSTRATIONS FOR
   "WHY NAMENOLOGY IS DIFFERENT"
   ═══════════════════════════════════════════════════════════════ */

// 1. NAME-BASED ANALYSIS SVG
const NameBasedAnalysisSvg = () => (
  <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
    <svg viewBox="0 0 160 160" className="w-full h-full select-none" fill="none">
      {/* Outer subtle acoustic ripple guide */}
      <circle cx="80" cy="80" r="64" stroke="#EEF2FF" strokeWidth="1" />
      <circle
        cx="80"
        cy="80"
        r="54"
        stroke="#818CF8"
        strokeWidth="0.8"
        strokeDasharray="3 4"
        className="animate-[spin_40s_linear_infinite]"
        style={{ transformOrigin: "80px 80px" }}
      />

      {/* Horizontal Baseline */}
      <line x1="22" y1="80" x2="138" y2="80" stroke="#EEF2FF" strokeWidth="1.2" />

      {/* Name Acoustic Frequency Bars */}
      <g strokeLinecap="round">
        <line x1="44" y1="72" x2="44" y2="88" stroke="#93C5FD" strokeWidth="1.5" />
        <line x1="52" y1="64" x2="52" y2="96" stroke="#60A5FA" strokeWidth="1.5" />
        <line x1="60" y1="52" x2="60" y2="108" stroke="#818CF8" strokeWidth="1.6" />
        <line x1="68" y1="42" x2="68" y2="118" stroke="#4F46E5" strokeWidth="1.8">
          <animate attributeName="y1" values="42;38;42" dur="5s" repeatCount="indefinite" />
          <animate attributeName="y2" values="118;122;118" dur="5s" repeatCount="indefinite" />
        </line>
        <line x1="76" y1="32" x2="76" y2="128" stroke="#7C3AED" strokeWidth="1.8">
          <animate attributeName="y1" values="32;28;32" dur="4s" repeatCount="indefinite" />
          <animate attributeName="y2" values="128;132;128" dur="4s" repeatCount="indefinite" />
        </line>

        {/* Central Vocal Axis */}
        <line x1="84" y1="26" x2="84" y2="134" stroke="#0B5CFF" strokeWidth="2.4" />
        <circle cx="84" cy="26" r="3" fill="#0B5CFF" />
        <circle cx="84" cy="134" r="3" fill="#0B5CFF" />

        <line x1="92" y1="36" x2="92" y2="124" stroke="#7C3AED" strokeWidth="1.8" />
        <line x1="100" y1="48" x2="100" y2="112" stroke="#4F46E5" strokeWidth="1.8" />
        <line x1="108" y1="60" x2="108" y2="100" stroke="#818CF8" strokeWidth="1.6" />
        <line x1="116" y1="70" x2="116" y2="90" stroke="#93C5FD" strokeWidth="1.5" />
      </g>

      {/* Center Anchor Node */}
      <circle cx="80" cy="80" r="7" fill="#FFFFFF" stroke="#0B5CFF" strokeWidth="1.4" />
      <circle cx="80" cy="80" r="2.5" fill="#7C3AED" />
    </svg>
  </div>
);

// 2. NUMBERS & PLANETARY INFLUENCES SVG
const NumbersPlanetarySvg = () => (
  <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
    <svg viewBox="0 0 160 160" className="w-full h-full select-none" fill="none">
      {/* Planetary Orbit Ellipses */}
      <ellipse cx="80" cy="80" rx="64" ry="46" stroke="#EEF2FF" strokeWidth="1" />
      <ellipse
        cx="80"
        cy="80"
        rx="52"
        ry="36"
        stroke="#C7D2FE"
        strokeWidth="0.9"
        strokeDasharray="3 4"
        className="animate-[spin_44s_linear_infinite]"
        style={{ transformOrigin: "80px 80px" }}
      />
      <ellipse
        cx="80"
        cy="80"
        rx="36"
        ry="24"
        stroke="#818CF8"
        strokeWidth="1.1"
        className="animate-[spin_28s_linear_infinite_reverse]"
        style={{ transformOrigin: "80px 80px" }}
      />

      {/* Sun / Core Star */}
      <circle cx="80" cy="80" r="11" fill="#FFFFFF" stroke="#0B5CFF" strokeWidth="1.5" />
      <circle cx="80" cy="80" r="5" fill="#0B5CFF" />

      {/* Orbiting Planet 1 with Number */}
      <g>
        <circle cx="120" cy="62" r="7" fill="#FFFFFF" stroke="#7C3AED" strokeWidth="1.2" />
        <text x="120" y="65" textAnchor="middle" fill="#7C3AED" fontSize="7" fontFamily="monospace" fontWeight="bold">3</text>
        <ellipse cx="120" cy="62" rx="10" ry="3.5" stroke="#A78BFA" strokeWidth="0.8" opacity="0.7" />
      </g>

      {/* Orbiting Planet 2 with Number */}
      <g>
        <circle cx="44" cy="94" r="6" fill="#FFFFFF" stroke="#0B5CFF" strokeWidth="1.2" />
        <text x="44" y="97" textAnchor="middle" fill="#0B5CFF" fontSize="7" fontFamily="monospace" fontWeight="bold">7</text>
      </g>
    </svg>
  </div>
);

// 3. MEANING OF NUMBERS SVG
const MeaningOfNumbersSvg = () => (
  <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
    <svg viewBox="0 0 160 160" className="w-full h-full select-none" fill="none">
      {/* Outer calibrated boundary */}
      <circle cx="80" cy="80" r="64" stroke="#EEF2FF" strokeWidth="1" />

      {/* Hexagonal Interpretation Lattice */}
      <polygon
        points="80,26 122,50 122,102 80,126 38,102 38,50"
        stroke="#4F46E5"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />

      <polygon
        points="80,38 110,56 110,96 80,114 50,96 50,56"
        stroke="#C4B5FD"
        strokeWidth="1"
        strokeDasharray="2 3"
        strokeLinejoin="round"
      />

      {/* Center Number Symbol Node */}
      <circle cx="80" cy="76" r="14" fill="#FFFFFF" stroke="#0B5CFF" strokeWidth="1.4" />
      <text x="80" y="80" textAnchor="middle" fill="#0B5CFF" fontSize="10" fontFamily="monospace" fontWeight="bold">
        #0–9
      </text>

      {/* Tripartite vectors radiating out */}
      <line x1="80" y1="62" x2="80" y2="40" stroke="#0B5CFF" strokeWidth="1.3" strokeDasharray="2 2" />
      <line x1="92" y1="84" x2="114" y2="98" stroke="#7C3AED" strokeWidth="1.3" strokeDasharray="2 2" />
      <line x1="68" y1="84" x2="46" y2="98" stroke="#4F46E5" strokeWidth="1.3" strokeDasharray="2 2" />

      {/* Vector labels */}
      <text x="80" y="36" textAnchor="middle" fill="#0B5CFF" fontSize="6.5" fontFamily="var(--font-sans), sans-serif" fontWeight="bold">MIND</text>
      <text x="124" y="104" textAnchor="middle" fill="#7C3AED" fontSize="6.5" fontFamily="var(--font-sans), sans-serif" fontWeight="bold">LIFE</text>
      <text x="36" y="104" textAnchor="middle" fill="#4F46E5" fontSize="6.5" fontFamily="var(--font-sans), sans-serif" fontWeight="bold">HEALTH</text>
    </svg>
  </div>
);

// 4. STRUCTURED INTERPRETATION SVG
const StructuredInterpretationSvg = () => (
  <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
    <svg viewBox="0 0 160 160" className="w-full h-full select-none" fill="none">
      {/* Outer frame */}
      <circle cx="80" cy="80" r="64" stroke="#EEF2FF" strokeWidth="1" />

      {/* Structured Framework Matrix Blocks */}
      <rect x="36" y="40" width="38" height="24" rx="5" fill="#FFFFFF" stroke="#0B5CFF" strokeWidth="1.2" />
      <text x="55" y="55" textAnchor="middle" fill="#0B5CFF" fontSize="7" fontFamily="var(--font-sans), sans-serif" fontWeight="bold">First Name</text>

      <rect x="86" y="40" width="38" height="24" rx="5" fill="#FFFFFF" stroke="#7C3AED" strokeWidth="1.2" />
      <text x="105" y="55" textAnchor="middle" fill="#7C3AED" fontSize="7" fontFamily="var(--font-sans), sans-serif" fontWeight="bold">Surname</text>

      {/* Downward structured connective arrows */}
      <path d="M 55 64 L 55 80 L 74 96" stroke="#0B5CFF" strokeWidth="1.3" strokeDasharray="2 2" fill="none" />
      <path d="M 105 64 L 105 80 L 86 96" stroke="#7C3AED" strokeWidth="1.3" strokeDasharray="2 2" fill="none" />

      {/* Combined Tier */}
      <rect x="52" y="96" width="56" height="28" rx="6" fill="#FFFFFF" stroke="#4F46E5" strokeWidth="1.4" />
      <text x="80" y="109" textAnchor="middle" fill="#4F46E5" fontSize="7" fontFamily="var(--font-sans), sans-serif" fontWeight="bold">Combined Name</text>
      <text x="80" y="119" textAnchor="middle" fill="#64748B" fontSize="6" fontFamily="var(--font-sans), sans-serif">Defined Principles</text>

      {/* Verified check badge */}
      <circle cx="80" cy="80" r="6" fill="#FFFFFF" stroke="#0B5CFF" strokeWidth="1" />
      <circle cx="80" cy="80" r="2.5" fill="#0B5CFF" />
    </svg>
  </div>
);

// 5. NAME WEIGHTING SYSTEM SVG (40% / 20% / 40%)
const NameWeightingSystemSvg = () => (
  <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
    <svg viewBox="0 0 160 160" className="w-full h-full select-none" fill="none">
      {/* Background isometric datum */}
      <path d="M 80 20 L 138 53 L 80 86 L 22 53 Z" stroke="#E0E7FF" strokeWidth="1" />
      <path d="M 80 53 L 138 86 L 80 119 L 22 86 Z" stroke="#E0E7FF" strokeWidth="1" />

      {/* Floating Tiers of Weighting */}
      {/* Top Tier: First Name (40%) */}
      <path
        d="M 80 32 L 120 54 L 80 76 L 40 54 Z"
        stroke="#0B5CFF"
        strokeWidth="1.5"
        strokeLinejoin="round"
        fill="#FFFFFF"
      />
      <text x="80" y="58" textAnchor="middle" fill="#0B5CFF" fontSize="9" fontFamily="monospace" fontWeight="bold">
        40%
      </text>

      {/* Middle Tier: Surname (20%) */}
      <path
        d="M 80 74 L 114 92 L 80 110 L 46 92 Z"
        stroke="#4F46E5"
        strokeWidth="1.3"
        strokeDasharray="3 2"
        strokeLinejoin="round"
        fill="#FFFFFF"
      />
      <text x="80" y="96" textAnchor="middle" fill="#4F46E5" fontSize="8" fontFamily="monospace" fontWeight="bold">
        20%
      </text>

      {/* Base Tier: Combined Name (40%) */}
      <path
        d="M 80 98 L 122 121 L 80 144 L 38 121 Z"
        stroke="#7C3AED"
        strokeWidth="1.5"
        strokeLinejoin="round"
        fill="#FFFFFF"
      />
      <text x="80" y="125" textAnchor="middle" fill="#7C3AED" fontSize="9" fontFamily="monospace" fontWeight="bold">
        40%
      </text>

      {/* Vertical Axis */}
      <line x1="80" y1="16" x2="80" y2="148" stroke="#0B5CFF" strokeWidth="1.2" strokeDasharray="3 4" opacity="0.6" />
      <circle cx="80" cy="16" r="2.5" fill="#0B5CFF" />
      <circle cx="80" cy="148" r="2.5" fill="#7C3AED" />
    </svg>
  </div>
);

/* ═══════════════════════════════════════════════════════════════
   5 ELEMENTS AS EXPLICITLY REQUESTED BY USER
   ═══════════════════════════════════════════════════════════════ */
const DIFFERENTIATORS = [
  {
    stepNumber: "01",
    id: "name-based-analysis",
    badge: "Name-Based",
    title: "1. Name-Based Analysis",
    description:
      "Namenology uses your first name and surname as the primary source for analysis, without requiring your date, time, or place of birth.",
    svg: <NameBasedAnalysisSvg />,
  },
  {
    stepNumber: "02",
    id: "numbers-planetary-influences",
    badge: "Planetary",
    title: "2. Numbers & Planetary Influences",
    description:
      "Each letter is assigned a number, and each number is associated with the influence and symbolism of a planet.",
    svg: <NumbersPlanetarySvg />,
  },
  {
    stepNumber: "03",
    id: "meaning-of-numbers",
    badge: "Interpretation",
    title: "3. Meaning of Numbers",
    description:
      "Each number has its own distinct characteristics and meaning, used to explore personality, life influences and relationships, and health-related tendencies.",
    svg: <MeaningOfNumbersSvg />,
  },
  {
    stepNumber: "04",
    id: "structured-interpretation",
    badge: "Framework",
    title: "4. Structured Interpretation",
    description:
      "Namenology follows a structured framework, interpreting the numbers from your first name, surname, and combined name according to defined principles.",
    svg: <StructuredInterpretationSvg />,
  },
  {
    stepNumber: "05",
    id: "name-weighting-system",
    badge: "40% / 20% / 40%",
    title: "5. Name Weighting System",
    description:
      "Namenology considers the first name, surname, and combined name at different levels of importance in the overall analysis.",
    svg: <NameWeightingSystemSvg />,
  },
];

export const WhatMakesUsDifferentSection: React.FC = () => {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  return (
    <section
      id="why-different"
      className="py-16 sm:py-24 bg-[#F8FAFF] relative overflow-hidden text-slate-900 border-t border-indigo-50"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* ================================================================= */}
        {/* SECTION HEADER                                                     */}
        {/* ================================================================= */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-purple-200/80 bg-purple-50 text-purple-700 text-xs font-semibold mb-3 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>The Scientific Departure</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-black tracking-tight font-outfit uppercase leading-tight text-slate-900">
            WHY <span className="gradient-text-cosmic-bright">NAMENOLOGY IS DIFFERENT</span>
          </h2>

          <p className="mt-4 text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
            Every name has a unique numerical pattern. Namenology brings letters, numbers, and planetary influences
            together through a structured approach to explore the influences represented by your name.
          </p>
        </div>

        {/* ================================================================= */}
        {/* 5 DIFFERENTIATOR CARDS (3 on Row 1, 2 Centered on Row 2)          */}
        {/* ================================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-5">
          {DIFFERENTIATORS.map((diff, index) => {
            const isHovered = hoveredCard === diff.id;
            const gridColClass =
              index === 3
                ? "md:col-span-2 md:col-start-2"
                : "md:col-span-2";

            return (
              <div
                key={diff.id}
                id={`diff-${diff.id}`}
                onMouseEnter={() => setHoveredCard(diff.id)}
                onMouseLeave={() => setHoveredCard(null)}
                className={`
                  relative rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between
                  border bg-white hover:-translate-y-1.5
                  ${gridColClass}
                  ${
                    isHovered
                      ? "border-purple-300 shadow-xl shadow-purple-500/10"
                      : "border-slate-200/80 shadow-xs"
                  }
                `}
              >
                <div>
                  {/* Top Bar with Badge */}
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 border border-blue-200/80 px-2.5 py-0.5 rounded">
                      {diff.badge}
                    </span>
                    <span className="font-mono text-[10px] text-purple-600 font-semibold">
                      #{diff.stepNumber}
                    </span>
                  </div>

                  {/* SVG Graphic */}
                  <div className="my-2 flex items-center justify-center">
                    {diff.svg}
                  </div>

                  {/* Title */}
                  <h3 className="font-outfit font-bold text-base text-slate-900 text-center mt-3 mb-2 tracking-tight">
                    {diff.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs text-slate-600 leading-relaxed text-center font-normal">
                    {diff.description}
                  </p>
                </div>

                {/* Bottom subtle accent line */}
                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-center">
                  <div
                    className={`
                      h-0.5 rounded-full transition-all duration-500
                      ${isHovered ? "w-12 bg-gradient-to-r from-blue-600 to-purple-600" : "w-6 bg-slate-200"}
                    `}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* ================================================================= */}
        {/* BOTTOM SCIENTIFIC OATH BANNER                                     */}
        {/* ================================================================= */}
        <div className="mt-12 sm:mt-16 p-7 sm:p-8 rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-950 text-white relative shadow-xl max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left max-w-2xl">
              <span className="text-[11px] font-bold text-cyan-300 tracking-widest uppercase">
                Structured Name-Based Analysis
              </span>
              <h4 className="text-lg sm:text-xl font-bold font-outfit tracking-tight text-white">
                Letters, Numbers & Planetary Influences in Harmony
              </h4>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-normal">
                Together, these five elements create a structured name-based analysis that combines letters, numbers,
                and planetary influences, with the{" "}
                <strong className="text-white font-semibold">
                  first name weighted at 40%, the surname at 20%, and the combined name at 40%
                </strong>
                . These five elements distinguish Namenology from many Numerology approaches used today.
              </p>
            </div>

            <div className="flex items-center gap-4 shrink-0">
              <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-cyan-300 shadow-inner">
                <ShieldCheck className="w-6 h-6" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
