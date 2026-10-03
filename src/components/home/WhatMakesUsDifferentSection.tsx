"use client";

import React, { useState } from "react";
import { CheckCircle2, ShieldCheck, Sparkles, Orbit } from "lucide-react";

/* ═══════════════════════════════════════════════════════════════
   BRIGHT BLUE-PURPLE-WHITE SOLAR SYSTEM NEBULA SVG ILLUSTRATIONS
   ═══════════════════════════════════════════════════════════════ */

// 1. NAME BASE SVG (Bright)
const NameBaseSvg = () => (
  <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
    <svg viewBox="0 0 160 160" className="w-full h-full" fill="none">
      {/* Outer subtle acoustic ripple guide */}
      <circle cx="80" cy="80" r="66" stroke="#E0E7FF" strokeWidth="1" />

      {/* Acoustic Expanding Ripple Rings */}
      <circle
        cx="80"
        cy="80"
        r="54"
        stroke="#818CF8"
        strokeWidth="1"
        strokeDasharray="3 4"
        opacity="0.6"
        className="animate-[spin_40s_linear_infinite]"
        style={{ transformOrigin: "80px 80px" }}
      />
      <circle cx="80" cy="80" r="40" stroke="#C4B5FD" strokeWidth="1" strokeDasharray="2 3" />

      {/* Horizontal Datum Baseline */}
      <line x1="22" y1="80" x2="138" y2="80" stroke="#EEF2FF" strokeWidth="1.2" />

      {/* Vocal Acoustic Frequency Bars */}
      <g strokeLinecap="round">
        <line x1="40" y1="74" x2="40" y2="86" stroke="#93C5FD" strokeWidth="1.4" />
        <line x1="48" y1="68" x2="48" y2="92" stroke="#60A5FA" strokeWidth="1.4" />
        <line x1="56" y1="58" x2="56" y2="102" stroke="#818CF8" strokeWidth="1.5" />
        <line x1="64" y1="48" x2="64" y2="112" stroke="#4F46E5" strokeWidth="1.6">
          <animate attributeName="y1" values="48;44;48" dur="5s" repeatCount="indefinite" />
          <animate attributeName="y2" values="112;116;112" dur="5s" repeatCount="indefinite" />
        </line>
        <line x1="72" y1="38" x2="72" y2="122" stroke="#7C3AED" strokeWidth="1.6">
          <animate attributeName="y1" values="38;34;38" dur="4s" repeatCount="indefinite" />
          <animate attributeName="y2" values="122;126;122" dur="4s" repeatCount="indefinite" />
        </line>

        {/* Central Core Vocal Bar */}
        <line x1="80" y1="30" x2="80" y2="130" stroke="#0B5CFF" strokeWidth="2.2">
          <animate attributeName="y1" values="30;26;30" dur="4.5s" repeatCount="indefinite" />
          <animate attributeName="y2" values="130;134;130" dur="4.5s" repeatCount="indefinite" />
        </line>
        <circle cx="80" cy="30" r="3" fill="#0B5CFF" />
        <circle cx="80" cy="130" r="3" fill="#0B5CFF" />

        <line x1="88" y1="38" x2="88" y2="122" stroke="#7C3AED" strokeWidth="1.6">
          <animate attributeName="y1" values="38;34;38" dur="4s" repeatCount="indefinite" />
          <animate attributeName="y2" values="122;126;122" dur="4s" repeatCount="indefinite" />
        </line>
        <line x1="96" y1="48" x2="96" y2="112" stroke="#4F46E5" strokeWidth="1.6">
          <animate attributeName="y1" values="48;44;48" dur="5s" repeatCount="indefinite" />
          <animate attributeName="y2" values="112;116;112" dur="5s" repeatCount="indefinite" />
        </line>
        <line x1="104" y1="58" x2="104" y2="102" stroke="#818CF8" strokeWidth="1.5" />
        <line x1="112" y1="68" x2="112" y2="92" stroke="#60A5FA" strokeWidth="1.4" />
        <line x1="120" y1="74" x2="120" y2="86" stroke="#93C5FD" strokeWidth="1.4" />
      </g>

      {/* Central Identity Anchor Node */}
      <circle cx="80" cy="80" r="8" fill="#FFFFFF" stroke="#0B5CFF" strokeWidth="1.5" />
      <circle cx="80" cy="80" r="3" fill="#7C3AED" />
    </svg>
  </div>
);

// 2. STRUCTURED SYSTEM SVG (Bright)
const StructuredSystemSvg = () => (
  <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
    <svg viewBox="0 0 160 160" className="w-full h-full" fill="none">
      {/* Background isometric datum */}
      <path d="M 80 20 L 138 53 L 80 86 L 22 53 Z" stroke="#E0E7FF" strokeWidth="1" />
      <path d="M 80 53 L 138 86 L 80 119 L 22 86 Z" stroke="#E0E7FF" strokeWidth="1" />

      {/* Floating tiers */}
      <g>
        {/* Top Plane: First Name (40%) Wireframe */}
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

        {/* Middle Tier: Surname (20%) Wireframe */}
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

        {/* Base Tier: Synergy (40%) Wireframe */}
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
      </g>

      {/* Vertical Precision Laser Axis */}
      <line x1="80" y1="16" x2="80" y2="148" stroke="#0B5CFF" strokeWidth="1.2" strokeDasharray="3 4" opacity="0.6" />
      <circle cx="80" cy="16" r="2.5" fill="#0B5CFF" />
      <circle cx="80" cy="148" r="2.5" fill="#7C3AED" />
    </svg>
  </div>
);

// 3. UNIQUE IDENTITY SVG (Bright)
const UniqueIdentitySvg = () => (
  <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
    <svg viewBox="0 0 160 160" className="w-full h-full" fill="none">
      {/* Outer Slender Diamond Facet */}
      <polygon
        points="80,20 134,54 134,106 80,140 26,106 26,54"
        stroke="#818CF8"
        strokeWidth="1.3"
        strokeLinejoin="round"
        fill="none"
        opacity="0.6"
      />

      {/* Biometric Whorl Arcs */}
      <g strokeLinecap="round">
        <path
          d="M 80 44 C 58 44, 46 60, 46 80 C 46 100, 58 116, 80 116"
          stroke="#93C5FD"
          strokeWidth="1.3"
          strokeDasharray="4 3"
        />
        <path
          d="M 80 44 C 102 44, 114 60, 114 80 C 114 100, 102 116, 80 116"
          stroke="#93C5FD"
          strokeWidth="1.3"
        />

        <path
          d="M 80 54 C 64 54, 56 66, 56 80 C 56 94, 64 106, 80 106"
          stroke="#4F46E5"
          strokeWidth="1.5"
        />
        <path
          d="M 80 54 C 96 54, 104 66, 104 80 C 104 94, 96 106, 80 106"
          stroke="#4F46E5"
          strokeWidth="1.5"
          strokeDasharray="4 2"
        />
      </g>

      {/* Orbiting Satellite Node */}
      <g
        className="animate-[spin_28s_linear_infinite]"
        style={{ transformOrigin: "80px 80px" }}
      >
        <circle cx="80" cy="62" r="2.5" fill="#0B5CFF" />
      </g>

      {/* Central Sovereign Node */}
      <circle cx="80" cy="80" r="7" fill="#FFFFFF" stroke="#0B5CFF" strokeWidth="1.5" />
      <circle cx="80" cy="80" r="3" fill="#7C3AED" />
    </svg>
  </div>
);

// 4. NO GUESS WORK SVG (Bright)
const NoGuessWorkSvg = () => (
  <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
    <svg viewBox="0 0 160 160" className="w-full h-full" fill="none">
      {/* Outer Calibration Ring */}
      <circle cx="80" cy="78" r="62" stroke="#EEF2FF" strokeWidth="1" />

      {/* Reticle */}
      <circle
        cx="80"
        cy="78"
        r="52"
        stroke="#818CF8"
        strokeWidth="1"
        strokeDasharray="2 4"
        opacity="0.6"
        className="animate-[spin_36s_linear_infinite]"
        style={{ transformOrigin: "80px 78px" }}
      />

      {/* Precision Crosshair Lines */}
      <line x1="80" y1="16" x2="80" y2="140" stroke="#0B5CFF" strokeWidth="1.2" opacity="0.5" />
      <line x1="18" y1="78" x2="142" y2="78" stroke="#0B5CFF" strokeWidth="1.2" opacity="0.5" />

      {/* Center Target Lock */}
      <circle cx="80" cy="78" r="24" stroke="#7C3AED" strokeWidth="1.3" fill="none" opacity="0.8" />
      <circle cx="80" cy="78" r="14" stroke="#0B5CFF" strokeWidth="1.3" fill="#FFFFFF" />
      <circle cx="80" cy="78" r="4" fill="#7C3AED" />
    </svg>
  </div>
);

/* ═══════════════════════════════════════════════════════════════
   4 SUB-HEADS FOR "WHY IS NAMENOLOGY DIFFERENT"
   ═══════════════════════════════════════════════════════════════ */
const DIFFERENTIATORS = [
  {
    id: "name-base",
    badge: "Acoustic Frequency",
    title: "Name-Base Vibration",
    tagline: "Active Soundwave Identity, Not Astrology",
    description:
      "Unlike astrology that anchors to an arbitrary historical birth moment, Namenology measures the living acoustic vibration of your spoken name. Every time your name is spoken, it radiates real vibrational energy into the world.",
    bulletPoints: [
      "Dynamic acoustic resonance activated whenever spoken",
      "Immune to ambiguous or misrecorded birth hour times",
      "Direct harmonic influence on personal identity",
    ],
    svg: <NameBaseSvg />,
  },
  {
    id: "structured-system",
    badge: "Deterministic Math",
    title: "Structured System",
    tagline: "The Tripartite Equilibrium",
    description:
      "We operate on a calibrated tripartite formula: Official First Name (40%), Official Surname (20%), and Full Name Synergy (40%). This guarantees every structural force in your identity is weighted with mathematical equilibrium.",
    bulletPoints: [
      "Rigorous 40% / 20% / 40% mathematical distribution",
      "Distinguishes personal ambition from ancestral heritage",
      "Calculates compound synergistic harmony",
    ],
    svg: <StructuredSystemSvg />,
  },
  {
    id: "unique-identity",
    badge: "Empirical Blueprint",
    title: "Deterministic Results",
    tagline: "100% Auditable Mathematics",
    description:
      "Namenology removes vague horoscope cliches. Two individuals with the same name characters run through our deterministic engine will generate the exact same mathematical vectors, guaranteeing complete scientific objectivity.",
    bulletPoints: [
      "Zero arbitrary or changing daily fortunes",
      "100% reproducible and verifiable calculations",
      "Closed deterministic library of 100 archetypes",
    ],
    svg: <UniqueIdentitySvg />,
  },
  {
    id: "no-guess-work",
    badge: "Life Vectors",
    title: "Actionable Analysis",
    tagline: "Practical Strategic Intelligence",
    description:
      "Receive precise, actionable intelligence rather than passive predictions. Namenology equips you with clear guidance on career resonance, behavioral dynamics, leadership velocity, and energetic alignment strategies.",
    bulletPoints: [
      "Clear guidance on career, leadership, and relational paths",
      "Empirical metrics on harmonic strengths and vulnerabilities",
      "Strategic optimization for identity harmonization",
    ],
    svg: <NoGuessWorkSvg />,
  },
];

export const WhatMakesUsDifferentSection: React.FC = () => {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  return (
    <section
      id="why-different"
      className="py-20 sm:py-28 bg-[#F8FAFF] relative overflow-hidden text-slate-900 border-t border-indigo-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* ================================================================= */}
        {/* SECTION HEADER                                                     */}
        {/* ================================================================= */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-purple-200/80 bg-purple-50 text-purple-700 text-xs font-semibold mb-3 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>The Scientific Departure</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black tracking-tight font-outfit uppercase leading-tight text-slate-900">
            WHY IS <span className="gradient-text-cosmic-bright">NAMENOLOGY DIFFERENT</span>
          </h2>
        </div>

        {/* ================================================================= */}
        {/* TOP ELEMENT: WITH LITTLE DESCRIPTION AS EXPLICITLY REQUESTED       */}
        {/* ================================================================= */}
        <div className="max-w-4xl mx-auto mb-14 sm:mb-16 p-6 sm:p-8 rounded-2xl bg-white border border-indigo-100 shadow-md shadow-indigo-500/5 text-center">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-widest mb-2">
            <Orbit className="w-3.5 h-3.5" />
            <span>Empirical Science vs. Astrological Guesswork</span>
          </div>
          {/* LITTLE DESCRIPTION ON TOP ELEMENT */}
          <p className="text-sm sm:text-base text-slate-700 leading-relaxed max-w-3xl mx-auto font-normal">
            Traditional systems rely on arbitrary birth-date charts and vague fortune-telling. NAMENOLOGY replaces superstition with computational linguistics and deterministic mathematics — analyzing your spoken name as an active vibrational frequency with 100% reproducible results.
          </p>
        </div>

        {/* ================================================================= */}
        {/* 4 DIFFERENTIATOR CARDS (4 SUB-HEADS)                               */}
        {/* ================================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {DIFFERENTIATORS.map((diff) => {
            const isHovered = hoveredCard === diff.id;
            return (
              <div
                key={diff.id}
                id={`diff-${diff.id}`}
                onMouseEnter={() => setHoveredCard(diff.id)}
                onMouseLeave={() => setHoveredCard(null)}
                className={`
                  relative rounded-2xl p-8 sm:p-10 transition-all duration-300 flex flex-col justify-between
                  border bg-white hover:-translate-y-1.5
                  ${
                    isHovered
                      ? "border-purple-300 shadow-xl shadow-purple-500/10"
                      : "border-slate-200/80 shadow-xs"
                  }
                `}
              >
                <div>
                  {/* Top Bar with Badge & Category */}
                  <div className="flex items-center justify-between gap-3 mb-6">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 border border-blue-200/80 px-3 py-1 rounded">
                      {diff.badge}
                    </span>
                    <span className="font-mono text-xs text-purple-600 font-semibold">
                      #{diff.id}
                    </span>
                  </div>

                  {/* SVG Graphic */}
                  <div className="my-4 py-2 flex items-center justify-center">
                    {diff.svg}
                  </div>

                  {/* Main Title (Sub-head) */}
                  <h3 className="font-outfit font-bold text-2xl text-slate-900 text-center mt-3 mb-1 tracking-tight">
                    {diff.title}
                  </h3>

                  {/* Tagline */}
                  <p className="text-xs font-semibold text-purple-600 text-center mb-3">
                    {diff.tagline}
                  </p>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed text-center mb-6">
                    {diff.description}
                  </p>

                  {/* Bullet Points with Checkmarks */}
                  <div className="space-y-2.5 pt-5 border-t border-slate-100">
                    {diff.bulletPoints.map((point, idx) => (
                      <div key={idx} className="flex items-center gap-2.5 text-xs text-slate-700 font-medium">
                        <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                        <span>{point}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Assurance Bar */}
                <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span className="font-mono text-[10px] text-purple-700 font-medium">100% Deterministic Engine</span>
                  <div className="flex items-center gap-1.5 text-slate-700 font-medium text-xs">
                    <span>Verified Science</span>
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Scientific Oath Banner */}
        <div className="mt-14 sm:mt-18 p-8 sm:p-10 rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-950 text-white relative shadow-xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left max-w-xl">
              <span className="text-[11px] font-bold text-cyan-300 tracking-widest uppercase">
                The Namenology Scientific Pledge
              </span>
              <h4 className="text-xl sm:text-2xl font-bold font-outfit tracking-tight text-white">
                No Astrology. No Fortune Telling. Just Mathematics.
              </h4>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                We believe your name is an active, deterministic acoustic vibration. Every reading produces the exact same result every time — transparent, mathematically auditable, and scientifically reproducible.
              </p>
            </div>

            <div className="flex items-center gap-4 shrink-0">
              <div className="text-right hidden sm:block">
                <span className="block text-xs font-bold text-white">Unicode NFC Validated</span>
                <span className="text-[11px] text-cyan-300">Deterministic Algorithm</span>
              </div>
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
