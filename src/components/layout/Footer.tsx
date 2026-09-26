import React from "react";
import Link from "next/link";
import { Shield, Lock } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-border bg-[#F7F9FC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand Column */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2">
              {/* Inline orbital logo mark */}
              <svg viewBox="0 0 28 28" fill="none" className="w-7 h-7">
                <circle cx="14" cy="14" r="12" stroke="url(#ft-grad)" strokeWidth="1" opacity="0.3" />
                <circle cx="14" cy="14" r="8" stroke="url(#ft-grad)" strokeWidth="1.2" opacity="0.5" />
                <circle cx="14" cy="14" r="4.5" fill="url(#ft-grad)" opacity="0.9" />
                <circle cx="14" cy="14" r="1.5" fill="white" opacity="0.5" />
                <defs>
                  <linearGradient id="ft-grad" x1="0" y1="0" x2="28" y2="28">
                    <stop offset="0%" stopColor="#0B5CFF" />
                    <stop offset="100%" stopColor="#7C3AED" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="flex items-baseline">
                <span className="font-bold tracking-tight text-brand-500">NAME</span>
                <span className="font-bold tracking-tight gradient-text-brand">NOLOGY</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-[240px]">
              The Science of Name. The Power of Destiny. Advanced mathematical harmonics and phonetic intelligence for leaders and individuals.
            </p>
            <p className="text-[10px] text-muted-foreground/60 uppercase tracking-widest font-medium">
              Global Name Science Platform
            </p>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-4">
              Analysis Services
            </h4>
            <ul className="space-y-2.5 text-xs text-muted-foreground">
              <li className="hover:text-brand-500 cursor-pointer transition-colors">
                <Link href="/analyze">First Name Analysis</Link>
              </li>
              <li className="hover:text-brand-500 cursor-pointer transition-colors">
                <Link href="/analyze">Surname Analysis</Link>
              </li>
              <li className="hover:text-brand-500 cursor-pointer transition-colors">
                <Link href="/analyze">Full Name Synergy</Link>
              </li>
              <li className="hover:text-brand-500 cursor-pointer transition-colors">
                <Link href="/services">Bespoke Naming Architecture</Link>
              </li>
            </ul>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-4">
              Platform
            </h4>
            <ul className="space-y-2.5 text-xs text-muted-foreground">
              <li>
                <Link href="/pricing" className="hover:text-brand-500 transition-colors">Pricing & Packages</Link>
              </li>
              <li>
                <Link href="/signin" className="hover:text-brand-500 transition-colors">Client Portal</Link>
              </li>
              <li>
                <span className="inline-flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-brand-500" />
                  Enterprise Grade Encryption
                </span>
              </li>
            </ul>
          </div>

          {/* Privacy */}
          <div>
            <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-4">
              Data Privacy & Security
            </h4>
            <div className="p-4 rounded-xl bg-white border border-border text-xs text-muted-foreground space-y-2 shadow-sm">
              <div className="flex items-center gap-1.5 text-foreground font-medium">
                <Lock className="w-3.5 h-3.5 text-brand-500" />
                Confidential Processing
              </div>
              <p className="leading-relaxed">
                All names and phonetic data are computed through secure stateless memory and never shared with third parties.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between text-xs text-muted-foreground gap-4">
          <p>&copy; {new Date().getFullYear()} NAMENOLOGY. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-foreground cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-foreground cursor-pointer transition-colors">Terms of Service</span>
            <span className="hover:text-foreground cursor-pointer transition-colors">Security Center</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
