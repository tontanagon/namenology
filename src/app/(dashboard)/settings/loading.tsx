import React from "react";
import { Skeleton } from "@/components/ui/Skeleton";

export default function SettingsLoading() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFF]">
      {/* Top Navbar Skeleton */}
      <div className="h-16 border-b border-slate-100 bg-white px-4 sm:px-8 flex items-center justify-between">
        <Skeleton className="w-36 h-8 rounded-xl" />
        <Skeleton className="w-24 h-8 rounded-lg" />
      </div>

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
        {/* Header Skeleton */}
        <div className="border-b border-indigo-100/80 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <Skeleton className="w-28 h-5 rounded-full" />
            <Skeleton className="w-56 h-8 rounded-xl" />
            <Skeleton className="w-80 h-4 rounded" />
          </div>
          <Skeleton className="w-36 h-9 rounded-xl" />
        </div>

        {/* Navigation Tabs Skeleton */}
        <div className="flex items-center gap-2 border-b border-indigo-100 pb-px">
          {[1, 2, 3, 4].map((t) => (
            <Skeleton key={t} className="w-28 h-10 rounded-t-xl" />
          ))}
        </div>

        {/* Tab Content Skeleton (Left Profile / Right Form) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Monogram Card */}
          <div className="md:col-span-1 p-6 rounded-2xl border border-indigo-100/80 bg-white space-y-6 shadow-sm">
            <div className="flex flex-col items-center space-y-3">
              <Skeleton className="w-20 h-20 rounded-2xl" />
              <Skeleton className="w-32 h-5 rounded" />
              <Skeleton className="w-40 h-3 rounded" />
              <Skeleton className="w-24 h-6 rounded-full" />
            </div>
            <div className="border-t border-slate-100 pt-4 space-y-3">
              <div className="flex justify-between">
                <Skeleton className="w-20 h-4 rounded" />
                <Skeleton className="w-24 h-4 rounded" />
              </div>
              <div className="flex justify-between">
                <Skeleton className="w-20 h-4 rounded" />
                <Skeleton className="w-16 h-4 rounded" />
              </div>
            </div>
          </div>

          {/* Right Form Card */}
          <div className="md:col-span-2 p-6 rounded-2xl border border-indigo-100/80 bg-white space-y-6 shadow-sm">
            <div className="space-y-1.5">
              <Skeleton className="w-44 h-6 rounded" />
              <Skeleton className="w-72 h-3.5 rounded" />
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Skeleton className="w-24 h-4 rounded" />
                <Skeleton className="w-full h-10 rounded-xl" />
              </div>
              <div className="space-y-2">
                <Skeleton className="w-24 h-4 rounded" />
                <Skeleton className="w-full h-10 rounded-xl" />
              </div>
              <div className="pt-2 flex justify-end">
                <Skeleton className="w-28 h-10 rounded-xl" />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
