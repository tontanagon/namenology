import React from "react";
import { Skeleton } from "@/components/ui/Skeleton";
import { Sparkles } from "lucide-react";

export default function AnalyzeLoading() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFF]">
      {/* Header skeleton */}
      <div className="h-16 border-b border-slate-100 bg-white px-4 sm:px-8 flex items-center justify-between">
        <Skeleton className="w-36 h-8 rounded-xl" />
        <Skeleton className="w-24 h-8 rounded-lg" />
      </div>

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-10 w-full space-y-8">
        <div className="text-center space-y-3 max-w-xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/80">
            <Sparkles className="w-3.5 h-3.5 text-blue-600 animate-spin" />
            <span className="text-xs font-bold text-blue-700">Loading Analysis Engine</span>
          </div>
          <Skeleton className="w-72 h-9 mx-auto rounded-xl" />
          <Skeleton className="w-96 h-4 mx-auto rounded" />
        </div>

        {/* Input Card Skeleton */}
        <div className="p-6 sm:p-8 rounded-3xl border border-indigo-100/80 bg-white space-y-6 shadow-xl shadow-blue-500/5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Skeleton className="w-28 h-4 rounded" />
              <Skeleton className="w-full h-11 rounded-xl" />
            </div>
            <div className="space-y-2">
              <Skeleton className="w-28 h-4 rounded" />
              <Skeleton className="w-full h-11 rounded-xl" />
            </div>
          </div>

          <div className="space-y-2">
            <Skeleton className="w-32 h-4 rounded" />
            <Skeleton className="w-full h-11 rounded-xl" />
          </div>

          <div className="pt-4">
            <Skeleton className="w-full h-12 rounded-xl bg-gradient-to-r from-blue-100 to-indigo-100" />
          </div>
        </div>

        {/* Harmonic Breakdown Preview Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[1, 2, 3].map((k) => (
            <div key={k} className="p-5 rounded-2xl border border-slate-100 bg-white space-y-3">
              <Skeleton className="w-20 h-4 rounded" />
              <Skeleton className="w-16 h-8 rounded-lg" />
              <Skeleton className="w-full h-2 rounded-full" />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
