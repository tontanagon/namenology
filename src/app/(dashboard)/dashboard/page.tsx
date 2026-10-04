import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentSession } from "@/lib/auth/session";
import { entitlementService } from "@/services/entitlement.service";
import { analysisService } from "@/services/analysis/analysis.service";
import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/layout/Navbar";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  Compass,
  Sparkles,
  ArrowRight,
  History,
  Plus,
  Lock,
  Layers,
  Award,
  Clock,
  CheckCircle2,
  Settings,
  AlertCircle,
} from "lucide-react";
import { CreditType } from "@prisma/client";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const { user } = await getCurrentSession();

  if (!user) {
    redirect("/signin?callbackUrl=/dashboard");
  }

  const [entitlements, historyData, serviceOrders, dbUser] = await Promise.all([
    entitlementService.getUserEntitlements(user.id),
    analysisService.getUserHistory(user.id, { limit: 5 }),
    prisma.serviceOrder.findMany({
      where: { userId: user.id },
      include: {
        product: {
          select: {
            code: true,
            name: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 3,
    }),
    prisma.user.findUnique({
      where: { id: user.id },
      select: { emailVerified: true },
    }),
  ]);

  const { balances } = entitlements;

  return (
    <div className="min-h-screen flex flex-col bg-white text-foreground">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
        {/* Email Verification Banner */}
        {!dbUser?.emailVerified && (
          <div className="bg-amber-50/90 border border-amber-200/80 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-900 shadow-sm animate-in fade-in duration-300">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center shrink-0 text-amber-600">
                <AlertCircle className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-slate-900">Your email address is pending verification</p>
                <p className="text-slate-600 mt-0.5">Please confirm your email to ensure uninterrupted access to your calculations and security notices.</p>
              </div>
            </div>
            <Link href={`/verify-email?email=${encodeURIComponent(user.email)}`} className="shrink-0">
              <Button size="sm" variant="outline" className="border-amber-300 bg-white hover:bg-amber-50 text-amber-800 text-xs font-semibold h-8">
                <span>Verify Email</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </Link>
          </div>
        )}

        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="brand">Active Account</Badge>
              <span className="text-xs text-muted-foreground">{user.email}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Welcome, {user.name}
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Manage your entitlements, recent analyses, and auspicious name calculations
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/settings">
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-1.5" />
                <span>Account Settings</span>
              </Button>
            </Link>
            <Link href="/analysis-history">
              <Button variant="outline" size="sm">
                <History className="w-4 h-4 mr-1.5" />
                <span>Audit History</span>
              </Button>
            </Link>
            <Link href="/analyze">
              <Button variant="primary" size="sm">
                <Plus className="w-4 h-4 mr-1.5" />
                <span>New Analysis</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Unified Credit Entitlements (Zero separation between first name and surname) */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
              Analysis Credit Balance
            </h2>
            <Link href="/pricing" className="text-xs text-brand-500 font-semibold hover:underline">
              Purchase Analysis Packages &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {/* Unified Analysis Credit Card */}
            <Card variant="science" glow="blue" className="p-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-muted-foreground uppercase">
                  Available Credits
                </span>
                <Badge
                  variant={
                    balances[CreditType.COMBINED] +
                      Math.min(
                        balances[CreditType.FIRST_NAME],
                        balances[CreditType.SURNAME]
                      ) >
                    0
                      ? "brand"
                      : "outline"
                  }
                >
                  {balances[CreditType.COMBINED] +
                    Math.min(
                      balances[CreditType.FIRST_NAME],
                      balances[CreditType.SURNAME]
                    ) >
                  0
                    ? "Active Pool"
                    : "Zero Balance"}
                </Badge>
              </div>
              <div className="text-4xl font-black text-brand-600 font-outfit">
                {balances[CreditType.COMBINED] +
                  Math.min(
                    balances[CreditType.FIRST_NAME],
                    balances[CreditType.SURNAME]
                  )}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Full Name (Official First Name + Official Surname) analyses remaining
              </p>
            </Card>

            {/* Quick Engine Launcher */}
            <Card variant="science" className="p-6 flex flex-col justify-between">
              <div>
                <span className="text-xs font-semibold text-muted-foreground uppercase block mb-1">
                  Name Science Engine
                </span>
                <div className="text-base font-bold text-foreground">
                  Simultaneous Official First Name & Official Surname Analysis
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Calculate phonetic weights, compound sum, and unlock destiny reading.
                </p>
              </div>
              <Link href="/analyze" className="mt-4">
                <Button variant="primary" size="sm" className="w-full font-bold">
                  <span>Start New Analysis &rarr;</span>
                </Button>
              </Link>
            </Card>

            {/* Package Top Up */}
            <Card variant="science" glow="indigo" className="p-6 flex flex-col justify-between">
              <div>
                <span className="text-xs font-semibold text-indigo-600 uppercase block mb-1">
                  Add Analysis Credits
                </span>
                <div className="text-base font-bold text-foreground">
                  Packages from $19
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Includes full name numerology group readings, characteristics & health warnings.
                </p>
              </div>
              <Link href="/pricing" className="mt-4">
                <Button variant="outline" size="sm" className="w-full font-semibold">
                  <span>Explore Packages</span>
                </Button>
              </Link>
            </Card>
          </div>
        </div>

        {/* Active Professional Service Orders (if any) */}
        {serviceOrders.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-500" />
                <span>Bespoke Scientific Consultations</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {serviceOrders.map((srv) => (
                <Card key={srv.id} variant="default" className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-foreground">{srv.product.name}</span>
                    <Badge variant={srv.status === "COMPLETED" ? "success" : "brand"}>
                      {srv.status.replace("_", " ")}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Order ID: {srv.id.slice(0, 8)}
                  </p>
                  <Link href={`/services/orders/${srv.id}`}>
                    <Button variant="outline" size="sm" className="w-full text-xs h-8">
                      <span>View Service Progress</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </Button>
                  </Link>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Recent Analysis History Table (REQ-B15) */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
              Recent Analysis History
            </h2>
            {historyData.total > 0 && (
              <Link href="/analysis-history" className="text-xs text-brand-500 font-semibold hover:underline">
                View All ({historyData.total}) &rarr;
              </Link>
            )}
          </div>

          {historyData.items.length === 0 ? (
            <Card variant="default" className="p-8 text-center">
              <div className="w-12 h-12 mx-auto rounded-full bg-brand-50 text-brand-500 flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-foreground">No analyses performed yet</h3>
              <p className="text-xs text-muted-foreground max-w-md mx-auto mt-2 mb-6">
                Enter your Official First Name and Official Surname to begin calculating individual character vibrations and numeric harmonics.
              </p>
              <Link href="/analyze">
                <Button variant="primary" size="sm">
                  <Compass className="w-4 h-4 mr-1.5" />
                  Perform First Analysis
                </Button>
              </Link>
            </Card>
          ) : (
            <div className="rounded-2xl border border-border overflow-hidden bg-white shadow-card">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-muted/50 border-b border-border text-muted-foreground">
                    <tr>
                      <th className="py-3 px-4 font-semibold">Subject Name</th>
                      <th className="py-3 px-4 font-semibold">Type</th>
                      <th className="py-3 px-4 font-semibold">Harmonic Score</th>
                      <th className="py-3 px-4 font-semibold">Formula</th>
                      <th className="py-3 px-4 font-semibold">Date</th>
                      <th className="py-3 px-4 text-right font-semibold">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {historyData.items.map((item) => (
                      <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                        <td className="py-3.5 px-4 font-semibold text-foreground">
                          {item.inputText}
                        </td>
                        <td className="py-3.5 px-4">
                          <Badge
                            variant={
                              item.analysisType === "COMBINED"
                                ? "gold"
                                : item.analysisType === "FIRST_NAME"
                                ? "brand"
                                : "outline"
                            }
                          >
                            {item.analysisType.replace("_", " ")}
                          </Badge>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-bold text-brand-500 text-sm">
                            {Number(item.finalScore).toFixed(1)}
                          </span>
                          <span className="text-[10px] text-muted-foreground ml-1">/100</span>
                        </td>
                        <td className="py-3.5 px-4 text-muted-foreground">
                          v{item.calculationVersion}
                        </td>
                        <td className="py-3.5 px-4 text-muted-foreground">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <Link
                            href={`/analyze/result/${item.id}`}
                            className="text-brand-500 font-semibold hover:underline inline-flex items-center"
                          >
                            <span>Report</span>
                            <ArrowRight className="w-3 h-3 ml-1" />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
