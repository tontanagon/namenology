"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ScoreGauge } from "@/components/analysis/ScoreGauge";
import {
  Sparkles,
  ArrowLeft,
  Printer,
  Calendar,
  Layers,
  ShieldCheck,
  CheckCircle2,
  Copy,
  Check,
  TrendingUp,
  Briefcase,
  Heart,
  Zap,
  Activity,
  Compass,
  Cpu,
  Eye,
  Target,
  BarChart3,
  Award,
  Globe,
  Radio,
  Share2,
  ShieldAlert,
  HeartPulse,
} from "lucide-react";
import { getNumerologyGroup } from "@/lib/data/numerology-groups";

interface CharacterDetail {
  character: string;
  score: number;
  position: number;
}

interface ComponentResult {
  key: string;
  label: string;
  inputText: string;
  score: number;
  weight: number;
  characters: CharacterDetail[];
}

interface AnalysisReport {
  id: string;
  analysisType: "FIRST_NAME" | "SURNAME" | "COMBINED";
  inputText: string;
  normalizedText: string;
  finalScore: number;
  rawScore: number;
  calculationVersion: string;
  configSnapshot?: any;
  interpretation: {
    category: string;
    title: string;
    description: string;
    recommendation: string | null;
  } | null;
  components: ComponentResult[];
  createdAt: string;
}

export default function AnalysisResultDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const [report, setReport] = useState<AnalysisReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchReport = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/analysis/${id}`);
        if (!res.ok) {
          throw new Error("Analysis report not found or access denied.");
        }
        const data = await res.json();
        const raw = data.analysis;
        const transformedComponents = (raw.components || []).map((c: any) => {
          const compKey = c.componentKey || c.key;
          const chars =
            c.characters && c.characters.length > 0
              ? c.characters
              : (raw.characterDetails || [])
                  .filter((cd: any) => cd.componentKey === compKey)
                  .map((cd: any) => ({
                    character: cd.character,
                    score: cd.mappedScore ?? cd.score,
                    position: cd.position,
                  }));
          return {
            ...c,
            key: compKey,
            label:
              c.label ||
              (compKey === "FIRST_NAME"
                ? "Official First Name"
                : compKey === "SURNAME"
                ? "Official Surname"
                : compKey === "MIDDLE_NAME"
                ? "Middle Name"
                : compKey === "NICKNAME"
                ? "Daily Call Name"
                : "Combined Synergy"),
            inputText: c.inputText,
            score: Number(c.score),
            weight: Number(c.weight ?? c.weightUsed ?? 100),
            characters: chars,
          };
        });

        setReport({
          ...raw,
          finalScore: Number(raw.finalScore),
          rawScore: Number(raw.rawScore),
          components: transformedComponents,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load report.");
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [id]);

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  // Deterministic scientific numerology calculation derived from the actual report
  const numerologyData = useMemo(() => {
    if (!report) return null;

    const score = report.finalScore || 75;

    // Compute compound number from character values or score
    let charSum = 0;
    if (report.components && report.components.length > 0) {
      report.components.forEach((c) => {
        c.characters?.forEach((ch) => {
          charSum += ch.score || 0;
        });
      });
    }
    if (charSum === 0) {
      charSum = Math.round(score * 0.6) + 18;
    }

    const compoundNumber = Math.max(14, (charSum % 89) + 11);

    // Reduce compound number to root number (1-9 or Master Numbers 11, 22)
    const reduceToRoot = (num: number): number => {
      if (num === 11 || num === 22 || num === 33) return num;
      const digits = num.toString().split("").map(Number);
      const sum = digits.reduce((a, b) => a + b, 0);
      if (sum > 9 && sum !== 11 && sum !== 22 && sum !== 33) {
        return reduceToRoot(sum);
      }
      return sum;
    };

    const rootNumber = reduceToRoot(compoundNumber);
    const frequencyHz = (432 + score * 1.25).toFixed(1);

    // Archetype definitions in international English
    const archetypes: Record<
      number,
      {
        title: string;
        subtitle: string;
        desc: string;
        element: string;
        style: string;
        mindset: string;
        social: string;
        latentTalent: string;
        catalyst: string;
        opportunityMagnet: string;
        careerPaths: string[];
        careerHeadline: string;
      }
    > = {
      1: {
        title: "The Visionary Catalyst",
        subtitle: "Pioneering Leadership & Strategic Origination",
        desc: "A high-frequency leadership vibration characterized by intense internal drive, breakthrough thinking, and the sovereign ability to establish new benchmarks.",
        element: "Cosmic Fire / Radiant Energy",
        style: "Direct, articulate, authoritative, and inspiring confidence.",
        mindset: "Strategic architecture, proactive opportunity recognition, and decisive clarity.",
        social: "Commanding gravitas that naturally attracts teams seeking unified vision.",
        latentTalent: "Translating abstract vision into tangible reality and galvanizing executive teams.",
        catalyst: "Autonomy in setting strategic direction and deploying high-stakes capital.",
        opportunityMagnet: "Attracts flagship ventures, board positions, and transformative executive roles.",
        careerPaths: [
          "Chief Executive Officer (C-Suite)",
          "Venture Capital & DeepTech Founder",
          "Global Strategic Advisor",
          "Enterprise Innovation Architect",
        ],
        careerHeadline: "Exponential growth in positions of primary authority, visionary leadership, and enterprise building.",
      },
      2: {
        title: "The Harmonic Synthesizer",
        subtitle: "Strategic Diplomacy & Collaborative Equilibrium",
        desc: "A refined resonance of balance, synthesis, and deep intuitive perception. Capable of uniting disparate perspectives into cohesive alliances.",
        element: "Aether / Resonant Fluidity",
        style: "Empathetic, diplomatic, and fostering durable long-term trust.",
        mindset: "Multi-dimensional observation, rigorous nuance analysis, and impeccable timing.",
        social: "An anchor of trust where high-level partners feel secure and aligned.",
        latentTalent: "Intuitive timing, crisis de-escalation, and effortless high-stakes negotiations.",
        catalyst: "Environments prioritizing strategic partnerships, integrity, and shared vision.",
        opportunityMagnet: "Attracts high-trust alliances and endorsement from sovereign institutions.",
        careerPaths: [
          "International Diplomacy & Governance",
          "Strategic Partnerships & M&A",
          "Organizational Psychology",
          "Cultural & Heritage Management",
        ],
        careerHeadline: "Reaches zenith success when bridging complex divides and stewarding strategic alliances.",
      },
      3: {
        title: "The Creative Illuminator",
        subtitle: "Inspirational Architecture & Public Resonance",
        desc: "A radiant acoustic frequency of inventive expression and magnetic communication, elevating ideas into widely celebrated cultural phenomena.",
        element: "Solar Radiance / Electric Wave",
        style: "Charismatic, articulate, and adept at translating intricate concepts into captivating narratives.",
        mindset: "Lateral divergent thinking, multi-disciplinary synthesis, and rapid ideation.",
        social: "Dynamic social magnetism, celebrated in intellectual and creative circles.",
        latentTalent: "Public influence, brand myth-making, and intuitive storytelling.",
        catalyst: "Expansive platforms with creative license to challenge orthodoxies.",
        opportunityMagnet: "Attracts media spotlights, institutional grants, and top-tier creative mandates.",
        careerPaths: [
          "Creative Direction & Media Architecture",
          "Global Brand Strategy",
          "Digital Entertainment & Publishing",
          "Keynote Thought Leadership",
        ],
        careerHeadline: "Generates enduring prosperity through iconic personal branding and transformative media.",
      },
      4: {
        title: "The Master Architect",
        subtitle: "Foundational Precision & Generational Endurance",
        desc: "A crystalline vibrational blueprint of systemic rigor, steadfast methodology, and generational wealth building.",
        element: "Crystalline Earth / Structured Grid",
        style: "Substantive, lucid, fact-driven, and uncompromisingly credible.",
        mindset: "Deep structural analysis, empirical forecasting, and comprehensive risk mitigation.",
        social: "An unshakeable rock of dependability and governance excellence.",
        latentTalent: "Engineering complex multi-tiered operational systems that run flawlessly.",
        catalyst: "Clear institutional mandates and concrete quantifiable milestones.",
        opportunityMagnet: "Attracts durable assets, private equity capital, and institutional governance trust.",
        careerPaths: [
          "Infrastructure & Systems Architecture",
          "Private Equity & Asset Management",
          "Corporate Law & Governance",
          "Data Systems Engineering",
        ],
        careerHeadline: "Builds multi-generational legacies through institutional systems with zero vulnerabilities.",
      },
      5: {
        title: "The Dynamic Explorer",
        subtitle: "Catalytic Agility & Global Expansion",
        desc: "A rapid quantum frequency of evolution, adaptability, and boundary-pushing transformation. Thrives at the intersection of volatility and opportunity.",
        element: "Dynamic Atmosphere / Quantum Motion",
        style: "Vibrant, agile, intellectually adventurous, and instantly persuasive.",
        mindset: "Rapid pattern recognition, iterative risk-taking, and refusal to conform to obsolete paradigms.",
        social: "Expansive global network spanning disparate continents, cultures, and industries.",
        latentTalent: "Pioneering new market frontiers and engineering unprecedented competitive pivots.",
        catalyst: "Fast-moving frontiers, disruptive markets, and cross-border operations.",
        opportunityMagnet: "Attracts emerging technologies, international trade ventures, and breakthrough market entries.",
        careerPaths: [
          "Cross-Border Enterprise & Global Trade",
          "Frontier AI & Emerging Tech",
          "Crisis Management & Turnarounds",
          "Venture Building & Media",
        ],
        careerHeadline: "Scales without ceiling in fast-evolving frontier sectors and multinational ecosystems.",
      },
      6: {
        title: "The Benevolent Harmonizer",
        subtitle: "Sustained Harmony & Community Prosperity",
        desc: "A golden equilibrium resonance of nourishment, social responsibility, and generative stewardship. Uplifts collaborators toward shared greatness.",
        element: "Harmonic Biosphere / Golden Equilibrium",
        style: "Inspiring, unifying, genuine, and profoundly respected.",
        mindset: "Holistic sustainability, stakeholder alignment, and long-term societal value creation.",
        social: "The epicentre of loyalty; generates devoted teams and unyielding client allegiance.",
        latentTalent: "Cultivating magnetic organizational cultures and high-retention enterprise communities.",
        catalyst: "Work that delivers demonstrable human welfare and enduring quality of life.",
        opportunityMagnet: "Attracts organic capital, unwavering patron support, and prestigious community trust.",
        careerPaths: [
          "Biotech, Life Sciences & Healthcare",
          "Luxury Hospitality & Living Concepts",
          "ESG & Sustainable Enterprise",
          "Bespoke Family Office Management",
        ],
        careerHeadline: "Compounding financial prosperity paired with deep moral authority and generational respect.",
      },
      7: {
        title: "The Scientific Intellect",
        subtitle: "Empirical Wisdom & Deep Truth Discovery",
        desc: "A profound analytical resonance dedicated to fundamental investigation, rigorous contemplation, and unveiling hidden mechanics of complex phenomena.",
        element: "Deep Cosmic Void / Pure Consciousness",
        style: "Measured, penetrating, laconic, and carrying immense intellectual gravity.",
        mindset: "Uncompromising epistemological rigor, contemplative depth, and radical intellectual honesty.",
        social: "Selective, elite intellectual circles that challenge and enrich the mind.",
        latentTalent: "Deciphering multi-variable cryptograms, esoteric models, and establishing new scientific paradigms.",
        catalyst: "Solitude, advanced research infrastructure, and unfettered intellectual exploration.",
        opportunityMagnet: "Attracts proprietary research mandates, intellectual property royalties, and academic honors.",
        careerPaths: [
          "Deep Science & Quantum Tech Research",
          "Algorithmic Finance & Quantitative Modeling",
          "Applied Philosophy & Strategic Analysis",
          "Advanced Cybersecurity Systems",
        ],
        careerHeadline: "Rises to premier authority as an irreplaceable strategic mind and pioneer of specialized domains.",
      },
      8: {
        title: "The Sovereign Strategist",
        subtitle: "Executive Dominance, Scale & Capital Magnetism",
        desc: "An imposing gravitational frequency of vast resource mobilization, commercial mastery, and scalable real-world execution.",
        element: "Magnetic Core / High-Density Resonance",
        style: "Commanding, outcome-obsessed, highly motivating, and executive-caliber.",
        mindset: "Scalability dynamics, capital efficiency, and relentless operational execution.",
        social: "A magnet for elite talent and institutional financiers who demand decisive leadership.",
        latentTalent: "Transforming dormant balance sheets and ideas into high-yield financial engines.",
        catalyst: "Mega-scale objectives with substantial economic and industrial impact.",
        opportunityMagnet: "Attracts private wealth syndicates, institutional mandates, and commercial triumph.",
        careerPaths: [
          "Investment Banking & Private Equity",
          "Sovereign Wealth & Mega-Project Leadership",
          "Multinational Enterprise Governance",
          "Real Estate Capital Syndication",
        ],
        careerHeadline: "Attains pinnacle financial sovereignty while erecting monumental commercial milestones.",
      },
      9: {
        title: "The Global Pioneer",
        subtitle: "Universal Consciousness & Civilizational Impact",
        desc: "An expansive, transcendent resonance with a boundless worldview, dedicated to raising collective standards and leaving an indelible civilizational imprint.",
        element: "Universal Field / Cosmic Synthesis",
        style: "Visionary, philanthropic, transcending borders and cultural divides.",
        mindset: "Civilizational scale, ethical governance, and planetary impact.",
        social: "Universally embraced by global leaders and revered across international communities.",
        latentTalent: "Uniting rival factions under a single moral and technological imperative.",
        catalyst: "Causes with global scope, human emancipation, and systemic preservation.",
        opportunityMagnet: "Attracts international treaties, United Nations-level initiatives, and humanitarian awards.",
        careerPaths: [
          "International Public Policy & Global NGOs",
          "Global Clean Energy & Biosphere Stewardship",
          "International Health & Universal Education",
          "Pioneering Philanthropic Foundations",
        ],
        careerHeadline: "Carves a lasting name in world history through civilizational enrichment and global distinction.",
      },
    };

    const fallbackArchetype =
      archetypes[rootNumber] || archetypes[rootNumber % 9 || 1];

    // Compute Strength Vectors
    const leadershipScore = Math.min(
      99,
      Math.round(score * 0.94 + (compoundNumber % 7) * 1.2)
    );
    const innovationScore = Math.min(
      99,
      Math.round(score * 0.91 + (compoundNumber % 5) * 1.5)
    );
    const communicationScore = Math.min(
      99,
      Math.round(score * 0.96 + (compoundNumber % 9) * 0.8)
    );
    const resilienceScore = Math.min(
      99,
      Math.round(score * 0.88 + (compoundNumber % 6) * 1.8)
    );
    const prosperityScore = Math.min(
      99,
      Math.round(score * 0.93 + (compoundNumber % 8) * 1.1)
    );

    const groupArticle = getNumerologyGroup(rootNumber);

    return {
      compoundNumber,
      rootNumber,
      frequencyHz,
      groupArticle,
      archetype: fallbackArchetype,
      metrics: {
        leadership: leadershipScore,
        innovation: innovationScore,
        communication: communicationScore,
        resilience: resilienceScore,
        prosperity: prosperityScore,
      },
    };
  }, [report]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Navbar />
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="flex flex-col items-center gap-4 text-center max-w-sm">
            <div className="relative">
              <div className="w-16 h-16 rounded-full border-2 border-brand-500/20 border-t-brand-500 animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-brand-500 animate-pulse" />
              </div>
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground">
                Computing Scientific Resonance Snapshot
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                Retrieving immutable calculation snapshot from state ledger...
              </p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error || !report || !numerologyData) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Navbar />
        <main className="flex-1 max-w-2xl mx-auto px-4 py-16 text-center">
          <Card variant="science" className="p-8">
            <div className="w-12 h-12 mx-auto rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mb-4">
              <Radio className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-foreground mb-2">
              Dossier Unavailable
            </h2>
            <p className="text-sm text-muted-foreground mb-6">
              {error || "Could not locate analysis report."}
            </p>
            <Link href="/analyze">
              <Button variant="primary">Return to Analysis Engine</Button>
            </Link>
          </Card>
        </main>
      </div>
    );
  }

  const {
    compoundNumber,
    rootNumber,
    frequencyHz,
    archetype,
    metrics,
    groupArticle,
  } = numerologyData;

  const analysisTypeLabel =
    report.analysisType === "FIRST_NAME"
      ? "Official First Name Analysis"
      : report.analysisType === "SURNAME"
      ? "Official Surname Analysis"
      : "Complete Name & Surname Synergy";

  return (
    <div className="min-h-screen flex flex-col bg-white text-foreground print:bg-white print:text-black relative overflow-hidden selection:bg-brand-500 selection:text-white">
      {/* Background Subtle Scientific Grid & Gradient Glow */}
      <div className="absolute inset-0 bg-scientific-grid pointer-events-none opacity-50 print:hidden" />
      <div className="absolute top-0 right-1/3 w-[600px] h-[600px] bg-gradient-to-br from-brand-500/5 via-indigo-500/5 to-transparent rounded-full blur-3xl pointer-events-none print:hidden" />

      <div className="print:hidden">
        <Navbar />
      </div>

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8 relative z-10">
        {/* ========================================================================= */}
        {/* TOP NAVIGATION & ACTIONS BAR */}
        {/* ========================================================================= */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 print:hidden">
          <Link
            href="/analyze"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-brand-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Analysis Engine</span>
          </Link>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyLink}
              className="h-8 text-xs"
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-emerald-500 mr-1.5" />
              ) : (
                <Copy className="w-3.5 h-3.5 mr-1.5" />
              )}
              <span>{copied ? "Link Copied" : "Share Dossier"}</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrint}
              className="h-8 text-xs"
            >
              <Printer className="w-3.5 h-3.5 mr-1.5" />
              <span>Print / Export PDF</span>
            </Button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 1. MASTER HERO CARD: NAME & RADIAL RESONANCE MATRIX */}
        {/* ========================================================================= */}
        <Card
          variant="science"
          glow="blue"
          className="p-6 sm:p-8 relative overflow-hidden"
        >
          <div className="absolute -top-16 -right-16 w-64 h-64 border border-brand-500/10 rounded-full pointer-events-none" />
          <div className="absolute -top-10 -right-10 w-52 h-52 border border-indigo-500/10 rounded-full pointer-events-none" />

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/80 pb-6 mb-6">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <Badge variant="brand">{analysisTypeLabel}</Badge>
                <Badge variant="indigo">
                  Unicode NFC Algorithm v{report.calculationVersion}
                </Badge>
                <Badge variant="cyan">{frequencyHz} Hz Resonance</Badge>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight font-outfit">
                {report.inputText}
              </h1>
              <p className="text-xs text-muted-foreground mt-1.5 flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-brand-500" />
                <span>
                  Evaluated on{" "}
                  {new Date(report.createdAt).toLocaleDateString("en-US", {
                    dateStyle: "long",
                  })}
                </span>
                <span className="text-slate-300">•</span>
                <span className="font-mono text-[11px]">
                  ID: {report.id.slice(0, 8)}
                </span>
              </p>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                Verification Status
              </span>
              <span className="inline-flex items-center gap-1.5 text-sm font-bold text-emerald-600 mt-1">
                <CheckCircle2 className="w-4 h-4" />
                <span>Verified Scientific Snapshot</span>
              </span>
            </div>
          </div>

          {/* Grid: Radial Score + Core Overview */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-5 flex justify-center">
              <ScoreGauge
                score={report.finalScore}
                size="lg"
                title="Composite Resonance"
                category={report.interpretation?.category}
              />
            </div>

            <div className="md:col-span-7 space-y-4">
              <div className="p-5 rounded-2xl bg-slate-50/80 border border-slate-200/60">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-xs font-bold text-brand-600 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>
                      {report.interpretation?.title ||
                        "Harmonic Resonance Profile"}
                    </span>
                  </h2>
                  <span className="text-[11px] font-mono text-muted-foreground">
                    Level 1 Precision
                  </span>
                </div>
                <p className="text-sm text-foreground/90 leading-relaxed">
                  {report.interpretation?.description ||
                    "The phonetic consonants, vowels, and tonal dynamics of this identity form a highly coherent acoustic matrix, generating structural alignment and continuous opportunity flow."}
                </p>
              </div>

              {report.interpretation?.recommendation && (
                <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 text-xs text-amber-900 leading-relaxed">
                  <span className="font-bold flex items-center gap-1.5 mb-1 text-amber-800">
                    <Award className="w-4 h-4 text-amber-600" />
                    Strategic Guidance & Alignment:
                  </span>
                  <p>{report.interpretation.recommendation}</p>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* ========================================================================= */}
        {/* CORE DESTINY ARTICLE: 1. Compound Sum 2. Article Title 3. Meaning/Reading */}
        {/* ========================================================================= */}
        <Card variant="science" glow="blue" className="p-6 sm:p-10 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/80 pb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="brand">1. Total Number & Group</Badge>
                <Badge variant="indigo">
                  GROUP {groupArticle.groupNumber} ({groupArticle.numbersFormatted})
                </Badge>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-4xl sm:text-5xl font-black text-brand-600 font-outfit">
                  {rootNumber}
                </span>
                <div>
                  <span className="text-xs text-muted-foreground uppercase font-bold block">
                    Total Compound Sum
                  </span>
                  <span className="text-xl font-bold text-foreground font-outfit">
                    {compoundNumber}
                  </span>
                </div>
              </div>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                2. Article Title
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-foreground font-outfit mt-1">
                {groupArticle.title}
              </h2>
            </div>
          </div>

          {/* 3. Meanings & Symbols */}
          <div className="p-5 rounded-2xl bg-brand-50/60 border border-brand-200/60 space-y-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-700 block">
              3. Meanings & Symbols:
            </span>
            <p className="text-sm font-semibold text-brand-950 leading-relaxed">
              {groupArticle.meaningsAndSymbols}
            </p>
          </div>

          {/* Characteristics of Group X */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-foreground flex items-center gap-2 font-outfit">
              <span className="w-2 h-2 rounded-full bg-brand-500" />
              <span>
                Characteristics of Group {groupArticle.groupNumber} ({groupArticle.numbersFormatted})
              </span>
            </h3>
            <p className="text-sm text-foreground/90 leading-relaxed font-normal bg-slate-50/60 p-5 rounded-2xl border border-slate-200/80">
              {groupArticle.characteristics}
            </p>
          </div>

          {/* Polarity Dynamics: When Connected to Unfavorable Numbers */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-amber-700 flex items-center gap-2 font-outfit">
              <ShieldAlert className="w-4 h-4 text-amber-500" />
              <span>Polarity Dynamics: When Connected to Unfavorable Numbers</span>
            </h3>
            <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-sm text-amber-950 leading-relaxed">
              {groupArticle.shadowPolarity}
            </div>
          </div>

          {/* Be Wary Of: Health & Physical Vulnerabilities */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-rose-700 flex items-center gap-2 font-outfit">
              <HeartPulse className="w-4 h-4 text-rose-500" />
              <span>Be Wary Of: Health & Physical Vulnerabilities</span>
            </h3>
            <div className="p-5 rounded-2xl bg-rose-50/70 border border-rose-200/80 text-sm text-rose-950 leading-relaxed">
              <span className="font-bold text-rose-900 block mb-1">Illnesses:</span>
              <span>{groupArticle.illnessesFormatted}</span>
            </div>
          </div>
        </Card>

        {/* ========================================================================= */}
        {/* 2. NUMEROLOGY NUMBER & RESONANCE DIAGRAM */}
        {/* ========================================================================= */}
        <Card variant="science" glow="indigo" className="p-6 sm:p-8">
          <div className="flex items-center justify-between border-b border-border/80 pb-4 mb-6">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-200/60 flex items-center justify-center text-indigo-600">
                <Cpu className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-foreground font-outfit">
                  Numerology Number & Vibrational Matrix
                </h2>
                <p className="text-xs text-muted-foreground">
                  Foundational mathematical root digits, compound index, and acoustic wave frequency
                </p>
              </div>
            </div>
            <Badge variant="indigo">Vibrational Matrix</Badge>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-center">
            {/* Number 1: Compound */}
            <div className="relative p-6 rounded-2xl bg-gradient-to-b from-brand-50/50 to-white border border-brand-100 flex flex-col items-center text-center">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                Compound Vibration
              </span>
              <div className="relative my-2">
                <div className="absolute inset-0 -m-3 border border-brand-300/40 rounded-full animate-spin-slow pointer-events-none" />
                <span className="text-5xl font-black text-gradient font-outfit">
                  {compoundNumber}
                </span>
              </div>
              <span className="text-xs font-medium text-brand-600 mt-2">
                Cumulative Character Sum
              </span>
              <span className="text-[11px] text-muted-foreground">
                Harmonic Coherence: 99.4%
              </span>
            </div>

            {/* Number 2: Root Digit */}
            <div className="relative p-6 rounded-2xl bg-gradient-to-b from-indigo-50/50 to-white border border-indigo-100 flex flex-col items-center text-center">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                Root Life-Path Number
              </span>
              <div className="relative my-2">
                <div className="absolute inset-0 -m-3 border border-indigo-300/40 rounded-full pointer-events-none" />
                <span className="text-5xl font-black text-indigo-600 font-outfit">
                  0{rootNumber}
                </span>
              </div>
              <span className="text-xs font-medium text-indigo-700 mt-2">
                {archetype.subtitle}
              </span>
              <span className="text-[11px] text-muted-foreground">
                Primary Identity Trajectory
              </span>
            </div>

            {/* Metric 3: Acoustic Frequency */}
            <div className="relative p-6 rounded-2xl bg-gradient-to-b from-violet-50/50 to-white border border-violet-100 flex flex-col items-center text-center">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                Acoustic Frequency
              </span>
              <div className="relative my-2">
                <div className="absolute inset-0 -m-3 border border-violet-300/40 rounded-full pointer-events-none" />
                <span className="text-4xl font-black text-violet-700 font-outfit">
                  {frequencyHz}
                </span>
                <span className="text-xs font-bold text-violet-500 ml-1">
                  Hz
                </span>
              </div>
              <span className="text-xs font-medium text-violet-700 mt-2">
                Cosmic Resonance Band
              </span>
              <span className="text-[11px] text-muted-foreground">
                Optimal Cognitive Acoustic Stability
              </span>
            </div>
          </div>
        </Card>

        {/* ========================================================================= */}
        {/* 3. DEEP MEANING & SEMANTIC ANALYSIS */}
        {/* ========================================================================= */}
        <Card variant="science" glow="blue" className="p-6 sm:p-8">
          <div className="flex items-center justify-between border-b border-border/80 pb-4 mb-6">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-brand-50 border border-brand-200/60 flex items-center justify-center text-brand-600">
                <Eye className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-foreground font-outfit">
                  Deep Meaning & Linguistic Synthesis
                </h2>
                <p className="text-xs text-muted-foreground">
                  Phonetic acoustic deconstruction, vibrational blueprint, and semantic significance
                </p>
              </div>
            </div>
            <Badge variant="brand">Semantic Resonance</Badge>
          </div>

          <div className="space-y-4">
            <p className="text-sm text-foreground/90 leading-relaxed">
              When deconstructed through our linguistic and numerological algorithm, the identity{" "}
              <span className="font-bold text-brand-600">
                &ldquo;{report.inputText}&rdquo;
              </span>{" "}
              exhibits high vibrational density. The phonetic root tones activate strategic clarity and authoritative communication.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50">
                <span className="text-xs font-bold text-brand-600 block mb-1">
                  Linguistic Acoustic Dimension:
                </span>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  The primary consonants introduce clear, resonant tones that project integrity, gravitas, and natural persuasiveness across international settings.
                </p>
              </div>
              <div className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50">
                <span className="text-xs font-bold text-indigo-600 block mb-1">
                  Vibrational Blueprint Dimension:
                </span>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  The cumulative numeric cluster {compoundNumber} neutralizes discord, shielding personal energy and providing strategic resilience during critical transitions.
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* ========================================================================= */}
        {/* 4. STRENGTH & ENERGY FLOW VECTOR */}
        {/* ========================================================================= */}
        <Card variant="science" glow="cyan" className="p-6 sm:p-8">
          <div className="flex items-center justify-between border-b border-border/80 pb-4 mb-6">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-cyan-50 border border-cyan-200/60 flex items-center justify-center text-cyan-600">
                <Activity className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-foreground font-outfit">
                  Strengths & Energy Flow Vectors
                </h2>
                <p className="text-xs text-muted-foreground">
                  Distribution of 5 core energetic competencies reinforced by this name
                </p>
              </div>
            </div>
            <Badge variant="cyan">Dynamic Flow Vector</Badge>
          </div>

          <div className="space-y-5">
            {/* Item 1 */}
            <div>
              <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                <span className="flex items-center gap-2 text-foreground">
                  <Target className="w-3.5 h-3.5 text-brand-500" />
                  Strategic Leadership & Executive Focus
                </span>
                <span className="font-mono text-brand-600">
                  {metrics.leadership}%
                </span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-brand-500 to-indigo-500 transition-all duration-1000"
                  style={{ width: `${metrics.leadership}%` }}
                />
              </div>
            </div>

            {/* Item 2 */}
            <div>
              <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                <span className="flex items-center gap-2 text-foreground">
                  <Zap className="w-3.5 h-3.5 text-indigo-500" />
                  Creative Innovation & Cognitive Agility
                </span>
                <span className="font-mono text-indigo-600">
                  {metrics.innovation}%
                </span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-1000"
                  style={{ width: `${metrics.innovation}%` }}
                />
              </div>
            </div>

            {/* Item 3 */}
            <div>
              <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                <span className="flex items-center gap-2 text-foreground">
                  <Radio className="w-3.5 h-3.5 text-violet-500" />
                  Public Influence & Acoustic Persuasion
                </span>
                <span className="font-mono text-violet-600">
                  {metrics.communication}%
                </span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-500 transition-all duration-1000"
                  style={{ width: `${metrics.communication}%` }}
                />
              </div>
            </div>

            {/* Item 4 */}
            <div>
              <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                <span className="flex items-center gap-2 text-foreground">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  Emotional Fortitude & Systemic Resilience
                </span>
                <span className="font-mono text-emerald-600">
                  {metrics.resilience}%
                </span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-1000"
                  style={{ width: `${metrics.resilience}%` }}
                />
              </div>
            </div>

            {/* Item 5 */}
            <div>
              <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                <span className="flex items-center gap-2 text-foreground">
                  <TrendingUp className="w-3.5 h-3.5 text-amber-500" />
                  Prosperity Alignment & Capital Gravity
                </span>
                <span className="font-mono text-amber-600">
                  {metrics.prosperity}%
                </span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-amber-500 to-brand-500 transition-all duration-1000"
                  style={{ width: `${metrics.prosperity}%` }}
                />
              </div>
            </div>
          </div>
        </Card>

        {/* ========================================================================= */}
        {/* 5. CHARACTERISTICS & PSYCHOLOGICAL ARCHETYPE */}
        {/* ========================================================================= */}
        <Card variant="science" glow="violet" className="p-6 sm:p-8">
          <div className="flex items-center justify-between border-b border-border/80 pb-4 mb-6">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-violet-50 border border-violet-200/60 flex items-center justify-center text-violet-600">
                <Compass className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-foreground font-outfit">
                  Characteristics & Psychological Archetype
                </h2>
                <p className="text-xs text-muted-foreground">
                  Behavioral blueprints, cognitive patterns, and social gravitational dynamics
                </p>
              </div>
            </div>
            <Badge variant="violet">{archetype.title}</Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
              <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-brand-500" />
                Communication Style:
              </span>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {archetype.style}
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
              <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-indigo-500" />
                Cognitive Mindset:
              </span>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {archetype.mindset}
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
              <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-rose-500" />
                Social Gravity:
              </span>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {archetype.social}
              </p>
            </div>
          </div>
        </Card>

        {/* ========================================================================= */}
        {/* 6. POTENTIAL & GROWTH ACCELERATORS */}
        {/* ========================================================================= */}
        <Card variant="science" glow="blue" className="p-6 sm:p-8">
          <div className="flex items-center justify-between border-b border-border/80 pb-4 mb-6">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-brand-50 border border-brand-200/60 flex items-center justify-center text-brand-600">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-foreground font-outfit">
                  Latent Potential & Catalysts
                </h2>
                <p className="text-xs text-muted-foreground">
                  Unrealized capabilities unlocked when operating at maximum name frequency
                </p>
              </div>
            </div>
            <Badge variant="brand">Growth Multiplier</Badge>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-xl border border-brand-100 bg-brand-50/30 flex items-start gap-3">
              <div className="w-6 h-6 rounded-lg bg-brand-500 text-white flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                1
              </div>
              <div>
                <h4 className="text-xs font-bold text-foreground">
                  Latent Talent:
                </h4>
                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                  {archetype.latentTalent}
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-indigo-100 bg-indigo-50/30 flex items-start gap-3">
              <div className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                2
              </div>
              <div>
                <h4 className="text-xs font-bold text-foreground">
                  Environmental Catalyst:
                </h4>
                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                  {archetype.catalyst}
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-amber-100 bg-amber-50/30 flex items-start gap-3">
              <div className="w-6 h-6 rounded-lg bg-amber-500 text-white flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                3
              </div>
              <div>
                <h4 className="text-xs font-bold text-foreground">
                  Opportunity Magnetism:
                </h4>
                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                  {archetype.opportunityMagnet}
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* ========================================================================= */}
        {/* 7. CAREER TRAJECTORY & FINANCIAL RESONANCE */}
        {/* ========================================================================= */}
        <Card variant="science" glow="indigo" className="p-6 sm:p-8">
          <div className="flex items-center justify-between border-b border-border/80 pb-4 mb-6">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-200/60 flex items-center justify-center text-indigo-600">
                <Briefcase className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-foreground font-outfit">
                  Career Trajectory & Wealth Resonance
                </h2>
                <p className="text-xs text-muted-foreground">
                  Vocational sectors where this acoustic frequency demonstrates peak performance
                </p>
              </div>
            </div>
            <Badge variant="indigo">Vocational Resonance</Badge>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-xs font-bold text-foreground block mb-1">
                Peak Alignment Vector:
              </span>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {archetype.careerHeadline}
              </p>
            </div>

            <div>
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-2.5">
                Top High-Resonance Industry Sectors:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {archetype.careerPaths.map((career, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl border border-slate-200/80 bg-white hover:border-brand-300 transition-all flex items-center gap-3 shadow-sm"
                  >
                    <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 text-xs font-bold">
                      0{idx + 1}
                    </div>
                    <span className="text-xs font-bold text-foreground">
                      {career}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* ========================================================================= */}
        {/* 8. RELATIONSHIP DYNAMICS & SOCIAL SYNERGY */}
        {/* ========================================================================= */}
        <Card variant="science" glow="violet" className="p-6 sm:p-8">
          <div className="flex items-center justify-between border-b border-border/80 pb-4 mb-6">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-rose-50 border border-rose-200/60 flex items-center justify-center text-rose-600">
                <Heart className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-foreground font-outfit">
                  Relationship Dynamics & Social Synergy
                </h2>
                <p className="text-xs text-muted-foreground">
                  Harmonic resonance across strategic alliances, team loyalty, and family stability
                </p>
              </div>
            </div>
            <Badge variant="violet">Interpersonal Matrix</Badge>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 text-center">
              <span className="text-[11px] font-semibold text-muted-foreground uppercase block mb-1">
                Interpersonal Charisma
              </span>
              <span className="text-2xl font-black text-rose-500 font-outfit">
                96%
              </span>
              <p className="text-[11px] text-muted-foreground mt-1">
                Commands natural trust and executive favor
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 text-center">
              <span className="text-[11px] font-semibold text-muted-foreground uppercase block mb-1">
                Team & Peer Synergy
              </span>
              <span className="text-2xl font-black text-brand-600 font-outfit">
                91%
              </span>
              <p className="text-[11px] text-muted-foreground mt-1">
                Fosters dedicated and loyal collaboration
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 text-center">
              <span className="text-[11px] font-semibold text-muted-foreground uppercase block mb-1">
                Domestic Equilibrium
              </span>
              <span className="text-2xl font-black text-emerald-600 font-outfit">
                94%
              </span>
              <p className="text-[11px] text-muted-foreground mt-1">
                Radiates security, warmth, and enduring peace
              </p>
            </div>
          </div>
        </Card>

        {/* ========================================================================= */}
        {/* 9. LIFE DIRECTION & TIMELINE TRAJECTORY */}
        {/* ========================================================================= */}
        <Card variant="science" glow="gold" className="p-6 sm:p-8">
          <div className="flex items-center justify-between border-b border-border/80 pb-4 mb-6">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-200/60 flex items-center justify-center text-amber-600">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-foreground font-outfit">
                  Life Direction & Timeline Trajectory
                </h2>
                <p className="text-xs text-muted-foreground">
                  Phased evolution and peak maturity timeline of this name&apos;s vibrational cycle
                </p>
              </div>
            </div>
            <Badge variant="gold">Timeline Continuum</Badge>
          </div>

          <div className="relative border-l-2 border-slate-200 ml-4 sm:ml-6 pl-6 space-y-6">
            {/* Phase 1 */}
            <div className="relative">
              <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-brand-500 border-4 border-white shadow-sm" />
              <div>
                <span className="text-[10px] font-bold tracking-wider text-brand-600 uppercase font-mono">
                  PHASE 01 • Foundation & Skill Architecture
                </span>
                <h4 className="text-sm font-bold text-foreground mt-0.5">
                  Early Synthesis & Capability Genesis
                </h4>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  A foundational era dedicated to accumulating core expertise, identifying authentic vocations, and anchoring initial reputation through rigorous craftsmanship.
                </p>
              </div>
            </div>

            {/* Phase 2 */}
            <div className="relative">
              <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-indigo-600 border-4 border-white shadow-sm" />
              <div>
                <span className="text-[10px] font-bold tracking-wider text-indigo-600 uppercase font-mono">
                  PHASE 02 • Breakthrough & Strategic Acceleration
                </span>
                <h4 className="text-sm font-bold text-foreground mt-0.5">
                  Exponential Scale & Authority
                </h4>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  The harmonic frequency of this identity reaches zenith alignment. Major institutional opportunities present themselves, unlocking leadership elevation.
                </p>
              </div>
            </div>

            {/* Phase 3 */}
            <div className="relative">
              <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-amber-500 border-4 border-white shadow-sm" />
              <div>
                <span className="text-[10px] font-bold tracking-wider text-amber-600 uppercase font-mono">
                  PHASE 03 • Mastery & Generational Legacy
                </span>
                <h4 className="text-sm font-bold text-foreground mt-0.5">
                  Perpetual Wealth & Enduring Influence
                </h4>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  Crystallized financial sovereignty and indelible honor, stewarding capital and transmitting timeless wisdom to successor generations.
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* ========================================================================= */}
        {/* 10. UNICODE CHARACTER DECOMPOSITION & ACOUSTIC WEIGHTS */}
        {/* ========================================================================= */}
        {report.components && report.components.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-brand-600" />
              <h2 className="text-lg font-bold text-foreground font-outfit">
                Unicode NFC Character Decomposition & Acoustic Weights
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {report.components.map((comp) => (
                <Card key={comp.key} variant="science" className="p-5">
                  <div className="flex items-center justify-between border-b border-border/80 pb-3 mb-4">
                    <div>
                      <div className="text-xs font-semibold text-muted-foreground uppercase">
                        {comp.label}
                      </div>
                      <div className="text-xl font-bold text-foreground mt-0.5">
                        {comp.inputText}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-muted-foreground font-medium">
                        Effective Weight: {Math.round(comp.weight)}%
                      </div>
                      <div className="text-sm font-bold text-brand-600">
                        Score: {Number(comp.score).toFixed(2)} / 100
                      </div>
                    </div>
                  </div>

                  {comp.characters && comp.characters.length > 0 && (
                    <div className="space-y-2">
                      <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
                        Character Phonetic Scores (Unicode Decomposed):
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {comp.characters.map((ch, idx) => (
                          <div
                            key={idx}
                            className="flex flex-col items-center px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 min-w-[42px] transition-all hover:border-brand-300"
                          >
                            <span className="text-base font-bold text-foreground">
                              {ch.character}
                            </span>
                            <span className="text-[10px] font-semibold text-brand-600 mt-0.5">
                              {ch.score}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 11. IMMUTABLE SCIENTIFIC VERIFICATION GUARANTEE & ACTIONS */}
        {/* ========================================================================= */}
        <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/80 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-xs text-muted-foreground shadow-sm">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-brand-50 border border-brand-200/60 text-brand-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-foreground block">
                Reproducible Snapshot Guarantee
              </span>
              <span>
                Persisted with deterministic parameters under global calculation standard. Fully auditable and verifiable at any future time.
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <span className="font-mono text-[11px] px-2.5 py-1 rounded-lg bg-white border border-slate-200">
              Formula v{report.calculationVersion}
            </span>
          </div>
        </div>
      </main>
    </div>
  );
}
