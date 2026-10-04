import React from "react";
import { Skeleton } from "@/components/ui/Skeleton";
import { Sparkles } from "lucide-react";

export default function ServicesLoading() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFF]">
      {/* Top Navbar Skeleton */}
      <div className="h-16 border-b border-slate-100 bg-white px-4 sm:px-8 flex items-center justify-between">
        <Skeleton className="w-36 h-8 rounded-xl" />
        <Skeleton className="w-24 h-8 rounded-lg" />
      </div>

      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full space-y-10">
        {/* Hero Skeleton */}
        <div className="text-center space-y-3 max-w-xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/80">
            <Sparkles className="w-3.5 h-3.5 text-blue-600 animate-spin" />
            <span className="text-xs font-bold text-blue-700">Premium Consultation Services</span>
          </div>
          <Skeleton className="w-80 h-9 mx-auto rounded-xl" />
          <Skeleton className="w-96 h-4 mx-auto rounded" />
        </div>

        {/* 2-Column Form / Pricing Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Details (2 cols) */}
          <div className="lg:col-span-2 p-8 rounded-3xl border border-indigo-100/80 bg-white space-y-6 shadow-sm">
            <Skeleton className="w-48 h-6 rounded-lg" />
            <div className="space-y-4">
              <Skeleton className="w-full h-11 rounded-xl" />
              <Skeleton className="w-full h-11 rounded-xl" />
              <Skeleton className="w-full h-24 rounded-xl" />
            </div>
            <Skeleton className="w-44 h-11 rounded-xl" />
          </div>

          {/* Sidebar / Checkout Card (1 col) */}
          <div className="p-6 rounded-3xl border border-indigo-100/80 bg-white space-y-6 shadow-sm h-fit">
            <div className="space-y-2">
              <Skeleton className="w-28 h-4 rounded" />
              <Skeleton className="w-36 h-8 rounded-lg" />
            </div>
            <div className="space-y-2 border-t border-slate-100 pt-4">
              <Skeleton className="w-full h-4 rounded" />
              <Skeleton className="w-full h-4 rounded" />
              <Skeleton className="w-3/4 h-4 rounded" />
            </div>
            <Skeleton className="w-full h-12 rounded-xl bg-gradient-to-r from-blue-100 to-indigo-100" />
          </div>
        </div>
      </main>
    </div>
  );
}
