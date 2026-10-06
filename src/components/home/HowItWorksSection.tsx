"use client";

import React, { useState } from "react";
import { Sparkles, Globe2, ArrowRight } from "lucide-react";

/* ═══════════════════════════════════════════════════════════════
   4 COSMIC STEP SVGS FOR "HOW NAMENOLOGY WORKS"
   1. Enter Your Official Name: Holographic input card with First/Surname
   2. Letters Become Numbers: Letters converting into numbers 0–9
   3. Numbers Are Combined: 40% / 20% / 40% synthesis into 1–100
   4. Receive Your Analysis: Radiant multi-dimensional dossier report
   ═══════════════════════════════════════════════════════════════ */

// 1. ENTER YOUR OFFICIAL NAME SVG
const OfficialNameInputSvg = () => (
  <div className="relative w-32 h-32 sm:w-36 sm:h-36 mx-auto flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
    <svg viewBox="0 0 160 160" className="w-full h-full select-none" fill="none">
      {/* Outer ambient guide */}
      <circle cx="80" cy="80" r="68" stroke="#EEF2FF" strokeWidth="1" />
      <circle cx="80" cy="80" r="60" stroke="#C7D2FE" strokeWidth="0.8" strokeDasharray="3 4" opacity="0.7" />

      {/* Official Document / ID Badge Card */}
      <rect
        x="24"
        y="36"
        width="112"
        height="88"
        rx="8"
        fill="#FFFFFF"
        stroke="#CBD5E1"
        strokeWidth="1.2"
        filter="drop-shadow(0 4px 6px rgba(0, 0, 0, 0.04))"
      />

      {/* Card Header Stripe */}
      <path
        d="M 24 44 Q 24 36 32 36 L 128 36 Q 136 36 136 44 L 136 52 L 24 52 Z"
        fill="#F8FAFC"
      />
      <circle cx="36" cy="44" r="3" fill="#0B5CFF" />
      <circle cx="46" cy="44" r="3" fill="#818CF8" />
      <circle cx="56" cy="44" r="3" fill="#CBD5E1" />

      {/* Field 1: First Name Input Box */}
      <rect x="34" y="60" width="92" height="22" rx="4" fill="#F8FAFF" stroke="#E2E8F0" strokeWidth="1" />
      <text x="42" y="74" fill="#0F172A" fontSize="8.5" fontFamily="var(--font-sans), sans-serif" fontWeight="bold">
        First Name
      </text>
      {/* Blinking cursor simulation */}
      <line x1="90" y1="65" x2="90" y2="77" stroke="#0B5CFF" strokeWidth="1.5">
        <animate attributeName="opacity" values="1;0;1" dur="1.2s" repeatCount="indefinite" />
      </line>

      {/* Field 2: Surname Input Box */}
      <rect x="34" y="88" width="92" height="22" rx="4" fill="#F8FAFF" stroke="#E2E8F0" strokeWidth="1" />
      <text x="42" y="102" fill="#0F172A" fontSize="8.5" fontFamily="var(--font-sans), sans-serif" fontWeight="bold">
        Surname
      </text>
      <circle cx="116" cy="99" r="3.5" fill="#10B981" opacity="0.85" />

      {/* Corner precision brackets */}
      <path d="M 28 46 L 28 42 L 32 42" stroke="#818CF8" strokeWidth="1" fill="none" />
      <path d="M 132 46 L 132 42 L 128 42" stroke="#818CF8" strokeWidth="1" fill="none" />
      <path d="M 28 114 L 28 118 L 32 118" stroke="#818CF8" strokeWidth="1" fill="none" />
      <path d="M 132 114 L 132 118 L 128 118" stroke="#818CF8" strokeWidth="1" fill="none" />
    </svg>
  </div>
);

// 2. LETTERS BECOME NUMBERS SVG
const LettersToNumbersSvg = () => (
  <div className="relative w-32 h-32 sm:w-36 sm:h-36 mx-auto flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
    <svg viewBox="0 0 160 160" className="w-full h-full select-none" fill="none">
      {/* Background orbital guide */}
      <circle cx="80" cy="80" r="68" stroke="#EEF2FF" strokeWidth="1" />

      {/* Left Input: Letter Nodes */}
      <g>
        <circle cx="40" cy="54" r="14" fill="#FFFFFF" stroke="#0B5CFF" strokeWidth="1.3" />
        <text x="40" y="58" textAnchor="middle" fill="#0B5CFF" fontSize="11" fontFamily="var(--font-sans), sans-serif" fontWeight="bold">
          A
        </text>
      </g>
      <g>
        <circle cx="40" cy="106" r="14" fill="#FFFFFF" stroke="#4F46E5" strokeWidth="1.3" />
        <text x="40" y="110" textAnchor="middle" fill="#4F46E5" fontSize="11" fontFamily="var(--font-sans), sans-serif" fontWeight="bold">
          N
        </text>
      </g>

      {/* Central Prism / Converter Gateway */}
      <polygon
        points="80,50 98,80 80,110 62,80"
        fill="#FFFFFF"
        stroke="#7C3AED"
        strokeWidth="1.5"
      />
      <circle cx="80" cy="80" r="4" fill="#7C3AED" />
      {/* Dynamic scanning rays */}
      <line x1="54" y1="54" x2="72" y2="74" stroke="#818CF8" strokeWidth="1.2" strokeDasharray="2 2" />
      <line x1="54" y1="106" x2="72" y2="86" stroke="#818CF8" strokeWidth="1.2" strokeDasharray="2 2" />
      <line x1="88" y1="74" x2="106" y2="54" stroke="#38BDF8" strokeWidth="1.2" strokeDasharray="2 2" />
      <line x1="88" y1="86" x2="106" y2="106" stroke="#38BDF8" strokeWidth="1.2" strokeDasharray="2 2" />

      {/* Right Output: Number Nodes (0–9) */}
      <g>
        <circle cx="120" cy="54" r="14" fill="#FFFFFF" stroke="#0284C7" strokeWidth="1.3" />
        <text x="120" y="58" textAnchor="middle" fill="#0284C7" fontSize="11" fontFamily="monospace" fontWeight="bold">
          1
        </text>
      </g>
      <g>
        <circle cx="120" cy="106" r="14" fill="#FFFFFF" stroke="#7C3AED" strokeWidth="1.3" />
        <text x="120" y="110" textAnchor="middle" fill="#7C3AED" fontSize="11" fontFamily="monospace" fontWeight="bold">
          5
        </text>
      </g>

      {/* Numerical conversion indicator range badge */}
      <rect x="62" y="126" width="36" height="15" rx="7.5" fill="#F8FAFF" stroke="#C7D2FE" strokeWidth="0.8" />
      <text x="80" y="137" textAnchor="middle" fill="#4F46E5" fontSize="7.5" fontFamily="monospace" fontWeight="bold">
        0–9
      </text>
    </svg>
  </div>
);

// 3. NUMBERS ARE COMBINED SVG
const NumbersCombinedSvg = () => (
  <div className="relative w-32 h-32 sm:w-36 sm:h-36 mx-auto flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
    <svg viewBox="0 0 160 160" className="w-full h-full select-none" fill="none">
      {/* Outer calibration ring */}
      <circle cx="80" cy="80" r="68" stroke="#EEF2FF" strokeWidth="1" />
      <circle
        cx="80"
        cy="80"
        r="58"
        stroke="#C7D2FE"
        strokeWidth="0.8"
        strokeDasharray="2 4"
        className="animate-[spin_40s_linear_infinite]"
        style={{ transformOrigin: "80px 80px" }}
      />

      {/* Tripartite Inflow Nodes */}
      {/* Node 1: First Name (40%) Top Left */}
      <g>
        <circle cx="44" cy="46" r="13" fill="#FFFFFF" stroke="#0B5CFF" strokeWidth="1.3" />
        <text x="44" y="49" textAnchor="middle" fill="#0B5CFF" fontSize="8" fontFamily="monospace" fontWeight="bold">40%</text>
      </g>

      {/* Node 2: Surname (20%) Top Right */}
      <g>
        <circle cx="116" cy="46" r="13" fill="#FFFFFF" stroke="#4F46E5" strokeWidth="1.3" />
        <text x="116" y="49" textAnchor="middle" fill="#4F46E5" fontSize="8" fontFamily="monospace" fontWeight="bold">20%</text>
      </g>

      {/* Node 3: Full Name (40%) Bottom Center */}
      <g>
        <circle cx="80" cy="126" r="13" fill="#FFFFFF" stroke="#7C3AED" strokeWidth="1.3" />
        <text x="80" y="129" textAnchor="middle" fill="#7C3AED" fontSize="8" fontFamily="monospace" fontWeight="bold">40%</text>
      </g>

      {/* Energy Stream Confluence Lines */}
      <path d="M 53 55 L 72 73" stroke="#0B5CFF" strokeWidth="1.4" strokeDasharray="2 2" />
      <path d="M 107 55 L 88 73" stroke="#4F46E5" strokeWidth="1.4" strokeDasharray="2 2" />
      <path d="M 80 113 L 80 92" stroke="#7C3AED" strokeWidth="1.4" strokeDasharray="2 2" />

      {/* Central Result Nexus: 1–100 */}
      <circle cx="80" cy="80" r="18" fill="#FFFFFF" stroke="#0B5CFF" strokeWidth="1.6" filter="drop-shadow(0 2px 4px rgba(11, 92, 255, 0.15))" />
      <circle cx="80" cy="80" r="14" fill="#EFF6FF" />
      <text x="80" y="83" textAnchor="middle" fill="#0B5CFF" fontSize="8.5" fontFamily="monospace" fontWeight="bold">
        1–100
      </text>
    </svg>
  </div>
);

// 4. RECEIVE YOUR ANALYSIS SVG
const ReceiveAnalysisSvg = () => (
  <div className="relative w-32 h-32 sm:w-36 sm:h-36 mx-auto flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
    <svg viewBox="0 0 160 160" className="w-full h-full select-none" fill="none">
      {/* Outer ambient circle */}
      <circle cx="80" cy="80" r="68" stroke="#EEF2FF" strokeWidth="1" />

      {/* Analysis Report Hologram Card */}
      <rect
        x="32"
        y="28"
        width="96"
        height="104"
        rx="8"
        fill="#FFFFFF"
        stroke="#CBD5E1"
        strokeWidth="1.2"
        filter="drop-shadow(0 4px 8px rgba(0, 0, 0, 0.04))"
      />

      {/* Card Header Badge */}
      <rect x="42" y="38" width="46" height="8" rx="4" fill="#DBEAFE" />
      <circle cx="114" cy="42" r="4" fill="#0B5CFF" />

      {/* Dimension 1: Personality Vector Bar */}
      <text x="42" y="58" fill="#475569" fontSize="6.5" fontFamily="var(--font-sans), sans-serif" fontWeight="bold">
        Personality
      </text>
      <rect x="42" y="62" width="76" height="5" rx="2.5" fill="#F1F5F9" />
      <rect x="42" y="62" width="58" height="5" rx="2.5" fill="#0B5CFF" />

      {/* Dimension 2: Relationships Vector Bar */}
      <text x="42" y="78" fill="#475569" fontSize="6.5" fontFamily="var(--font-sans), sans-serif" fontWeight="bold">
        Relationships
      </text>
      <rect x="42" y="82" width="76" height="5" rx="2.5" fill="#F1F5F9" />
      <rect x="42" y="82" width="66" height="5" rx="2.5" fill="#4F46E5" />

      {/* Dimension 3: Well-Being Vector Bar */}
      <text x="42" y="98" fill="#475569" fontSize="6.5" fontFamily="var(--font-sans), sans-serif" fontWeight="bold">
        Well-Being
      </text>
      <rect x="42" y="102" width="76" height="5" rx="2.5" fill="#F1F5F9" />
      <rect x="42" y="102" width="52" height="5" rx="2.5" fill="#7C3AED" />

      {/* Bottom verified watermark */}
      <circle cx="80" cy="120" r="4.5" fill="#FFFFFF" stroke="#0B5CFF" strokeWidth="1" />
      <circle cx="80" cy="120" r="2" fill="#0B5CFF" />
    </svg>
  </div>
);

/* ═══════════════════════════════════════════════════════════════
   4 STEPS AS EXPLICITLY REQUESTED BY USER
   ═══════════════════════════════════════════════════════════════ */
const HOW_STEPS = [
  {
    stepNumber: "01",
    phase: "Step 1",
    id: "enter-name",
    title: "Enter Your Official Name",
    description:
      "Enter your first name and surname exactly as they appear on your official documents.",
    svg: <OfficialNameInputSvg />,
  },
  {
    stepNumber: "02",
    phase: "Step 2",
    id: "letters-to-numbers",
    title: "Letters Become Numbers",
    description:
      "Our system converts the letters in your first name and surname into numbers from 0–9.",
    svg: <LettersToNumbersSvg />,
  },
  {
    stepNumber: "03",
    phase: "Step 3",
    id: "numbers-combined",
    title: "Numbers Are Combined",
    description:
      "The numbers from your first name, surname, and full name are calculated to create numbers from 1–100.",
    svg: <NumbersCombinedSvg />,
  },
  {
    stepNumber: "04",
    phase: "Step 4",
    id: "receive-analysis",
    title: "Receive Your Analysis",
    description:
      "You receive an analysis explaining the meanings and characteristics associated with your numbers.",
    svg: <ReceiveAnalysisSvg />,
  },
];

export const HowItWorksSection: React.FC = () => {
  const [hoveredStep, setHoveredStep] = useState<string | null>(null);

  return (
    <section
      id="how-namenology-works"
      className="py-16 sm:py-24 bg-[#F8FAFF] relative overflow-hidden text-slate-900 border-t border-indigo-50"
    >
      {/* Background ethereal bright glowing nebulae */}
      <div className="absolute top-1/4 left-1/4 w-[450px] h-[450px] bg-blue-500/[0.04] rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[450px] h-[450px] bg-purple-500/[0.04] rounded-full blur-[100px] pointer-events-none" />

      {/* Subtle orbital lines decoration */}
      <svg
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[750px] pointer-events-none select-none opacity-30"
        viewBox="0 0 800 800"
        fill="none"
      >
        <circle cx="400" cy="400" r="380" stroke="#E0E7FF" strokeWidth="1" />
        <circle cx="400" cy="400" r="280" stroke="#C7D2FE" strokeWidth="0.8" strokeDasharray="4 6" />
        <circle cx="400" cy="400" r="180" stroke="#DDD6FE" strokeWidth="0.6" />
      </svg>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* ================================================================= */}
        {/* SECTION HEADER                                                     */}
        {/* ================================================================= */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-blue-200/80 bg-blue-50/80 text-blue-700 text-xs font-semibold mb-3 shadow-2xs backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>The Process</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight font-outfit uppercase leading-tight text-slate-900">
            HOW <span className="gradient-text-cosmic-bright">NAMENOLOGY WORKS</span>
          </h2>

          <p className="mt-4 text-sm sm:text-base text-slate-600 leading-relaxed font-normal max-w-2xl mx-auto">
            Namenology explores three key areas:{" "}
            <strong className="text-slate-900 font-semibold">Personality</strong>,{" "}
            <strong className="text-slate-900 font-semibold">Life Influence & Relationships</strong>, and{" "}
            <strong className="text-slate-900 font-semibold">Well-Being</strong>.
          </p>
        </div>

        {/* ================================================================= */}
        {/* 4-STEP HORIZONTAL PIPELINE WITH GLASSMORPHIC CARDS                 */}
        {/* ================================================================= */}
        <div className="relative py-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 items-stretch justify-center">
            {HOW_STEPS.map((step, idx) => {
              const isHovered = hoveredStep === step.id;

              return (
                <div key={step.id} className="relative flex flex-col">
                  {/* Card Container */}
                  <div
                    onMouseEnter={() => setHoveredStep(step.id)}
                    onMouseLeave={() => setHoveredStep(null)}
                    className={`
                      relative rounded-2xl p-5 sm:p-6 transition-all duration-300 flex flex-col justify-between
                      border bg-white hover:-translate-y-1.5 h-full group
                      ${isHovered
                        ? "border-blue-300 shadow-xl shadow-indigo-500/10"
                        : "border-slate-200/80 shadow-xs"
                      }
                    `}
                  >
                    <div>
                      {/* Step Indicator Header */}
                      <div className="flex items-center justify-between mb-3">
                        {/* <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 border border-blue-200/70 px-2 py-0.5 rounded">
                          #{step.stepNumber}
                        </span> */}
                        <span className={`text-xs uppercase tracking-wider font-semibold
                        ${isHovered
                            ? "text-blue-700"
                            : "text-slate-400"
                          }`}>
                          {step.phase}
                        </span>
                      </div>

                      {/* SVG Graphic */}
                      <div className="my-2 flex items-center justify-center relative">
                        {step.svg}
                      </div>

                      {/* Title */}
                      <h3 className="font-outfit font-bold text-lg sm:text-xl text-slate-900 text-center mt-3 mb-2 tracking-tight group-hover:text-blue-600 transition-colors">
                        {step.title}
                      </h3>

                      {/* Description */}
                      <p className="text-sm text-slate-600 leading-relaxed text-center font-normal">
                        {step.description}
                      </p>
                    </div>

                    {/* Bottom subtle accent line */}
                    <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-center">
                      <div
                        className={`
                          h-0.5 rounded-full transition-all duration-500
                          ${isHovered ? "w-12 bg-gradient-to-r from-blue-600 to-indigo-600" : "w-6 bg-slate-200"}
                        `}
                      />
                    </div>
                  </div>

                  {/* Desktop Connecting Chevrons (between cards) */}
                  {idx < HOW_STEPS.length - 1 && (
                    <div className="hidden lg:flex items-center absolute -right-3 top-1/2 -translate-y-1/2 w-6 pointer-events-none z-20">
                      <div className="relative w-full flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-blue-500 ring-2 ring-blue-100 shadow-xs" />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ================================================================= */}
        {/* SUPPLEMENTARY DESCRIPTIONS — ARTICLE STYLE (NO CARDS / NO BORDERS) */}
        {/* ================================================================= */}
        <div className="mt-14 sm:mt-18 max-w-3xl mx-auto pt-10 sm:pt-12 border-t border-slate-200/70 space-y-8 sm:space-y-10">
          {/* 1. In Simple Terms */}
          <article className="space-y-2.5">
            <h4 className="font-outfit font-bold text-xl sm:text-2xl text-slate-900 tracking-tight">
              In Simple Terms
            </h4>
            <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-normal">
              In simple terms, Namenology transforms the letters of your official name into numbers, combines them,
              and interprets the resulting numbers to provide insights into the three key areas above.
            </p>
          </article>

          {/* 2. One Numerical System, Different Languages */}
          <article className="space-y-2.5 pt-8 sm:pt-10 border-t border-slate-200/60">
            <h4 className="font-outfit font-bold text-xl sm:text-2xl text-slate-900 tracking-tight">
              One Numerical System, Different Languages
            </h4>
            <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-normal">
              People around the world use different languages and alphabets, but numbers are universal.
              Namenology uses one numerical system to explore names through numbers, creating a common framework for
              understanding names across languages.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
};
