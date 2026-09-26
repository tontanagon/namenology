"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { ScoreGauge } from "@/components/analysis/ScoreGauge";
import {
  NumerologyGroupArticle,
  getNumerologyGroup,
  reduceToRootNumber,
} from "@/lib/data/numerology-groups";
import {
  Sparkles,
  Compass,
  AlertCircle,
  CheckCircle2,
  Lock,
  Unlock,
  ArrowRight,
  TrendingUp,
  Layers,
  FileText,
  Plus,
  Trash2,
  Award,
  ShieldAlert,
  HeartPulse,
  Share2,
  Printer,
  Check,
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
}

interface AnalysisPreviewData {
  firstName: ComponentPreview;
  surname: ComponentPreview;
  fullName: {
    inputText: string;
    finalScore: number;
    totalCompoundSum: number; // 1. เลขรวม
    rootNumber: number;       // 1. เลขรวม (Root)
    article: NumerologyGroupArticle; // 2. ชื่อของบทความ + 3. ความหมายหรือบทความ
  };
}

interface PairingItem {
  surname: string;
  score: number;
  totalSum: number;
  rootNumber: number;
  articleTitle: string;
}

export default function AnalyzePage() {
  const [activeTab, setActiveTab] = useState<"unified" | "pairing">("unified");
  const [firstName, setFirstName] = useState("");
  const [surname, setSurname] = useState("");
  const [credits, setCredits] = useState<CreditBalances>({
    total: 0,
    firstName: 0,
    surname: 0,
    combined: 0,
  });
  const [loading, setLoading] = useState(false);
  const [unlocking, setUnlocking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<AnalysisPreviewData | null>(null);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [savedAnalysisId, setSavedAnalysisId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Pairing Mode State
  const [pairingFirstName, setPairingFirstName] = useState("");
  const [candidateSurnames, setCandidateSurnames] = useState<string[]>(["", ""]);
  const [pairingResults, setPairingResults] = useState<PairingItem[]>([]);
  const [pairingLoading, setPairingLoading] = useState(false);

  const fetchCredits = async () => {
    try {
      const res = await fetch("/api/auth/me");
      const data = await res.json();
      if (data.authenticated && data.credits) {
        setCredits({
          total: data.credits.total ?? (data.credits.combined + Math.min(data.credits.firstName, data.credits.surname)),
          firstName: data.credits.firstName ?? 0,
          surname: data.credits.surname ?? 0,
          combined: data.credits.combined ?? 0,
        });
      }
    } catch {
      // offline fallback
    }
  };

  useEffect(() => {
    fetchCredits();
  }, []);

  // ---------------------------------------------------------------------------
  // 1. Execute Preview Calculation (Unified First Name + Surname)
  // ---------------------------------------------------------------------------
  const handleCalculatePreview = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const fName = firstName.trim();
    const sName = surname.trim();

    if (!fName || !sName) {
      setError("Please provide both Given Name and Surname to compute complete synergy.");
      return;
    }

    setLoading(true);
    setIsUnlocked(false);
    setSavedAnalysisId(null);

    try {
      const res = await fetch("/api/analysis/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: fName,
          surname: sName,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Calculation failed. Please verify character inputs.");
        setLoading(false);
        return;
      }

      setPreview(data.data);
      setLoading(false);
    } catch {
      setError("Network connection error. Please try again.");
      setLoading(false);
    }
  };

  // ---------------------------------------------------------------------------
  // 2. Unlock Full Dossier (Consume 1 Credit & Save to DB)
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
        if (res.status === 403) {
          setError("You do not have enough analysis credits. Please acquire an analysis package to unlock.");
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

  // ---------------------------------------------------------------------------
  // 3. Pairing Mode Calculation
  // ---------------------------------------------------------------------------
  const handlePairingAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const validCandidates = candidateSurnames.filter((s) => s.trim().length > 0);
    if (!pairingFirstName.trim()) {
      setError("Please enter a primary Given Name.");
      return;
    }
    if (validCandidates.length === 0) {
      setError("Please provide at least one candidate surname.");
      return;
    }

    setPairingLoading(true);
    const results: PairingItem[] = [];

    for (const cand of validCandidates) {
      try {
        const res = await fetch("/api/analysis/preview", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            firstName: pairingFirstName.trim(),
            surname: cand.trim(),
          }),
        });

        const data = await res.json();
        if (res.ok && data.data) {
          results.push({
            surname: cand.trim(),
            score: data.data.fullName.finalScore,
            totalSum: data.data.fullName.totalCompoundSum,
            rootNumber: data.data.fullName.rootNumber,
            articleTitle: data.data.fullName.article.title,
          });
        }
      } catch {
        // continue
      }
    }

    results.sort((a, b) => b.score - a.score);
    setPairingResults(results);
    setPairingLoading(false);
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
        {/* HEADER & UNIFIED CREDIT BADGE (NO SEPARATION BETWEEN FIRST & SURNAME)     */}
        {/* ========================================================================= */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="brand">Name Science Engine v2.0</Badge>
              <Badge variant="indigo">Unified Name & Surname Synergy</Badge>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground font-outfit">
              Scientific Name Resonance & Numerology
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Analyze Given Name and Surname simultaneously to decode phonetic frequencies, total compound vibration, and complete destiny archetypes.
            </p>
          </div>

          {/* Unified Credit Counter: No separate First Name vs Surname credits */}
          <div className="flex items-center gap-3 p-3 rounded-2xl border border-slate-200/80 bg-white/90 backdrop-blur-md shadow-card">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Analysis Credits
              </span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xl font-extrabold text-brand-600 font-outfit">
                  {credits.total}
                </span>
                <span className="text-xs text-muted-foreground">
                  {credits.total === 1 ? "Complete Analysis" : "Complete Analyses"}
                </span>
              </div>
            </div>
            <Link href="/pricing">
              <Button variant="outline" size="sm" className="h-8 text-xs font-semibold shrink-0">
                + Top Up
              </Button>
            </Link>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-border">
          <button
            type="button"
            className={`pb-3 px-5 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === "unified"
                ? "border-brand-500 text-brand-600 font-bold"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => setActiveTab("unified")}
          >
            <Compass className="w-4 h-4" />
            <span>Complete Name Analysis</span>
          </button>
          <button
            type="button"
            className={`pb-3 px-5 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === "pairing"
                ? "border-brand-500 text-brand-600 font-bold"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => setActiveTab("pairing")}
          >
            <Sparkles className="w-3.5 h-3.5 text-brand-500" />
            <span>Harmonic Surname Comparison</span>
          </button>
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: UNIFIED FIRST NAME + SURNAME ANALYSIS FORM                         */}
        {/* ========================================================================= */}
        {activeTab === "unified" && (
          <div className="space-y-8">
            <Card variant="science" glow="blue" className="p-6 sm:p-8">
              <form onSubmit={handleCalculatePreview} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* First Name Input */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
                      <span>Given Name (First Name) *</span>
                      <span className="text-[11px] font-normal text-muted-foreground">Weight: 60%</span>
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
                      Primary given name vibrating core creative and sovereign potential.
                    </p>
                  </div>

                  {/* Surname Input */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
                      <span>Surname (Family Name) *</span>
                      <span className="text-[11px] font-normal text-muted-foreground">Weight: 40%</span>
                    </label>
                    <Input
                      type="text"
                      placeholder="e.g. Vance"
                      value={surname}
                      onChange={(e) => setSurname(e.target.value)}
                      className="h-12 text-sm font-medium"
                      required
                    />
                    <p className="text-[11px] text-muted-foreground">
                      Ancestral lineage resonance providing structural foundation and stability.
                    </p>
                  </div>
                </div>

                {error && (
                  <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-600 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-2 border-t border-slate-100">
                  <div className="text-xs text-muted-foreground flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-brand-500" />
                    <span>Instant calculation of acoustic weights, root life numbers, and total compound frequency.</span>
                  </div>

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
                    ) : (
                      <span className="flex items-center gap-2">
                        <Compass className="w-4 h-4" />
                        <span>Calculate Complete Name Resonance</span>
                      </span>
                    )}
                  </Button>
                </div>
              </form>
            </Card>

            {/* ===================================================================== */}
            {/* ANALYSIS RESULT DISPLAY (INCLUDES 1.เลขรวม 2.ชื่อของบทความ 3.ความหมาย) */}
            {/* ===================================================================== */}
            {preview && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Section Title */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-200 pb-3">
                  <div>
                    <h2 className="text-xl font-extrabold text-foreground font-outfit">
                      Analysis Results for &ldquo;{preview.fullName.inputText}&rdquo;
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      Simultaneous calculation of First Name (60%), Surname (40%), and Full Name Compound Resonance (100%).
                    </p>
                  </div>
                  {isUnlocked && (
                    <Badge variant="success" className="gap-1.5 py-1 px-3">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Full Destiny Dossier Unlocked</span>
                    </Badge>
                  )}
                </div>

                {/* Component Breakdown Cards (First Name & Surname) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* First Name Breakdown */}
                  <Card variant="science" className="p-5 space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                          Given Name Component (60%)
                        </span>
                        <h3 className="text-lg font-bold text-foreground mt-0.5">
                          {preview.firstName.inputText}
                        </h3>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-muted-foreground">Root Vibration</div>
                        <div className="text-xl font-extrabold text-brand-600 font-outfit">
                          {preview.firstName.rootNumber}
                          <span className="text-xs font-normal text-muted-foreground ml-1">
                            (Sum: {preview.firstName.charSum})
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-2">
                        Phonetic Acoustic Weights:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {preview.firstName.characters.map((ch, idx) => (
                          <div
                            key={idx}
                            className="flex flex-col items-center px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 min-w-[36px]"
                          >
                            <span className="text-xs font-bold text-foreground">{ch.character}</span>
                            <span className="text-[10px] font-bold text-brand-600">{ch.score}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Card>

                  {/* Surname Breakdown */}
                  <Card variant="science" className="p-5 space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                          Surname Component (40%)
                        </span>
                        <h3 className="text-lg font-bold text-foreground mt-0.5">
                          {preview.surname.inputText}
                        </h3>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-muted-foreground">Root Vibration</div>
                        <div className="text-xl font-extrabold text-indigo-600 font-outfit">
                          {preview.surname.rootNumber}
                          <span className="text-xs font-normal text-muted-foreground ml-1">
                            (Sum: {preview.surname.charSum})
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-2">
                        Phonetic Acoustic Weights:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {preview.surname.characters.map((ch, idx) => (
                          <div
                            key={idx}
                            className="flex flex-col items-center px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 min-w-[36px]"
                          >
                            <span className="text-xs font-bold text-foreground">{ch.character}</span>
                            <span className="text-[10px] font-bold text-indigo-600">{ch.score}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Card>
                </div>

                {/* ================================================================= */}
                {/* THE COMPLETE FULL NAME DESTINY DOSSIER (GATED/UNLOCKED)           */}
                {/* 1. เลขรวม (TOTAL NUMBER)                                         */}
                {/* 2. ชื่อของบทความ (ARTICLE TITLE)                                  */}
                {/* 3. ความหมายหรือบทความ (MEANINGS & DEEP ARTICLE)                   */}
                {/* ================================================================= */}
                <div className="relative rounded-3xl border border-slate-200 bg-white shadow-xl overflow-hidden">
                  {/* Decorative Header Glow */}
                  <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-brand-500 via-indigo-500 to-violet-500" />

                  <div className="p-6 sm:p-10 space-y-8">
                    {/* Top Identity Meta */}
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 pb-6 border-b border-slate-100">
                      <div>
                        <div className="flex items-center gap-2 mb-1.5">
                          <Badge variant="brand">Full Name Synergy</Badge>
                          <Badge variant="outline">
                            Harmonic Index: {preview.fullName.finalScore} / 100
                          </Badge>
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground font-outfit">
                          {preview.fullName.inputText}
                        </h2>
                      </div>

                      {/* 1. เลขรวม (TOTAL NUMBER & ROOT VIBRATION) */}
                      <div className="flex items-center gap-4 bg-slate-50 border border-slate-200/80 p-4 rounded-2xl">
                        <div className="text-center">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                            Compound Sum
                          </span>
                          <span className="text-2xl font-black text-foreground font-outfit">
                            {preview.fullName.totalCompoundSum}
                          </span>
                        </div>
                        <div className="h-8 w-px bg-slate-200" />
                        <div className="text-center">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-brand-600 block">
                            1. Total Root Number
                          </span>
                          <span className="text-4xl font-black text-brand-600 font-outfit leading-none">
                            {preview.fullName.rootNumber}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* 2. ชื่อของบทความ (ARTICLE TITLE) */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-brand-600">
                          2. Article & Archetype
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

                    {/* 3. ความหมายหรือบทความ: MEANINGS & SYMBOLS (VISIBLE TEASER) */}
                    <div className="p-4 sm:p-5 rounded-2xl bg-brand-50/60 border border-brand-200/60 space-y-1.5">
                      <span className="text-xs font-bold uppercase tracking-wider text-brand-700 block">
                        Meanings & Symbols:
                      </span>
                      <p className="text-sm font-semibold text-brand-950 leading-relaxed">
                        {preview.fullName.article.meaningsAndSymbols}
                      </p>
                    </div>

                    {/* ============================================================= */}
                    {/* GATED DEEP DOSSIER (BLURRED OVERLAY IF UNPAID / LOCKED)       */}
                    {/* ============================================================= */}
                    <div className="relative">
                      {/* Deep Article Content */}
                      <div
                        className={`space-y-6 transition-all duration-700 ${
                          !isUnlocked
                            ? "filter blur-md select-none opacity-30 pointer-events-none max-h-[380px] overflow-hidden"
                            : "filter-none opacity-100"
                        }`}
                      >
                        {/* CHARACTERISTICS OF GROUP X */}
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

                        {/* POLARITY DYNAMICS (WHEN CONNECTED TO BAD NUMBERS) */}
                        <div className="space-y-3">
                          <h4 className="text-sm font-bold uppercase tracking-wider text-amber-700 flex items-center gap-2 font-outfit">
                            <ShieldAlert className="w-4 h-4 text-amber-500" />
                            <span>Polarity Dynamics: When Connected to Unfavorable Numbers</span>
                          </h4>
                          <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-sm text-amber-950 leading-relaxed">
                            {preview.fullName.article.shadowPolarity}
                          </div>
                        </div>

                        {/* BE WARY OF / ILLNESSES & HEALTH VULNERABILITIES */}
                        <div className="space-y-3">
                          <h4 className="text-sm font-bold uppercase tracking-wider text-rose-700 flex items-center gap-2 font-outfit">
                            <HeartPulse className="w-4 h-4 text-rose-500" />
                            <span>Be Wary Of: Health & Physical Vulnerabilities</span>
                          </h4>
                          <div className="p-5 rounded-2xl bg-rose-50/70 border border-rose-200/80 text-sm text-rose-950 leading-relaxed">
                            <span className="font-bold text-rose-900 block mb-1">Illnesses:</span>
                            <span>{preview.fullName.article.illnessesFormatted}</span>
                          </div>
                        </div>
                      </div>

                      {/* =========================================================== */}
                      {/* FROSTED GLASS PAYWALL OVERLAY (REQUIRES PAYMENT / CREDIT)   */}
                      {/* =========================================================== */}
                      {!isUnlocked && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-white/60 backdrop-blur-md rounded-2xl border border-slate-200/90 shadow-lg">
                          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-brand-500/25 mb-4 animate-bounce">
                            <Lock className="w-7 h-7" />
                          </div>

                          <h3 className="text-xl sm:text-2xl font-black text-foreground font-outfit mb-2">
                            Complete Full Name Destiny Reading Locked
                          </h3>
                          <p className="text-xs sm:text-sm text-muted-foreground max-w-md mb-6 leading-relaxed">
                            Unlock the comprehensive psychological characteristics, unfavorable number polarity dynamics, and physical illness warnings for{" "}
                            <span className="font-bold text-foreground">&ldquo;{preview.fullName.inputText}&rdquo;</span>.
                          </p>

                          {credits.total > 0 ? (
                            <div className="space-y-3 w-full max-w-xs">
                              <Button
                                variant="gradient"
                                size="lg"
                                onClick={handleUnlockDossier}
                                disabled={unlocking}
                                className="w-full font-bold shadow-lg shadow-brand-500/20"
                              >
                                {unlocking ? (
                                  <span className="flex items-center gap-2">
                                    <Sparkles className="w-4 h-4 animate-spin" />
                                    <span>Unlocking Dossier...</span>
                                  </span>
                                ) : (
                                  <span className="flex items-center gap-2">
                                    <Unlock className="w-4 h-4" />
                                    <span>Unlock with 1 Credit</span>
                                  </span>
                                )}
                              </Button>
                              <p className="text-[11px] text-muted-foreground">
                                You have <span className="font-bold text-brand-600">{credits.total}</span> analysis credits available.
                              </p>
                            </div>
                          ) : (
                            <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-sm">
                              <Link href="/pricing" className="w-full">
                                <Button variant="gradient" size="lg" className="w-full font-bold">
                                  <span>Unlock Complete Report — $19</span>
                                </Button>
                              </Link>
                              <Link href="/pricing" className="w-full sm:w-auto">
                                <Button variant="outline" size="lg" className="w-full text-xs font-semibold">
                                  <span>View Packages</span>
                                </Button>
                              </Link>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Unlocked Actions Toolbar */}
                    {isUnlocked && (
                      <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                          <span>This analysis is persisted to your permanent audit history.</span>
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
                            <span>Print</span>
                          </Button>
                          {savedAnalysisId && (
                            <Link href={`/analyze/result/${savedAnalysisId}`}>
                              <Button variant="primary" size="sm" className="h-9 text-xs font-bold">
                                <span>View 11-Card Full Dossier &rarr;</span>
                              </Button>
                            </Link>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: HARMONIC SURNAME COMPARISON (TEST MULTIPLE SURNAMES)               */}
        {/* ========================================================================= */}
        {activeTab === "pairing" && (
          <div className="space-y-6">
            <Card variant="science" className="p-6 sm:p-8">
              <form onSubmit={handlePairingAnalyze} className="space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-foreground font-outfit">
                    Harmonic Surname Pairing & Ranking
                  </h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Compare candidate surnames against a given name to find the ideal compound vibrational resonance.
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Given Name *
                  </label>
                  <Input
                    type="text"
                    placeholder="e.g. Alexander"
                    value={pairingFirstName}
                    onChange={(e) => setPairingFirstName(e.target.value)}
                    className="h-11 text-sm font-medium"
                    required
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Candidate Surnames (Up to 5)
                  </label>
                  {candidateSurnames.map((cand, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <Input
                        type="text"
                        placeholder={`Surname Candidate ${idx + 1}`}
                        value={cand}
                        onChange={(e) => {
                          const updated = [...candidateSurnames];
                          updated[idx] = e.target.value;
                          setCandidateSurnames(updated);
                        }}
                        className="h-10 text-sm font-medium"
                      />
                      {candidateSurnames.length > 1 && (
                        <button
                          type="button"
                          onClick={() =>
                            setCandidateSurnames(candidateSurnames.filter((_, i) => i !== idx))
                          }
                          className="p-2 text-muted-foreground hover:text-rose-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  {candidateSurnames.length < 5 && (
                    <button
                      type="button"
                      onClick={() => setCandidateSurnames([...candidateSurnames, ""])}
                      className="text-xs font-semibold text-brand-600 hover:text-brand-700 inline-flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add another candidate surname</span>
                    </button>
                  )}
                </div>

                {error && (
                  <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-600 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  disabled={pairingLoading}
                  className="w-full font-bold"
                >
                  {pairingLoading ? (
                    <span className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 animate-spin" />
                      <span>Ranking Candidates...</span>
                    </span>
                  ) : (
                    <span>Rank Surnames by Harmonic Resonance</span>
                  )}
                </Button>
              </form>
            </Card>

            {/* Pairing Results Table */}
            {pairingResults.length > 0 && (
              <Card variant="science" className="overflow-hidden">
                <div className="p-5 border-b border-border flex items-center justify-between">
                  <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">
                    Pairing Harmony Leaderboard
                  </h3>
                  <Badge variant="brand">Ranked from Highest to Lowest</Badge>
                </div>
                <div className="divide-y divide-border">
                  {pairingResults.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-4 flex items-center justify-between hover:bg-slate-50/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                            idx === 0
                              ? "bg-brand-500 text-white"
                              : "bg-slate-100 text-muted-foreground"
                          }`}
                        >
                          #{idx + 1}
                        </span>
                        <div>
                          <div className="text-sm font-bold text-foreground">
                            {pairingFirstName} {item.surname}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            1. Total: {item.totalSum} (Root {item.rootNumber}) • 2. {item.articleTitle}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-base font-black text-brand-600 font-outfit">
                          {item.score.toFixed(1)}
                        </span>
                        <span className="text-xs text-muted-foreground block">/ 100</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
