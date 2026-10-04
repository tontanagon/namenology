import React from "react";
import { Skeleton } from "@/components/ui/Skeleton";
import { Sparkles } from "lucide-react";

export default function DashboardLoading() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Top Bar Skeleton */}
      <div className="h-16 border-b border-slate-100 bg-white px-4 sm:px-8 flex items-center justify-between">
        <Skeleton className="w-36 h-8 rounded-xl" />
        <div className="flex items-center gap-3">
          <Skeleton className="w-24 h-8 rounded-lg" />
          <Skeleton className="w-8 h-8 rounded-full" />
        </div>
      </div>

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-10">
        {/* Header Skeleton */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Skeleton className="w-24 h-5 rounded-full" />
              <Skeleton className="w-40 h-4 rounded" />
            </div>
            <Skeleton className="w-64 h-9 rounded-xl" />
            <Skeleton className="w-96 h-4 rounded" />
          </div>
          <div className="flex items-center gap-3">
            <Skeleton className="w-36 h-10 rounded-xl" />
            <Skeleton className="w-32 h-10 rounded-xl" />
          </div>
        </div>

        {/* 3 Entitlement Credit Balance Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="p-6 rounded-2xl border border-indigo-100/70 bg-[#F8FAFF] space-y-4 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <Skeleton className="w-28 h-4 rounded" />
                <Skeleton className="w-8 h-8 rounded-xl" />
              </div>
              <div className="space-y-2">
                <Skeleton className="w-20 h-10 rounded-lg" />
                <Skeleton className="w-44 h-3 rounded" />
              </div>
              <Skeleton className="w-full h-8 rounded-xl" />
            </div>
          ))}
        </div>

        {/* Recent Analyses Skeleton */}
        <div className="p-6 sm:p-8 rounded-2xl border border-indigo-100/70 bg-white space-y-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                <Sparkles className="w-4 h-4 animate-spin" />
              </div>
              <Skeleton className="w-48 h-6 rounded-lg" />
            </div>
            <Skeleton className="w-24 h-8 rounded-lg" />
          </div>

          <div className="space-y-3">
            {[1, 2, 3, 4].map((j) => (
              <div
                key={j}
                className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <Skeleton className="w-10 h-10 rounded-xl" />
                  <div className="space-y-1.5">
                    <Skeleton className="w-32 h-4 rounded" />
                    <Skeleton className="w-24 h-3 rounded" />
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Skeleton className="w-16 h-6 rounded-full" />
                  <Skeleton className="w-20 h-8 rounded-lg" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
