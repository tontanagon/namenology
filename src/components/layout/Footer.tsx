import React from "react";
import Link from "next/link";
import { Shield, Lock } from "lucide-react";

interface FooterProps {
  variant?: "default" | "cosmic";
}

export const Footer: React.FC<FooterProps> = ({ variant = "default" }) => {
  const isCosmic = variant === "cosmic";

  return (
    <footer
      className={`border-t transition-colors duration-300 ${
        isCosmic
          ? "border-white/10 bg-[#040612] text-slate-400"
          : "border-border bg-[#F7F9FC] text-muted-foreground"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand Column */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2">
              {/* Inline orbital logo mark */}
              <svg viewBox="0 0 28 28" fill="none" className="w-7 h-7">
                <circle cx="14" cy="14" r="12" stroke="url(#ft-grad)" strokeWidth="1" opacity="0.4" />
                <circle cx="14" cy="14" r="8" stroke="url(#ft-grad)" strokeWidth="1.2" opacity="0.6" />
                <circle cx="14" cy="14" r="4.5" fill="url(#ft-grad)" opacity="0.9" />
                <circle cx="14" cy="14" r="1.5" fill="white" opacity="0.8" />
                <defs>
                  <linearGradient id="ft-grad" x1="0" y1="0" x2="28" y2="28">
                    <stop offset="0%" stopColor="#38BDF8" />
                    <stop offset="50%" stopColor="#818CF8" />
                    <stop offset="100%" stopColor="#C084FC" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="flex items-baseline">
                <span className={`font-bold tracking-tight ${isCosmic ? "text-white" : "text-brand-500"}`}>
                  NAME
                </span>
                <span className={`font-bold tracking-tight ${isCosmic ? "gradient-text-cosmic-bright" : "gradient-text-brand"}`}>
                  NOLOGY
                </span>
              </div>
            </div>
            <p className={`text-xs leading-relaxed max-w-[240px] ${isCosmic ? "text-slate-300" : "text-muted-foreground"}`}>
              The Science of Name. The Power of Destiny. Advanced mathematical harmonics and phonetic intelligence for leaders and individuals worldwide.
            </p>
            <p className={`text-[10px] uppercase tracking-widest font-medium ${isCosmic ? "text-cyan-400/80" : "text-muted-foreground/60"}`}>
              Global Solar Name Science Platform
            </p>
          </div>

          {/* Services */}
          <div>
            <h4 className={`text-xs font-semibold uppercase tracking-wider mb-4 ${isCosmic ? "text-white" : "text-foreground"}`}>
              Analysis Services
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li className={`cursor-pointer transition-colors ${isCosmic ? "hover:text-cyan-300" : "hover:text-brand-500"}`}>
                <Link href="/analyze">Official First Name Analysis</Link>
              </li>
              <li className={`cursor-pointer transition-colors ${isCosmic ? "hover:text-cyan-300" : "hover:text-brand-500"}`}>
                <Link href="/analyze">Official Surname Analysis</Link>
              </li>
              <li className={`cursor-pointer transition-colors ${isCosmic ? "hover:text-cyan-300" : "hover:text-brand-500"}`}>
                <Link href="/analyze">Full Name Synergy</Link>
              </li>
              <li className={`cursor-pointer transition-colors ${isCosmic ? "hover:text-cyan-300" : "hover:text-brand-500"}`}>
                <Link href="/services">Bespoke Naming Architecture</Link>
              </li>
            </ul>
          </div>

          {/* Platform */}
          <div>
            <h4 className={`text-xs font-semibold uppercase tracking-wider mb-4 ${isCosmic ? "text-white" : "text-foreground"}`}>
              Platform
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/pricing" className={`transition-colors ${isCosmic ? "hover:text-cyan-300" : "hover:text-brand-500"}`}>
                  Pricing & Packages
                </Link>
              </li>
              <li>
                <Link href="/signin" className={`transition-colors ${isCosmic ? "hover:text-cyan-300" : "hover:text-brand-500"}`}>
                  Client Portal
                </Link>
              </li>
              <li>
                <span className="inline-flex items-center gap-1.5">
                  <Shield className={`w-3.5 h-3.5 ${isCosmic ? "text-cyan-400" : "text-brand-500"}`} />
                  Enterprise Grade Encryption
                </span>
              </li>
            </ul>
          </div>

          {/* Privacy */}
          <div>
            <h4 className={`text-xs font-semibold uppercase tracking-wider mb-4 ${isCosmic ? "text-white" : "text-foreground"}`}>
              Data Privacy & Security
            </h4>
            <div
              className={`p-4 rounded-xl border text-xs space-y-2 shadow-sm ${
                isCosmic
                  ? "bg-[#0A0D26]/80 border-white/10 text-slate-300"
                  : "bg-white border-border text-muted-foreground"
              }`}
            >
              <div className={`flex items-center gap-1.5 font-medium ${isCosmic ? "text-white" : "text-foreground"}`}>
                <Lock className={`w-3.5 h-3.5 ${isCosmic ? "text-cyan-400" : "text-brand-500"}`} />
                Confidential Processing
              </div>
              <p className="leading-relaxed">
                All names and phonetic data are computed through secure stateless memory and never shared with third parties.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className={`pt-8 border-t flex flex-col sm:flex-row items-center justify-between text-xs gap-4 ${
            isCosmic ? "border-white/10 text-slate-400" : "border-border text-muted-foreground"
          }`}
        >
          <p>&copy; {new Date().getFullYear()} NAMENOLOGY. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className={`cursor-pointer transition-colors ${isCosmic ? "hover:text-white" : "hover:text-foreground"}`}>
              Privacy Policy
            </span>
            <span className={`cursor-pointer transition-colors ${isCosmic ? "hover:text-white" : "hover:text-foreground"}`}>
              Terms of Service
            </span>
            <span className={`cursor-pointer transition-colors ${isCosmic ? "hover:text-white" : "hover:text-foreground"}`}>
              Security Center
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
