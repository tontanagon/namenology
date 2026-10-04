"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Database,
  Sliders,
  Settings,
  ShoppingBag,
  Award,
  Users,
  Shield,
  Menu,
  X,
  ExternalLink,
  LogOut,
  ChevronRight,
  ShieldCheck,
  User as UserIcon,
  Activity,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

/* ── Inline SVG NAMENOLOGY Logo ── */
const NamenologyLogo: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    viewBox="0 0 36 36"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <circle cx="18" cy="18" r="16" stroke="url(#admin-logo-grad)" strokeWidth="1.2" opacity="0.4" />
    <circle cx="18" cy="18" r="11" stroke="url(#admin-logo-grad)" strokeWidth="1.5" opacity="0.7" />
    <circle cx="18" cy="18" r="6" fill="url(#admin-logo-grad)" opacity="0.9" />
    <circle cx="30" cy="10" r="1.5" fill="#0B5CFF" />
    <circle cx="18" cy="18" r="2" fill="white" opacity="0.95" />
    <defs>
      <linearGradient id="admin-logo-grad" x1="0" y1="0" x2="36" y2="36">
        <stop offset="0%" stopColor="#0B5CFF" />
        <stop offset="50%" stopColor="#6366F1" />
        <stop offset="100%" stopColor="#7C3AED" />
      </linearGradient>
    </defs>
  </svg>
);

interface NavGroup {
  groupName: string;
  items: {
    href: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    description?: string;
  }[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    groupName: "Main",
    items: [
      {
        href: "/admin/dashboard",
        label: "Overview",
        icon: LayoutDashboard,
        description: "Metrics, KPIs & operational summary",
      },
    ],
  },
  {
    groupName: "Calculation Engine",
    items: [
      {
        href: "/admin/characters",
        label: "Characters & Phonetics",
        icon: Database,
        description: "Unicode vowel & consonant tables",
      },
      {
        href: "/admin/components",
        label: "Components & Weights",
        icon: Sliders,
        description: "Tripartite formula weights & balance",
      },
      {
        href: "/admin/settings",
        label: "System Configuration",
        icon: Settings,
        description: "Global quota, precision & policy",
      },
    ],
  },
  {
    groupName: "Commerce & Services",
    items: [
      {
        href: "/admin/products",
        label: "Products & Packages",
        icon: ShoppingBag,
        description: "Credit tiers & service offerings",
      },
      {
        href: "/admin/service-orders",
        label: "Service Orders",
        icon: Award,
        description: "Baby naming & custom consultations",
      },
    ],
  },
  {
    groupName: "Security & Access",
    items: [
      {
        href: "/admin/users",
        label: "Users & Quotas",
        icon: Users,
        description: "Accounts, ledger & credits",
      },
      {
        href: "/admin/audit-logs",
        label: "Audit Logs",
        icon: Shield,
        description: "Immutable administrative history",
      },
    ],
  },
];

interface AdminShellProps {
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
  children: React.ReactNode;
}

export const AdminShell: React.FC<AdminShellProps> = ({ user, children }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSignout = async () => {
    try {
      await fetch("/api/auth/signout", { method: "POST" });
      router.push("/");
      router.refresh();
    } catch (err) {
      console.error("Signout error:", err);
    }
  };

  // Derive current page title from active path
  const allItems = NAV_GROUPS.flatMap((g) => g.items);
  const activeItem = allItems.find((i) => pathname === i.href) || {
    label: "Admin Console",
    description: "Management Center",
  };

  const renderNavContent = () => (
    <div className="flex flex-col h-full justify-between">
      {/* Top Header & Branding */}
      <div>
        <div className="p-5 border-b border-indigo-50 flex items-center justify-between bg-white">
          <Link href="/admin/dashboard" className="flex items-center gap-2.5 group">
            <NamenologyLogo className="w-8 h-8 transition-transform group-hover:scale-105" />
            <div>
              <div className="flex items-baseline gap-0 text-base font-bold tracking-tight">
                <span className="text-blue-600">NAME</span>
                <span className="gradient-text-cosmic-bright">NOLOGY</span>
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[10px] font-bold tracking-wider uppercase text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200/80 shadow-2xs">
                  Admin Console
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              </div>
            </div>
          </Link>

          {/* Mobile close button */}
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Sections */}
        <div className="px-3 py-4 space-y-6 overflow-y-auto max-h-[calc(100vh-210px)] scrollbar-none">
          {NAV_GROUPS.map((group) => (
            <div key={group.groupName} className="space-y-1">
              <div className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                {group.groupName}
              </div>

              <div className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={`group flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                        isActive
                          ? "bg-gradient-to-r from-blue-50 via-indigo-50/60 to-purple-50/40 text-blue-700 font-bold border border-blue-200/80 shadow-xs"
                          : "text-slate-600 hover:text-blue-700 hover:bg-blue-50/50"
                      }`}
                    >
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                          isActive
                            ? "bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-xs shadow-blue-500/20"
                            : "bg-slate-100 text-slate-500 group-hover:bg-blue-100 group-hover:text-blue-600"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 truncate">
                        <span className="block truncate">{item.label}</span>
                      </div>
                      {isActive && (
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0" />
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sidebar Footer: Admin Profile & Actions */}
      <div className="p-3 border-t border-indigo-50 bg-[#F8FAFF] space-y-2">
        {/* Admin Card */}
        <div className="p-2.5 rounded-xl bg-white border border-indigo-100/80 shadow-2xs flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-slate-900 truncate">{user.name}</p>
            <p className="text-[10px] text-slate-500 truncate">{user.email}</p>
          </div>
          <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 shrink-0">
            RBAC
          </span>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-2 gap-1.5 pt-1">
          <Link
            href="/"
            className="flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold text-slate-700 hover:text-blue-700 bg-white hover:bg-blue-50/60 transition-colors border border-slate-200/90 shadow-2xs"
          >
            <ExternalLink className="w-3 h-3 text-blue-600" />
            <span>Main Site</span>
          </Link>
          <button
            onClick={handleSignout}
            className="flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold text-rose-700 hover:text-rose-800 bg-rose-50/80 hover:bg-rose-100 transition-colors border border-rose-200/80 cursor-pointer shadow-2xs"
          >
            <LogOut className="w-3 h-3" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-[#F8FAFF] text-slate-900">
      {/* =================================================================== */}
      {/* 1. DESKTOP LEFT SIDEBAR                                             */}
      {/* =================================================================== */}
      <aside className="hidden lg:block w-64 xl:w-72 bg-white border-r border-indigo-100/90 h-screen sticky top-0 shrink-0 z-30 select-none shadow-xs">
        {renderNavContent()}
      </aside>

      {/* =================================================================== */}
      {/* 2. MOBILE DRAWER SIDEBAR                                            */}
      {/* =================================================================== */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileOpen(false)}
          />

          {/* Sliding panel */}
          <div className="relative w-72 max-w-[85vw] bg-white border-r border-indigo-100 h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-200">
            {renderNavContent()}
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* 3. MAIN CONTENT AREA (RIGHT SIDE)                                   */}
      {/* =================================================================== */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen bg-[#F8FAFF] text-slate-900">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-20 h-16 bg-white/90 backdrop-blur-xl border-b border-indigo-100/90 px-4 sm:px-8 flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-3">
            {/* Mobile hamburger button */}
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Breadcrumb Navigation */}
            <div className="flex items-center gap-2 text-xs">
              <span className="font-semibold text-slate-400">
                Admin
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
              <span className="font-bold text-slate-900 font-outfit">
                {activeItem.label}
              </span>
            </div>
          </div>

          {/* Right Header Badges & Actions */}
          <div className="flex items-center gap-3">
            {/* System Status Pill */}
            <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-emerald-200 bg-emerald-50 text-emerald-700 text-xs font-semibold shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>System Live</span>
            </div>

            {/* Live Site Preview */}
            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200/90 bg-white text-slate-700 hover:text-blue-600 hover:bg-blue-50/60 text-xs font-semibold transition-colors shadow-2xs"
            >
              <ExternalLink className="w-3.5 h-3.5 text-blue-600" />
              <span className="hidden sm:inline">Live Site</span>
            </Link>

            {/* Admin User Chip */}
            <div className="hidden md:flex items-center gap-2 pl-3 border-l border-slate-200">
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-2xs">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <span className="text-xs font-bold text-slate-800 truncate max-w-[130px]">
                {user.name}
              </span>
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
