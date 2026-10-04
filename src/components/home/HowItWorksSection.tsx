"use client";

import React, { useState } from "react";
import { CheckCircle2, Workflow, Sparkles, Orbit } from "lucide-react";

/* ═══════════════════════════════════════════════════════════════
   BRIGHT BLUE-PURPLE-WHITE SOLAR SYSTEM NEBULA SVG ILLUSTRATIONS
   ═══════════════════════════════════════════════════════════════ */

// 1. COSMIC STRUCTURE SVG (Bright)
const CosmicStructureSvg = () => (
  <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
    <svg viewBox="0 0 160 160" className="w-full h-full" fill="none">
      {/* Outer subtle orbital boundary guide */}
      <circle cx="80" cy="80" r="66" stroke="#E0E7FF" strokeWidth="1" />

      {/* Secondary orbital ring — smooth rotation */}
      <circle
        cx="80"
        cy="80"
        r="54"
        stroke="#818CF8"
        strokeWidth="1"
        strokeDasharray="3 4"
        opacity="0.6"
        className="animate-[spin_36s_linear_infinite]"
        style={{ transformOrigin: "80px 80px" }}
      />

      {/* Sacred geometry lattice hairlines */}
      <polygon
        points="80,34 118,102 42,102"
        stroke="#93C5FD"
        strokeWidth="1"
        strokeLinejoin="round"
      />
      <polygon
        points="80,126 118,58 42,58"
        stroke="#C4B5FD"
        strokeWidth="1"
        strokeLinejoin="round"
      />

      {/* Core orbital ring */}
      <circle cx="80" cy="80" r="38" stroke="#0B5CFF" strokeWidth="1.3" />

      {/* Concentric fine inner ring */}
      <circle cx="80" cy="80" r="22" stroke="#7C3AED" strokeWidth="1" strokeDasharray="2 3" opacity="0.6" />

      {/* Axial alignment markers */}
      <line x1="80" y1="14" x2="80" y2="24" stroke="#4F46E5" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="80" y1="136" x2="80" y2="146" stroke="#4F46E5" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="14" y1="80" x2="24" y2="80" stroke="#4F46E5" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="136" y1="80" x2="146" y2="80" stroke="#4F46E5" strokeWidth="1.2" strokeLinecap="round" />

      {/* Blue Orbiting Satellite Node */}
      <g
        className="animate-[spin_24s_linear_infinite]"
        style={{ transformOrigin: "80px 80px" }}
      >
        <circle cx="80" cy="26" r="3" fill="#0B5CFF" />
        <circle cx="80" cy="26" r="6" stroke="#0B5CFF" strokeWidth="0.8" opacity="0.4" />
      </g>

      {/* Purple Orbiting Satellite Node */}
      <g
        className="animate-[spin_30s_linear_infinite_reverse]"
        style={{ transformOrigin: "80px 80px" }}
      >
        <circle cx="80" cy="134" r="2.5" fill="#7C3AED" />
      </g>

      {/* Center minimal focal node */}
      <circle cx="80" cy="80" r="6" fill="#FFFFFF" stroke="#0B5CFF" strokeWidth="1.4" />
      <circle cx="80" cy="80" r="2.5" fill="#7C3AED" />
    </svg>
  </div>
);

// 2. COSMIC CODE SVG (Bright)
const CosmicCodeSvg = () => (
  <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
    <svg viewBox="0 0 160 160" className="w-full h-full" fill="none">
      {/* Outer calibrated boundary circle */}
      <circle cx="80" cy="80" r="64" stroke="#EEF2FF" strokeWidth="1" />

      {/* Rotating calibration ring with tick marks */}
      <g
        className="animate-[spin_40s_linear_infinite]"
        style={{ transformOrigin: "80px 80px" }}
      >
        <circle cx="80" cy="80" r="54" stroke="#A5B4FC" strokeWidth="1" strokeDasharray="1 7" />
        <circle cx="80" cy="80" r="50" stroke="#E0E7FF" strokeWidth="0.8" />
      </g>

      {/* Main Hexagon Matrix */}
      <polygon
        points="80,30 119,52 119,98 80,120 41,98 41,52"
        stroke="#4F46E5"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />

      {/* Subtle Inner Dashed Hexagon */}
      <polygon
        points="80,42 108,58 108,92 80,108 52,92 52,58"
        stroke="#C4B5FD"
        strokeWidth="1"
        strokeDasharray="2 3"
        strokeLinejoin="round"
      />

      {/* Numerology Glyphs */}
      <text x="80" y="24" textAnchor="middle" fill="#0B5CFF" fontSize="9" fontFamily="monospace" fontWeight="bold">1</text>
      <text x="128" y="52" textAnchor="middle" fill="#4F46E5" fontSize="9" fontFamily="monospace" fontWeight="bold">3</text>
      <text x="128" y="104" textAnchor="middle" fill="#7C3AED" fontSize="9" fontFamily="monospace" fontWeight="bold">7</text>
      <text x="80" y="138" textAnchor="middle" fill="#0B5CFF" fontSize="9" fontFamily="monospace" fontWeight="bold">9</text>
      <text x="32" y="104" textAnchor="middle" fill="#7C3AED" fontSize="9" fontFamily="monospace" fontWeight="bold">11</text>
      <text x="32" y="52" textAnchor="middle" fill="#4F46E5" fontSize="9" fontFamily="monospace" fontWeight="bold">22</text>

      {/* Scanning Radial Hairline */}
      <line x1="80" y1="80" x2="119" y2="52" stroke="#0B5CFF" strokeWidth="1.3" strokeLinecap="round">
        <animateTransform
          attributeName="transform"
          type="rotate"
          from="0 80 80"
          to="360 80 80"
          dur="24s"
          repeatCount="indefinite"
        />
      </line>

      {/* Center Number Node: 100 Archetypes */}
      <circle cx="80" cy="80" r="14" fill="#FFFFFF" stroke="#0B5CFF" strokeWidth="1.3" />
      <text
        x="80"
        y="83"
        textAnchor="middle"
        fill="#0B5CFF"
        fontSize="9"
        fontFamily="monospace"
        fontWeight="bold"
      >
        100
      </text>
    </svg>
  </div>
);

// 3. LETTER CONVERSION SVG (Bright)
const LetterConversionSvg = () => (
  <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
    <svg viewBox="0 0 160 160" className="w-full h-full" fill="none">
      {/* Background alignment datum lines */}
      <line x1="16" y1="80" x2="144" y2="80" stroke="#EEF2FF" strokeWidth="1" />
      <line x1="80" y1="16" x2="80" y2="144" stroke="#EEF2FF" strokeWidth="1" />

      {/* Connecting Hairlines from Letter to Number */}
      <path
        d="M 46 54 L 80 80 L 114 54"
        stroke="#A5B4FC"
        strokeWidth="1"
        strokeDasharray="2 3"
        fill="none"
      />
      <path
        d="M 46 80 L 114 80"
        stroke="#DDD6FE"
        strokeWidth="1"
        fill="none"
      />
      <path
        d="M 46 106 L 80 80 L 114 106"
        stroke="#A5B4FC"
        strokeWidth="1"
        strokeDasharray="2 3"
        fill="none"
      />

      {/* Center Geometric Conversion Prism */}
      <circle cx="80" cy="80" r="16" stroke="#0B5CFF" strokeWidth="1.3" fill="#FFFFFF" />
      <circle cx="80" cy="80" r="22" stroke="#C7D2FE" strokeWidth="0.8" strokeDasharray="2 3" />
      <polygon points="80,72 87,84 73,84" stroke="#7C3AED" strokeWidth="1.3" fill="none" />
      <circle cx="80" cy="80" r="2.5" fill="#7C3AED" />

      {/* Left Column: Letterform */}
      <g>
        <rect x="22" y="42" width="24" height="24" rx="6" stroke="#4F46E5" strokeWidth="1.3" fill="#FFFFFF" />
        <text x="34" y="58" textAnchor="middle" fill="#0B5CFF" fontSize="11" fontFamily="sans-serif" fontWeight="700">A</text>

        <rect x="22" y="68" width="24" height="24" rx="6" stroke="#CBD5E1" strokeWidth="1" fill="#FFFFFF" />
        <text x="34" y="84" textAnchor="middle" fill="#64748B" fontSize="10" fontFamily="sans-serif" fontWeight="600">L</text>

        <rect x="22" y="94" width="24" height="24" rx="6" stroke="#CBD5E1" strokeWidth="1" fill="#FFFFFF" />
        <text x="34" y="110" textAnchor="middle" fill="#64748B" fontSize="10" fontFamily="sans-serif" fontWeight="600">X</text>
      </g>

      {/* Right Column: Numbers */}
      <g>
        <rect x="114" y="42" width="24" height="24" rx="6" stroke="#7C3AED" strokeWidth="1.3" fill="#FFFFFF" />
        <text x="126" y="58" textAnchor="middle" fill="#7C3AED" fontSize="11" fontFamily="monospace" fontWeight="700">1</text>

        <rect x="114" y="68" width="24" height="24" rx="6" stroke="#C7D2FE" strokeWidth="1" fill="#FFFFFF" />
        <text x="126" y="84" textAnchor="middle" fill="#4F46E5" fontSize="10" fontFamily="monospace" fontWeight="600">3</text>

        <rect x="114" y="94" width="24" height="24" rx="6" stroke="#C7D2FE" strokeWidth="1" fill="#FFFFFF" />
        <text x="126" y="110" textAnchor="middle" fill="#4F46E5" fontSize="10" fontFamily="monospace" fontWeight="600">5</text>
      </g>
    </svg>
  </div>
);

// 4. NAME ANALYSIS SVG (Bright)
const NameAnalysisSvg = () => (
  <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
    <svg viewBox="0 0 160 160" className="w-full h-full" fill="none">
      {/* Background coordinate grid */}
      <line x1="20" y1="80" x2="140" y2="80" stroke="#EEF2FF" strokeWidth="1" />
      <line x1="80" y1="26" x2="80" y2="134" stroke="#EEF2FF" strokeWidth="1" strokeDasharray="3 3" />
      <circle cx="80" cy="80" r="54" stroke="#EEF2FF" strokeWidth="1" />

      {/* Wave 1: First Name (40% Weight - Blue) */}
      <path
        d="M 22 80 C 42 46, 58 46, 80 80 C 102 114, 118 114, 138 80"
        stroke="#0B5CFF"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      >
        <animate
          attributeName="d"
          values="M 22 80 C 42 46, 58 46, 80 80 C 102 114, 118 114, 138 80; M 22 80 C 42 56, 58 56, 80 80 C 102 104, 118 104, 138 80; M 22 80 C 42 46, 58 46, 80 80 C 102 114, 118 114, 138 80"
          dur="8s"
          repeatCount="indefinite"
        />
      </path>

      {/* Wave 2: Surname (20% Weight - Purple) */}
      <path
        d="M 22 80 C 42 104, 58 104, 80 80 C 102 56, 118 56, 138 80"
        stroke="#7C3AED"
        strokeWidth="1.3"
        strokeDasharray="3 3"
        strokeLinecap="round"
        fill="none"
      />

      {/* Wave 3: Synergy Combined Harmonic (Indigo) */}
      <path
        d="M 22 80 C 50 36, 110 124, 138 80"
        stroke="#4F46E5"
        strokeWidth="1.6"
        strokeLinecap="round"
        fill="none"
      />

      {/* Center nodal point */}
      <circle cx="80" cy="80" r="5" fill="#FFFFFF" stroke="#0B5CFF" strokeWidth="1.5" />
      <circle cx="80" cy="80" r="2.5" fill="#7C3AED" />
    </svg>
  </div>
);

// 5. LIFE PATH ALIGNMENT SVG (Bright)
const LifePathAlignmentSvg = () => (
  <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
    <svg viewBox="0 0 160 160" className="w-full h-full" fill="none">
      {/* Outer compass rim */}
      <circle cx="80" cy="80" r="62" stroke="#EEF2FF" strokeWidth="1" />
      <circle cx="80" cy="80" r="52" stroke="#C7D2FE" strokeWidth="0.8" strokeDasharray="2 4" />

      {/* 4 Cardinal Rays */}
      <line x1="80" y1="18" x2="80" y2="142" stroke="#0B5CFF" strokeWidth="1" opacity="0.4" />
      <line x1="18" y1="80" x2="142" y2="80" stroke="#0B5CFF" strokeWidth="1" opacity="0.4" />

      {/* Revolving Vector Pointer */}
      <g
        className="animate-[spin_18s_linear_infinite]"
        style={{ transformOrigin: "80px 80px" }}
      >
        <line x1="80" y1="80" x2="124" y2="44" stroke="#0B5CFF" strokeWidth="1.6" strokeLinecap="round" />
        <circle cx="124" cy="44" r="3.5" fill="#0B5CFF" />
        <circle cx="124" cy="44" r="7" stroke="#0B5CFF" strokeWidth="0.8" opacity="0.4" />
      </g>

      {/* Center node */}
      <circle cx="80" cy="80" r="6" fill="#FFFFFF" stroke="#7C3AED" strokeWidth="1.5" />
      <circle cx="80" cy="80" r="2.5" fill="#0B5CFF" />
    </svg>
  </div>
);

/* ═══════════════════════════════════════════════════════════════
   5 SUB-HEADS FOR "HOW NAMENOLOGY WORKS"
   ═══════════════════════════════════════════════════════════════ */
const STEPS = [
  {
    tag: "Cosmic Identity",
    title: "Cosmic Structure",
    slug: "cosmic-structure",
    summary:
      "Capturing the foundational vocal vibration. Your official name acts as a physical acoustic frequency imprint that radiates through your social and personal universe.",
    highlight: "Acoustic Frequency Imprint",
    svg: <CosmicStructureSvg />,
  },
  {
    tag: "Chaldean Matrix",
    title: "Cosmic Code",
    slug: "cosmic-code",
    summary:
      "Deciphering numerical resonance. Rooted in ancient Chaldean harmonics, we map each vowel and consonant into a deterministic closed library of 100 archetypes.",
    highlight: "100 Closed Archetypes",
    svg: <CosmicCodeSvg />,
  },
  {
    tag: "Global Standard",
    title: "Letter Conversion",
    slug: "letter-conversion",
    summary:
      "Transforming phonetic characters into vibrational values. Normalized via Unicode NFC to systematically map each letter of your official name into precise energetic frequency weights.",
    highlight: "Unicode NFC Standards",
    svg: <LetterConversionSvg />,
  },
  {
    tag: "Tripartite Synthesis",
    title: "Name Analysis",
    slug: "name-analysis",
    summary:
      "Tripartite life impact formula. Calculates the exact equilibrium between Official First Name (40%), Official Surname (20%), and Full Name Synergy (40%) without subjective bias.",
    highlight: "40% / 20% / 40% Formula",
    svg: <NameAnalysisSvg />,
  },
  {
    tag: "Destiny Optimization",
    title: "Life Path Alignment",
    slug: "life-path-alignment",
    summary:
      "Translating compound sums and root vibrations into actionable life vectors — revealing career resonance, innate strengths, health precautions, and holistic trajectory alignment.",
    highlight: "Actionable Destiny Dossier",
    svg: <LifePathAlignmentSvg />,
  },
];

export const HowItWorksSection: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number | null>(null);

  return (
    <section
      id="how-namenology-works"
      className="py-20 sm:py-28 bg-white border-y border-indigo-50/80 relative overflow-hidden text-slate-900"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* ================================================================= */}
        {/* SECTION HEADER                                                     */}
        {/* ================================================================= */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-blue-200/80 bg-blue-50 text-blue-700 text-xs font-semibold mb-3 shadow-2xs">
            <Orbit className="w-3.5 h-3.5 text-blue-600" />
            <span>Deterministic 5-Stage Architecture</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black tracking-tight font-outfit uppercase leading-tight text-slate-900">
            HOW <span className="gradient-text-cosmic-bright">NAMENOLOGY WORKS</span>
          </h2>

          <p className="mt-4 text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
            A deterministic vibrational pipeline that converts human vocal identity into precision mathematical destiny intelligence.
          </p>
        </div>

        {/* ================================================================= */}
        {/* 5-STAGE ARCHITECTURE CARDS (3:2 ROWS)                             */}
        {/* ================================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-6 max-w-6xl mx-auto">
          {STEPS.map((item, index) => {
            const isHovered = activeStep === index;
            // 3:2 layout:
            // Row 1 (first 3 cards): span 2 cols each (2 + 2 + 2 = 6 cols)
            // Row 2 (last 2 cards): span 2 cols each, centered (col-start-2 leaves cols 1 and 6 empty)
            const gridColClass =
              index === 3
                ? "md:col-span-2 md:col-start-2"
                : "md:col-span-2";

            return (
              <div
                key={item.slug}
                id={`step-${item.slug}`}
                onMouseEnter={() => setActiveStep(index)}
                onMouseLeave={() => setActiveStep(null)}
                className={`
                  relative rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between
                  border bg-white hover:-translate-y-1.5
                  ${gridColClass}
                  ${
                    isHovered
                      ? "border-blue-400 shadow-xl shadow-blue-500/10"
                      : "border-slate-200/80 shadow-xs"
                  }
                `}
              >
                <div>
                  {/* Top Tag */}
                  <div className="flex items-center justify-center mb-4">
                    <span className="text-[10px] sm:text-[11px] font-semibold text-purple-700 uppercase tracking-wider bg-purple-50/90 border border-purple-200/70 px-3 py-1 rounded-full">
                      {item.tag}
                    </span>
                  </div>

                  {/* SVG Graphic */}
                  <div className="my-2 py-2 flex items-center justify-center">
                    {item.svg}
                  </div>

                  {/* Step Title (Sub-head) */}
                  <h3 className="font-outfit font-bold text-lg text-slate-900 text-center mt-3 mb-2 tracking-tight">
                    {item.title}
                  </h3>

                  {/* Summary Description */}
                  <p className="text-xs text-slate-600 leading-relaxed text-center">
                    {item.summary}
                  </p>
                </div>

                {/* Bottom Highlight Feature Tag */}
                <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-center gap-1.5 text-[11px] font-semibold text-slate-700 bg-slate-50/80 rounded-lg py-1.5 px-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span className="truncate">{item.highlight}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* ================================================================= */}
        {/* FOOTER ELEMENT: WITH LITTLE DESCRIPTION AS EXPLICITLY REQUESTED    */}
        {/* ================================================================= */}
        <div className="mt-14 sm:mt-18 p-6 sm:p-7 rounded-2xl bg-[#F8FAFF] border border-indigo-100/90 max-w-4xl mx-auto shadow-md shadow-indigo-500/5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-5">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-100/80 border border-blue-200 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                <Workflow className="w-5 h-5" />
              </div>
              <div className="space-y-1 text-center sm:text-left">
                <p className="text-xs font-bold text-slate-900 font-outfit uppercase tracking-wider flex items-center justify-center sm:justify-start gap-2">
                  <span>Unified 5-Stage Scientific Pipeline</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
                </p>
                {/* LITTLE DESCRIPTION ON FOOTER ELEMENT */}
                <p className="text-xs text-slate-600 leading-relaxed">
                  From vocal pronunciation to mathematical vector analysis, each stage systematically refines your name into an auditable energetic dossier — combining Unicode character standards, Chaldean harmonics, and tripartite balance.
                </p>
              </div>
            </div>

            <div className="text-xs font-bold text-purple-700 bg-purple-50 border border-purple-200/80 px-3 py-1.5 rounded-xl shrink-0 flex items-center gap-1.5 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>100% Deterministic</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
