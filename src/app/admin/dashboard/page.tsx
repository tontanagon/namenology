import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  Sliders,
  Users,
  Database,
  Shield,
  Layers,
  ShoppingBag,
  Award,
  ArrowRight,
  TrendingUp,
  Cpu,
  CheckCircle2,
  DollarSign,
  Activity,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [
    userCount,
    analysisCount,
    paidOrderAgg,
    pendingServiceCount,
    activeConfig,
    activeComponents,
    recentAudits,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.analysis.count(),
    prisma.order.aggregate({
      where: { status: "PAID" },
      _sum: { amount: true },
      _count: true,
    }),
    prisma.serviceOrder.count({
      where: {
        status: { in: ["PAID", "FORM_SUBMITTED", "IN_REVIEW", "IN_PROGRESS"] },
      },
    }),
    prisma.analysisConfig.findFirst({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.nameComponent.findMany({
      where: { isEnabled: true },
      orderBy: { sortOrder: "asc" },
    }),
    prisma.adminAuditLog.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        adminUser: {
          select: { name: true, email: true },
        },
      },
    }),
  ]);

  const totalRevenue = Number(paidOrderAgg._sum.amount ?? 0);
  const paidOrderCount = paidOrderAgg._count;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            System Administration Overview
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Real-time telemetry, configuration snapshots, product performance, and security audits
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="brand">Formula v{activeConfig?.version || "1.0"}</Badge>
          <Badge variant="gold">Active Mode</Badge>
        </div>
      </div>

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card glass glow="cyan">
          <div className="flex items-center justify-between text-xs text-muted-foreground uppercase font-semibold">
            <span>Total Registered Users</span>
            <Users className="w-4 h-4 text-brand-600" />
          </div>
          <div className="text-3xl font-black text-foreground mt-2">{userCount}</div>
          <span className="text-[11px] text-muted-foreground mt-1 block">
            Auditable customer accounts
          </span>
        </Card>

        <Card glass glow="cyan">
          <div className="flex items-center justify-between text-xs text-muted-foreground uppercase font-semibold">
            <span>Analyses Executed</span>
            <Cpu className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-3xl font-black text-foreground mt-2">{analysisCount}</div>
          <span className="text-[11px] text-muted-foreground mt-1 block">
            Stored with immutable snapshots
          </span>
        </Card>

        <Card glass glow="gold">
          <div className="flex items-center justify-between text-xs text-muted-foreground uppercase font-semibold">
            <span>Paid Revenue</span>
            <DollarSign className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-3xl font-black text-foreground mt-2">
            ${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
          <span className="text-[11px] text-muted-foreground mt-1 block">
            From {paidOrderCount} settled Stripe orders
          </span>
        </Card>

        <Card glass glow="indigo">
          <div className="flex items-center justify-between text-xs text-muted-foreground uppercase font-semibold">
            <span>Active Service Orders</span>
            <Award className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-3xl font-black text-foreground mt-2">{pendingServiceCount}</div>
          <span className="text-[11px] text-muted-foreground mt-1 block">
            Specialist consults requiring attention
          </span>
        </Card>
      </div>

      {/* Active Weights & Formula Config Summary */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <Card glass className="md:col-span-6 p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-brand-600" />
              <h2 className="text-sm font-bold text-foreground">Active Component Weight Distribution</h2>
            </div>
            <Link href="/admin/components" className="text-xs text-brand-600 hover:underline">
              Configure &rarr;
            </Link>
          </div>

          <div className="space-y-3">
            {activeComponents.map((comp) => (
              <div key={comp.id} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-foreground">{comp.label}</span>
                  <span className="font-mono font-bold text-brand-600">
                    {Number(comp.weight).toFixed(1)}%
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-border overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-brand-500 to-teal-400 rounded-full"
                    style={{ width: `${Number(comp.weight)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 text-[11px] text-muted-foreground flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
            <span>Server-side rule enforced: Total enabled weight sum equals 100.00%</span>
          </div>
        </Card>

        <Card glass className="md:col-span-6 p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-brand-600" />
              <h2 className="text-sm font-bold text-foreground">Recent Administrative Audit Logs</h2>
            </div>
            <Link href="/admin/audit-logs" className="text-xs text-brand-600 hover:underline">
              View All &rarr;
            </Link>
          </div>

          {recentAudits.length === 0 ? (
            <p className="text-xs text-muted-foreground py-6 text-center">
              No recent audit log modifications recorded.
            </p>
          ) : (
            <div className="divide-y divide-border/60">
              {recentAudits.map((log) => (
                <div key={log.id} className="py-2.5 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-semibold text-foreground">{log.action}</span>
                    <span className="text-muted-foreground block text-[11px]">
                      by {log.adminUser.name} on {log.targetType}
                    </span>
                  </div>
                  <span className="text-[11px] text-muted-foreground font-mono">
                    {new Date(log.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Admin Modules Quick Launch Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <Card glass className="p-4 hover:border-brand-500/50 transition-colors">
          <Database className="w-5 h-5 text-brand-600 mb-2" />
          <h3 className="font-bold text-foreground text-sm">Character Scores</h3>
          <p className="text-xs text-muted-foreground mt-1 mb-3">
            Adjust numeric mapping for Thai and Latin alphabet characters.
          </p>
          <Link href="/admin/characters">
            <Button variant="outline" size="sm" className="w-full text-xs">
              Manage Scores
            </Button>
          </Link>
        </Card>

        <Card glass className="p-4 hover:border-brand-500/50 transition-colors">
          <ShoppingBag className="w-5 h-5 text-amber-500 mb-2" />
          <h3 className="font-bold text-foreground text-sm">Product Catalog</h3>
          <p className="text-xs text-muted-foreground mt-1 mb-3">
            Configure analysis packages ($19, $24, $45, $65) and services.
          </p>
          <Link href="/admin/products">
            <Button variant="outline" size="sm" className="w-full text-xs">
              Manage Products
            </Button>
          </Link>
        </Card>

        <Card glass className="p-4 hover:border-brand-500/50 transition-colors">
          <Award className="w-5 h-5 text-indigo-500 mb-2" />
          <h3 className="font-bold text-foreground text-sm">Service Orders</h3>
          <p className="text-xs text-muted-foreground mt-1 mb-3">
            Review Baby Naming and Name Change customer intake and deliver reports.
          </p>
          <Link href="/admin/service-orders">
            <Button variant="outline" size="sm" className="w-full text-xs">
              Review Orders
            </Button>
          </Link>
        </Card>

        <Card glass className="p-4 hover:border-brand-500/50 transition-colors">
          <Users className="w-5 h-5 text-teal-600 mb-2" />
          <h3 className="font-bold text-foreground text-sm">Users & Quotas</h3>
          <p className="text-xs text-muted-foreground mt-1 mb-3">
            Inspect customer credit balances and execute manual ledger grants.
          </p>
          <Link href="/admin/users">
            <Button variant="outline" size="sm" className="w-full text-xs">
              Manage Users
            </Button>
          </Link>
        </Card>
      </div>
    </div>
  );
}
