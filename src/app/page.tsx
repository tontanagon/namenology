import Link from "next/link";
import { Navbar, NamenologyLogo } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { NameAnalyzePath } from "@/components/home/NameAnalyzePath";
import { CosmicHeroOrbitalAnimation } from "@/components/home/CosmicHeroOrbitalAnimation";
import { WhatIsNamenologySection } from "@/components/home/WhatIsNamenologySection";
import { HowItWorksSection } from "@/components/home/HowItWorksSection";
import { WhatMakesUsDifferentSection } from "@/components/home/WhatMakesUsDifferentSection";
import { CheckCircle2, Orbit } from "lucide-react";

/* ═══════════════════════════════════════════════════════════════
   HOMEPAGE COMPONENT
   - Hero: Dark Blue Galaxy Theme with 2-Column Split:
     * Left: Brand Logo, Slogan, Little Description, Trust Badges
     * Right: What Is Namenology Orbital Galaxy Animation
       (Central Human & Planet core + 5 orbiting pillars)
     * Below: Deterministic Name Analysis Form
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
            1. HEAD:
               - Left: Logo, Slogan, Little Description, Trust Badges
               - Right: What Is Namenology Orbital Animation
            2. ANALYZE NAME: Form for typing name & Analyze button
           ═══════════════════════════════════════════════════ */}
        <section className="relative overflow-hidden pt-10 pb-16 sm:pt-16 sm:pb-24 bg-gradient-to-b from-[#FAFCFF] via-[#F6F8FE] to-white text-slate-900">
          {/* Ethereal Nebular Background Glows */}
          <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-b from-blue-500/[0.07] via-purple-500/[0.06] to-transparent rounded-full blur-[120px] pointer-events-none -z-10" />
          <div className="absolute top-1/2 right-1/4 w-[600px] h-[500px] bg-gradient-to-tr from-purple-500/[0.06] via-cyan-400/[0.05] to-transparent rounded-full blur-[120px] pointer-events-none -z-10" />

          {/* Deep Galaxy Ambient Stardust */}
          <div className="absolute inset-0 stardust-bright-field opacity-60 pointer-events-none -z-10" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            {/* 1. HEAD: Split into Left (Logo, Slogan, Description) and Right (Orbital Animation) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 xl:gap-14 items-center">
              {/* LEFT SIDE: Logo, Slogan, Description & Trust Indicators */}
              <div className="lg:col-span-6 text-center lg:text-left space-y-6">
                {/* Cosmic Badge */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-purple-200/80 bg-purple-50/80 text-purple-700 text-xs font-semibold shadow-2xs backdrop-blur-md">
                  <Orbit className="w-3.5 h-3.5 text-blue-600 animate-spin" style={{ animationDuration: "12s" }} />
                  <span>Deterministic Solar Name Science</span>
                  <span className="w-1 h-1 rounded-full bg-blue-500" />
                  <span className="text-blue-600 font-medium">AI Resonance Matrix</span>
                </div>

                {/* LOGO & BRAND IDENTITY */}
                <div className="flex items-center justify-center lg:justify-start gap-3.5">
                  <div className="relative">
                    <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 blur-md opacity-30 animate-pulse" />
                    <NamenologyLogo className="relative w-12 h-12" />
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-2xl sm:text-3xl font-black tracking-widest font-outfit uppercase leading-none text-slate-900">
                      NAMENOLOGY
                    </span>
                    <span className="text-[10px] tracking-widest uppercase font-semibold text-blue-600 font-mono mt-1">
                      Celestial Identity Science
                    </span>
                  </div>
                </div>

                {/* SLOGAN (HEADLINE) */}
                <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-[54px] font-black tracking-tight font-outfit leading-[1.12] text-slate-900">
                  The Power of Your Name.
                  <br />
                  <span className="gradient-text-cosmic-bright">The Path of Your Life.</span>
                </h1>

                {/* LITTLE DESCRIPTION */}
                <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl mx-auto lg:mx-0 font-normal">
                  Decode your official name through mathematical harmonics, Unicode acoustic resonance, and deterministic vibrational science. Uncover the celestial blueprint encoded in your identity.
                </p>

                {/* TRUST INDICATORS */}
                {/* <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-4 text-xs sm:text-sm text-slate-600 font-medium">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50/90 border border-slate-200/80 shadow-2xs">
                    <CheckCircle2 className="w-4 h-4 text-blue-600" />
                    <span>2 Complimentary Analyses</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50/90 border border-slate-200/80 shadow-2xs">
                    <CheckCircle2 className="w-4 h-4 text-purple-600" />
                    <span>Deterministic Solar Formula</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50/90 border border-slate-200/80 shadow-2xs">
                    <CheckCircle2 className="w-4 h-4 text-blue-600" />
                    <span>Global Unicode NFC Script</span>
                  </div>
                </div> */}
              </div>

              {/* RIGHT SIDE: What is Namenology Galaxy Animation (Human & Planet Core + Orbiting Pillars) */}
              <div className="lg:col-span-6 flex justify-center">
                <CosmicHeroOrbitalAnimation />
              </div>
            </div>

            {/* 2. ANALYZE NAME: Form for typing name and button for analyze */}
            <div className="mt-14 sm:mt-18 relative z-20">
              <NameAnalyzePath />
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════
            HOW NAMENOLOGY WORKS
           ═══════════════════════════════════════════════════ */}
        <HowItWorksSection />

        {/* ═══════════════════════════════════════════════════
            WHAT IS NAMENOLOGY
           ═══════════════════════════════════════════════════ */}
        <WhatIsNamenologySection />

        {/* ═══════════════════════════════════════════════════
            WHY NAMENOLOGY IS DIFFERENT
           ═══════════════════════════════════════════════════ */}
        <WhatMakesUsDifferentSection />
      </main>

      <Footer variant="default" />
    </div>
  );
}
