"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  User,
  Menu,
  X,
  LogOut,
  ShieldAlert,
  ArrowRight,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface NavbarProps {
  variant?: "default" | "cosmic";
}

/* ── NAMENOLOGY Logo (Inline SVG) ── */
export const NamenologyLogo: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    viewBox="0 0 36 36"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Outer orbital ring */}
    <circle cx="18" cy="18" r="16" stroke="url(#logo-grad)" strokeWidth="1.2" opacity="0.4" />
    {/* Inner orbital ring */}
    <circle cx="18" cy="18" r="11" stroke="url(#logo-grad)" strokeWidth="1.5" opacity="0.7" />
    {/* Center glow sphere */}
    <circle cx="18" cy="18" r="6" fill="url(#logo-grad)" opacity="0.9" />
    {/* Small orbital dot */}
    <circle cx="30" cy="10" r="1.5" fill="#0B5CFF" />
    {/* Light point */}
    <circle cx="18" cy="18" r="2" fill="white" opacity="0.95" />
    <defs>
      <linearGradient id="logo-grad" x1="0" y1="0" x2="36" y2="36">
        <stop offset="0%" stopColor="#0B5CFF" />
        <stop offset="50%" stopColor="#6366F1" />
        <stop offset="100%" stopColor="#7C3AED" />
      </linearGradient>
    </defs>
  </svg>
);

export const Navbar: React.FC<NavbarProps> = ({ variant = "default" }) => {
  const isCosmic = variant === "cosmic";
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated && data.user) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      })
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSignout = async () => {
    try {
      await fetch("/api/auth/signout", { method: "POST" });
      if (typeof window !== "undefined") {
        localStorage.removeItem("namenology_free_analyses_count");
        Object.keys(localStorage).forEach((key) => {
          if (key.startsWith("namenology_free_analyses")) {
            localStorage.removeItem(key);
          }
        });
      }
      setUser(null);
      router.push("/");
      router.refresh();
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/analyze", label: "Name Analysis" },
    { href: "/services/baby-naming", label: "Baby Naming" },
    { href: "/services/name-change", label: "Name Change" },
    { href: "/pricing", label: "Pricing & Plans" },
    { href: "/contact", label: "Contact Us" },
  ];

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isCosmic
          ? scrolled
            ? "bg-[#050716]/90 backdrop-blur-xl border-b border-white/10 shadow-lg shadow-black/50 text-white"
            : "bg-[#050716]/60 backdrop-blur-md border-b border-white/5 text-white"
          : scrolled
          ? "bg-white/90 backdrop-blur-xl border-b border-indigo-100/90 shadow-sm text-slate-800"
          : "bg-white/75 backdrop-blur-md border-b border-slate-100/80 text-slate-800"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <NamenologyLogo className="w-9 h-9 transition-transform duration-300 group-hover:scale-105" />
          <div className="flex items-baseline gap-0">
            <span className={`font-bold text-lg tracking-tight ${isCosmic ? "text-white" : "text-blue-600"}`}>
              NAME
            </span>
            <span className="font-bold text-lg tracking-tight gradient-text-cosmic-bright">
              NOLOGY
            </span>
          </div>
        </Link>

        {/* Desktop Navigation (Items 1 - 6) */}
        <nav className={`hidden lg:flex items-center gap-5 xl:gap-7 text-xs xl:text-sm font-medium ${isCosmic ? "text-slate-300" : "text-slate-600"}`}>
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`transition-colors duration-200 relative group py-1 ${
                  isActive
                    ? isCosmic
                      ? "text-cyan-300 font-semibold"
                      : "text-blue-600 font-semibold"
                    : isCosmic
                    ? "hover:text-cyan-300"
                    : "hover:text-blue-600"
                }`}
              >
                {link.label}
                <span
                  className={`absolute -bottom-1 left-0 h-0.5 transition-all duration-300 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 ${
                    isActive ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                />
              </Link>
            );
          })}
          {user?.role === "ADMIN" && (
            <Link
              href="/admin/dashboard"
              className="flex items-center gap-1 text-purple-600 font-semibold hover:text-purple-700 py-1"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              Admin
            </Link>
          )}
        </nav>

        {/* Action Buttons: 7. Sign Up / Sign In */}
        <div className="hidden lg:flex items-center gap-2.5">
          {loading ? (
            <div className={`w-28 h-9 animate-pulse rounded-xl ${isCosmic ? "bg-white/10" : "bg-slate-100"}`} />
          ) : user ? (
            <div className="flex items-center gap-2">
              <Link href="/dashboard">
                <Button variant="outline" size="sm" className={isCosmic ? "border-white/20 text-white" : "border-slate-200 text-slate-800"}>
                  <User className="w-4 h-4 text-blue-600 mr-1.5" />
                  {user.name}
                </Button>
              </Link>
              <Link href="/settings" title="Account Settings">
                <Button
                  variant="outline"
                  size="sm"
                  className={isCosmic ? "border-white/20 text-white hover:bg-white/10" : "border-slate-200 text-slate-700 hover:text-blue-600 hover:bg-blue-50/60"}
                >
                  <Settings className="w-4 h-4" />
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignout}
                className={isCosmic ? "text-slate-400 hover:text-rose-400" : "text-slate-500 hover:text-rose-600"}
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/signin">
                <Button
                  variant="ghost"
                  size="sm"
                  className={isCosmic ? "text-slate-200 hover:text-white" : "text-slate-700 hover:text-blue-600"}
                >
                  <User className="w-4 h-4 mr-1.5" />
                  Sign In
                </Button>
              </Link>
              <Link href="/signup">
                <Button
                  variant="gradient"
                  size="sm"
                  className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/20 hover:shadow-lg hover:shadow-indigo-500/30 border border-indigo-400/30 font-semibold"
                >
                  Sign Up
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className={`lg:hidden p-2 rounded-xl transition-colors ${isCosmic ? "text-slate-300 hover:bg-white/10" : "text-slate-600 hover:bg-slate-100"}`}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {mobileMenuOpen && (
        <div
          className={`lg:hidden border-b px-4 py-5 space-y-4 shadow-xl ${
            isCosmic
              ? "bg-[#080B22] border-white/10 text-white"
              : "bg-white border-indigo-100 text-slate-800"
          }`}
        >
          <div className="flex flex-col space-y-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-sm font-medium py-1.5 px-2 rounded-lg transition-colors ${
                    isActive
                      ? isCosmic
                        ? "bg-white/10 text-cyan-300 font-semibold"
                        : "bg-blue-50 text-blue-600 font-semibold"
                      : isCosmic
                      ? "text-slate-200 hover:text-cyan-300 hover:bg-white/5"
                      : "text-slate-700 hover:text-blue-600 hover:bg-slate-50"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            {user?.role === "ADMIN" && (
              <Link
                href="/admin/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-semibold text-purple-600 py-1.5 px-2"
              >
                Admin Console
              </Link>
            )}
          </div>
          <div className={`pt-4 border-t flex flex-col gap-2 ${isCosmic ? "border-white/10" : "border-slate-100"}`}>
            {user ? (
              <>
                <div className={`text-xs mb-1 ${isCosmic ? "text-slate-400" : "text-slate-500"}`}>
                  Signed in as <strong className={isCosmic ? "text-white" : "text-slate-800"}>{user.email}</strong>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" size="sm" className="w-full justify-center text-xs border-slate-200">
                      <User className="w-3.5 h-3.5 mr-1 text-blue-600" />
                      Dashboard
                    </Button>
                  </Link>
                  <Link href="/settings" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" size="sm" className="w-full justify-center text-xs border-slate-200">
                      <Settings className="w-3.5 h-3.5 mr-1 text-slate-600" />
                      Settings
                    </Button>
                  </Link>
                </div>
                <Button
                  variant="outline"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleSignout();
                  }}
                  className="w-full justify-center text-rose-600 border-slate-200 text-xs mt-1"
                >
                  <LogOut className="w-4 h-4 mr-1.5" />
                  Sign Out
                </Button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link href="/signin" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full justify-center border-slate-200">
                    <User className="w-4 h-4 mr-1.5" />
                    Sign In
                  </Button>
                </Link>
                <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="gradient" className="w-full justify-center bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold">
                    Sign Up
                    <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
