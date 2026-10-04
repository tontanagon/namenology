"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import {
  CheckCircle2,
  AlertCircle,
  Mail,
  Sparkles,
  ArrowRight,
  RefreshCw,
  ShieldCheck,
  Send,
} from "lucide-react";

type VerificationStatus = "verifying" | "success" | "error" | "prompt";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const emailParam = searchParams.get("email") || "";

  const [status, setStatus] = useState<VerificationStatus>(token ? "verifying" : "prompt");
  const [message, setMessage] = useState<string>("");
  const [resendEmail, setResendEmail] = useState<string>(emailParam);
  const [resending, setResending] = useState(false);
  const [resendResult, setResendResult] = useState<{ success: boolean; text: string } | null>(null);
  const hasRequestedRef = useRef(false);

  // Auto-verify if token is present in URL
  useEffect(() => {
    if (!token || hasRequestedRef.current) return;
    hasRequestedRef.current = true;

    let isMounted = true;

    async function verify() {
      try {
        setStatus("verifying");
        const res = await fetch(`/api/auth/verify-email?token=${encodeURIComponent(token!)}`);
        const data = await res.json();

        if (!isMounted) return;

        if (res.ok && data.success) {
          setStatus("success");
          setMessage(data.message || "Your email address has been successfully verified!");
          if (data.email) {
            setResendEmail(data.email);
          }
        } else {
          setStatus("error");
          setMessage(data.message || "The verification link is invalid or has expired.");
        }
      } catch {
        if (!isMounted) return;
        setStatus("error");
        setMessage("A network error occurred. Please check your internet connection.");
      }
    }

    verify();

    return () => {
      isMounted = false;
    };
  }, [token]);

  // Handle Resend Request
  const handleResend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resendEmail || !resendEmail.includes("@")) {
      setResendResult({ success: false, text: "Please enter a valid email address." });
      return;
    }

    setResending(true);
    setResendResult(null);

    try {
      const res = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: resendEmail }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setResendResult({
          success: true,
          text: data.message || "Verification link sent! Please check your inbox.",
        });
      } else {
        setResendResult({
          success: false,
          text: data.message || "Failed to send verification email. Please try again.",
        });
      }
    } catch {
      setResendResult({
        success: false,
        text: "Network error. Please try again later.",
      });
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* 1. Verifying State */}
      {status === "verifying" && (
        <Card variant="elevated" className="p-8 sm:p-10 text-center space-y-6 bg-white border-indigo-100/80 shadow-xl shadow-blue-500/5">
          <div className="relative mx-auto w-20 h-20 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-blue-100/60 animate-ping opacity-75" />
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/30">
              <Sparkles className="w-8 h-8 animate-spin" />
            </div>
          </div>

          <div className="space-y-2">
            <Badge variant="brand">Cosmic Security</Badge>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight font-outfit">
              Verifying Your Email...
            </h1>
            <p className="text-sm text-slate-500 max-w-sm mx-auto">
              Connecting to NAMENOLOGY security protocols and confirming your verification token.
            </p>
          </div>
        </Card>
      )}

      {/* 2. Success State */}
      {status === "success" && (
        <Card variant="elevated" className="p-8 sm:p-10 text-center space-y-6 bg-white border-emerald-100 shadow-xl shadow-emerald-500/5 animate-in fade-in zoom-in-95 duration-300">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-emerald-500 to-teal-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/25">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-700">
              <ShieldCheck className="w-4 h-4" />
              <span>Identity Confirmed</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-outfit">
              Email Verified Successfully!
            </h1>
            <p className="text-sm text-slate-600 max-w-sm mx-auto leading-relaxed">
              {message}
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/dashboard" className="w-full sm:w-auto">
              <Button size="lg" className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/20">
                <span>Go to Dashboard</span>
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </Link>
            <Link href="/analyze" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full border-slate-200">
                <span>Analyze Name</span>
              </Button>
            </Link>
          </div>
        </Card>
      )}

      {/* 3. Error / Expired State */}
      {status === "error" && (
        <Card variant="elevated" className="p-8 sm:p-10 text-center space-y-6 bg-white border-rose-100 shadow-xl shadow-rose-500/5 animate-in fade-in zoom-in-95 duration-300">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-rose-500 to-amber-500 text-white flex items-center justify-center shadow-lg shadow-rose-500/25">
            <AlertCircle className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-xs font-bold text-rose-700">
              <span>Verification Issue</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight font-outfit">
              Verification Failed
            </h1>
            <p className="text-sm text-slate-600 max-w-sm mx-auto leading-relaxed">
              {message}
            </p>
          </div>

          {/* Resend Form */}
          <div className="border-t border-slate-100 pt-6 text-left space-y-4">
            <div className="text-center">
              <h3 className="text-sm font-bold text-slate-800">
                Need a new verification link?
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Enter your email address and we will dispatch a fresh link to your inbox.
              </p>
            </div>

            {resendResult && (
              <div
                className={`p-3 rounded-xl border text-xs flex items-center gap-2 ${
                  resendResult.success
                    ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                    : "bg-rose-50 border-rose-200 text-rose-800"
                }`}
              >
                {resendResult.success ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                )}
                <span>{resendResult.text}</span>
              </div>
            )}

            <form onSubmit={handleResend} className="space-y-3">
              <Input
                label="Email Address"
                type="email"
                value={resendEmail}
                onChange={(e) => setResendEmail(e.target.value)}
                placeholder="name@example.com"
                required
              />
              <Button
                type="submit"
                disabled={resending}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold"
              >
                {resending ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    <span>Sending New Link...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    <span>Resend Verification Email</span>
                  </>
                )}
              </Button>
            </form>
          </div>

          <div className="pt-2 text-center">
            <Link href="/signin" className="text-xs text-blue-600 hover:underline font-semibold">
              Return to Sign In
            </Link>
          </div>
        </Card>
      )}

      {/* 4. Prompt / Info State (No token in URL, e.g. after signup) */}
      {status === "prompt" && (
        <Card variant="elevated" className="p-8 sm:p-10 text-center space-y-6 bg-white border-indigo-100/80 shadow-xl shadow-blue-500/5">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/25">
            <Mail className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <Badge variant="brand">Check Your Inbox</Badge>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-outfit">
              Verify Your Email Address
            </h1>
            <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
              We have sent a verification link to your email. Please click the link in the message to activate your account and access all scientific features.
            </p>
          </div>

          <div className="bg-blue-50/70 border border-blue-200/60 rounded-2xl p-4 text-xs text-slate-600 text-left space-y-1.5">
            <div className="font-bold text-blue-900 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span>Security Information</span>
            </div>
            <p>• The verification link expires in <strong>24 hours</strong>.</p>
            <p>• Be sure to check your <strong>Spam</strong> or <strong>Promotions</strong> folder if not in your primary inbox.</p>
          </div>

          {/* Resend Section */}
          <div className="border-t border-slate-100 pt-6 text-left space-y-4">
            <div className="text-center">
              <h3 className="text-sm font-bold text-slate-800">
                Didn&apos;t receive the email?
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Enter your email address to request a new verification message.
              </p>
            </div>

            {resendResult && (
              <div
                className={`p-3 rounded-xl border text-xs flex items-center gap-2 ${
                  resendResult.success
                    ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                    : "bg-rose-50 border-rose-200 text-rose-800"
                }`}
              >
                {resendResult.success ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                )}
                <span>{resendResult.text}</span>
              </div>
            )}

            <form onSubmit={handleResend} className="space-y-3">
              <Input
                label="Email Address"
                type="email"
                value={resendEmail}
                onChange={(e) => setResendEmail(e.target.value)}
                placeholder="name@example.com"
                required
              />
              <Button
                type="submit"
                disabled={resending}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold"
              >
                {resending ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    <span>Sending Verification Email...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    <span>Send Verification Email</span>
                  </>
                )}
              </Button>
            </form>
          </div>

          <div className="pt-2 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100">
            <Link href="/dashboard" className="text-blue-600 hover:underline font-semibold">
              Go to Dashboard
            </Link>
            <Link href="/signin" className="text-slate-500 hover:text-slate-800">
              Sign In with another account
            </Link>
          </div>
        </Card>
      )}
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFF]">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <Suspense
          fallback={
            <div className="flex flex-col items-center gap-3 text-slate-500">
              <Sparkles className="w-8 h-8 animate-spin text-blue-600" />
              <p className="text-sm font-semibold">Loading verification status...</p>
            </div>
          }
        >
          <VerifyEmailContent />
        </Suspense>
      </main>
    </div>
  );
}
