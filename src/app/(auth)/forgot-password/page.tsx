"use client";

import React, { useState } from "react";
import Link from "next/link";
import { KeyRound, ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Unable to process request. Please try again.");
        setLoading(false);
        return;
      }

      setSubmitted(true);
      setLoading(false);
    } catch {
      setError("Network connection error. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 py-12 relative overflow-hidden selection:bg-brand-500 selection:text-white">
      <div className="absolute inset-0 bg-gradient-hero pointer-events-none" />
      <div className="absolute inset-0 scientific-grid pointer-events-none opacity-30" />

      <div className="w-full max-w-md space-y-6 relative z-10">
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2 group mb-6">
            <svg viewBox="0 0 36 36" fill="none" className="w-9 h-9">
              <circle cx="18" cy="18" r="16" stroke="url(#fp-grad)" strokeWidth="1.2" opacity="0.3" />
              <circle cx="18" cy="18" r="11" stroke="url(#fp-grad)" strokeWidth="1.5" opacity="0.5" />
              <circle cx="18" cy="18" r="6" fill="url(#fp-grad)" opacity="0.9" />
              <circle cx="18" cy="18" r="2" fill="white" opacity="0.6" />
              <defs>
                <linearGradient id="fp-grad" x1="0" y1="0" x2="36" y2="36">
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
          <h1 className="text-2xl font-bold tracking-tight text-foreground font-outfit">
            Reset Password
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Enter your registered email address to receive password recovery instructions.
          </p>
        </div>

        <Card variant="elevated" className="p-8">
          {submitted ? (
            <div className="space-y-4 text-center py-4">
              <div className="w-12 h-12 rounded-full bg-brand-50 text-brand-500 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-semibold text-foreground font-outfit">Check Your Inbox</h2>
              <p className="text-xs text-muted-foreground leading-relaxed">
                If an account exists for <strong className="text-foreground">{email}</strong>, we have dispatched recovery instructions.
              </p>
              <div className="pt-4">
                <Link href="/signin">
                  <Button variant="outline" className="w-full justify-center">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Sign In
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 flex items-center gap-2 text-xs text-red-600">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <Input
                label="Registered Email Address"
                type="email"
                placeholder="name@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />

              <Button
                type="submit"
                variant="gradient"
                className="w-full justify-center"
                isLoading={loading}
              >
                <KeyRound className="w-4 h-4" />
                Send Reset Link
              </Button>

              <div className="pt-2 text-center">
                <Link
                  href="/signin"
                  className="inline-flex items-center text-xs text-muted-foreground hover:text-brand-500 transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5 mr-1" />
                  Back to Sign In
                </Link>
              </div>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
}
