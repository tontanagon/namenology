"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
  Award,
  ArrowRight,
  Star,
  Users,
  Clock,
  Compass,
} from "lucide-react";

interface ServiceMetadata {
  code: string;
  title: string;
  price: string;
  badge: string;
  description: string;
  deliverables: string[];
  duration: string;
  specialistTitle: string;
}

const SERVICES_CATALOG: Record<string, ServiceMetadata> = {
  "baby-naming": {
    code: "SRV_BABY_NAMING",
    title: "Scientific Baby Naming Architecture",
    price: "$150",
    badge: "Most Popular Consultation",
    description:
      "A comprehensive, scientific naming architecture service for newborns. Harmonizes birth harmonics, phonetic acoustic groups, Unicode numeric resonance, and ancestral family surname synergy.",
    deliverables: [
      "5 Custom Scientifically Validated Name Candidates tailored to exact birth data",
      "Full phonetic and vibrational acoustic score breakdown for each candidate",
      "Algorithmic verification and elimination of discordant consonant frequencies",
      "Ancestral surname harmony analysis for lifelong prosperity and cognitive clarity",
      "Official cryptographic certificate dossier signed by Lead Name Scientist",
    ],
    duration: "2–3 Business Days",
    specialistTitle: "Senior Name Scientist & Phonetic Architect",
  },
  "name-change": {
    code: "SRV_NAME_CHANGE",
    title: "Strategic Personal Name Realignment",
    price: "$190",
    badge: "Personal Transformation",
    description:
      "A transformative consultation for individuals seeking to realign their vibrational field, unlock career breakthroughs, and optimize cognitive resonance through scientific renaming.",
    deliverables: [
      "Deep vibrational audit of your current birth name, phonetics, and numeric weights",
      "5 Tailored replacement names aligned with your strategic life aspirations (Leadership, Wealth, Innovation)",
      "Optimal registration timing matrix based on astronomical and numeric cycles",
      "Comprehensive 10-page master analysis dossier with full resonance diagrams",
      "Direct follow-up consultation with Senior Resonance Analyst",
    ],
    duration: "3–4 Business Days",
    specialistTitle: "Lead Name Scientist & Resonance Analyst",
  },
  "surname-creation": {
    code: "SRV_SURNAME_CREATION",
    title: "Generational Family Surname Architecture",
    price: "$360",
    badge: "Generational Legacy",
    description:
      "Our most prestigious service. Engineering a completely new, mathematically harmonious family surname intended to establish an enduring family lineage and multigenerational prosperity.",
    deliverables: [
      "Lineage and phonetic legacy harmonization across all active family members",
      "3 Unique, fully verified new surname options with etymology and cultural elegance",
      "Formal legal registration compliance audit (Department of Provincial Administration standards)",
      "Comprehensive family generational vibrational compatibility matrix",
      "Hand-crafted calligraphy certificate and auspicious timing schedule",
    ],
    duration: "5–7 Business Days",
    specialistTitle: "Senior Linguistic Council & Name Systems Architect",
  },
};

export default function ServiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const codeParam = (params?.code as string)?.toLowerCase();

  const service = SERVICES_CATALOG[codeParam] || SERVICES_CATALOG["baby-naming"];
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleBookService = async () => {
    try {
      setLoading(true);
      setError(null);

      // 1. Fetch product ID for this service code
      const prodRes = await fetch("/api/products");
      if (!prodRes.ok) throw new Error("Could not load product catalog.");
      const data = await prodRes.json();
      const matched = data.products.find((p: any) => p.code === service.code);

      if (!matched) {
        throw new Error("Service product is currently unavailable.");
      }

      // 2. Initiate Checkout
      const checkoutRes = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: matched.id }),
      });

      const checkoutData = await checkoutRes.json();
      if (!checkoutRes.ok) {
        if (checkoutRes.status === 401) {
          router.push(`/signin?redirect=/services/${codeParam}`);
          return;
        }
        if (checkoutRes.status === 403 && checkoutData.code === "EMAIL_VERIFICATION_REQUIRED") {
          router.push("/verify-email");
          return;
        }
        throw new Error(checkoutData.error || "Failed to initialize checkout.");
      }

      // Redirect to Stripe checkout (or simulated dev dashboard)
      if (checkoutData.checkoutUrl) {
        window.location.href = checkoutData.checkoutUrl;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error initiating checkout.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground selection:bg-brand-500 selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
        <Link
          href="/pricing"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Packages & Services</span>
        </Link>

        {/* Hero Card */}
        <Card glass glow="gold" className="p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="gold">{service.badge}</Badge>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{service.duration} Delivery</span>
                </span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-foreground tracking-tight">
                {service.title}
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground mt-2 leading-relaxed max-w-xl">
                {service.description}
              </p>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-xs text-muted-foreground uppercase tracking-wider block">One-time Investment</span>
              <span className="text-3xl sm:text-4xl font-black text-foreground">{service.price}</span>
              <span className="text-xs text-muted-foreground block mt-1">Full Service Package</span>
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-xs text-rose-600">
              {error}
            </div>
          )}

          {/* Deliverables List */}
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-brand-600" />
              <span>What Is Included in This Consultation</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {service.deliverables.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-muted/40 border border-border text-xs">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                  <span className="text-foreground leading-relaxed">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Row */}
          <div className="pt-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <ShieldCheck className="w-4 h-4 text-teal-600" />
              <span>Handled by {service.specialistTitle} with 100% Confidentiality</span>
            </div>

            <Button
              variant="primary"
              size="lg"
              onClick={handleBookService}
              disabled={loading}
              className="w-full sm:w-auto min-w-[200px]"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 animate-spin" />
                  Preparing Checkout...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <span>Book Consultation ({service.price})</span>
                  <ArrowRight className="w-4 h-4" />
                </span>
              )}
            </Button>
          </div>
        </Card>
      </main>
    </div>
  );
}
