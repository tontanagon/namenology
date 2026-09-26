"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";

function SigninForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to sign in. Please verify your credentials.");
        setLoading(false);
        return;
      }

      router.push(callbackUrl);
      router.refresh();
    } catch {
      setError("Network connection error. Please try again.");
      setLoading(false);
    }
  };

  return (
    <Card variant="elevated" className="p-8">
      {error && (
        <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 flex items-center gap-2 text-xs text-red-600">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email Address"
          type="email"
          placeholder="name@domain.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />

        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
        />

        <div className="flex items-center justify-between text-xs">
          <label className="flex items-center gap-2 text-muted-foreground cursor-pointer">
            <input
              type="checkbox"
              defaultChecked
              className="rounded border-border text-brand-500 focus:ring-brand-500"
            />
            Remember this session
          </label>
          <Link href="/forgot-password" className="text-brand-500 hover:underline font-medium">
            Forgot password?
          </Link>
        </div>

        <Button
          type="submit"
          variant="gradient"
          className="w-full justify-center"
          isLoading={loading}
        >
          <Lock className="w-4 h-4" />
          Sign In
        </Button>
      </form>

      <div className="mt-6 pt-6 border-t border-border text-center text-xs text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="text-brand-500 font-semibold hover:underline">
          Create free account
        </Link>
      </div>
    </Card>
  );
}

export default function SigninPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 py-12 relative overflow-hidden selection:bg-brand-500 selection:text-white">
      {/* Subtle background decoration */}
      <div className="absolute inset-0 bg-gradient-hero pointer-events-none" />
      <div className="absolute inset-0 scientific-grid pointer-events-none opacity-30" />

      <div className="w-full max-w-md space-y-6 relative z-10">
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2 group mb-6">
            <svg viewBox="0 0 36 36" fill="none" className="w-9 h-9">
              <circle cx="18" cy="18" r="16" stroke="url(#si-grad)" strokeWidth="1.2" opacity="0.3" />
              <circle cx="18" cy="18" r="11" stroke="url(#si-grad)" strokeWidth="1.5" opacity="0.5" />
              <circle cx="18" cy="18" r="6" fill="url(#si-grad)" opacity="0.9" />
              <circle cx="18" cy="18" r="2" fill="white" opacity="0.6" />
              <defs>
                <linearGradient id="si-grad" x1="0" y1="0" x2="36" y2="36">
                  <stop offset="0%" stopColor="#0B5CFF" />
                  <stop offset="50%" stopColor="#4F46E5" />
                  <stop offset="100%" stopColor="#7C3AED" />
                </linearGradient>
              </defs>
            </svg>
            <div className="flex items-baseline">
              <span className="font-bold text-xl text-brand-500">NAME</span>
              <span className="font-bold text-xl gradient-text-brand">NOLOGY</span>
            </div>
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-foreground font-outfit">Welcome Back</h1>
          <p className="text-xs text-muted-foreground mt-1">
            Sign in to access your analysis dossiers, credit balances, and reports
          </p>
        </div>

        <Suspense fallback={<Card variant="elevated" className="p-8 h-64 animate-pulse" />}>
          <SigninForm />
        </Suspense>
      </div>
    </div>
  );
}
