"use client";

import React, { useState } from "react";
import { Sparkles } from "lucide-react";

/* ═══════════════════════════════════════════════════════════════
   BRIGHT BLUE-PURPLE-WHITE SOLAR SYSTEM NEBULA SVG ILLUSTRATIONS
   ═══════════════════════════════════════════════════════════════ */

// 1. VIBRATIONAL SCIENCE SVG (Bright)
const VibrationalScienceSvg = () => (
  <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
    <svg viewBox="0 0 120 120" className="w-full h-full" fill="none">
      {/* Outer subtle boundary */}
      <circle cx="60" cy="60" r="52" stroke="#E0E7FF" strokeWidth="1" />

      {/* Orbiting ring */}
      <circle
        cx="60"
        cy="60"
        r="42"
        stroke="#818CF8"
        strokeWidth="1"
        strokeDasharray="3 4"
        opacity="0.5"
        className="animate-[spin_36s_linear_infinite]"
        style={{ transformOrigin: "60px 60px" }}
      />

      {/* Sound wave pattern */}
      <g strokeLinecap="round">
        <line x1="30" y1="54" x2="30" y2="66" stroke="#93C5FD" strokeWidth="1.4" />
        <line x1="38" y1="46" x2="38" y2="74" stroke="#60A5FA" strokeWidth="1.4" />
        <line x1="46" y1="36" x2="46" y2="84" stroke="#4F46E5" strokeWidth="1.5">
          <animate attributeName="y1" values="36;32;36" dur="4s" repeatCount="indefinite" />
          <animate attributeName="y2" values="84;88;84" dur="4s" repeatCount="indefinite" />
        </line>
        <line x1="54" y1="28" x2="54" y2="92" stroke="#7C3AED" strokeWidth="1.6">
          <animate attributeName="y1" values="28;24;28" dur="3.5s" repeatCount="indefinite" />
          <animate attributeName="y2" values="92;96;92" dur="3.5s" repeatCount="indefinite" />
        </line>
        <line x1="60" y1="22" x2="60" y2="98" stroke="#0B5CFF" strokeWidth="2">
          <animate attributeName="y1" values="22;18;22" dur="4.5s" repeatCount="indefinite" />
          <animate attributeName="y2" values="98;102;98" dur="4.5s" repeatCount="indefinite" />
        </line>
        <line x1="66" y1="28" x2="66" y2="92" stroke="#7C3AED" strokeWidth="1.6">
          <animate attributeName="y1" values="28;24;28" dur="3.5s" repeatCount="indefinite" />
          <animate attributeName="y2" values="92;96;92" dur="3.5s" repeatCount="indefinite" />
        </line>
        <line x1="74" y1="36" x2="74" y2="84" stroke="#4F46E5" strokeWidth="1.5">
          <animate attributeName="y1" values="36;32;36" dur="4s" repeatCount="indefinite" />
          <animate attributeName="y2" values="84;88;84" dur="4s" repeatCount="indefinite" />
        </line>
        <line x1="82" y1="46" x2="82" y2="74" stroke="#60A5FA" strokeWidth="1.4" />
        <line x1="90" y1="54" x2="90" y2="66" stroke="#93C5FD" strokeWidth="1.4" />
      </g>

      {/* Center node */}
      <circle cx="60" cy="60" r="5" fill="#FFFFFF" stroke="#0B5CFF" strokeWidth="1.5" />
      <circle cx="60" cy="60" r="2" fill="#7C3AED" />
    </svg>
  </div>
);

// 2. MATHEMATICAL FORMULA SVG (Bright)
const MathFormulaRvg = () => (
  <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
    <svg viewBox="0 0 120 120" className="w-full h-full" fill="none">
      {/* Outer boundary */}
      <circle cx="60" cy="60" r="52" stroke="#E0E7FF" strokeWidth="1" />

      {/* Hexagonal matrix */}
      <polygon
        points="60,16 100,36 100,76 60,96 20,76 20,36"
        stroke="#4F46E5"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      <polygon
        points="60,28 90,44 90,68 60,84 30,68 30,44"
        stroke="#A5B4FC"
        strokeWidth="1"
        strokeDasharray="2 3"
        strokeLinejoin="round"
      />

      {/* Scanning radial */}
      <line x1="60" y1="60" x2="100" y2="36" stroke="#0B5CFF" strokeWidth="1.3" strokeLinecap="round">
        <animateTransform
          attributeName="transform"
          type="rotate"
          from="0 60 60"
          to="360 60 60"
          dur="20s"
          repeatCount="indefinite"
        />
      </line>

      {/* Number nodes at vertices */}
      <text x="60" y="13" textAnchor="middle" fill="#0B5CFF" fontSize="7" fontFamily="monospace" fontWeight="bold">1</text>
      <text x="105" y="36" textAnchor="start" fill="#4F46E5" fontSize="7" fontFamily="monospace" fontWeight="bold">9</text>
      <text x="105" y="80" textAnchor="start" fill="#7C3AED" fontSize="7" fontFamily="monospace" fontWeight="bold">7</text>
      <text x="60" y="106" textAnchor="middle" fill="#0B5CFF" fontSize="7" fontFamily="monospace" fontWeight="bold">3</text>
      <text x="10" y="80" textAnchor="start" fill="#7C3AED" fontSize="7" fontFamily="monospace" fontWeight="bold">11</text>
      <text x="10" y="36" textAnchor="start" fill="#4F46E5" fontSize="7" fontFamily="monospace" fontWeight="bold">22</text>

      {/* Center node */}
      <circle cx="60" cy="60" r="10" fill="#FFFFFF" stroke="#0B5CFF" strokeWidth="1.3" />
      <text x="60" y="63" textAnchor="middle" fill="#0B5CFF" fontSize="8" fontFamily="monospace" fontWeight="bold">Σ</text>
    </svg>
  </div>
);

// 3. PHONETIC RESONANCE SVG (Bright)
const PhoneticResonanceSvg = () => (
  <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
    <svg viewBox="0 0 120 120" className="w-full h-full" fill="none">
      {/* Expanding acoustic ripple rings */}
      <circle cx="60" cy="60" r="50" stroke="#EEF2FF" strokeWidth="1" />
      <circle cx="60" cy="60" r="42" stroke="#C7D2FE" strokeWidth="0.8" strokeDasharray="2 3" />
      <circle cx="60" cy="60" r="34" stroke="#818CF8" strokeWidth="1" />
      <circle cx="60" cy="60" r="26" stroke="#4F46E5" strokeWidth="1" strokeDasharray="3 2" />
      <circle cx="60" cy="60" r="18" stroke="#0B5CFF" strokeWidth="1.3" />

      {/* Rotating resonance axis */}
      <g
        className="animate-[spin_24s_linear_infinite]"
        style={{ transformOrigin: "60px 60px" }}
      >
        <circle cx="60" cy="18" r="3" fill="#7C3AED" />
        <circle cx="60" cy="18" r="6" stroke="#7C3AED" strokeWidth="0.8" opacity="0.4" />
      </g>

      {/* Letter-to-frequency conversion markers */}
      <text x="60" y="47" textAnchor="middle" fill="#0B5CFF" fontSize="8" fontFamily="sans-serif" fontWeight="700">A</text>
      <text x="60" y="58" textAnchor="middle" fill="#7C3AED" fontSize="5" fontFamily="monospace" fontWeight="600">→ Hz</text>

      {/* Center acoustic core */}
      <circle cx="60" cy="66" r="6" fill="#FFFFFF" stroke="#0B5CFF" strokeWidth="1.3" />
      <circle cx="60" cy="66" r="2.5" fill="#7C3AED" />
    </svg>
  </div>
);

// 4. DESTINY MAPPING SVG (Bright)
const DestinyMappingSvg = () => (
  <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
    <svg viewBox="0 0 120 120" className="w-full h-full" fill="none">
      {/* Compass outer ring */}
      <circle cx="60" cy="60" r="50" stroke="#4F46E5" strokeWidth="1.2" opacity="0.6" />
      <circle cx="60" cy="60" r="42" stroke="#A5B4FC" strokeWidth="1" strokeDasharray="2 4" />

      {/* Cardinal ticks */}
      <line x1="60" y1="10" x2="60" y2="18" stroke="#0B5CFF" strokeWidth="1.4" strokeLinecap="round" />
      <line x1="60" y1="102" x2="60" y2="110" stroke="#4F46E5" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="10" y1="60" x2="18" y2="60" stroke="#4F46E5" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="102" y1="60" x2="110" y2="60" stroke="#4F46E5" strokeWidth="1.2" strokeLinecap="round" />

      {/* North star */}
      <path d="M 60 6 L 62 12 L 68 12 L 63 15 L 65 21 L 60 17 L 55 21 L 57 15 L 52 12 L 58 12 Z" fill="#0B5CFF" />

      {/* Compass needle with oscillation */}
      <g>
        <animateTransform
          attributeName="transform"
          type="rotate"
          values="-4 60 60; 4 60 60; -4 60 60"
          dur="6s"
          repeatCount="indefinite"
        />
        <polygon points="60,22 64,56 60,62 56,56" stroke="#0B5CFF" strokeWidth="1" fill="#0B5CFF" />
        <polygon points="60,98 64,64 60,58 56,64" stroke="#7C3AED" strokeWidth="1" fill="#EDE9FE" />
      </g>

      {/* Pivot center */}
      <circle cx="60" cy="60" r="5" fill="#FFFFFF" stroke="#0B5CFF" strokeWidth="1.3" />
      <circle cx="60" cy="60" r="2" fill="#7C3AED" />
    </svg>
  </div>
);

// 5. UNICODE INTELLIGENCE SVG (Bright)
const UnicodeIntelligenceSvg = () => (
  <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
    <svg viewBox="0 0 120 120" className="w-full h-full" fill="none">
      {/* Background datum */}
      <line x1="12" y1="60" x2="108" y2="60" stroke="#EEF2FF" strokeWidth="1" />
      <line x1="60" y1="12" x2="60" y2="108" stroke="#EEF2FF" strokeWidth="1" />

      {/* Conversion prism center */}
      <circle cx="60" cy="60" r="14" stroke="#0B5CFF" strokeWidth="1.3" fill="#FFFFFF" />
      <circle cx="60" cy="60" r="20" stroke="#C7D2FE" strokeWidth="0.8" strokeDasharray="2 3" />
      <polygon points="60,52 67,64 53,64" stroke="#7C3AED" strokeWidth="1.3" fill="none" />

      {/* Left: Unicode characters */}
      <rect x="14" y="28" width="22" height="18" rx="5" stroke="#4F46E5" strokeWidth="1.2" fill="#FFFFFF" />
      <text x="25" y="40" textAnchor="middle" fill="#0B5CFF" fontSize="8" fontFamily="sans-serif" fontWeight="700">あ</text>

      <rect x="14" y="52" width="22" height="18" rx="5" stroke="#CBD5E1" strokeWidth="1" fill="#FFFFFF" />
      <text x="25" y="64" textAnchor="middle" fill="#64748B" fontSize="8" fontFamily="sans-serif" fontWeight="600">ก</text>

      <rect x="14" y="76" width="22" height="18" rx="5" stroke="#CBD5E1" strokeWidth="1" fill="#FFFFFF" />
      <text x="25" y="88" textAnchor="middle" fill="#64748B" fontSize="8" fontFamily="sans-serif" fontWeight="600">A</text>

      {/* Right: Numerical outputs */}
      <rect x="84" y="28" width="22" height="18" rx="5" stroke="#7C3AED" strokeWidth="1.2" fill="#FFFFFF" />
      <text x="95" y="40" textAnchor="middle" fill="#7C3AED" fontSize="8" fontFamily="monospace" fontWeight="700">7</text>

      <rect x="84" y="52" width="22" height="18" rx="5" stroke="#C7D2FE" strokeWidth="1" fill="#FFFFFF" />
      <text x="95" y="64" textAnchor="middle" fill="#4F46E5" fontSize="8" fontFamily="monospace" fontWeight="600">3</text>

      <rect x="84" y="76" width="22" height="18" rx="5" stroke="#C7D2FE" strokeWidth="1" fill="#FFFFFF" />
      <text x="95" y="88" textAnchor="middle" fill="#4F46E5" fontSize="8" fontFamily="monospace" fontWeight="600">1</text>

      {/* Connection hairlines */}
      <path d="M 36 37 L 46 56" stroke="#A5B4FC" strokeWidth="0.8" strokeDasharray="2 2" />
      <path d="M 36 61 L 46 60" stroke="#A5B4FC" strokeWidth="0.8" strokeDasharray="2 2" />
      <path d="M 36 85 L 46 64" stroke="#A5B4FC" strokeWidth="0.8" strokeDasharray="2 2" />
      <path d="M 74 56 L 84 37" stroke="#A5B4FC" strokeWidth="0.8" strokeDasharray="2 2" />
      <path d="M 74 60 L 84 61" stroke="#A5B4FC" strokeWidth="0.8" strokeDasharray="2 2" />
      <path d="M 74 64 L 84 85" stroke="#A5B4FC" strokeWidth="0.8" strokeDasharray="2 2" />

      {/* Center conversion dot */}
      <circle cx="60" cy="60" r="2.5" fill="#7C3AED" />
    </svg>
  </div>
);

// 6. ACTIONABLE INSIGHTS SVG (Bright)
const ActionableInsightsSvg = () => (
  <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
    <svg viewBox="0 0 120 120" className="w-full h-full" fill="none">
      {/* Background grid */}
      <circle cx="60" cy="60" r="50" stroke="#EEF2FF" strokeWidth="1" />

      {/* Ascending data chart */}
      <polyline
        points="20,90 35,78 48,82 60,58 72,62 85,40 100,28"
        stroke="#4F46E5"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <polygon
        points="20,90 35,78 48,82 60,58 72,62 85,40 100,28 100,96 20,96"
        fill="url(#bright-insight-grad)"
        opacity="0.15"
      />

      {/* Data node points */}
      <circle cx="35" cy="78" r="2.5" fill="#0B5CFF" />
      <circle cx="60" cy="58" r="3" fill="#4F46E5" />
      <circle cx="85" cy="40" r="3" fill="#7C3AED" />
      <circle cx="100" cy="28" r="4" fill="#FFFFFF" stroke="#0B5CFF" strokeWidth="1.5" />

      {/* Target horizon indicator */}
      <line x1="20" y1="28" x2="94" y2="28" stroke="#0B5CFF" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.6" />

      <defs>
        <linearGradient id="bright-insight-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0B5CFF" />
          <stop offset="100%" stopColor="#7C3AED" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  </div>
);

/* ═══════════════════════════════════════════════════════════════
   6 SUB-HEADS FOR "WHAT IS NAMENOLOGY"
   ═══════════════════════════════════════════════════════════════ */
const FEATURES = [
  {
    id: "vibrational-science",
    title: "Vibrational Science",
    description:
      "Every name carries a unique acoustic frequency. Namenology decodes the vibrational signature of your official name to reveal the energetic blueprint that shapes your life path.",
    svg: <VibrationalScienceSvg />,
  },
  {
    id: "mathematical-precision",
    title: "Mathematical Precision",
    description:
      "Powered by deterministic algorithms and a closed library of 100 archetypes. Every calculation follows rigorous mathematical constants rooted in ancient Chaldean harmonics.",
    svg: <MathFormulaRvg />,
  },
  {
    id: "phonetic-resonance",
    title: "Phonetic Resonance",
    description:
      "Each letter in your name is mapped to a specific frequency weight. We analyze the acoustic harmony between vowels, consonants, and their combined phonetic resonance.",
    svg: <PhoneticResonanceSvg />,
  },
  {
    id: "destiny-mapping",
    title: "Destiny Mapping",
    description:
      "Translate compound sums and root vibrations into actionable life vectors — revealing career resonance, innate strengths, health insights, and holistic trajectory alignment.",
    svg: <DestinyMappingSvg />,
  },
  {
    id: "unicode-intelligence",
    title: "Unicode Intelligence",
    description:
      "Global character support via Unicode NFC normalization. Whether your name is in English, Thai, Japanese, Arabic, or any script — the same deterministic engine applies universally.",
    svg: <UnicodeIntelligenceSvg />,
  },
  {
    id: "actionable-insights",
    title: "Actionable Insights",
    description:
      "No vague fortune-telling. Receive structured, data-driven dossiers with clear metrics on personality, career paths, relationships, and life optimization strategies.",
    svg: <ActionableInsightsSvg />,
  },
];

export const WhatIsNamenologySection: React.FC = () => {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  return (
    <section
      id="what-is-namenology"
      className="py-20 sm:py-28 bg-[#F8FAFF] relative overflow-hidden text-slate-900 border-t border-indigo-50"
    >
      {/* Background ethereal bright glowing nebulae */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-purple-500/[0.04] rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-blue-500/[0.04] rounded-full blur-[100px] pointer-events-none" />

      {/* Subtle orbital lines decoration */}
      <svg
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] pointer-events-none select-none opacity-40"
        viewBox="0 0 700 700"
        fill="none"
      >
        <circle cx="350" cy="350" r="340" stroke="#E0E7FF" strokeWidth="1" />
        <circle cx="350" cy="350" r="260" stroke="#C7D2FE" strokeWidth="0.8" strokeDasharray="4 6" />
        <circle cx="350" cy="350" r="180" stroke="#DDD6FE" strokeWidth="0.6" />
      </svg>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* ================================================================= */}
        {/* SECTION HEADER                                                     */}
        {/* ================================================================= */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-purple-200/80 bg-purple-50 text-purple-700 text-xs font-semibold mb-3 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>The Science of Name</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black tracking-tight font-outfit uppercase leading-tight text-slate-900">
            WHAT IS{" "}
            <span className="gradient-text-cosmic-bright">
              NAMENOLOGY
            </span>
          </h2>

          <p className="mt-4 text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Namenology is the modern science of name analysis — a systematic approach that decodes
            the vibrational energy, mathematical harmonics, and phonetic intelligence embedded within
            every human name.
          </p>
        </div>

        {/* ================================================================= */}
        {/* 6 FEATURE CARDS GRID (3×2)                                        */}
        {/* ================================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
          {FEATURES.map((feature) => {
            const isHovered = hoveredCard === feature.id;
            return (
              <div
                key={feature.id}
                id={`feature-${feature.id}`}
                onMouseEnter={() => setHoveredCard(feature.id)}
                onMouseLeave={() => setHoveredCard(null)}
                className={`
                  relative rounded-2xl p-7 sm:p-8
                  transition-all duration-300 flex flex-col
                  border bg-white
                  hover:-translate-y-1.5
                  ${
                    isHovered
                      ? "border-purple-300 shadow-xl shadow-indigo-500/10"
                      : "border-slate-200/80 shadow-xs"
                  }
                `}
              >
                {/* SVG Graphic */}
                <div className="mb-6 flex items-center justify-center">
                  {feature.svg}
                </div>

                {/* Sub-head Title */}
                <h3 className="font-outfit font-bold text-xl text-slate-900 text-center mb-2.5 tracking-tight group-hover:text-blue-600 transition-colors">
                  {feature.title}
                </h3>

                {/* Sub-head Description */}
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed text-center flex-1">
                  {feature.description}
                </p>

                {/* Bottom subtle accent line */}
                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-center">
                  <div
                    className={`
                      h-0.5 rounded-full transition-all duration-500
                      ${isHovered ? "w-16 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600" : "w-8 bg-slate-200"}
                    `}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
