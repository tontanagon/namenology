"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import {
  Mail,
  MessageSquare,
  Sparkles,
  Send,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Building,
  HelpCircle,
  ArrowRight,
  Orbit,
} from "lucide-react";

export default function ContactPage() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    subject: "general",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate reliable dispatch
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900">
      <Navbar />

      <main className="flex-1">
        {/* ================================================================= */}
        {/* HERO SECTION                                                      */}
        {/* ================================================================= */}
        <section className="relative py-16 sm:py-20 bg-gradient-to-b from-blue-50/50 via-indigo-50/30 to-white overflow-hidden border-b border-indigo-50/80">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-blue-200/80 bg-blue-50 text-blue-700 text-xs font-semibold mb-4 shadow-2xs">
              <Orbit className="w-3.5 h-3.5 text-blue-600" />
              <span>Deterministic Name Intelligence Support</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black font-outfit uppercase tracking-tight text-slate-900 leading-tight">
              CONTACT <span className="gradient-text-cosmic-bright">NAMENOLOGY</span>
            </h1>

            <p className="mt-4 text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Have questions about your vibrational analysis dossier, custom phonetic consultation, or enterprise naming? Our scientific team is here to assist.
            </p>
          </div>
        </section>

        {/* ================================================================= */}
        {/* CONTACT METHODS & FORM GRID                                       */}
        {/* ================================================================= */}
        <section className="py-16 sm:py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              {/* Left Column: Direct Info & Channels (5 cols) */}
              <div className="lg:col-span-5 space-y-6">
                <div>
                  <h2 className="font-outfit font-bold text-2xl text-slate-900 mb-2">
                    Get in Touch
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    We maintain deterministic, auditable service standards. Every inquiry receives personalized review from our linguistics and customer care specialists.
                  </p>
                </div>

                <div className="space-y-4">
                  {/* Card 1: Official Email */}
                  <div className="p-5 rounded-2xl border border-slate-200/80 bg-white shadow-xs hover:border-blue-300 transition-colors">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
                        <Mail className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-outfit font-bold text-sm text-slate-900">
                          Direct Support Email
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5">
                          For analysis assistance, dossier questions & orders
                        </p>
                        <a
                          href="mailto:support@namenology.com"
                          className="inline-block mt-2 text-xs font-semibold text-blue-600 hover:text-blue-700 underline"
                        >
                          support@namenology.com
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Card 2: Business Hours & SLA */}
                  <div className="p-5 rounded-2xl border border-slate-200/80 bg-white shadow-xs hover:border-indigo-300 transition-colors">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 border border-indigo-100">
                        <Clock className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-outfit font-bold text-sm text-slate-900">
                          Response SLA
                        </h3>
                        <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                          Monday – Friday: 9:00 AM – 6:00 PM (UTC+7)
                          <br />
                          Average response turnaround: <strong className="text-slate-900">&lt; 24 business hours</strong>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Card 3: Consultation Services */}
                  <div className="p-5 rounded-2xl border border-purple-100 bg-purple-50/40 shadow-xs">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0 border border-purple-200">
                        <Sparkles className="w-5 h-5" />
                      </div>
                      <div className="space-y-1">
                        <h3 className="font-outfit font-bold text-sm text-purple-950">
                          Looking for Specialized Services?
                        </h3>
                        <p className="text-xs text-purple-900/80 leading-relaxed">
                          Discover our bespoke personalized naming consultations:
                        </p>
                        <div className="flex flex-wrap gap-2 pt-2">
                          <Link
                            href="/services/baby-naming"
                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-700 bg-white border border-blue-200 px-2.5 py-1 rounded-lg hover:bg-blue-50 transition-colors"
                          >
                            Baby Naming <ArrowRight className="w-3 h-3" />
                          </Link>
                          <Link
                            href="/services/name-change"
                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-purple-700 bg-white border border-purple-200 px-2.5 py-1 rounded-lg hover:bg-purple-50 transition-colors"
                          >
                            Name Change <ArrowRight className="w-3 h-3" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Interactive Contact Form (7 cols) */}
              <div className="lg:col-span-7">
                <Card variant="elevated" className="p-6 sm:p-8 rounded-3xl border-slate-200/90 shadow-md">
                  {isSubmitted ? (
                    <div className="py-12 text-center space-y-4">
                      <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
                        <CheckCircle2 className="w-8 h-8" />
                      </div>
                      <h3 className="font-outfit font-bold text-2xl text-slate-900">
                        Message Sent Successfully
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                        Thank you for contacting NAMENOLOGY. Our research team has received your message and will respond to <strong className="text-slate-900">{formState.email}</strong> within 24 hours.
                      </p>
                      <div className="pt-4">
                        <Button
                          variant="outline"
                          onClick={() => {
                            setIsSubmitted(false);
                            setFormState({ name: "", email: "", subject: "general", message: "" });
                          }}
                        >
                          Send Another Message
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                        <MessageSquare className="w-4 h-4 text-blue-600" />
                        <span className="text-xs font-bold font-outfit uppercase tracking-wider text-slate-900">
                          Send a Direct Inquiry
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                            Your Full Name <span className="text-rose-500">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Alex Mercer"
                            value={formState.name}
                            onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                            className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-900 bg-white"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                            Email Address <span className="text-rose-500">*</span>
                          </label>
                          <input
                            type="email"
                            required
                            placeholder="name@example.com"
                            value={formState.email}
                            onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                            className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-900 bg-white"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                          Inquiry Type <span className="text-rose-500">*</span>
                        </label>
                        <select
                          value={formState.subject}
                          onChange={(e) => setFormState({ ...formState, subject: e.target.value })}
                          className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-900 bg-white"
                        >
                          <option value="general">General Inquiry & Information</option>
                          <option value="baby-naming">Scientific Baby Naming Consultation</option>
                          <option value="name-change">Personal Name Realignment Consultation</option>
                          <option value="pricing">Pricing & Subscription Questions</option>
                          <option value="corporate">Enterprise & Brand Naming Architecture</option>
                          <option value="technical">Account / Payment Support</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                          Your Message <span className="text-rose-500">*</span>
                        </label>
                        <textarea
                          required
                          rows={5}
                          placeholder="Please provide any details about your question, name analysis, or required consultation..."
                          value={formState.message}
                          onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                          className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-900 bg-white resize-none"
                        />
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                          <span>100% Confidential & Secure</span>
                        </div>

                        <Button
                          type="submit"
                          variant="gradient"
                          disabled={isSubmitting}
                          className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white min-w-[140px]"
                        >
                          {isSubmitting ? (
                            <span className="flex items-center gap-2">
                              <Sparkles className="w-4 h-4 animate-spin" />
                              Sending...
                            </span>
                          ) : (
                            <span className="flex items-center gap-1.5">
                              <Send className="w-3.5 h-3.5" />
                              Send Message
                            </span>
                          )}
                        </Button>
                      </div>
                    </form>
                  )}
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
