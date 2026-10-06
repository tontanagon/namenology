"use client";

import React, { useState } from "react";
import { Sparkles } from "lucide-react";

/* ═══════════════════════════════════════════════════════════════
   5 COSMIC BLUE-INDIGO-CYAN SVG ILLUSTRATIONS FOR "WHAT IS NAMENOLOGY"
   1. Cosmic Structure: Celestial star & planetary orbits
   2. Cosmic Code: Astrolabe dial with 0-9 numerical energies
   3. Letter Conversion: Chaldean numerical conversion matrix
   4. Name Analysis: First Name + Surname integration reticle
   5. Life Path: Cosmic astrolabe 8-point compass star
   ═══════════════════════════════════════════════════════════════ */

// 1. COSMIC STRUCTURE SVG
const CosmicStructureSvg = () => (
  <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
    <svg viewBox="0 0 160 160" className="w-full h-full select-none" fill="none">
      <defs>
        <radialGradient id="wi-core-glow" cx="45%" cy="45%" r="55%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="30%" stopColor="#BAE6FD" />
          <stop offset="65%" stopColor="#38BDF8" />
          <stop offset="100%" stopColor="#0B5CFF" />
        </radialGradient>
        <radialGradient id="wi-corona" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.45" />
          <stop offset="60%" stopColor="#6366F1" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#7C3AED" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Outer boundary */}
      <circle cx="80" cy="80" r="68" stroke="#EEF2FF" strokeWidth="1" />
      <circle cx="80" cy="80" r="64" stroke="#E0E7FF" strokeWidth="0.8" strokeDasharray="3 4" />

      {/* Orbit 1: Inner (Mercury) */}
      <ellipse cx="80" cy="80" rx="26" ry="22" stroke="#CBD5E1" strokeWidth="0.8" />
      <circle cx="102" cy="72" r="2.5" fill="#38BDF8" />

      {/* Orbit 2: Venus */}
      <ellipse cx="80" cy="80" rx="38" ry="33" stroke="#C7D2FE" strokeWidth="0.8" />
      <circle cx="56" cy="54" r="3.2" fill="#818CF8" />

      {/* Orbit 3: Earth & Moon */}
      <ellipse cx="80" cy="80" rx="50" ry="44" stroke="#CBD5E1" strokeWidth="0.8" />
      <circle cx="118" cy="100" r="3.8" fill="#2563EB" />
      <circle cx="123" cy="103" r="1.2" fill="#CBD5E1" />

      {/* Orbit 4: Mars */}
      <ellipse cx="80" cy="80" rx="60" ry="54" stroke="#C7D2FE" strokeWidth="0.8" />
      <circle cx="58" cy="114" r="3" fill="#7C3AED" />

      {/* Rotating outer orbit with Saturn ring */}
      <g
        className="animate-[spin_48s_linear_infinite]"
        style={{ transformOrigin: "80px 80px" }}
      >
        <circle cx="80" cy="80" r="62" stroke="#818CF8" strokeWidth="0.8" strokeDasharray="2 4" opacity="0.6" />
        <circle cx="132" cy="52" r="3.8" fill="#4F46E5" />
        <ellipse cx="132" cy="52" rx="7.5" ry="2.5" stroke="#A5B4FC" strokeWidth="0.8" fill="none" transform="rotate(-25 132 52)" />
      </g>

      {/* Corona glow & Central star */}
      <circle cx="80" cy="80" r="24" fill="url(#wi-corona)" />
      <circle cx="80" cy="80" r="12" fill="url(#wi-core-glow)" />
      <circle cx="78" cy="78" r="3.5" fill="#FFFFFF" opacity="0.8" />
    </svg>
  </div>
);

// 2. COSMIC CODE SVG
const CosmicCodeSvg = () => (
  <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
    <svg viewBox="0 0 160 160" className="w-full h-full select-none" fill="none">
      <defs>
        <radialGradient id="wi-nexus-glow" cx="40%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#E0F2FE" />
          <stop offset="35%" stopColor="#38BDF8" />
          <stop offset="75%" stopColor="#0B5CFF" />
          <stop offset="100%" stopColor="#4F46E5" />
        </radialGradient>
      </defs>

      {/* Outer dial ring */}
      <circle cx="80" cy="80" r="68" stroke="#EEF2FF" strokeWidth="1" />
      <circle
        cx="80"
        cy="80"
        r="62"
        stroke="#C7D2FE"
        strokeWidth="0.8"
        strokeDasharray="1 5"
        className="animate-[spin_45s_linear_infinite]"
        style={{ transformOrigin: "80px 80px" }}
      />

      {/* Radial spokes */}
      <g opacity="0.3" stroke="#C7D2FE" strokeWidth="0.7" strokeDasharray="2 3">
        <line x1="80" y1="80" x2="80" y2="38" />
        <line x1="80" y1="80" x2="110" y2="50" />
        <line x1="80" y1="80" x2="122" y2="80" />
        <line x1="80" y1="80" x2="114" y2="112" />
        <line x1="80" y1="80" x2="80" y2="122" />
        <line x1="80" y1="80" x2="48" y2="112" />
        <line x1="80" y1="80" x2="38" y2="80" />
        <line x1="80" y1="80" x2="50" y2="50" />
      </g>

      {/* Orbit ring for numbers */}
      <circle cx="80" cy="80" r="48" stroke="#CBD5E1" strokeWidth="0.8" strokeDasharray="2 3" />

      {/* Celestial energy nodes (0–9) */}
      <circle cx="80" cy="38" r="4.5" fill="#0B5CFF" />
      <circle cx="110" cy="50" r="4.2" fill="#38BDF8" />
      <circle cx="122" cy="80" r="4.5" fill="#4F46E5" />
      <circle cx="114" cy="112" r="4.2" fill="#7C3AED" />
      <circle cx="80" cy="122" r="4.5" fill="#06B6D4" />
      <circle cx="48" cy="112" r="4.5" fill="#2563EB" />
      <circle cx="38" cy="80" r="4.2" fill="#8B5CF6" />
      <circle cx="50" cy="50" r="4.5" fill="#6366F1" />

      {/* Numbers around the perimeter */}
      <text x="80" y="27" textAnchor="middle" fill="#0F172A" fontSize="9" fontFamily="var(--font-sans), sans-serif" fontWeight="bold">1</text>
      <text x="120" y="42" textAnchor="middle" fill="#0F172A" fontSize="9" fontFamily="var(--font-sans), sans-serif" fontWeight="bold">3</text>
      <text x="134" y="83" textAnchor="middle" fill="#0F172A" fontSize="9" fontFamily="var(--font-sans), sans-serif" fontWeight="bold">5</text>
      <text x="120" y="125" textAnchor="middle" fill="#0F172A" fontSize="9" fontFamily="var(--font-sans), sans-serif" fontWeight="bold">7</text>
      <text x="80" y="138" textAnchor="middle" fill="#0F172A" fontSize="9" fontFamily="var(--font-sans), sans-serif" fontWeight="bold">9</text>
      <text x="40" y="125" textAnchor="middle" fill="#0F172A" fontSize="9" fontFamily="var(--font-sans), sans-serif" fontWeight="bold">6</text>
      <text x="26" y="83" textAnchor="middle" fill="#0F172A" fontSize="9" fontFamily="var(--font-sans), sans-serif" fontWeight="bold">8</text>
      <text x="40" y="42" textAnchor="middle" fill="#0F172A" fontSize="9" fontFamily="var(--font-sans), sans-serif" fontWeight="bold">2</text>

      {/* Central 0 node */}
      <circle cx="80" cy="80" r="16" fill="#BAE6FD" opacity="0.3" />
      <circle cx="80" cy="80" r="11" fill="url(#wi-nexus-glow)" stroke="#38BDF8" strokeWidth="1" />
      <text x="80" y="84" textAnchor="middle" fill="#FFFFFF" fontSize="11" fontFamily="var(--font-sans), sans-serif" fontWeight="bold">
        0
      </text>
    </svg>
  </div>
);

// 3. LETTER CONVERSION SVG
const LetterConversionSvg = () => (
  <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
    <svg viewBox="0 0 160 160" className="w-full h-full select-none" fill="none">
      {/* Outer boundary */}
      <circle cx="80" cy="80" r="68" stroke="#EEF2FF" strokeWidth="1" />

      {/* Chaldean Mini Matrix Container */}
      <rect
        x="30"
        y="30"
        width="100"
        height="100"
        rx="6"
        fill="#FFFFFF"
        stroke="#CBD5E1"
        strokeWidth="1.2"
        filter="drop-shadow(0 2px 4px rgba(0, 0, 0, 0.03))"
      />
      {/* Header bar */}
      <path
        d="M 30 36 Q 30 30 36 30 L 124 30 Q 130 30 130 36 L 130 48 L 30 48 Z"
        fill="#F8FAFC"
      />

      {/* Grid lines */}
      <line x1="46.6" y1="30" x2="46.6" y2="130" stroke="#E2E8F0" strokeWidth="0.8" />
      <line x1="63.3" y1="30" x2="63.3" y2="130" stroke="#E2E8F0" strokeWidth="0.8" />
      <line x1="80" y1="30" x2="80" y2="130" stroke="#E2E8F0" strokeWidth="0.8" />
      <line x1="96.6" y1="30" x2="96.6" y2="130" stroke="#E2E8F0" strokeWidth="0.8" />
      <line x1="113.3" y1="30" x2="113.3" y2="130" stroke="#E2E8F0" strokeWidth="0.8" />

      <line x1="30" y1="48" x2="130" y2="48" stroke="#E2E8F0" strokeWidth="0.8" />
      <line x1="30" y1="68" x2="130" y2="68" stroke="#E2E8F0" strokeWidth="0.8" />
      <line x1="30" y1="88" x2="130" y2="88" stroke="#E2E8F0" strokeWidth="0.8" />
      <line x1="30" y1="108" x2="130" y2="108" stroke="#E2E8F0" strokeWidth="0.8" />

      {/* Header Numbers: 1 2 3 4 5 6 */}
      <g fill="#0B5CFF" fontSize="9" fontFamily="var(--font-sans), sans-serif" fontWeight="bold" textAnchor="middle">
        <text x="38.3" y="42">1</text>
        <text x="55" y="42">2</text>
        <text x="71.6" y="42">3</text>
        <text x="88.3" y="42">4</text>
        <text x="105" y="42">5</text>
        <text x="121.6" y="42">6</text>
      </g>

      {/* Row 1: A B C D E U */}
      <g fill="#334155" fontSize="8" fontFamily="var(--font-sans), sans-serif" fontWeight="bold" textAnchor="middle">
        <text x="38.3" y="61">A</text>
        <text x="55" y="61">B</text>
        <text x="71.6" y="61">C</text>
        <text x="88.3" y="61">D</text>
        <text x="105" y="61">E</text>
        <text x="121.6" y="61">U</text>
      </g>

      {/* Row 2: I K G M H V */}
      <g fill="#334155" fontSize="8" fontFamily="var(--font-sans), sans-serif" fontWeight="bold" textAnchor="middle">
        <text x="38.3" y="81">I</text>
        <text x="55" y="81">K</text>
        <text x="71.6" y="81">G</text>
        <text x="88.3" y="81">M</text>
        <text x="105" y="81">H</text>
        <text x="121.6" y="81">V</text>
      </g>

      {/* Row 3: J R L T N W */}
      <g fill="#334155" fontSize="8" fontFamily="var(--font-sans), sans-serif" fontWeight="bold" textAnchor="middle">
        <text x="38.3" y="101">J</text>
        <text x="55" y="101">R</text>
        <text x="71.6" y="101">L</text>
        <text x="88.3" y="101">T</text>
        <text x="105" y="101">N</text>
        <text x="121.6" y="101">W</text>
      </g>

      {/* Row 4: Q S X */}
      <g fill="#334155" fontSize="8" fontFamily="var(--font-sans), sans-serif" fontWeight="bold" textAnchor="middle">
        <text x="38.3" y="121">Q</text>
        <text x="71.6" y="121">S</text>
        <text x="105" y="121">X</text>
      </g>
    </svg>
  </div>
);

// 4. NAME ANALYSIS SVG
const NameAnalysisSvg = () => (
  <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
    <svg viewBox="0 0 160 160" className="w-full h-full select-none" fill="none">
      {/* Background celestial alignment lines and circle */}
      <circle cx="80" cy="80" r="68" stroke="#EEF2FF" strokeWidth="0.8" />
      <circle cx="80" cy="80" r="56" stroke="#C7D2FE" strokeWidth="0.8" strokeDasharray="3 4" />

      {/* Cardinal crosshairs */}
      <line x1="80" y1="12" x2="80" y2="148" stroke="#E2E8F0" strokeWidth="0.8" strokeDasharray="2 3" />
      <line x1="12" y1="80" x2="148" y2="80" stroke="#E2E8F0" strokeWidth="0.8" strokeDasharray="2 3" />

      {/* Glowing anchor dots */}
      <circle cx="80" cy="20" r="2.5" fill="#0B5CFF" />
      <circle cx="80" cy="140" r="2.5" fill="#7C3AED" />

      {/* Analysis Card */}
      <rect
        x="24"
        y="46"
        width="112"
        height="68"
        rx="6"
        fill="#FFFFFF"
        stroke="#CBD5E1"
        strokeWidth="1.2"
        filter="drop-shadow(0 4px 6px rgba(0, 0, 0, 0.04))"
      />
      <rect
        x="27"
        y="49"
        width="106"
        height="62"
        rx="4"
        fill="none"
        stroke="#EEF2FF"
        strokeWidth="0.8"
      />

      {/* First Name Row */}
      <text
        x="80"
        y="70"
        textAnchor="middle"
        fill="#0F172A"
        fontSize="11"
        fontFamily="var(--font-sans), sans-serif"
        fontWeight="bold"
      >
        First Name
      </text>

      {/* Divider line with center energy node */}
      <line x1="36" y1="80" x2="124" y2="80" stroke="#E2E8F0" strokeWidth="0.8" />
      <circle cx="80" cy="80" r="2" fill="#0B5CFF" />

      {/* Last Name Row */}
      <text
        x="80"
        y="99"
        textAnchor="middle"
        fill="#0F172A"
        fontSize="11"
        fontFamily="var(--font-sans), sans-serif"
        fontWeight="bold"
      >
        Last Name
      </text>

      {/* Corner brackets */}
      <path d="M 30 54 L 30 51 L 33 51" stroke="#818CF8" strokeWidth="1" fill="none" />
      <path d="M 130 54 L 130 51 L 127 51" stroke="#818CF8" strokeWidth="1" fill="none" />
      <path d="M 30 106 L 30 109 L 33 109" stroke="#818CF8" strokeWidth="1" fill="none" />
      <path d="M 130 106 L 130 109 L 127 109" stroke="#818CF8" strokeWidth="1" fill="none" />
    </svg>
  </div>
);

// 5. LIFE PATH SVG
const LifePathSvg = () => (
  <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
    <svg viewBox="0 0 160 160" className="w-full h-full select-none" fill="none">
      <defs>
        <radialGradient id="wi-starburst" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="25%" stopColor="#BAE6FD" />
          <stop offset="55%" stopColor="#38BDF8" />
          <stop offset="85%" stopColor="#0B5CFF" />
          <stop offset="100%" stopColor="#4F46E5" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Concentric astrolabe rings */}
      <circle cx="80" cy="80" r="68" stroke="#EEF2FF" strokeWidth="1" />
      <circle cx="80" cy="80" r="62" stroke="#C7D2FE" strokeWidth="0.8" opacity="0.8" />
      <circle cx="80" cy="80" r="54" stroke="#818CF8" strokeWidth="0.8" strokeDasharray="3 4" opacity="0.7" />
      <circle cx="80" cy="80" r="44" stroke="#4F46E5" strokeWidth="1" opacity="0.85" />
      <circle cx="80" cy="80" r="32" stroke="#0B5CFF" strokeWidth="0.9" strokeDasharray="2 3" />

      {/* 8-point geometric compass star rays */}
      <polygon points="80,18 84,72 80,80 76,72" fill="#38BDF8" opacity="0.9" />
      <polygon points="80,142 84,88 80,80 76,88" fill="#0B5CFF" opacity="0.9" />
      <polygon points="18,80 72,76 80,80 72,84" fill="#38BDF8" opacity="0.9" />
      <polygon points="142,80 88,76 80,80 88,84" fill="#0B5CFF" opacity="0.9" />
      <polygon points="36,36 74,75 80,80 75,74" fill="#6366F1" opacity="0.8" />
      <polygon points="124,124 86,85 80,80 85,86" fill="#7C3AED" opacity="0.8" />
      <polygon points="124,36 85,74 80,80 86,75" fill="#6366F1" opacity="0.8" />
      <polygon points="36,124 75,86 80,80 74,85" fill="#7C3AED" opacity="0.8" />

      {/* Center glowing radiant starburst core */}
      <circle cx="80" cy="80" r="22" fill="url(#wi-starburst)" />
      <circle cx="80" cy="80" r="6" fill="#FFFFFF" stroke="#38BDF8" strokeWidth="1" />
      <circle cx="80" cy="80" r="2.5" fill="#0B5CFF" />
    </svg>
  </div>
);

/* ═══════════════════════════════════════════════════════════════
   5 ELEMENTS AS EXPLICITLY REQUESTED BY USER
   ═══════════════════════════════════════════════════════════════ */
const WHAT_IS_ITEMS = [
  {
    stepNumber: "01",
    id: "cosmic-structure",
    title: "1. Cosmic Structure",
    description:
      "Cosmic Structure refers to the existence and movement of stars and celestial bodies throughout the Milky Way galaxy, forming the foundation of the Namenology system.",
    svg: <CosmicStructureSvg />,
  },
  {
    stepNumber: "02",
    id: "cosmic-code",
    title: "2. Cosmic Code",
    description:
      "Cosmic Code represents cosmic influences through numbers 0–9, with each number associated with specific celestial energies and characteristics.",
    svg: <CosmicCodeSvg />,
  },
  {
    stepNumber: "03",
    id: "letter-conversion",
    title: "3. Letter Conversion",
    description:
      "Each letter in your name and surname is converted into a numerical value from 0–9, creating a unique numerical pattern.",
    svg: <LetterConversionSvg />,
  },
  {
    stepNumber: "04",
    id: "name-analysis",
    title: "4. Name Analysis",
    description:
      "The numbers from your name and surname are combined and interpreted according to their meanings and numerical energies.",
    svg: <NameAnalysisSvg />,
  },
  {
    stepNumber: "05",
    id: "life-path",
    title: "5. Life Path",
    description:
      "The resulting numbers are combined into a number from 1–100, which forms the basis for exploring your Life Path.",
    svg: <LifePathSvg />,
  },
];

export const WhatIsNamenologySection: React.FC = () => {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  return (
    <section
      id="what-is-namenology"
      className="py-16 sm:py-24 bg-white relative overflow-hidden text-slate-900 border-t border-slate-100"
    >
      {/* Background ethereal bright glowing nebulae */}
      <div className="absolute top-1/4 left-1/4 w-[450px] h-[450px] bg-purple-500/[0.04] rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[450px] h-[450px] bg-blue-500/[0.04] rounded-full blur-[100px] pointer-events-none" />

      {/* Subtle orbital lines decoration */}
      <svg
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] pointer-events-none select-none opacity-30"
        viewBox="0 0 700 700"
        fill="none"
      >
        <circle cx="350" cy="350" r="340" stroke="#E0E7FF" strokeWidth="1" />
        <circle cx="350" cy="350" r="260" stroke="#C7D2FE" strokeWidth="0.8" strokeDasharray="4 6" />
        <circle cx="350" cy="350" r="180" stroke="#DDD6FE" strokeWidth="0.6" />
      </svg>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* ================================================================= */}
        {/* SECTION HEADER                                                     */}
        {/* ================================================================= */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-purple-200/80 bg-purple-50 text-purple-700 text-xs font-semibold mb-3 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>The Science of Name</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-black tracking-tight font-outfit uppercase leading-tight text-slate-900">
            WHAT IS <span className="gradient-text-cosmic-bright">NAMENOLOGY</span>
          </h2>

          <p className="mt-4 text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
            Namenology is a distinctive, proprietary numerology system developed by integrating concepts from{" "}
            <strong className="text-slate-800 font-semibold">
              cosmology, astronomy, astrology, horoscopy, and numerology
            </strong>{" "}
            into one unique framework for name analysis.
          </p>
        </div>

        {/* ================================================================= */}
        {/* 5 FEATURE CARDS (3 on Row 1, 2 Centered on Row 2)                */}
        {/* ================================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-5">
          {WHAT_IS_ITEMS.map((item, index) => {
            const isHovered = hoveredCard === item.id;
            const gridColClass =
              index === 3
                ? "md:col-span-2 md:col-start-2"
                : "md:col-span-2";

            return (
              <div
                key={item.id}
                id={`what-is-${item.id}`}
                onMouseEnter={() => setHoveredCard(item.id)}
                onMouseLeave={() => setHoveredCard(null)}
                className={`
                  relative rounded-2xl p-6
                  transition-all duration-300 flex flex-col justify-between
                  border bg-white
                  hover:-translate-y-1.5
                  ${gridColClass}
                  ${isHovered
                    ? "border-purple-300 shadow-xl shadow-indigo-500/10"
                    : "border-slate-200/80 shadow-xs"
                  }
                `}
              >
                <div>
                  {/* Step Number Badge */}
                  {/* <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono font-bold text-purple-700 bg-purple-50 border border-purple-200/70 px-2 py-0.5 rounded">
                      {item.stepNumber}
                    </span>
                    <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                      Foundation
                    </span>
                  </div> */}

                  {/* SVG Graphic */}
                  <div className="my-2 flex items-center justify-center">
                    {item.svg}
                  </div>

                  {/* Title */}
                  <h3 className="font-outfit font-bold text-lg text-slate-900 text-center mt-3 mb-2 tracking-tight group-hover:text-blue-600 transition-colors">
                    {item.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-slate-600 leading-relaxed text-center font-normal">
                    {item.description}
                  </p>
                </div>

                {/* Bottom subtle accent line */}
                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-center">
                  <div
                    className={`
                      h-0.5 rounded-full transition-all duration-500
                      ${isHovered ? "w-12 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600" : "w-6 bg-slate-200"}
                    `}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* ================================================================= */}
        {/* SUPPLEMENTARY ARTICLE (NO CARD FRAME / NO BORDER)                  */}
        {/* ================================================================= */}
        <div className="mt-14 sm:mt-18 max-w-3xl mx-auto pt-10 sm:pt-12 border-t border-slate-200/70">
          <article className="space-y-2.5">
            <h4 className="font-outfit font-bold text-xl sm:text-2xl text-slate-900 tracking-tight">
              A Unique Pattern Encoded in Every Name
            </h4>
            <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-normal">
              Your name and surname carry a{" "}
              <strong className="text-slate-900 font-semibold">unique numerical pattern</strong>, with each letter connected
              to the Cosmic Code and the energies represented by the stars. Together, these numbers form a unique energy pattern that Namenology uses to explore your{" "}
              <span className="font-semibold text-blue-600">Personality, Destiny, and Well-being</span>.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
};
