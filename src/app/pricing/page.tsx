"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import {
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Clock,
  Layers,
  Zap,
  Star,
} from "lucide-react";

interface ProductEntitlement {
  creditType: string;
  quantity: number;
}

interface ProductItem {
  id: string;
  code: string;
  name: string;
  description: string | null;
  productType: "ANALYSIS_PACKAGE" | "SERVICE" | "SUBSCRIPTION";
  price: number;
  currency: string;
  sortOrder: number;
  entitlements: ProductEntitlement[];
}

export default function PricingPage() {
  const router = useRouter();
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loadingProductId, setLoadingProductId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.products) {
          setProducts(data.products);
        }
      })
      .catch(() => {});
  }, []);

  const handleCheckout = async (productId: string, code: string) => {
    if (code === "FREE_TIER") {
      router.push("/signup");
      return;
    }

    setError(null);
    setLoadingProductId(productId);

    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });

      const data = await res.json();

      if (res.status === 401) {
        router.push("/signin?callbackUrl=/pricing");
        return;
      }

      if (!res.ok) {
        setError(data.error || "Failed to initiate checkout session.");
        setLoadingProductId(null);
        return;
      }

      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      }
    } catch {
      setError("Network connection error. Please try again.");
      setLoadingProductId(null);
    }
  };

  const analysisPackages = products.filter(
    (p) => p.productType === "ANALYSIS_PACKAGE"
  );
  const professionalServices = products.filter(
    (p) => p.productType === "SERVICE"
  );

  return (
    <div className="min-h-screen flex flex-col bg-white text-foreground selection:bg-brand-500 selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full space-y-24">
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <Badge variant="brand" className="mb-2">
            <Zap className="w-3 h-3" />
            TRANSPARENT VALUE
          </Badge>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground font-outfit">
            Select the Package That
            <span className="gradient-text-brand"> Fits Your Journey</span>
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            Deterministic calculation entitlements with complete transparency. No recurring hidden fees.
          </p>

          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 inline-flex items-center gap-2 text-xs text-red-600 mt-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Section 1: Complete Analysis Packages */}
        <div>
          <div className="flex items-center justify-between mb-8 pb-3 border-b border-border">
            <div>
              <h2 className="text-xl font-bold text-foreground font-outfit">Name Analysis Packages</h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Each complete set includes: 1 Given Name + 1 Ancestral Surname + 1 Composite Harmonic Dossier
              </p>
            </div>
            <Badge variant="indigo" className="hidden sm:inline-flex">
              One-Time Purchase
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {analysisPackages.map((pkg) => {
              const isPopular = pkg.code === "PKG_2_SETS";
              const isFree = pkg.code === "FREE_TIER";
              const firstNames =
                pkg.entitlements.find((e) => e.creditType === "FIRST_NAME")?.quantity ?? 0;
              const surnames =
                pkg.entitlements.find((e) => e.creditType === "SURNAME")?.quantity ?? 0;
              const combined =
                pkg.entitlements.find((e) => e.creditType === "COMBINED")?.quantity ?? 0;

              return (
                <Card
                  key={pkg.id}
                  variant="science"
                  glow={isPopular ? "blue" : isFree ? "none" : "indigo"}
                  className={`p-7 flex flex-col justify-between relative ${
                    isPopular ? "border-brand-300 shadow-glow-blue" : ""
                  }`}
                >
                  {isPopular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge variant="brand" className="shadow-sm">
                        <Star className="w-3 h-3" />
                        Most Popular
                      </Badge>
                    </div>
                  )}

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-lg text-foreground font-outfit">{pkg.name}</h3>
                      {isFree && <Badge variant="outline">Complimentary</Badge>}
                    </div>

                    <div className="flex items-baseline gap-1 my-4">
                      <span className="text-4xl font-extrabold text-foreground font-outfit">
                        ${pkg.price}
                      </span>
                      <span className="text-xs text-muted-foreground font-semibold">
                        / {pkg.currency}
                      </span>
                    </div>

                    <p className="text-xs text-muted-foreground leading-relaxed mb-6">
                      {pkg.description}
                    </p>

                    {/* Explicit Entitlements Breakdown */}
                    <div className="space-y-2.5 pt-4 border-t border-border/60 text-xs">
                      <span className="font-semibold text-muted-foreground block text-[11px] uppercase tracking-wider">
                        Included Entitlements:
                      </span>
                      <div className="flex items-center gap-2 text-foreground">
                        <CheckCircle2 className="w-4 h-4 text-brand-500 shrink-0" />
                        <span>{firstNames} Given Name Evaluations</span>
                      </div>
                      <div className="flex items-center gap-2 text-foreground">
                        <CheckCircle2 className="w-4 h-4 text-brand-500 shrink-0" />
                        <span>{surnames} Ancestral Surname Evaluations</span>
                      </div>
                      <div className="flex items-center gap-2 text-foreground">
                        <CheckCircle2
                          className={`w-4 h-4 shrink-0 ${
                            combined > 0 ? "text-brand-500" : "text-muted-foreground"
                          }`}
                        />
                        <span className={combined === 0 ? "text-muted-foreground" : "font-semibold text-brand-500"}>
                          {combined > 0
                            ? `${combined} Complete Sets (Name + Surname)`
                            : "0 Combined Sets (Requires Paid Package)"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <CheckCircle2 className="w-4 h-4 text-brand-500 shrink-0" />
                        <span>Immutable Cryptographic Dossier Snapshot</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-8">
                    <Button
                      variant={isPopular ? "gradient" : isFree ? "outline" : "secondary"}
                      className="w-full justify-center"
                      isLoading={loadingProductId === pkg.id}
                      onClick={() => handleCheckout(pkg.id, pkg.code)}
                    >
                      {isFree ? (
                        <>
                          Claim Free Tier
                          <ArrowRight className="w-4 h-4" />
                        </>
                      ) : (
                        <>
                          Get Package
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Section 2: Professional Services */}
        <div>
          <div className="flex items-center justify-between mb-8 pb-3 border-b border-border">
            <div>
              <h2 className="text-xl font-bold text-foreground font-outfit">Bespoke Name Architecture Services</h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Bespoke baby naming, strategic personal rebranding, and generational surname engineering conducted by Lead Scientists
              </p>
            </div>
            <Badge variant="violet" className="hidden sm:inline-flex">
              Specialist Consultation
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {professionalServices.map((srv) => (
              <Card
                key={srv.id}
                variant="science"
                glow="violet"
                className="p-7 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-base text-foreground font-outfit">{srv.name}</h3>
                    <Badge variant="violet">Consultation</Badge>
                  </div>

                  <div className="flex items-baseline gap-1 my-3">
                    <span className="text-3xl font-extrabold text-foreground font-outfit">
                      ${srv.price}
                    </span>
                    <span className="text-xs text-muted-foreground font-semibold">
                      / consultation
                    </span>
                  </div>

                  <p className="text-xs text-muted-foreground leading-relaxed mb-6">
                    {srv.description}
                  </p>

                  <div className="space-y-2 pt-4 border-t border-border/60 text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-brand-500 shrink-0" />
                      <span>Turnaround within 3–5 business days</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Layers className="w-3.5 h-3.5 text-brand-500 shrink-0" />
                      <span>Complete personal analysis dossier & certificate</span>
                    </div>
                  </div>
                </div>

                <div className="pt-8">
                  <Button
                    variant="outline"
                    className="w-full justify-center"
                    isLoading={loadingProductId === srv.id}
                    onClick={() => handleCheckout(srv.id, srv.code)}
                  >
                    Book Consultation
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Security & Trust Banner */}
        <div className="p-6 rounded-2xl border border-border bg-[#F7F9FC] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-500 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-foreground">Stripe 256-Bit Financial Encryption</h4>
              <p className="text-xs text-muted-foreground mt-0.5">
                All transactions are processed through PCI-DSS Level 1 compliant Stripe. We never store payment card credentials.
              </p>
            </div>
          </div>
          <Link href="/signin">
            <Button variant="ghost" size="sm">
              Client Portal Sign In &rarr;
            </Button>
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
