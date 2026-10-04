"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  User,
  Layers,
  ShieldCheck,
  Compass,
} from "lucide-react";

export const NameAnalyzePath: React.FC = () => {
  const router = useRouter();
  const [firstName, setFirstName] = useState("Alexander");
  const [surname, setSurname] = useState("Sterling");
  const [error, setError] = useState<string | null>(null);

  const presets = [
    { first: "Alexander", last: "Sterling" },
    { first: "Elena", last: "Vance" },
    { first: "Aria", last: "Nova" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedFirst = firstName.trim();
    const trimmedLast = surname.trim();

    if (!trimmedFirst || !trimmedLast) {
      setError("Please enter both Official First Name and Official Surname.");
      return;
    }

    setError(null);
    router.push(
      `/analyze?firstName=${encodeURIComponent(trimmedFirst)}&surname=${encodeURIComponent(trimmedLast)}`
    );
  };

  return (
    <div className="relative w-full max-w-5xl mx-auto">
      {/* Background ambient bright cosmic glow */}
      <div className="absolute -inset-2 bg-gradient-to-r from-blue-500/15 via-indigo-500/15 to-purple-500/20 rounded-3xl blur-3xl opacity-70 -z-10" />

      {/* Main Analysis Console Card - Bright Ethereal White Glass */}
      <div className="relative rounded-2xl sm:rounded-3xl border border-indigo-100/90 bg-white/95 backdrop-blur-2xl shadow-2xl shadow-indigo-500/10 overflow-hidden transition-all duration-300">
        {/* Top vibrant cosmic gradient stripe */}
        <div className="h-1.5 w-full bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600" />

        {/* Engine status bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-indigo-50/80 px-4 sm:px-6 py-3 bg-[#F8FAFF] text-xs">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
              <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
            </div>
            <span className="font-mono text-slate-600 text-xs hidden sm:inline font-medium">
              DISCOVER WHAT YOUR NAME REVEALS
            </span>

          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-medium text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200/70">
              Unicode NFC
            </span>
            <span className="text-[10px] font-mono font-medium text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded border border-purple-200/70">
              40% / 20% / 40% Formula
            </span>
          </div>
        </div>

        {/* Interactive Input Form */}
        <div className="p-6 sm:p-8 border-b border-indigo-50 bg-gradient-to-b from-white to-[#FAFCFF]">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end">
              {/* Official First Name Input */}
              <div className="sm:col-span-5 space-y-1.5">
                <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-blue-600" />
                    Official First Name
                  </span>
                  <span className="text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-200/80 px-2 py-0.5 rounded-full">
                    40% Impact
                  </span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="e.g. Alexander"
                    className="w-full px-4 py-3 text-sm font-medium rounded-xl border border-slate-200 bg-slate-50/70 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-xs"
                    required
                  />
                </div>
              </div>

              {/* Official Surname Input */}
              <div className="sm:col-span-4 space-y-1.5">
                <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-purple-600" />
                    Official Surname
                  </span>
                  <span className="text-[10px] font-bold text-purple-700 bg-purple-50 border border-purple-200/80 px-2 py-0.5 rounded-full">
                    20% Impact
                  </span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={surname}
                    onChange={(e) => setSurname(e.target.value)}
                    placeholder="e.g. Sterling"
                    className="w-full px-4 py-3 text-sm font-medium rounded-xl border border-slate-200 bg-slate-50/70 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all shadow-xs"
                    required
                  />
                </div>
              </div>

              {/* Analyze Button */}
              <div className="sm:col-span-3">
                <Button
                  type="submit"
                  variant="gradient"
                  size="md"
                  className="w-full h-12 text-sm font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/35 transition-all duration-300"
                >
                  <Sparkles className="w-4 h-4 mr-1.5 text-cyan-200 animate-pulse" />
                  Analyze My Name
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </div>
            </div>

            {/* Quick Presets / Suggestions */}
            <div className="flex flex-wrap items-center gap-2 pt-2 text-xs text-slate-500">
              {/* <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">Try sample:</span> */}
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
              <span className="text-[11px] uppercase tracking-wider text-slate-800 font-semibold">Enter your information to explore your Personality, Life Influences & Relationships, and Well-Being 2  free name analyses included.</span>
              {/* {presets.map((preset) => (
                <button
                  type="button"
                  key={preset.first + preset.last}
                  onClick={() => {
                    setFirstName(preset.first);
                    setSurname(preset.last);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-indigo-50/60 hover:bg-indigo-100/70 border border-indigo-100 text-slate-700 hover:text-indigo-900 transition-all text-xs font-medium"
                >
                  {preset.first} {preset.last}
                </button>
              ))} */}
            </div>

            {/* Error Message */}
            {error && (
              <p className="text-xs text-rose-500 font-medium pl-1">{error}</p>
            )}
          </form>
        </div>

        {/* 40% / 20% / 40% Tripartite Architecture */}
        <div className="p-6 sm:p-8 bg-[#FAFBFE]">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-4 flex items-center justify-between">
            <span className="flex items-center gap-2 text-slate-800">
              <Compass className="w-3.5 h-3.5 text-blue-600" />
              Deterministic Tripartite Architecture
            </span>
            <span className="text-[11px] text-purple-700 font-medium bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200/60">
              Empirical Harmonic Synthesis
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Component 1: Official First Name */}
            <div className="p-4 rounded-xl bg-white border border-slate-200/80 hover:border-blue-300 transition-all space-y-2 group shadow-2xs hover:shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  Official First Name
                </span>
                <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200/60">
                  40% Life Impact
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Governs conscious personality, creative initiative, personal ambition, and executive character expression.
              </p>
            </div>

            {/* Component 2: Official Surname */}
            <div className="p-4 rounded-xl bg-white border border-slate-200/80 hover:border-indigo-300 transition-all space-y-2 group shadow-2xs hover:shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                  Official Surname
                </span>
                <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200/60">
                  20% Life Impact
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Governs ancestral lineage resonance, structural heritage, social gravity, and generational stability.
              </p>
            </div>

            {/* Component 3: Full Name Synergy */}
            <div className="p-4 rounded-xl bg-white border border-slate-200/80 hover:border-purple-300 transition-all space-y-2 group shadow-2xs hover:shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 group-hover:text-purple-600 transition-colors">
                  Full Name Synergy
                </span>
                <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200/60">
                  40% Life Impact
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Composite vibrational synthesis of Official First Name and Official Surname working in unified harmonic synergy.
              </p>
            </div>
          </div>

          {/* Bottom Trust Line */}
          <div className="mt-5 pt-4 border-t border-slate-200/70 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
            {/* <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
              <span>2 Complimentary Analyses Included · No Credit Card Required</span>
            </div> */}
            <div className="flex items-center gap-1.5 text-purple-700 font-semibold text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
              <span>100% Deterministic & Auditable</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
