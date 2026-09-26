"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import {
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  Clock,
  FileCheck,
  Award,
  AlertCircle,
  FileText,
  Download,
} from "lucide-react";

interface ServiceOrder {
  id: string;
  status:
    | "PENDING_PAYMENT"
    | "PAID"
    | "FORM_SUBMITTED"
    | "IN_REVIEW"
    | "IN_PROGRESS"
    | "COMPLETED"
    | "CANCELLED"
    | "REFUNDED";
  formData?: any;
  notes?: string;
  resultDelivery?: string;
  createdAt: string;
  product: {
    code: string;
    name: string;
    price: number;
    currency: string;
  };
}

export default function ServiceOrderDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const [order, setOrder] = useState<ServiceOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Form Fields
  const [targetName, setTargetName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [birthTime, setBirthTime] = useState("");
  const [lifeGoals, setLifeGoals] = useState("");
  const [specialPreferences, setSpecialPreferences] = useState("");

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/service-orders/${id}`);
      if (!res.ok) throw new Error("Service order not found.");
      const data = await res.json();
      setOrder(data.serviceOrder);

      // Pre-fill if already submitted
      if (data.serviceOrder.formData) {
        setTargetName(data.serviceOrder.formData.targetName || "");
        setBirthDate(data.serviceOrder.formData.birthDate || "");
        setBirthTime(data.serviceOrder.formData.birthTime || "");
        setLifeGoals(data.serviceOrder.formData.lifeGoals || "");
        setSpecialPreferences(data.serviceOrder.formData.specialPreferences || "");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load order.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchOrder();
  }, [id]);

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const res = await fetch(`/api/service-orders/${id}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          formData: {
            targetName,
            birthDate,
            birthTime,
            lifeGoals,
            specialPreferences,
          },
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to submit form.");

      setSuccessMsg("Your scientific name intake form has been submitted successfully!");
      setOrder(data.serviceOrder);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Submission error.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-background text-foreground">
        <Navbar />
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="flex flex-col items-center gap-2 text-muted-foreground text-xs">
            <Sparkles className="w-6 h-6 animate-spin text-brand-500" />
            <span>Loading service order...</span>
          </div>
        </main>
      </div>
    );
  }

  if (error && !order) {
    return (
      <div className="min-h-screen flex flex-col bg-background text-foreground">
        <Navbar />
        <main className="flex-1 max-w-xl mx-auto px-4 py-16 text-center">
          <Card glass className="p-8">
            <h2 className="text-lg font-bold text-foreground mb-2">Order Not Found</h2>
            <p className="text-xs text-muted-foreground mb-6">{error}</p>
            <Link href="/dashboard">
              <Button variant="primary" size="sm">
                Return to Dashboard
              </Button>
            </Link>
          </Card>
        </main>
      </div>
    );
  }

  // Visual status step indices
  const steps = [
    { key: "PAID", label: "Payment Confirmed" },
    { key: "FORM_SUBMITTED", label: "Intake Submitted" },
    { key: "IN_REVIEW", label: "Specialist Review" },
    { key: "IN_PROGRESS", label: "Calculations in Progress" },
    { key: "COMPLETED", label: "Delivered" },
  ];

  const currentStepIndex = steps.findIndex((s) => s.key === order?.status);
  const isPendingForm = order?.status === "PAID";

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground selection:bg-brand-500 selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
        {/* Navigation */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>

        {/* Header Card */}
        <Card glass glow="gold" className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-4 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="gold">Bespoke Service</Badge>
                <span className="text-xs font-mono text-muted-foreground">Order ID: {order?.id.slice(0, 8)}</span>
              </div>
              <h1 className="text-2xl font-extrabold text-foreground">{order?.product.name}</h1>
            </div>
            <div className="text-right">
              <Badge variant={order?.status === "COMPLETED" ? "success" : "brand"}>
                {order?.status.replace("_", " ")}
              </Badge>
            </div>
          </div>

          {/* Status Timeline */}
          <div className="relative flex items-center justify-between mt-6 px-2">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 w-full bg-border -z-0" />
            {steps.map((step, idx) => {
              const isPast = idx <= currentStepIndex;
              const isCurrent = idx === currentStepIndex;

              return (
                <div key={step.key} className="relative z-10 flex flex-col items-center text-center">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      isPast
                        ? "bg-brand-600 text-white shadow-sm ring-4 ring-brand-500/20"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {isPast ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                  </div>
                  <span
                    className={`text-[10px] mt-2 hidden sm:block max-w-[80px] leading-tight font-medium ${
                      isCurrent ? "text-brand-600 font-bold" : "text-muted-foreground"
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Completed Service Delivery Section */}
        {order?.status === "COMPLETED" && order.resultDelivery && (
          <Card glass glow="cyan" className="p-6 space-y-4">
            <div className="flex items-center gap-2 text-brand-600">
              <Award className="w-5 h-5" />
              <h2 className="text-base font-bold text-foreground">Specialist Name Science Delivery Ready</h2>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Your customized scientific name report has been prepared and finalized by our lead name scientist.
            </p>
            <div className="p-4 rounded-xl bg-muted/50 border border-border text-xs leading-relaxed font-mono whitespace-pre-wrap">
              {order.resultDelivery}
            </div>
          </Card>
        )}

        {/* Intake Form Section */}
        {isPendingForm ? (
          <Card glass glow="cyan" className="p-6 space-y-6">
            <div>
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                <FileText className="w-5 h-5 text-brand-600" />
                <span>Scientific Name Intake Form</span>
              </h2>
              <p className="text-xs text-muted-foreground mt-1">
                Please provide birth and personal details so our specialist can calculate optimal phonetic and harmonic configurations.
              </p>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-xs text-rose-600 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmitForm} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Target Name / Subject Name <span className="text-rose-500">*</span>
                  </label>
                  <Input
                    type="text"
                    placeholder="e.g. Current Name or Child's Expected Name"
                    value={targetName}
                    onChange={(e) => setTargetName(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Date of Birth <span className="text-rose-500">*</span>
                  </label>
                  <Input
                    type="date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Exact Time of Birth (Optional)
                  </label>
                  <Input
                    type="time"
                    value={birthTime}
                    onChange={(e) => setBirthTime(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Primary Life Focus / Goals
                  </label>
                  <Input
                    type="text"
                    placeholder="e.g. Career Success, Health, Wealth, Prosperity"
                    value={lifeGoals}
                    onChange={(e) => setLifeGoals(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Specific Letter or Cultural Preferences (Optional)
                </label>
                <textarea
                  rows={3}
                  className="w-full px-3 py-2 rounded-xl border border-border bg-background text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-brand-500"
                  placeholder="e.g. Avoid certain letters, preferred starting consonant, or family phonetic traditions"
                  value={specialPreferences}
                  onChange={(e) => setSpecialPreferences(e.target.value)}
                />
              </div>

              <div className="flex items-center justify-end pt-2">
                <Button type="submit" variant="primary" disabled={submitting} className="min-w-[150px]">
                  {submitting ? (
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 animate-spin" />
                      Submitting...
                    </span>
                  ) : (
                    "Submit Details to Master"
                  )}
                </Button>
              </div>
            </form>
          </Card>
        ) : (
          /* Already Submitted Information View */
          <Card glass className="p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-600" />
                <h2 className="text-sm font-bold text-foreground">Submitted Intake Details</h2>
              </div>
              <Badge variant="brand">Under Specialist Review</Badge>
            </div>

            {successMsg && (
              <div className="p-3 rounded-lg bg-teal-500/10 border border-teal-500/20 text-xs text-teal-700">
                {successMsg}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3 rounded-xl bg-muted/40 border border-border">
                <span className="text-muted-foreground block text-[11px]">Subject Name</span>
                <span className="font-bold text-foreground mt-0.5 block">{targetName || "Not provided"}</span>
              </div>
              <div className="p-3 rounded-xl bg-muted/40 border border-border">
                <span className="text-muted-foreground block text-[11px]">Date of Birth</span>
                <span className="font-bold text-foreground mt-0.5 block">{birthDate || "Not provided"}</span>
              </div>
              <div className="p-3 rounded-xl bg-muted/40 border border-border">
                <span className="text-muted-foreground block text-[11px]">Time of Birth</span>
                <span className="font-bold text-foreground mt-0.5 block">{birthTime || "Not provided"}</span>
              </div>
              <div className="p-3 rounded-xl bg-muted/40 border border-border">
                <span className="text-muted-foreground block text-[11px]">Primary Life Goals</span>
                <span className="font-bold text-foreground mt-0.5 block">{lifeGoals || "General harmony"}</span>
              </div>
            </div>

            {specialPreferences && (
              <div className="p-3 rounded-xl bg-muted/40 border border-border text-xs">
                <span className="text-muted-foreground block text-[11px]">Special Preferences:</span>
                <p className="mt-1 text-foreground leading-relaxed">{specialPreferences}</p>
              </div>
            )}
          </Card>
        )}
      </main>
    </div>
  );
}
