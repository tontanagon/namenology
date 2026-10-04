import React from "react";
import { CosmicPreloader } from "@/components/ui/CosmicPreloader";

export default function GlobalLoading() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header Skeleton */}
      <div className="h-16 border-b border-slate-100 bg-white/80 backdrop-blur-md px-4 sm:px-8 flex items-center justify-between">
        <div className="w-32 h-7 bg-slate-100 rounded-lg animate-pulse" />
        <div className="hidden md:flex items-center gap-6">
          <div className="w-16 h-4 bg-slate-100 rounded animate-pulse" />
          <div className="w-20 h-4 bg-slate-100 rounded animate-pulse" />
          <div className="w-16 h-4 bg-slate-100 rounded animate-pulse" />
          <div className="w-24 h-4 bg-slate-100 rounded animate-pulse" />
        </div>
        <div className="w-24 h-9 bg-slate-100 rounded-xl animate-pulse" />
      </div>

      {/* Main Content Cosmic Preloader */}
      <main className="flex-1 flex items-center justify-center p-6">
        <CosmicPreloader
          label="Preparing Cosmic Intelligence"
          subtitle="Calculating planetary harmonics and mathematical destiny matrices..."
          size="lg"
        />
      </main>
    </div>
  );
}
