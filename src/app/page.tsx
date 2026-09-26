import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ScoreGauge } from "@/components/analysis/ScoreGauge";
import {
  ArrowRight,
  CheckCircle2,
  Globe,
  Cpu,
  BarChart3,
  Atom,
  Lightbulb,
  Search,
  ChevronRight,
  Layers,
  Target,
  Zap,
  Brain,
  TrendingUp,
} from "lucide-react";

/* ═══════════════════════════════════════════════
   ORBITAL SVG DECORATION COMPONENTS
   ═══════════════════════════════════════════════ */

const OrbitalDecoration = () => (
  <svg
    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] pointer-events-none select-none opacity-[0.04]"
    viewBox="0 0 700 700"
    fill="none"
  >
    {/* Outer orbital */}
    <circle cx="350" cy="350" r="340" stroke="#0B5CFF" strokeWidth="0.8" />
    {/* Middle orbital */}
    <circle cx="350" cy="350" r="260" stroke="#4F46E5" strokeWidth="0.6" strokeDasharray="4 6" />
    {/* Inner orbital */}
    <circle cx="350" cy="350" r="180" stroke="#7C3AED" strokeWidth="0.5" />
    {/* Cross grid lines */}
    <line x1="350" y1="10" x2="350" y2="690" stroke="#0B5CFF" strokeWidth="0.3" opacity="0.5" />
    <line x1="10" y1="350" x2="690" y2="350" stroke="#0B5CFF" strokeWidth="0.3" opacity="0.5" />
    {/* Diagonal */}
    <line x1="100" y1="100" x2="600" y2="600" stroke="#4F46E5" strokeWidth="0.2" opacity="0.3" />
    <line x1="600" y1="100" x2="100" y2="600" stroke="#4F46E5" strokeWidth="0.2" opacity="0.3" />
    {/* Small accent dots */}
    <circle cx="350" cy="10" r="3" fill="#0B5CFF" opacity="0.3" />
    <circle cx="690" cy="350" r="3" fill="#4F46E5" opacity="0.3" />
    <circle cx="350" cy="690" r="3" fill="#7C3AED" opacity="0.3" />
    <circle cx="10" cy="350" r="3" fill="#22D3EE" opacity="0.3" />
  </svg>
);

const HeroVisual = () => (
  <div className="relative w-full max-w-[400px] aspect-square mx-auto">
    {/* Animated orbital rings */}
    <div className="absolute inset-0 animate-orbit opacity-30">
      <svg viewBox="0 0 400 400" fill="none" className="w-full h-full">
        <ellipse cx="200" cy="200" rx="190" ry="80" stroke="#0B5CFF" strokeWidth="0.8"
          transform="rotate(-25 200 200)" />
      </svg>
    </div>
    <div className="absolute inset-0 animate-orbit-reverse opacity-20">
      <svg viewBox="0 0 400 400" fill="none" className="w-full h-full">
        <ellipse cx="200" cy="200" rx="170" ry="60" stroke="#7C3AED" strokeWidth="0.6"
          transform="rotate(40 200 200)" />
      </svg>
    </div>
    {/* Central sphere with gradient */}
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full bg-gradient-to-br from-brand-500 via-indigo-600 to-violet-600 opacity-90 blur-[1px] animate-pulse-glow" />
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-36 h-36 rounded-full bg-gradient-to-br from-brand-500 via-indigo-500 to-violet-500 flex items-center justify-center shadow-glow-blue">
      <div className="text-center text-white">
        <div className="text-3xl font-black tracking-tighter">N</div>
        <div className="text-[9px] uppercase tracking-[0.3em] font-medium opacity-80 mt-0.5">Analysis</div>
      </div>
    </div>
    {/* Floating data points */}
    <div className="absolute top-8 right-12 animate-float" style={{ animationDelay: "0s" }}>
      <div className="bg-white/90 backdrop-blur-sm border border-border rounded-xl px-3 py-2 shadow-card">
        <div className="text-[10px] text-muted-foreground font-medium">Life Path</div>
        <div className="text-lg font-black text-brand-500">7</div>
      </div>
    </div>
    <div className="absolute bottom-16 left-4 animate-float" style={{ animationDelay: "2s" }}>
      <div className="bg-white/90 backdrop-blur-sm border border-border rounded-xl px-3 py-2 shadow-card">
        <div className="text-[10px] text-muted-foreground font-medium">Synergy</div>
        <div className="text-lg font-black text-indigo-600">92%</div>
      </div>
    </div>
    <div className="absolute top-20 left-0 animate-float" style={{ animationDelay: "4s" }}>
      <div className="bg-white/90 backdrop-blur-sm border border-border rounded-xl px-3 py-2 shadow-card">
        <div className="text-[10px] text-muted-foreground font-medium">Energy</div>
        <div className="text-lg font-black text-violet-600">✦</div>
      </div>
    </div>
    {/* Small orbital accent particles */}
    <div className="absolute top-4 left-1/2 w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
    <div className="absolute bottom-8 right-20 w-1 h-1 rounded-full bg-brand-500 animate-pulse" style={{ animationDelay: "1s" }} />
    <div className="absolute top-1/3 right-0 w-1 h-1 rounded-full bg-violet-500 animate-pulse" style={{ animationDelay: "2s" }} />
  </div>
);

/* ═══════════════════════════════════════════════
   STEP NUMBER COMPONENT
   ═══════════════════════════════════════════════ */
const StepNumber = ({ num }: { num: string }) => (
  <div className="relative w-16 h-16 mx-auto mb-6">
    <div className="absolute inset-0 rounded-full border border-brand-200/60 animate-pulse-glow" />
    <div className="absolute inset-1 rounded-full bg-gradient-to-br from-brand-500 to-indigo-600 flex items-center justify-center shadow-glow-blue">
      <span className="text-white font-black text-xl tracking-tighter">{num}</span>
    </div>
  </div>
);

/* ═══════════════════════════════════════════════
   MAIN PAGE COMPONENT
   ═══════════════════════════════════════════════ */
export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-foreground">
      <Navbar />

      <main className="flex-1">
        {/* ══════════════════════════════════
            HERO SECTION
            "Discover the Science Behind Your Name"
           ══════════════════════════════════ */}
        <section className="relative overflow-hidden pt-24 pb-32 md:pt-32 md:pb-40">
          <div className="absolute inset-0 bg-gradient-hero pointer-events-none" />
          <div className="absolute inset-0 scientific-grid pointer-events-none opacity-40" />
          <OrbitalDecoration />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              {/* Left: Text Content */}
              <div className="text-left">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-brand-200/60 bg-brand-50/60 text-brand-600 text-xs font-medium mb-8 shadow-sm backdrop-blur-sm">
                  <Atom className="w-3.5 h-3.5" />
                  <span>Modern Name Science Platform</span>
                  <span className="w-1 h-1 rounded-full bg-brand-400" />
                  <span className="text-brand-400">AI-Powered</span>
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-[1.1] font-outfit">
                  Discover the
                  <span className="gradient-text-brand"> Science & Energy</span>
                  <br />
                  Behind Your Name
                </h1>

                <p className="mt-6 text-base sm:text-lg text-muted-foreground max-w-lg leading-relaxed">
                  Analyze your name with numerological mathematics, Unicode acoustic resonance, and intelligent vibrational science. Built for thinkers, innovators, and leaders worldwide.
                </p>

                <div className="mt-10 flex flex-col sm:flex-row items-start gap-4">
                  <Link href="/analyze">
                    <Button size="lg" variant="gradient" className="w-full sm:w-auto">
                      Analyze Your Name
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                  <Link href="/#science">
                    <Button size="lg" variant="outline" className="w-full sm:w-auto text-muted-foreground">
                      Explore the Science
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>

                {/* Trust indicators */}
                <div className="mt-10 flex flex-wrap items-center gap-6 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-brand-500" />
                    <span>2 Free Analyses on Signup</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-brand-500" />
                    <span>Intelligent AI Analytics</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-brand-500" />
                    <span>Deterministic & Reproducible</span>
                  </div>
                </div>
              </div>

              {/* Right: Hero Visual */}
              <div className="hidden lg:block">
                <HeroVisual />
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════
            DASHBOARD PREVIEW SECTION
           ══════════════════════════════════ */}
        <section className="py-12 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-20">
          <Card variant="elevated" className="p-0 overflow-hidden">
            <div className="flex items-center justify-between border-b border-border px-6 py-4">
              <div className="flex items-center gap-2.5">
                <div className="w-2.5 h-2.5 rounded-full bg-brand-500" />
                <div className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                <div className="w-2.5 h-2.5 rounded-full bg-violet-500" />
                <span className="text-xs font-mono text-muted-foreground ml-2">
                  namenology_quantum_engine_v2.0
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="brand">International NFC</Badge>
                <Badge variant="indigo">Deterministic Formula</Badge>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                {/* Data panels */}
                <div className="md:col-span-7 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-[#F7F9FC] border border-border/60">
                      <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Given Name (60%)</div>
                      <div className="text-lg font-bold text-foreground mt-1">Alexander</div>
                      <div className="flex items-center gap-1.5 mt-2">
                        <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-brand-500 to-indigo-500 rounded-full" style={{ width: "88%" }} />
                        </div>
                        <span className="text-xs text-brand-500 font-bold whitespace-nowrap">88</span>
                      </div>
                    </div>
                    <div className="p-4 rounded-xl bg-[#F7F9FC] border border-border/60">
                      <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Surname (40%)</div>
                      <div className="text-lg font-bold text-foreground mt-1">Sterling</div>
                      <div className="flex items-center gap-1.5 mt-2">
                        <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full" style={{ width: "91%" }} />
                        </div>
                        <span className="text-xs text-indigo-600 font-bold whitespace-nowrap">91</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-[#F7F9FC] border border-border/60">
                    <div className="flex items-center justify-between text-xs mb-3 font-medium">
                      <span className="text-muted-foreground flex items-center gap-1.5">
                        <BarChart3 className="w-3.5 h-3.5 text-brand-500" />
                        Harmonic Resonance Index
                      </span>
                      <span className="text-foreground font-bold text-sm">89.2 / 100</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-brand-500 via-indigo-500 to-violet-500 rounded-full transition-all duration-1000" style={{ width: "89.2%" }} />
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-3 leading-relaxed">
                      Dynamic Weight Formulation: Given Name 60%, Surname 40% — Analyzed via global Unicode NFC decomposition and acoustic matrix.
                    </p>
                  </div>
                </div>

                {/* Score Gauge */}
                <div className="md:col-span-5 flex flex-col items-center justify-center p-6 rounded-xl bg-[#F7F9FC] border border-border/60">
                  <ScoreGauge
                    score={89}
                    size="sm"
                    title="Harmonic Synergy"
                    category="Highly Auspicious"
                  />
                  <p className="text-[11px] text-muted-foreground text-center mt-3 px-4 leading-relaxed">
                    Optimal Resonance Coherence — The vibrational acoustic frequency between given name and surname is mathematically harmonious.
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* ══════════════════════════════════
            CORE PILLARS — "WHY NAMENOLOGY"
           ══════════════════════════════════ */}
        <section id="science" className="py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-brand-200/60 bg-brand-50/40 text-brand-600 text-xs font-medium mb-4">
              <Lightbulb className="w-3.5 h-3.5" />
              THE SCIENTIFIC APPROACH
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground font-outfit">
              Name Science Meets
              <span className="gradient-text-brand"> Intelligent Technology</span>
            </h2>
            <p className="mt-4 text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
              NAMENOLOGY is not a horoscope or fortune-telling site. It is an advanced computational platform that decodes the mathematical harmonics, phonetic vibrations, and linguistic genetics of names.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1: Numerology Science */}
            <Card variant="science" glow="blue" className="group">
              <div className="w-14 h-14 rounded-2xl bg-brand-50 text-brand-500 flex items-center justify-center mb-6 group-hover:bg-brand-500 group-hover:text-white transition-all duration-300">
                <Atom className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-foreground">Mathematical Numerology</h3>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                Deconstruct phonetic characters into harmonic frequency values, calculating vibrational resonance and deep archetypal life paths.
              </p>
              <div className="mt-6 flex items-center text-xs font-medium text-brand-500 group-hover:text-brand-600 transition-colors">
                Explore Methodology <ChevronRight className="w-3.5 h-3.5 ml-1" />
              </div>
            </Card>

            {/* Card 2: AI Technology */}
            <Card variant="science" glow="indigo" className="group">
              <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                <Brain className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-foreground">Intelligent Analytics</h3>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                Combining computational linguistics, machine learning, and Unicode decomposition to produce deterministic, bias-free resonance profiles.
              </p>
              <div className="mt-6 flex items-center text-xs font-medium text-indigo-600 group-hover:text-indigo-700 transition-colors">
                Explore Analytics <ChevronRight className="w-3.5 h-3.5 ml-1" />
              </div>
            </Card>

            {/* Card 3: Precision & Trust */}
            <Card variant="science" glow="violet" className="group">
              <div className="w-14 h-14 rounded-2xl bg-violet-50 text-violet-600 flex items-center justify-center mb-6 group-hover:bg-violet-600 group-hover:text-white transition-all duration-300">
                <Target className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-foreground">Immutable Accuracy</h3>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                Every calculation is frozen as an immutable cryptographic snapshot — 100% reproducible and auditable across all future formula updates.
              </p>
              <div className="mt-6 flex items-center text-xs font-medium text-violet-600 group-hover:text-violet-700 transition-colors">
                Explore Security <ChevronRight className="w-3.5 h-3.5 ml-1" />
              </div>
            </Card>
          </div>
        </section>

        {/* ══════════════════════════════════
            HOW IT WORKS — 3 STEPS
           ══════════════════════════════════ */}
        <section id="how-it-works" className="py-28 bg-[#F7F9FC] relative overflow-hidden">
          <div className="absolute inset-0 cosmic-dots pointer-events-none opacity-50" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center max-w-3xl mx-auto mb-20">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-200/60 bg-indigo-50/40 text-indigo-600 text-xs font-medium mb-4">
                <Layers className="w-3.5 h-3.5" />
                THE PROCESS
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground font-outfit">
                3 Steps to
                <span className="gradient-text-brand"> Discovery</span>
              </h2>
              <p className="mt-4 text-muted-foreground text-sm sm:text-base">
                Seamlessly evaluate and optimize your name vibrations in three steps
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
              {/* Step 1 */}
              <div className="relative">
                <StepNumber num="01" />
                <h3 className="font-bold text-foreground text-lg mb-3">Input Your Identity</h3>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-[280px] mx-auto">
                  Provide your given name, ancestral surname, or test multiple candidate pairings simultaneously.
                </p>
                <div className="hidden md:block absolute top-8 -right-5 w-10 h-[1px] bg-gradient-to-r from-brand-300 to-transparent" />
              </div>

              {/* Step 2 */}
              <div className="relative">
                <StepNumber num="02" />
                <h3 className="font-bold text-foreground text-lg mb-3">Algorithmic Calculation</h3>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-[280px] mx-auto">
                  The engine processes Unicode NFC normalization, character weights, and atomic transaction validation.
                </p>
                <div className="hidden md:block absolute top-8 -right-5 w-10 h-[1px] bg-gradient-to-r from-indigo-300 to-transparent" />
              </div>

              {/* Step 3 */}
              <div>
                <StepNumber num="03" />
                <h3 className="font-bold text-foreground text-lg mb-3">Receive Scientific Dossier</h3>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-[280px] mx-auto">
                  Access deep resonance scores, dynamic energy vectors, career indicators, and strategic life direction.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════
            NUMBER VISUALIZATION SHOWCASE
           ══════════════════════════════════ */}
        <section className="py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-violet-200/60 bg-violet-50/40 text-violet-600 text-xs font-medium mb-4">
              <BarChart3 className="w-3.5 h-3.5" />
              DATA ARCHITECTURE
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground font-outfit">
              Numbers Are
              <span className="gradient-text-brand"> Intelligence in Motion</span>
            </h2>
            <p className="mt-4 text-muted-foreground text-sm sm:text-base">
              Every numeric frequency carries acoustic resonance — rendered as a scientific dashboard
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { num: "01", label: "Life Path", desc: "Core Trajectory", color: "brand" },
              { num: "02", label: "Expression", desc: "Vocal & Social Resonance", color: "indigo" },
              { num: "03", label: "Soul Urge", desc: "Internal Drive & Intuition", color: "violet" },
              { num: "04", label: "Personality", desc: "External Gravity & Impact", color: "cyan" },
            ].map((item, i) => (
              <Card key={i} variant="science" className="text-center group cursor-pointer">
                <div className="relative inline-block mb-4">
                  <div className="number-highlight text-5xl sm:text-6xl py-2">{item.num}</div>
                </div>
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-1">{item.label}</div>
                <div className="text-sm font-bold text-foreground">{item.desc}</div>
                <div className="mt-3 w-full h-[2px] bg-gradient-to-r from-transparent via-brand-200 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </Card>
            ))}
          </div>
        </section>

        {/* ══════════════════════════════════
            SERVICES OVERVIEW
           ══════════════════════════════════ */}
        <section className="py-28 bg-[#F7F9FC] relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              {/* Left text */}
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-brand-200/60 bg-brand-50/40 text-brand-600 text-xs font-medium mb-6">
                  <Zap className="w-3.5 h-3.5" />
                  OUR CAPABILITIES
                </div>
                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground leading-tight font-outfit">
                  Comprehensive
                  <br />
                  <span className="gradient-text-brand">Name Science Suite</span>
                </h2>
                <p className="mt-6 text-muted-foreground text-sm sm:text-base leading-relaxed max-w-lg">
                  From instantaneous algorithmic evaluations to bespoke personal and generational surname architecture, NAMENOLOGY delivers scientific precision for every life milestone.
                </p>

                <div className="mt-8 space-y-4">
                  {[
                    { icon: Search, label: "Single & Combined Analysis", desc: "Given name, surname, and composite pairing evaluations" },
                    { icon: Globe, label: "Global Unicode NFC Support", desc: "Cross-cultural character normalization and decomposition" },
                    { icon: TrendingUp, label: "Strategic Resonance Dossier", desc: "Vibrational scores, career alignment vectors, and life timelines" },
                    { icon: Cpu, label: "Bespoke Naming Architecture", desc: "Scientific baby naming, personal renaming, and family lineage engineering" },
                  ].map((svc, i) => (
                    <div key={i} className="flex items-start gap-4 group">
                      <div className="w-10 h-10 rounded-xl bg-white border border-border flex items-center justify-center text-brand-500 group-hover:bg-brand-50 transition-colors shrink-0 shadow-sm">
                        <svc.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-foreground">{svc.label}</div>
                        <div className="text-xs text-muted-foreground">{svc.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-10">
                  <Link href="/services">
                    <Button variant="gradient" size="lg">
                      Explore All Services
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Right: Data viz preview */}
              <div className="relative">
                <Card variant="elevated" className="p-8">
                  <div className="text-center mb-6">
                    <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-1">Interactive Dossier Preview</div>
                    <div className="text-xl font-bold text-foreground">Premium Analysis Dashboard</div>
                  </div>

                  {/* Mini score cards */}
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    {[
                      { label: "Resilience", value: "92", unit: "%" },
                      { label: "Leadership", value: "87", unit: "%" },
                      { label: "Social Synergy", value: "78", unit: "%" },
                      { label: "Prosperity", value: "85", unit: "%" },
                    ].map((metric, i) => (
                      <div key={i} className="p-3 rounded-xl bg-[#F7F9FC] border border-border/60 text-center">
                        <div className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">{metric.label}</div>
                        <div className="text-2xl font-black text-brand-500 mt-1">
                          {metric.value}
                          <span className="text-xs font-medium text-muted-foreground">{metric.unit}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Mini bar chart */}
                  <div className="space-y-3">
                    {[
                      { label: "Strategic Leadership", pct: 88, color: "from-brand-500 to-indigo-500" },
                      { label: "Innovation & Agility", pct: 92, color: "from-indigo-500 to-violet-500" },
                      { label: "Interpersonal Gravity", pct: 84, color: "from-violet-500 to-brand-500" },
                    ].map((bar, i) => (
                      <div key={i}>
                        <div className="flex justify-between text-xs font-medium mb-1">
                          <span className="text-muted-foreground">{bar.label}</span>
                          <span className="text-foreground">{bar.pct}%</span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                          <div
                            className={`h-full bg-gradient-to-r ${bar.color} rounded-full transition-all duration-700`}
                            style={{ width: `${bar.pct}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Floating accent decoration */}
                <div className="absolute -top-4 -right-4 w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-indigo-500 opacity-20 blur-sm" />
                <div className="absolute -bottom-3 -left-3 w-6 h-6 rounded-full bg-gradient-to-br from-violet-500 to-brand-500 opacity-15 blur-sm" />
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════
            FAQ SECTION
           ══════════════════════════════════ */}
        <section className="py-28 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-white text-xs font-medium text-muted-foreground mb-4">
              <svg className="w-3.5 h-3.5 text-brand-500" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.2" />
                <text x="8" y="11" textAnchor="middle" fill="currentColor" fontSize="8" fontWeight="bold">?</text>
              </svg>
              <span>FREQUENTLY ASKED QUESTIONS</span>
            </div>
            <h2 className="text-3xl font-extrabold text-foreground font-outfit">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "How many free analyses do I receive upon registering?",
                a: "Every new account receives 2 complimentary Given Name credits and 2 Surname credits. Combined (Full Name) analyses require a credit package or subscription.",
              },
              {
                q: "Can I test multiple candidate surnames with one given name?",
                a: "Yes. Our Harmonic Pairing Engine allows you to benchmark 1 given name against up to 5 candidate surnames (or vice versa), automatically ranking them by composite mathematical harmony.",
              },
              {
                q: "What is Bespoke Naming Architecture?",
                a: "For clients seeking custom-engineered names for newborns, professional rebranding, or new family lineages, our senior name scientists craft tailored candidates with complete phonetic dossiers and legal registration compliance.",
              },
            ].map((faq, i) => (
              <Card key={i} variant="default" className="p-6 hover:border-brand-200/60 transition-colors">
                <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-brand-50 text-brand-500 text-xs font-bold flex items-center justify-center shrink-0">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {faq.q}
                </h3>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed pl-8">
                  {faq.a}
                </p>
              </Card>
            ))}
          </div>
        </section>

        {/* ══════════════════════════════════
            CTA BANNER
           ══════════════════════════════════ */}
        <section className="py-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-r from-brand-500 via-indigo-600 to-violet-600" />
            <div className="absolute inset-0 opacity-10">
              <svg className="w-full h-full" viewBox="0 0 800 300" fill="none">
                <circle cx="700" cy="50" r="200" stroke="white" strokeWidth="0.5" />
                <circle cx="100" cy="250" r="150" stroke="white" strokeWidth="0.5" />
                <circle cx="400" cy="150" r="80" stroke="white" strokeWidth="0.8" strokeDasharray="4 4" />
              </svg>
            </div>

            <div className="relative z-10 p-10 sm:p-16 text-center">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white leading-tight font-outfit">
                Ready to Discover the Science
                <br />
                Behind Your Name?
              </h2>
              <p className="mt-4 text-sm sm:text-base text-white/80 max-w-xl mx-auto">
                Join thousands of global leaders, innovators, and individuals. Register today to claim your 2 complimentary name analyses.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/signup">
                  <Button size="lg" className="w-full sm:w-auto bg-white text-brand-600 hover:bg-brand-50 font-bold border-none shadow-lg">
                    Create Free Account
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link href="/pricing">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto border-white/30 text-white hover:bg-white/10">
                    View Pricing & Packages
                  </Button>
                </Link>
              </div>

              {/* Subtle gold accent dot */}
              <div className="mt-8 flex items-center justify-center gap-1.5">
                <div className="w-1 h-1 rounded-full bg-[#D6A84F]" />
                <span className="text-[10px] uppercase tracking-[0.3em] text-white/60 font-medium">
                  The Science of Name — The Power of Destiny
                </span>
                <div className="w-1 h-1 rounded-full bg-[#D6A84F]" />
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
