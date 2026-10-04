import React from "react";
import { Skeleton } from "@/components/ui/Skeleton";
import { Sparkles } from "lucide-react";

export default function AuthLoading() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFF]">
      {/* Top Navbar Skeleton */}
      <div className="h-16 border-b border-slate-100 bg-white px-4 sm:px-8 flex items-center justify-between">
        <Skeleton className="w-36 h-8 rounded-xl" />
        <Skeleton className="w-20 h-8 rounded-lg" />
      </div>

      <main className="flex-1 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-md p-8 sm:p-10 rounded-3xl border border-indigo-100/80 bg-white space-y-6 shadow-xl shadow-blue-500/5">
          <div className="flex flex-col items-center space-y-2 text-center">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Sparkles className="w-6 h-6 animate-spin" />
            </div>
            <Skeleton className="w-48 h-7 rounded-lg" />
            <Skeleton className="w-64 h-4 rounded" />
          </div>

          <div className="space-y-4 pt-2">
            <div className="space-y-2">
              <Skeleton className="w-20 h-4 rounded" />
              <Skeleton className="w-full h-11 rounded-xl" />
            </div>
            <div className="space-y-2">
              <Skeleton className="w-20 h-4 rounded" />
              <Skeleton className="w-full h-11 rounded-xl" />
            </div>
            <Skeleton className="w-full h-12 rounded-xl bg-gradient-to-r from-blue-100 to-indigo-100" />
          </div>

          <div className="pt-2 border-t border-slate-100 flex justify-center">
            <Skeleton className="w-40 h-4 rounded" />
          </div>
        </div>
      </main>
    </div>
  );
}
