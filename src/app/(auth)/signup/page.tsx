"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShieldCheck, AlertCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";

export default function SignupPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match. Please re-enter.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters in length.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to create account. Please try again.");
        setLoading(false);
        return;
      }

      // Successful signup: redirect to dashboard with immediate free credits!
      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Network connection error. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 py-12 relative overflow-hidden selection:bg-brand-500 selection:text-white">
      {/* Subtle background decoration */}
      <div className="absolute inset-0 bg-gradient-hero pointer-events-none" />
      <div className="absolute inset-0 scientific-grid pointer-events-none opacity-30" />

      <div className="w-full max-w-md space-y-6 relative z-10">
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2 group mb-6">
            <svg viewBox="0 0 36 36" fill="none" className="w-9 h-9">
              <circle cx="18" cy="18" r="16" stroke="url(#su-grad)" strokeWidth="1.2" opacity="0.3" />
              <circle cx="18" cy="18" r="11" stroke="url(#su-grad)" strokeWidth="1.5" opacity="0.5" />
              <circle cx="18" cy="18" r="6" fill="url(#su-grad)" opacity="0.9" />
              <circle cx="18" cy="18" r="2" fill="white" opacity="0.6" />
              <defs>
                <linearGradient id="su-grad" x1="0" y1="0" x2="36" y2="36">
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
          <h1 className="text-2xl font-bold tracking-tight text-foreground font-outfit">Create Free Account</h1>
          <p className="text-xs text-muted-foreground mt-1">
            Claim 2 complimentary Given Name and 2 Surname analysis credits immediately upon registration.
          </p>
        </div>

        <Card variant="elevated" className="p-8">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 flex items-center gap-2 text-xs text-red-600">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              type="text"
              placeholder="e.g. Johnathan Sterling"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoComplete="name"
            />

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
              placeholder="Minimum 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
            />

            <Input
              label="Confirm Password"
              type="password"
              placeholder="Re-enter password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              autoComplete="new-password"
            />

            <div className="p-3 rounded-xl bg-brand-50/60 border border-brand-200/50 flex items-start gap-2 text-xs text-brand-700">
              <ShieldCheck className="w-4 h-4 text-brand-500 shrink-0 mt-0.5" />
              <span>
                Data Security Guarantee: Your personal identity and analyzed names are processed securely and never shared with third parties.
              </span>
            </div>

            <Button
              type="submit"
              variant="gradient"
              className="w-full justify-center"
              isLoading={loading}
            >
              Create Account
              <ArrowRight className="w-4 h-4" />
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-border text-center text-xs text-muted-foreground">
            Already have an account?{" "}
            <Link href="/signin" className="text-brand-500 font-semibold hover:underline">
              Sign in
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
