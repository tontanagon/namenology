"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!token) {
      setError("No reset token provided. Please request a new password reset link.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to reset password.");
        setLoading(false);
        return;
      }

      setSuccess(true);
      setLoading(false);

      // Auto redirect to signin after 3 seconds
      setTimeout(() => {
        router.push("/signin");
      }, 3000);
    } catch {
      setError("A network error occurred. Please try again.");
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-slate-900">Missing Reset Token</h3>
        <p className="text-sm text-slate-500 max-w-sm mx-auto">
          The link you followed appears to be invalid or incomplete. Please request a new password reset link.
        </p>
        <div className="pt-2">
          <Link href="/forgot-password">
            <Button className="w-full">Request New Link</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-slate-900">Password Reset Complete</h3>
        <p className="text-sm text-slate-500">
          Your password has been successfully updated. You can now sign in with your new password.
        </p>
        <div className="pt-2">
          <Link href="/signin">
            <Button className="w-full">Sign In Now</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div>
        <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
          New Password
        </label>
        <Input
          type="password"
          required
          placeholder="At least 8 characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          minLength={8}
          autoComplete="new-password"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
          Confirm New Password
        </label>
        <Input
          type="password"
          required
          placeholder="Re-enter your new password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          minLength={8}
          autoComplete="new-password"
        />
      </div>

      <Button type="submit" disabled={loading} className="w-full" size="lg">
        {loading ? "Updating Password..." : "Set New Password"}
      </Button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 py-12 relative overflow-hidden selection:bg-brand-500 selection:text-white">
      <div className="absolute inset-0 bg-gradient-hero pointer-events-none" />
      <div className="absolute inset-0 scientific-grid pointer-events-none opacity-30" />

      <div className="w-full max-w-md space-y-6 relative z-10">
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2 group mb-6">
            <svg viewBox="0 0 36 36" fill="none" className="w-9 h-9">
              <circle cx="18" cy="18" r="16" stroke="url(#rp-grad)" strokeWidth="1.2" opacity="0.3" />
              <circle cx="18" cy="18" r="11" stroke="url(#rp-grad)" strokeWidth="1.5" opacity="0.5" />
              <circle cx="18" cy="18" r="6" fill="url(#rp-grad)" opacity="0.9" />
              <circle cx="18" cy="18" r="2" fill="white" opacity="0.6" />
              <defs>
                <linearGradient id="rp-grad" x1="0" y1="0" x2="36" y2="36">
                  <stop offset="0%" stopColor="#0B5CFF" />
                  <stop offset="50%" stopColor="#4F46E5" />
                  <stop offset="100%" stopColor="#7C3AED" />
                </linearGradient>
              </defs>
            </svg>
            <span className="font-extrabold text-xl tracking-tight text-slate-900 group-hover:text-brand-600 transition-colors">
              NAMENOLOGY
            </span>
          </Link>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Set New Password
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Choose a strong password with at least 8 characters
          </p>
        </div>

        <Card className="p-6 md:p-8 backdrop-blur-md bg-white/95 border-slate-200/80 shadow-card">
          <Suspense fallback={<div className="text-center py-4 text-sm text-slate-400">Loading form...</div>}>
            <ResetPasswordForm />
          </Suspense>

          <div className="mt-6 pt-6 border-t border-slate-100 text-center">
            <Link
              href="/signin"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-brand-600 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Sign In
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
