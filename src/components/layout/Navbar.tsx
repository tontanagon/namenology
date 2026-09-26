"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  Menu,
  X,
  LayoutDashboard,
  LogOut,
  ShieldAlert,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
}

/* ── NAMENOLOGY Logo (Inline SVG) ── */
const NamenologyLogo: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    viewBox="0 0 36 36"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Outer orbital ring */}
    <circle cx="18" cy="18" r="16" stroke="url(#logo-grad)" strokeWidth="1.2" opacity="0.3" />
    {/* Inner orbital ring */}
    <circle cx="18" cy="18" r="11" stroke="url(#logo-grad)" strokeWidth="1.5" opacity="0.5" />
    {/* Center glow sphere */}
    <circle cx="18" cy="18" r="6" fill="url(#logo-grad)" opacity="0.9" />
    {/* Small orbital dot */}
    <circle cx="30" cy="10" r="1.5" fill="#22D3EE" />
    {/* Light point */}
    <circle cx="18" cy="18" r="2" fill="white" opacity="0.6" />
    <defs>
      <linearGradient id="logo-grad" x1="0" y1="0" x2="36" y2="36">
        <stop offset="0%" stopColor="#0B5CFF" />
        <stop offset="50%" stopColor="#4F46E5" />
        <stop offset="100%" stopColor="#7C3AED" />
      </linearGradient>
    </defs>
  </svg>
);

export const Navbar: React.FC = () => {
  const router = useRouter();
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
      setUser(null);
      router.push("/");
      router.refresh();
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/analyze", label: "Analyze Name" },
    { href: "/#science", label: "The Science" },
    { href: "/services", label: "Naming Architecture" },
    { href: "/pricing", label: "Pricing & Plans" },
  ];

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "glass-panel-scrolled"
          : "bg-white/60 backdrop-blur-sm border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <NamenologyLogo className="w-9 h-9 transition-transform duration-300 group-hover:scale-105" />
          <div className="flex items-baseline gap-0">
            <span className="font-bold text-lg tracking-tight text-brand-500">NAME</span>
            <span className="font-bold text-lg tracking-tight gradient-text-brand">NOLOGY</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-muted-foreground">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="hover:text-brand-500 transition-colors duration-200 relative group"
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-brand-500 to-indigo-500 transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
          {user && (
            <>
              <Link href="/dashboard" className="hover:text-brand-500 transition-colors duration-200">
                Dashboard
              </Link>
              {user.role === "ADMIN" && (
                <Link
                  href="/admin/dashboard"
                  className="flex items-center gap-1 text-violet-600 font-semibold hover:text-violet-700"
                >
                  <ShieldAlert className="w-3.5 h-3.5" />
                  Admin
                </Link>
              )}
            </>
          )}
        </nav>

        {/* Action Buttons */}
        <div className="hidden lg:flex items-center gap-3">
          {loading ? (
            <div className="w-28 h-9 bg-slate-100 animate-pulse rounded-xl" />
          ) : user ? (
            <div className="flex items-center gap-3">
              <Link href="/dashboard">
                <Button variant="outline" size="sm">
                  <LayoutDashboard className="w-4 h-4 text-brand-500" />
                  {user.name}
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignout}
                className="text-muted-foreground hover:text-red-500"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <>
              <Link href="/signin">
                <Button variant="ghost" size="sm">
                  <User className="w-4 h-4" />
                  Sign In
                </Button>
              </Link>
              <Link href="/analyze">
                <Button variant="gradient" size="sm">
                  Analyze Name
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 rounded-xl text-muted-foreground hover:bg-slate-50 transition-colors"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-border px-4 py-5 space-y-4 shadow-lg">
          <div className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-medium text-foreground hover:text-brand-500 py-1"
              >
                {link.label}
              </Link>
            ))}
            {user && (
              <>
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm font-medium text-foreground hover:text-brand-500"
                >
                  Dashboard
                </Link>
                {user.role === "ADMIN" && (
                  <Link
                    href="/admin/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-sm font-semibold text-violet-600"
                  >
                    Admin Console
                  </Link>
                )}
              </>
            )}
          </div>
          <div className="pt-4 border-t border-border flex flex-col gap-2">
            {user ? (
              <>
                <div className="text-xs text-muted-foreground mb-1">
                  Signed in as <strong className="text-foreground">{user.email}</strong>
                </div>
                <Button
                  variant="outline"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleSignout();
                  }}
                  className="w-full justify-center text-red-500"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Link href="/signin" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full justify-center">
                    <User className="w-4 h-4" />
                    Sign In
                  </Button>
                </Link>
                <Link href="/analyze" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="gradient" className="w-full justify-center">
                    Analyze Name
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
