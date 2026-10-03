import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { NameAnalyzePath } from "@/components/home/NameAnalyzePath";
import { WhatIsNamenologySection } from "@/components/home/WhatIsNamenologySection";
import { HowItWorksSection } from "@/components/home/HowItWorksSection";
import { WhatMakesUsDifferentSection } from "@/components/home/WhatMakesUsDifferentSection";
import { CheckCircle2, Orbit } from "lucide-react";

/* ═══════════════════════════════════════════════════════════════
   BRIGHT SOLAR SYSTEM NEBULA ORBITAL SVG DECORATION
   - Rotating planetary ellipses with glowing celestial nodes
   - Specially calibrated for bright white/iridescent canvas
   ═══════════════════════════════════════════════════════════════ */
const BrightSolarSystemOrbitalDecoration = () => (
  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[850px] pointer-events-none select-none">
    {/* Ethereal bright pastel nebula glow */}
    <div className="absolute inset-16 bg-gradient-to-tr from-blue-500/[0.08] via-purple-500/[0.08] to-cyan-400/[0.06] rounded-full blur-[100px]" />

    <svg className="w-full h-full opacity-60" viewBox="0 0 850 850" fill="none">
      {/* Central Star / Core Nexus */}
      <circle cx="425" cy="425" r="16" fill="url(#bright-sun-grad)" opacity="0.9" />
      <circle cx="425" cy="425" r="32" stroke="#0B5CFF" strokeWidth="0.8" opacity="0.3" strokeDasharray="3 4" />

      {/* Orbit 1: Inner Planetary Path */}
      <ellipse cx="425" cy="425" rx="140" ry="110" stroke="#93C5FD" strokeWidth="1" opacity="0.6" />
      <g className="animate-[spin_24s_linear_infinite]" style={{ transformOrigin: "425px 425px" }}>
        <circle cx="565" cy="425" r="5" fill="#0B5CFF" />
        <circle cx="565" cy="425" r="9" stroke="#0B5CFF" strokeWidth="0.8" opacity="0.4" />
      </g>

      {/* Orbit 2: Mid Planetary Path */}
      <ellipse cx="425" cy="425" rx="240" ry="190" stroke="#C7D2FE" strokeWidth="1" opacity="0.7" strokeDasharray="5 7" />
      <g className="animate-[spin_38s_linear_infinite_reverse]" style={{ transformOrigin: "425px 425px" }}>
        <circle cx="185" cy="425" r="7" fill="#7C3AED" />
        {/* Planetary Ring */}
        <ellipse cx="185" cy="425" rx="14" ry="5" stroke="#A78BFA" strokeWidth="1" opacity="0.8" />
      </g>

      {/* Orbit 3: Outer Planetary Path */}
      <ellipse cx="425" cy="425" rx="350" ry="280" stroke="#E0E7FF" strokeWidth="0.9" opacity="0.8" />
      <g className="animate-[spin_56s_linear_infinite]" style={{ transformOrigin: "425px 425px" }}>
        <circle cx="775" cy="425" r="6" fill="#4F46E5" />
        <circle cx="784" cy="420" r="2" fill="#0B5CFF" />
      </g>

      {/* Orbit 4: Deep Celestial Boundary */}
      <circle cx="425" cy="425" rx="410" stroke="#EEF2FF" strokeWidth="0.8" />

      {/* Axial astrolabe alignment markers */}
      <line x1="425" y1="20" x2="425" y2="830" stroke="#93C5FD" strokeWidth="0.6" opacity="0.4" strokeDasharray="2 4" />
      <line x1="20" y1="425" x2="830" y2="425" stroke="#93C5FD" strokeWidth="0.6" opacity="0.4" strokeDasharray="2 4" />

      {/* Diagonal rays */}
      <line x1="130" y1="130" x2="720" y2="720" stroke="#C4B5FD" strokeWidth="0.5" opacity="0.3" />
      <line x1="720" y1="130" x2="130" y2="720" stroke="#C4B5FD" strokeWidth="0.5" opacity="0.3" />

      {/* Celestial Nodes */}
      <circle cx="425" cy="15" r="2.5" fill="#0B5CFF" opacity="0.8" />
      <circle cx="835" cy="425" r="2.5" fill="#7C3AED" opacity="0.8" />
      <circle cx="425" cy="835" r="2.5" fill="#4F46E5" opacity="0.8" />
      <circle cx="15" cy="425" r="2.5" fill="#0B5CFF" opacity="0.8" />

      <defs>
        <radialGradient id="bright-sun-grad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="40%" stopColor="#93C5FD" />
          <stop offset="80%" stopColor="#818CF8" />
          <stop offset="100%" stopColor="#7C3AED" stopOpacity="0" />
        </radialGradient>
      </defs>
    </svg>
  </div>
);

/* ═══════════════════════════════════════════════════════════════
   HOMEPAGE COMPONENT — BRIGHT MOOD
   - Theme: Blue / Purple / White Tone Mystery Solar System Nebula
   - Bright, Luminous, Modern & Minimal
   - 5 Elements:
     1. Head (nameweb & little description)
     2. Analyze name (form for typing name & button)
     3. What is Namenology (6 sub-heads)
     4. How Namenology works (5 sub-heads & footer element description)
     5. Why is Namenology different (4 sub-heads & top element description)
   ═══════════════════════════════════════════════════════════════ */
export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 selection:bg-indigo-500/15 selection:text-indigo-700 overflow-x-hidden relative">
      {/* Background Starfield Pattern */}
      <div className="fixed inset-0 stardust-bright-field pointer-events-none opacity-60 z-0" />

      <Navbar variant="default" />

      <main className="flex-1 relative z-10">
        {/* ═══════════════════════════════════════════════════
            ELEMENT 1 & 2:
            1. HEAD: Nameweb & Little Description
            2. ANALYZE NAME: Form for typing name & Analyze button
           ═══════════════════════════════════════════════════ */}
        <section className="relative overflow-hidden pt-10 pb-16 sm:pt-16 sm:pb-24 bg-gradient-to-b from-[#FAFCFF] via-[#F6F8FE] to-white">
          {/* Ethereal Nebular Background Glows */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-b from-blue-500/[0.08] via-purple-500/[0.07] to-transparent rounded-full blur-[120px] pointer-events-none -z-10" />
          <BrightSolarSystemOrbitalDecoration />

          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            {/* 1. HEAD: Nameweb and Little Description */}
            <div className="text-center max-w-3xl mx-auto">
              {/* Cosmic Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-purple-200/80 bg-purple-50/80 text-purple-700 text-xs font-semibold mb-4 shadow-2xs backdrop-blur-md">
                <Orbit className="w-3.5 h-3.5 text-blue-600 animate-spin" style={{ animationDuration: "12s" }} />
                <span>Deterministic Solar Name Science</span>
                <span className="w-1 h-1 rounded-full bg-blue-500" />
                <span className="text-blue-600 font-medium">AI Resonance Matrix</span>
              </div>

              {/* 1. HEAD - NAMEWEB */}
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight font-outfit leading-[1.1] text-slate-900">
                <span className="block text-2xl sm:text-3xl lg:text-4xl font-medium tracking-widest text-slate-500 uppercase mb-2">
                  NAMENOLOGY
                </span>
                The Power of Your Name
                <br />
                The Path of Your Life
              </h1>

              {/* 1. HEAD - LITTLE DESCRIPTION */}
              <p className="mt-4 sm:mt-5 text-sm sm:text-base lg:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
                Decode your official name through mathematical harmonics, Unicode acoustic resonance, and deterministic vibrational science. Uncover the celestial blueprint encoded in your identity.
              </p>

              {/* Trust Indicators */}
              <div className="mt-5 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-slate-600 font-medium">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                  <span>2 Complimentary Analyses</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-600" />
                  <span>Deterministic Solar Formula</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                  <span>Global Unicode NFC Script</span>
                </div>
              </div>
            </div>

            {/* 2. ANALYZE NAME: Form for typing name and button for analyze */}
            <div className="mt-10 sm:mt-12">
              <NameAnalyzePath />
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════
            ELEMENT 3:
            WHAT IS NAMENOLOGY (6 SUB-HEADS)
           ═══════════════════════════════════════════════════ */}
        <WhatIsNamenologySection />

        {/* ═══════════════════════════════════════════════════
            ELEMENT 4:
            HOW NAMENOLOGY WORKS (5 SUB-HEADS & FOOTER ELEMENT DESCRIPTION)
           ═══════════════════════════════════════════════════ */}
        <HowItWorksSection />

        {/* ═══════════════════════════════════════════════════
            ELEMENT 5:
            WHY IS NAMENOLOGY DIFFERENT (4 SUB-HEADS & TOP ELEMENT DESCRIPTION)
           ═══════════════════════════════════════════════════ */}
        <WhatMakesUsDifferentSection />
      </main>

      <Footer variant="default" />
    </div>
  );
}
