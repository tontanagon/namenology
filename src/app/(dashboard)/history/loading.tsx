import React from "react";
import { Skeleton } from "@/components/ui/Skeleton";
import { History } from "lucide-react";

export default function HistoryLoading() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFF]">
      {/* Top Navbar Skeleton */}
      <div className="h-16 border-b border-slate-100 bg-white px-4 sm:px-8 flex items-center justify-between">
        <Skeleton className="w-36 h-8 rounded-xl" />
        <Skeleton className="w-24 h-8 rounded-lg" />
      </div>

      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
        {/* Header Skeleton */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-indigo-100/80 pb-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/80">
              <History className="w-3.5 h-3.5 text-blue-600 animate-spin" />
              <span className="text-xs font-bold text-blue-700">Loading History</span>
            </div>
            <Skeleton className="w-64 h-8 rounded-xl" />
            <Skeleton className="w-96 h-4 rounded" />
          </div>
          <Skeleton className="w-36 h-10 rounded-xl" />
        </div>

        {/* Search & Filter Bar Skeleton */}
        <div className="flex items-center justify-between gap-4">
          <Skeleton className="w-72 h-10 rounded-xl" />
          <div className="flex items-center gap-2">
            <Skeleton className="w-20 h-9 rounded-lg" />
            <Skeleton className="w-20 h-9 rounded-lg" />
          </div>
        </div>

        {/* History Cards List Skeleton */}
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="p-6 rounded-2xl border border-indigo-100/80 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm"
            >
              <div className="flex items-center gap-4">
                <Skeleton className="w-14 h-14 rounded-2xl" />
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Skeleton className="w-36 h-5 rounded" />
                    <Skeleton className="w-16 h-5 rounded-full" />
                  </div>
                  <Skeleton className="w-56 h-3 rounded" />
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right space-y-1">
                  <Skeleton className="w-20 h-6 rounded" />
                  <Skeleton className="w-24 h-3 rounded" />
                </div>
                <Skeleton className="w-28 h-9 rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
