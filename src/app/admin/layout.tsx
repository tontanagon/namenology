import React from "react";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth/rbac";
import { Navbar } from "@/components/layout/Navbar";
import { Badge } from "@/components/ui/Badge";
import {
  Sliders,
  Users,
  Database,
  Shield,
  Layers,
  ShoppingBag,
  Settings,
  Award,
  LayoutDashboard,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Enforces server-side ADMIN authorization guard
  const user = await requireAdmin("/admin/dashboard");

  const navItems = [
    { href: "/admin/dashboard", label: "Overview", icon: LayoutDashboard },
    { href: "/admin/characters", label: "Characters", icon: Database },
    { href: "/admin/components", label: "Components & Weights", icon: Sliders },
    { href: "/admin/settings", label: "System Config", icon: Settings },
    { href: "/admin/products", label: "Products", icon: ShoppingBag },
    { href: "/admin/service-orders", label: "Service Orders", icon: Award },
    { href: "/admin/users", label: "Users & Quotas", icon: Users },
    { href: "/admin/audit-logs", label: "Audit Logs", icon: Shield },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground selection:bg-brand-500 selection:text-white">
      <Navbar />

      {/* Admin Subheader Bar */}
      <div className="border-b border-border bg-muted/30 backdrop-blur-sm sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-2.5">
            <div className="flex items-center gap-2">
              <Badge variant="indigo">Admin Center</Badge>
              <span className="text-xs text-muted-foreground hidden sm:inline">
                Administrator: {user.name} ({user.email})
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                RBAC: Verified
              </span>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex space-x-1 overflow-x-auto py-2 border-t border-border/40 scrollbar-none">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors shrink-0"
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {children}
      </main>
    </div>
  );
}
