"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import {
  NumerologyGroupArticle,
} from "@/lib/data/numerology-groups";
import {
  Sparkles,
  Compass,
  AlertCircle,
  CheckCircle2,
  Lock,
  Unlock,
  Printer,
  Check,
  ShieldAlert,
  HeartPulse,
  Award,
  Share2,
  ArrowRight,
  BookOpen,
} from "lucide-react";

interface CreditBalances {
  total: number;
  firstName: number;
  surname: number;
  combined: number;
}

interface MappedChar {
  character: string;
  lookupKey: string;
  position: number;
  score: number;
}

interface ComponentPreview {
  inputText: string;
  score: number;
  charSum: number;
  rootNumber: number;
  characters: MappedChar[];
  weight: number;
  article: NumerologyGroupArticle;
}

interface AnalysisPreviewData {
  firstName: ComponentPreview;
  surname: ComponentPreview;
  fullName: {
    inputText: string;
    finalScore: number;
    fullNameScore?: number;
    totalCompoundSum: number; // Total compound number
    rootNumber: number;       // Root vibration
    weight: number;           // 40% life influence
    article: NumerologyGroupArticle; // Full name article
  };
}

export default function AnalyzePage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [surname, setSurname] = useState("");
  const [credits, setCredits] = useState<CreditBalances>({
    total: 0,
    firstName: 0,
    surname: 0,
    combined: 0,
  });
  const [freeAnalysesCount, setFreeAnalysesCount] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [unlocking, setUnlocking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<AnalysisPreviewData | null>(null);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [savedAnalysisId, setSavedAnalysisId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Shared execute analysis function
  const executeAnalysis = async (
    fName: string,
    sName: string,
    overrideCount?: number,
    overrideCredits?: CreditBalances
  ) => {
    setError(null);
    const trimmedFirst = fName.trim();
    const trimmedSurname = sName.trim();

    if (!trimmedFirst || !trimmedSurname) {
      setError("Please provide both Official First Name and Official Surname to compute the complete analysis.");
      return;
    }

    const currentCount = overrideCount !== undefined ? overrideCount : freeAnalysesCount;
    const currentCredits = overrideCredits !== undefined ? overrideCredits : credits;
    const isFreeTrial = currentCount < 2;

    if (!isFreeTrial && currentCredits.total <= 0) {
      setError(
        "You have used your 2 free trial analyses. Subsequent analyses require credits. Please purchase a package to continue."
      );
      setPreview(null);
      return;
    }

    setLoading(true);
    setSavedAnalysisId(null);

    try {
      const res = await fetch("/api/analysis/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: trimmedFirst,
          surname: trimmedSurname,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Calculation failed. Please verify character inputs.");
        setPreview(null);
        if (res.status === 403) {
          setFreeAnalysesCount((prev) => Math.max(prev, 2));
        }
        setLoading(false);
        return;
      }

      setPreview(data.data);
      if (data.savedAnalysisId || data.analysisId) {
        setSavedAnalysisId(data.savedAnalysisId || data.analysisId);
      }

      if (isFreeTrial) {
        setIsUnlocked(false);
        const newCount = currentCount + 1;
        setFreeAnalysesCount(newCount);
      } else {
        try {
          const authRes = await fetch("/api/analysis", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              analysisType: "COMBINED",
              firstName: trimmedFirst,
              surname: trimmedSurname,
            }),
          });
          const authData = await authRes.json();
          if (authRes.ok && authData.analysis) {
            setIsUnlocked(true);
            setSavedAnalysisId(authData.analysis.id);
            await fetchCredits();
          } else {
            setIsUnlocked(false);
            if (authRes.status === 403) {
              setError("Insufficient credits. Please acquire an analysis package to unlock.");
            }
          }
        } catch {
          setIsUnlocked(false);
        }
      }

      setLoading(false);
    } catch {
      setError("Network connection error. Please try again.");
      setLoading(false);
    }
  };

  const fetchCredits = async (): Promise<{
    count: number;
    creds: CreditBalances;
  }> => {
    let count = 0;
    let creds: CreditBalances = {
      total: 0,
      firstName: 0,
      surname: 0,
      combined: 0,
    };

    try {
      const res = await fetch("/api/auth/me");
      const data = await res.json();
      if (data) {
        if (data.credits) {
          creds = {
            total:
              data.credits.total ??
              data.credits.combined +
                Math.min(data.credits.firstName, data.credits.surname),
            firstName: data.credits.firstName ?? 0,
            surname: data.credits.surname ?? 0,
            combined: data.credits.combined ?? 0,
          };
          setCredits(creds);
        }
        if (typeof data.analysesCount === "number") {
          count = data.analysesCount;
          setFreeAnalysesCount(count);
          if (typeof window !== "undefined") {
            // Delete legacy shared un-scoped key
            localStorage.removeItem("namenology_free_analyses_count");
            if (data.user?.id) {
              localStorage.setItem(`namenology_free_analyses_${data.user.id}`, count.toString());
            }
          }
        }
      }
    } catch {
      // offline fallback
    }

    return { count, creds };
  };

  // Initialize free analyses count from server and check query params safely
  useEffect(() => {
    let isMounted = true;

    async function initPage() {
      // Clean up legacy shared key that leaked across accounts
      if (typeof window !== "undefined") {
        localStorage.removeItem("namenology_free_analyses_count");
      }

      // Fetch authoritative count & credits from server first
      const { count: serverCount, creds: serverCredits } = await fetchCredits();
      if (!isMounted) return;

      const effectiveCount = serverCount;

      if (typeof window !== "undefined") {
        const params = new URLSearchParams(window.location.search);
        const fn = params.get("firstName");
        const sn = params.get("surname");
        if (fn) setFirstName(fn);
        if (sn) setSurname(sn);

        if (fn && sn) {
          // Check quota: if free trials are exhausted (>=2) and user has no credits (<=0),
          // DO NOT auto-execute analysis!
          if (effectiveCount >= 2 && serverCredits.total <= 0) {
            setError(
              "You have used your 2 free trial analyses. Subsequent analyses require credits. Please purchase a package to continue."
            );
            setPreview(null);
            return;
          }

          executeAnalysis(fn, sn, effectiveCount, serverCredits);
        }
      }
    }

    initPage();

    return () => {
      isMounted = false;
    };
  }, []);

  // ---------------------------------------------------------------------------
  // Execute Name Analysis
  // - Runs 1 & 2: Free trial (Official First Name 40% & Official Surname 20% unlocked, Full Name 40% locked)
  // - Run 3+: Requires payment or credit to analyze & unlocks all 3 parts
  // ---------------------------------------------------------------------------
  const handleCalculatePreview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (freeAnalysesCount >= 2 && credits.total <= 0) {
      setError(
        "You have used your 2 free trial analyses. Subsequent analyses require credits. Please purchase a package to continue."
      );
      setPreview(null);
      return;
    }
    executeAnalysis(firstName, surname);
  };

  // ---------------------------------------------------------------------------
  // Unlock Full Name Dossier (Consume 1 Credit from Free Trial Preview)
  // ---------------------------------------------------------------------------
  const handleUnlockDossier = async () => {
    if (!preview) return;
    setError(null);
    setUnlocking(true);

    try {
      const res = await fetch("/api/analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          analysisType: "COMBINED",
          firstName: preview.firstName.inputText,
          surname: preview.surname.inputText,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 401) {
          router.push("/signin?callbackUrl=/analyze");
          return;
        }
        if (res.status === 403) {
          setError(
            "Insufficient credits. Please acquire an analysis package to unlock the Full Name analysis."
          );
        } else {
          setError(data.error || "Failed to unlock full reading.");
        }
        setUnlocking(false);
        return;
      }

      setIsUnlocked(true);
      setSavedAnalysisId(data.analysis.id);
      await fetchCredits();
      setUnlocking(false);
    } catch {
      setError("Failed to communicate with state ledger. Please try again.");
      setUnlocking(false);
    }
  };

  const handleCopyShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-foreground selection:bg-brand-500 selection:text-white relative overflow-hidden">
      {/* Background subtle cosmic grid & light gradient */}
      <div className="absolute inset-0 bg-scientific-grid pointer-events-none opacity-60" />
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-gradient-to-b from-brand-500/5 via-indigo-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8 relative z-10">
        {/* ========================================================================= */}
        {/* HEADER & CREDIT STATUS                                                    */}
        {/* ========================================================================= */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="brand">Name Science Engine v2.0</Badge>
              <Badge variant="indigo">Tripartite Destiny Analysis</Badge>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground font-outfit">
              Scientific Name Resonance & Numerology
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Analyze in 3 distinct dimensions: Official First Name (40%) + Official Surname (20%) + Full Name (40%) decoded through the 1–100 numerology science.
            </p>
          </div>

          {/* Credit Counter */}
          <div className="flex items-center gap-3 p-3 rounded-2xl border border-slate-200/80 bg-white/90 backdrop-blur-md shadow-card">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Analysis Credits
              </span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xl font-extrabold text-brand-600 font-outfit">
                  {credits.total}
                </span>
                <span className="text-xs text-muted-foreground">Available</span>
              </div>
            </div>
            <Link href="/pricing">
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-xs font-semibold shrink-0"
              >
                + Top Up
              </Button>
            </Link>
          </div>
        </div>

        {/* Free Trial Quota Notice Banner */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-brand-50/80 to-indigo-50/80 border border-brand-200/60 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-xl bg-brand-500 text-white flex items-center justify-center font-bold font-outfit shadow-sm">
              {Math.min(2, freeAnalysesCount)}/2
            </div>
            <div>
              {freeAnalysesCount < 2 ? (
                <p className="font-semibold text-brand-950">
                  Free Trial:{" "}
                  <span className="font-bold text-brand-600">
                    {2 - freeAnalysesCount} remaining
                  </span>{" "}
                  (Official First Name 40% & Official Surname 20% are unlocked for free)
                </p>
              ) : (
                <p className="font-semibold text-amber-900">
                  Free trial quota completed • Subsequent analyses require 1 credit (unlocks all 3 dimensions 100%)
                </p>
              )}
              <p className="text-[11px] text-muted-foreground mt-0.5">
                The first 2 analyses are free, but the Full Name analysis (40%) is locked until unlocked with credits.
              </p>
            </div>
          </div>
          {freeAnalysesCount >= 2 && credits.total === 0 && (
            <Link href="/pricing">
              <Button
                variant="primary"
                size="sm"
                className="h-7 text-[11px] font-bold shrink-0"
              >
                Purchase Credits &rarr;
              </Button>
            </Link>
          )}
        </div>

        {/* ========================================================================= */}
        {/* NAME INPUT FORM                                                           */}
        {/* ========================================================================= */}
        <Card variant="science" glow="blue" className="p-6 sm:p-8">
          <form onSubmit={handleCalculatePreview} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Official First Name Input */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
                  <span>Official First Name *</span>
                  <Badge variant="brand" className="text-[10px] py-0 px-2">
                    40% Life Impact
                  </Badge>
                </label>
                <Input
                  type="text"
                  placeholder="e.g. Alexander"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="h-12 text-sm font-medium"
                  required
                />
                <p className="text-[11px] text-muted-foreground">
                  Individual personality, creative initiative, and sovereign leadership potential.
                </p>
              </div>

              {/* Official Surname Input */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
                  <span>Official Surname *</span>
                  <Badge variant="indigo" className="text-[10px] py-0 px-2">
                    20% Life Impact
                  </Badge>
                </label>
                <Input
                  type="text"
                  placeholder="e.g. Sterling"
                  value={surname}
                  onChange={(e) => setSurname(e.target.value)}
                  className="h-12 text-sm font-medium"
                  required
                />
                <p className="text-[11px] text-muted-foreground">
                  Ancestral lineage resonance, structural stability, and generational support.
                </p>
              </div>
            </div>

            {error && (
              <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{error}</span>
                </div>
                {error.includes("2 free trial analyses") && (
                  <Link href="/pricing" className="shrink-0">
                    <Button
                      type="button"
                      variant="primary"
                      size="sm"
                      className="h-8 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white"
                    >
                      Purchase Credits &rarr;
                    </Button>
                  </Link>
                )}
              </div>
            )}

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-2 border-t border-slate-100">
              <div className="text-xs text-muted-foreground flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-brand-500" />
                <span>
                  Decodes phonetic letter weights (Chaldean & Thai) and queries the 1–100 numerology knowledge base.
                </span>
              </div>

              {freeAnalysesCount >= 2 && credits.total <= 0 ? (
                <Link href="/pricing" className="w-full sm:w-auto">
                  <Button
                    type="button"
                    variant="primary"
                    size="lg"
                    className="w-full sm:w-auto px-8 font-bold bg-amber-600 hover:bg-amber-700 text-white shadow-lg shadow-amber-500/20"
                  >
                    <Lock className="w-4 h-4 mr-2" />
                    <span>Free Trial Expired — Purchase Credits</span>
                  </Button>
                </Link>
              ) : (
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  disabled={loading || !firstName.trim() || !surname.trim()}
                  className="w-full sm:w-auto px-8 font-bold"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 animate-spin" />
                      <span>Computing Vibration...</span>
                    </span>
                  ) : freeAnalysesCount < 2 ? (
                    <span className="flex items-center gap-2">
                      <Compass className="w-4 h-4" />
                      <span>
                        Calculate Name Resonance (Free Trial {freeAnalysesCount + 1}/2)
                      </span>
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Compass className="w-4 h-4" />
                      <span>Analyze Full Dossier (1 Credit)</span>
                    </span>
                  )}
                </Button>
              )}
            </div>
          </form>
        </Card>

        {/* ========================================================================= */}
        {/* ANALYSIS RESULTS: 3 MAPPING SECTIONS                                      */}
        {/* 1. Official First Name (40%)                                              */}
        {/* 2. Official Surname (20%)                                                 */}
        {/* 3. Full Name (40%) (Gated on 2 free trials, unlocked via credit)          */}
        {/* ========================================================================= */}
        {preview && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Results Title Banner */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-200 pb-3">
              <div>
                <h2 className="text-xl font-extrabold text-foreground font-outfit">
                  Analysis Results for &ldquo;{preview.fullName.inputText}&rdquo;
                </h2>
                <p className="text-xs text-muted-foreground">
                  Tripartite analysis: Official First Name (40%) • Official Surname (20%) • Full Name (40%)
                </p>
              </div>
              {isUnlocked ? (
                <Badge variant="success" className="gap-1.5 py-1 px-3">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Full Destiny Dossier Unlocked</span>
                </Badge>
              ) : (
                <Badge variant="gold" className="gap-1.5 py-1 px-3">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Free Trial Mode (Full Name Locked)</span>
                </Badge>
              )}
            </div>

            {/* ===================================================================== */}
            {/* 1. OFFICIAL FIRST NAME COMPONENT — 40% LIFE IMPACT                    */}
            {/* ===================================================================== */}
            <Card variant="science" glow="blue" className="p-6 sm:p-8 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-5">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <Badge variant="brand">1. Official First Name</Badge>
                    <Badge variant="indigo">40% Life Impact</Badge>
                  </div>
                  <h3 className="text-2xl font-black text-foreground font-outfit">
                    {preview.firstName.inputText}
                  </h3>
                </div>

                <div className="flex items-center gap-4 bg-slate-50 border border-slate-200/80 p-3.5 rounded-2xl">
                  <div className="text-center">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                      Compound Sum
                    </span>
                    <span className="text-3xl font-black text-brand-600 font-outfit">
                      {preview.firstName.charSum}
                    </span>
                  </div>
                  <div className="h-8 w-px bg-slate-200" />
                  <div className="text-center">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                      Root Vibration
                    </span>
                    <span className="text-2xl font-bold text-foreground font-outfit">
                      {preview.firstName.rootNumber}
                    </span>
                  </div>
                </div>
              </div>

              {/* Phonetic character mapping pills */}
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-2">
                  Phonetic Letter Values (Decoded Weights):
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {preview.firstName.characters.map((ch, idx) => (
                    <div
                      key={idx}
                      className="flex flex-col items-center px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 min-w-[38px]"
                    >
                      <span className="text-xs font-bold text-foreground">
                        {ch.character}
                      </span>
                      <span className="text-[10px] font-black text-brand-600 font-outfit">
                        {ch.score}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Article for First Name */}
              <div className="space-y-4 pt-2">
                <div className="flex flex-wrap items-center justify-between gap-2 bg-brand-50/70 border border-brand-200/80 p-4 rounded-2xl">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-brand-700 block">
                      Article for Compound Number {preview.firstName.charSum}
                    </span>
                    <h4 className="text-xl font-black text-brand-950 font-outfit mt-0.5">
                      {preview.firstName.article.title}
                    </h4>
                  </div>
                  <Badge variant="brand">
                    Group {preview.firstName.article.groupNumber} ({preview.firstName.article.numbersFormatted})
                  </Badge>
                </div>

                {preview.firstName.article.meaningsAndSymbols && (
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 text-xs text-foreground/90 space-y-1">
                    <span className="font-bold text-foreground uppercase block text-[10px] tracking-wider">
                      Meanings & Symbols:
                    </span>
                    <p className="leading-relaxed">
                      {preview.firstName.article.meaningsAndSymbols}
                    </p>
                  </div>
                )}

                {preview.firstName.article.characteristics && (
                  <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200 text-xs text-foreground/90 space-y-1">
                    <span className="font-bold text-foreground uppercase block text-[10px] tracking-wider">
                      Characteristics of Group {preview.firstName.article.groupNumber}:
                    </span>
                    <p className="leading-relaxed">
                      {preview.firstName.article.characteristics}
                    </p>
                  </div>
                )}

                {preview.firstName.article.lifeDescription && (
                  <div className="p-4 rounded-xl bg-white border border-slate-200 text-xs text-foreground/90 space-y-1">
                    <span className="font-bold text-foreground uppercase block text-[10px] tracking-wider flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-brand-600" />
                      Life Influence & Destiny Reading:
                    </span>
                    <p className="leading-relaxed">
                      {preview.firstName.article.lifeDescription}
                    </p>
                  </div>
                )}

                {preview.firstName.article.illnessesFormatted && (
                  <div className="p-3.5 rounded-xl bg-rose-50/70 border border-rose-200/70 text-xs text-rose-950">
                    <span className="font-bold text-rose-900 block mb-0.5">
                      Be Wary Of & Health Precautions:
                    </span>
                    <p>{preview.firstName.article.illnessesFormatted}</p>
                  </div>
                )}
              </div>
            </Card>

            {/* ===================================================================== */}
            {/* 2. OFFICIAL SURNAME COMPONENT — 20% LIFE IMPACT                       */}
            {/* ===================================================================== */}
            <Card variant="science" glow="blue" className="p-6 sm:p-8 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-5">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <Badge variant="brand">2. Official Surname</Badge>
                    <Badge variant="indigo">20% Life Impact</Badge>
                  </div>
                  <h3 className="text-2xl font-black text-foreground font-outfit">
                    {preview.surname.inputText}
                  </h3>
                </div>

                <div className="flex items-center gap-4 bg-slate-50 border border-slate-200/80 p-3.5 rounded-2xl">
                  <div className="text-center">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                      Compound Sum
                    </span>
                    <span className="text-3xl font-black text-indigo-600 font-outfit">
                      {preview.surname.charSum}
                    </span>
                  </div>
                  <div className="h-8 w-px bg-slate-200" />
                  <div className="text-center">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                      Root Vibration
                    </span>
                    <span className="text-2xl font-bold text-foreground font-outfit">
                      {preview.surname.rootNumber}
                    </span>
                  </div>
                </div>
              </div>

              {/* Phonetic character mapping pills */}
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-2">
                  Phonetic Letter Values (Decoded Weights):
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {preview.surname.characters.map((ch, idx) => (
                    <div
                      key={idx}
                      className="flex flex-col items-center px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 min-w-[38px]"
                    >
                      <span className="text-xs font-bold text-foreground">
                        {ch.character}
                      </span>
                      <span className="text-[10px] font-black text-indigo-600 font-outfit">
                        {ch.score}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Article for Surname */}
              <div className="space-y-4 pt-2">
                <div className="flex flex-wrap items-center justify-between gap-2 bg-indigo-50/70 border border-indigo-200/80 p-4 rounded-2xl">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 block">
                      Article for Compound Number {preview.surname.charSum}
                    </span>
                    <h4 className="text-xl font-black text-indigo-950 font-outfit mt-0.5">
                      {preview.surname.article.title}
                    </h4>
                  </div>
                  <Badge variant="indigo">
                    Group {preview.surname.article.groupNumber} ({preview.surname.article.numbersFormatted})
                  </Badge>
                </div>

                {preview.surname.article.meaningsAndSymbols && (
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 text-xs text-foreground/90 space-y-1">
                    <span className="font-bold text-foreground uppercase block text-[10px] tracking-wider">
                      Meanings & Symbols:
                    </span>
                    <p className="leading-relaxed">
                      {preview.surname.article.meaningsAndSymbols}
                    </p>
                  </div>
                )}

                {preview.surname.article.characteristics && (
                  <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200 text-xs text-foreground/90 space-y-1">
                    <span className="font-bold text-foreground uppercase block text-[10px] tracking-wider">
                      Characteristics of Group {preview.surname.article.groupNumber}:
                    </span>
                    <p className="leading-relaxed">
                      {preview.surname.article.characteristics}
                    </p>
                  </div>
                )}

                {preview.surname.article.lifeDescription && (
                  <div className="p-4 rounded-xl bg-white border border-slate-200 text-xs text-foreground/90 space-y-1">
                    <span className="font-bold text-foreground uppercase block text-[10px] tracking-wider flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                      Life Influence & Destiny Reading:
                    </span>
                    <p className="leading-relaxed">
                      {preview.surname.article.lifeDescription}
                    </p>
                  </div>
                )}

                {preview.surname.article.illnessesFormatted && (
                  <div className="p-3.5 rounded-xl bg-rose-50/70 border border-rose-200/70 text-xs text-rose-950">
                    <span className="font-bold text-rose-900 block mb-0.5">
                      Be Wary Of & Health Precautions:
                    </span>
                    <p>{preview.surname.article.illnessesFormatted}</p>
                  </div>
                )}
              </div>
            </Card>

            {/* ===================================================================== */}
            {/* 3. FULL NAME COMPONENT — 40% (GATED ON 2 FREE TRIALS)                 */}
            {/* ===================================================================== */}
            <div className="relative rounded-3xl border border-slate-200 bg-white shadow-xl overflow-hidden">
              {/* Header Accent Glow */}
              <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-brand-500 via-indigo-500 to-violet-500" />

              <div className="p-6 sm:p-10 space-y-8">
                {/* Full Name Identity Meta */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 pb-6 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <Badge variant="brand">3. Full Name Synergy</Badge>
                      <Badge variant="violet">40% Life Impact</Badge>
                      <Badge variant="outline">
                        Composite Harmonic Score: {preview.fullName.finalScore} / 100
                      </Badge>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground font-outfit">
                      {preview.fullName.inputText}
                    </h2>
                  </div>

                  {/* Compound Sum for Full Name */}
                  <div className="flex items-center gap-4 bg-slate-50 border border-slate-200/80 p-4 rounded-2xl">
                    <div className="text-center">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                        Compound Sum
                      </span>
                      <span className="text-3xl font-black text-brand-600 font-outfit">
                        {preview.fullName.totalCompoundSum}
                      </span>
                    </div>
                    <div className="h-8 w-px bg-slate-200" />
                    <div className="text-center">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                        Root Vibration
                      </span>
                      <span className="text-2xl font-bold text-foreground font-outfit">
                        {preview.fullName.rootNumber}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Article Header */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-brand-600">
                      Article for Compound Number {preview.fullName.totalCompoundSum}
                    </span>
                    <span className="text-xs text-muted-foreground">•</span>
                    <span className="text-xs font-semibold text-muted-foreground">
                      GROUP {preview.fullName.article.groupNumber} ({preview.fullName.article.numbersFormatted})
                    </span>
                  </div>
                  <h3 className="text-2xl sm:text-4xl font-black text-foreground font-outfit tracking-tight">
                    {preview.fullName.article.title}
                  </h3>
                </div>

                {/* Visible Teaser: Meanings & Symbols */}
                <div className="p-4 sm:p-5 rounded-2xl bg-brand-50/60 border border-brand-200/60 space-y-1.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-brand-700 block">
                    Meanings & Symbols:
                  </span>
                  <p className="text-sm font-semibold text-brand-950 leading-relaxed">
                    {preview.fullName.article.meaningsAndSymbols}
                  </p>
                </div>

                {/* Gated Deep Article Container */}
                <div className="relative">
                  {/* Deep Article Content */}
                  <div
                    className={`space-y-6 transition-all duration-700 ${
                      !isUnlocked
                        ? "filter blur-md select-none opacity-25 pointer-events-none max-h-[360px] overflow-hidden"
                        : "filter-none opacity-100"
                    }`}
                  >
                    {/* CHARACTERISTICS OF GROUP */}
                    <div className="space-y-3">
                      <h4 className="text-sm font-bold uppercase tracking-wider text-foreground flex items-center gap-2 font-outfit">
                        <span className="w-2 h-2 rounded-full bg-brand-500" />
                        <span>
                          Characteristics of Group {preview.fullName.article.groupNumber} ({preview.fullName.article.numbersFormatted})
                        </span>
                      </h4>
                      <p className="text-sm text-foreground/90 leading-relaxed font-normal bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                        {preview.fullName.article.characteristics}
                      </p>
                    </div>

                    {/* LIFE PREDICTION */}
                    <div className="space-y-3">
                      <h4 className="text-sm font-bold uppercase tracking-wider text-brand-700 flex items-center gap-2 font-outfit">
                        <BookOpen className="w-4 h-4 text-brand-600" />
                        <span>Life Influence & Destiny Reading:</span>
                      </h4>
                      <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-sm text-foreground/95 leading-relaxed">
                        {preview.fullName.article.lifeDescription}
                      </div>
                    </div>

                    {/* POLARITY DYNAMICS (WHEN CONNECTED TO BAD NUMBERS) */}
                    {preview.fullName.article.shadowPolarity && (
                      <div className="space-y-3">
                        <h4 className="text-sm font-bold uppercase tracking-wider text-amber-700 flex items-center gap-2 font-outfit">
                          <ShieldAlert className="w-4 h-4 text-amber-500" />
                          <span>Polarity Dynamics: When Connected to Unfavorable Numbers</span>
                        </h4>
                        <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-sm text-amber-950 leading-relaxed">
                          {preview.fullName.article.shadowPolarity}
                        </div>
                      </div>
                    )}

                    {/* HEALTH & PHYSICAL VULNERABILITIES */}
                    {preview.fullName.article.illnessesFormatted && (
                      <div className="space-y-3">
                        <h4 className="text-sm font-bold uppercase tracking-wider text-rose-700 flex items-center gap-2 font-outfit">
                          <HeartPulse className="w-4 h-4 text-rose-500" />
                          <span>Be Wary Of: Health & Physical Vulnerabilities</span>
                        </h4>
                        <div className="p-5 rounded-2xl bg-rose-50/70 border border-rose-200/80 text-sm text-rose-950 leading-relaxed">
                          <span className="font-bold text-rose-900 block mb-1">
                            Health Vulnerabilities:
                          </span>
                          <span>{preview.fullName.article.illnessesFormatted}</span>
                        </div>
                      </div>
                    )}

                    {/* EXAMPLE NAMES */}
                    {preview.fullName.article.exampleNames && (
                      <div className="space-y-2">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 font-outfit">
                          <Award className="w-3.5 h-3.5 text-brand-500" />
                          <span>Names and Surnames Carrying the Power of this Number:</span>
                        </h4>
                        <p className="text-xs font-medium text-slate-700 bg-slate-50 p-3.5 rounded-xl border border-slate-200/70">
                          {preview.fullName.article.exampleNames}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Frosted Glass Paywall Overlay (If Locked) */}
                  {!isUnlocked && (
                    <div className="absolute inset-0 flex items-center justify-center p-4">
                      <div className="max-w-md w-full p-6 sm:p-8 rounded-3xl bg-white/95 backdrop-blur-xl border border-slate-200/90 shadow-2xl text-center space-y-5 animate-in zoom-in-95 duration-300">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-brand-500/25">
                          <Lock className="w-7 h-7" />
                        </div>

                        <div className="space-y-2">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900">
                            First 2 Analyses Free • Full Name Locked
                          </span>
                          <h4 className="text-lg font-extrabold text-foreground font-outfit">
                            Unlock Full Name Analysis (40% Impact)
                          </h4>
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            The Full Name represents 40% of your total life destiny impact (the composite resonance of Official First Name and Official Surname). Unlock to access the full archetype article, life predictions, polarity dynamics, and health warnings.
                          </p>
                        </div>

                        <div className="pt-2 space-y-3">
                          {credits.total > 0 ? (
                            <Button
                              variant="primary"
                              size="lg"
                              onClick={handleUnlockDossier}
                              disabled={unlocking}
                              className="w-full font-bold shadow-md shadow-brand-500/20"
                            >
                              {unlocking ? (
                                <span className="flex items-center gap-2">
                                  <Sparkles className="w-4 h-4 animate-spin" />
                                  <span>Unlocking...</span>
                                </span>
                              ) : (
                                <span className="flex items-center gap-2">
                                  <Unlock className="w-4 h-4" />
                                  <span>Unlock Full Name Analysis (1 Credit)</span>
                                </span>
                              )}
                            </Button>
                          ) : (
                            <Link href="/pricing" className="block w-full">
                              <Button
                                variant="primary"
                                size="lg"
                                className="w-full font-bold shadow-md shadow-brand-500/20"
                              >
                                <span className="flex items-center gap-2">
                                  <span>Top Up Credits to Unlock (Packages)</span>
                                  <ArrowRight className="w-4 h-4" />
                                </span>
                              </Button>
                            </Link>
                          )}

                          <div className="flex items-center justify-center gap-2 text-[11px] text-muted-foreground">
                            <span>Balance: {credits.total} Credits</span>
                            <span>•</span>
                            <Link
                              href="/pricing"
                              className="text-brand-600 font-semibold hover:underline"
                            >
                              View Pricing Packages
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Actions Bar (When Unlocked) */}
                  {isUnlocked && (
                    <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="flex items-center gap-2 text-xs text-emerald-600 font-semibold">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Complete Name Dossier Unlocked & Ready</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleCopyShare}
                          className="h-9 text-xs"
                        >
                          {copied ? (
                            <Check className="w-3.5 h-3.5 text-emerald-500 mr-1.5" />
                          ) : (
                            <Share2 className="w-3.5 h-3.5 mr-1.5" />
                          )}
                          <span>{copied ? "Link Copied" : "Share"}</span>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.print()}
                          className="h-9 text-xs"
                        >
                          <Printer className="w-3.5 h-3.5 mr-1.5" />
                          <span>Print / PDF</span>
                        </Button>
                        {savedAnalysisId && (
                          <Link href={`/analyze/result/${savedAnalysisId}`}>
                            <Button
                              variant="primary"
                              size="sm"
                              className="h-9 text-xs font-bold"
                            >
                              <span>View Full 11-Card Dossier &rarr;</span>
                            </Button>
                          </Link>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {!preview && freeAnalysesCount >= 2 && credits.total <= 0 && (
          <Card
            variant="science"
            glow="gold"
            className="p-8 text-center space-y-4 border-amber-200 bg-amber-50/40 animate-in fade-in duration-300"
          >
            <div className="w-12 h-12 rounded-2xl bg-amber-100 border border-amber-200 flex items-center justify-center mx-auto text-amber-700">
              <Lock className="w-6 h-6" />
            </div>
            <div className="max-w-md mx-auto space-y-1.5">
              <h3 className="text-lg font-bold text-slate-900 font-outfit">
                Free Trial Quota Reached (2/2 Used)
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                You have used both complimentary trial analyses. To compute name resonance, unlock full 100% synergy readings, and generate comprehensive destiny dossiers, please top up credits.
              </p>
            </div>
            <div className="pt-2">
              <Link href="/pricing">
                <Button
                  variant="primary"
                  size="lg"
                  className="px-6 font-bold bg-amber-600 hover:bg-amber-700 text-white"
                >
                  View Credit Packages &rarr;
                </Button>
              </Link>
            </div>
          </Card>
        )}
      </main>
    </div>
  );
}
