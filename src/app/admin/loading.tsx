import React from "react";
import { Skeleton } from "@/components/ui/Skeleton";
import { ShieldAlert } from "lucide-react";

export default function AdminLoading() {
  return (
    <div className="min-h-screen flex bg-slate-900 text-slate-100">
      {/* Sidebar Skeleton (Desktop) */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-slate-800 bg-slate-950 p-6 space-y-6 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-purple-600/20 flex items-center justify-center text-purple-400">
            <ShieldAlert className="w-4 h-4 animate-spin" />
          </div>
          <Skeleton className="w-28 h-6 rounded bg-slate-800" />
        </div>

        <div className="space-y-2 pt-4">
          {[1, 2, 3, 4, 5, 6, 7].map((s) => (
            <Skeleton key={s} className="w-full h-10 rounded-xl bg-slate-800/60" />
          ))}
        </div>
      </aside>

      {/* Main Admin Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Admin Header Skeleton */}
        <header className="h-16 border-b border-slate-800 bg-slate-950/70 px-6 flex items-center justify-between">
          <Skeleton className="w-48 h-6 rounded bg-slate-800" />
          <div className="flex items-center gap-3">
            <Skeleton className="w-24 h-8 rounded-lg bg-slate-800" />
            <Skeleton className="w-8 h-8 rounded-full bg-slate-800" />
          </div>
        </header>

        {/* Admin Body Skeleton */}
        <main className="flex-1 p-6 sm:p-8 space-y-8 overflow-y-auto">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div className="space-y-2">
              <Skeleton className="w-56 h-8 rounded-xl bg-slate-800" />
              <Skeleton className="w-72 h-4 rounded bg-slate-800/80" />
            </div>
            <Skeleton className="w-32 h-10 rounded-xl bg-slate-800" />
          </div>

          {/* 4 Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[1, 2, 3, 4].map((m) => (
              <div
                key={m}
                className="p-5 rounded-2xl border border-slate-800 bg-slate-950/80 space-y-3"
              >
                <div className="flex justify-between items-center">
                  <Skeleton className="w-24 h-4 rounded bg-slate-800" />
                  <Skeleton className="w-7 h-7 rounded-lg bg-slate-800" />
                </div>
                <Skeleton className="w-20 h-8 rounded bg-slate-800" />
                <Skeleton className="w-36 h-3 rounded bg-slate-800/60" />
              </div>
            ))}
          </div>

          {/* Table Container Skeleton */}
          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-950/80 space-y-4">
            <div className="flex justify-between items-center pb-2">
              <Skeleton className="w-40 h-6 rounded bg-slate-800" />
              <Skeleton className="w-48 h-9 rounded-lg bg-slate-800" />
            </div>

            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((row) => (
                <div
                  key={row}
                  className="p-4 rounded-xl border border-slate-800/60 bg-slate-900/40 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <Skeleton className="w-8 h-8 rounded-lg bg-slate-800" />
                    <div className="space-y-1">
                      <Skeleton className="w-32 h-4 rounded bg-slate-800" />
                      <Skeleton className="w-24 h-3 rounded bg-slate-800/60" />
                    </div>
                  </div>
                  <Skeleton className="w-20 h-6 rounded-full bg-slate-800" />
                  <Skeleton className="w-24 h-8 rounded-lg bg-slate-800" />
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
