"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  Shield,
  Sparkles,
  Filter,
  Calendar,
  User,
  ChevronLeft,
  ChevronRight,
  Code,
} from "lucide-react";

interface AuditLogItem {
  id: string;
  action: string;
  targetType: string;
  targetId: string | null;
  metadata: any;
  createdAt: string;
  adminUser: {
    name: string;
    email: string;
  };
}

export default function AdminAuditLogsPage() {
  const [logs, setLogs] = useState<AuditLogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionFilter, setActionFilter] = useState("ALL");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const limit = 20;

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      if (actionFilter !== "ALL") params.append("action", actionFilter);

      const res = await fetch(`/api/admin/audit-logs?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setLogs(data.logs || []);
        setTotal(data.total || 0);
      }
    } catch {
      // Ignored
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [page, actionFilter]);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Administrative Audit Trail
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Immutable log of all configuration modifications, weight shifts, and manual quota grants
          </p>
        </div>
        <Badge variant="indigo">Security Audit Layer</Badge>
      </div>

      {/* Filter Bar */}
      <Card glass className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <select
            value={actionFilter}
            onChange={(e) => {
              setActionFilter(e.target.value);
              setPage(1);
            }}
            className="h-9 px-3 rounded-lg border border-border bg-background text-foreground text-xs font-medium focus:outline-none focus:ring-1 focus:ring-brand-500"
          >
            <option value="ALL">All Actions</option>
            <option value="UPDATE_CHARACTER_SCORE">UPDATE_CHARACTER_SCORE</option>
            <option value="UPDATE_COMPONENT_WEIGHTS">UPDATE_COMPONENT_WEIGHTS</option>
            <option value="BUMP_FORMULA_VERSION">BUMP_FORMULA_VERSION</option>
            <option value="UPDATE_PRODUCT_CATALOG">UPDATE_PRODUCT_CATALOG</option>
            <option value="UPDATE_SERVICE_ORDER">UPDATE_SERVICE_ORDER</option>
            <option value="MANUAL_CREDIT_ADJUSTMENT">MANUAL_CREDIT_ADJUSTMENT</option>
          </select>
        </div>
        <span className="text-xs text-muted-foreground font-mono">Total: {total} logs</span>
      </Card>

      {/* Logs Table */}
      <Card glass className="overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-muted-foreground text-xs flex flex-col items-center gap-2">
            <Sparkles className="w-5 h-5 animate-spin text-brand-500" />
            <span>Loading audit records...</span>
          </div>
        ) : logs.length === 0 ? (
          <div className="py-16 text-center text-muted-foreground text-xs">
            No administrative audit logs found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border bg-muted/40 text-muted-foreground">
                  <th className="py-3 px-4 font-semibold">Action</th>
                  <th className="py-3 px-4 font-semibold">Entity</th>
                  <th className="py-3 px-4 font-semibold">Administrator</th>
                  <th className="py-3 px-4 font-semibold">Timestamp</th>
                  <th className="py-3 px-4 font-semibold text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {logs.map((log) => {
                  const isExpanded = expandedId === log.id;

                  return (
                    <React.Fragment key={log.id}>
                      <tr className="hover:bg-muted/30 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-bold text-foreground">
                          <Badge variant="brand">{log.action}</Badge>
                        </td>
                        <td className="py-3.5 px-4 text-muted-foreground font-mono">
                          {log.targetType}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-semibold text-foreground block">{log.adminUser.name}</span>
                          <span className="text-[10px] text-muted-foreground">{log.adminUser.email}</span>
                        </td>
                        <td className="py-3.5 px-4 text-muted-foreground font-mono text-[11px]">
                          {new Date(log.createdAt).toLocaleString()}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleExpand(log.id)}
                            className="h-7 text-xs px-2"
                          >
                            <Code className="w-3.5 h-3.5 mr-1" />
                            <span>{isExpanded ? "Hide Metadata" : "View Metadata"}</span>
                          </Button>
                        </td>
                      </tr>

                      {isExpanded && (
                        <tr>
                          <td colSpan={5} className="p-4 bg-muted/50 border-b border-border">
                            <div className="text-xs font-mono">
                              <span className="text-muted-foreground font-semibold block mb-1">
                                Event Payload & Metadata:
                              </span>
                              <pre className="p-3 rounded-lg bg-background border border-border text-[11px] overflow-x-auto max-h-48 text-teal-600">
                                {JSON.stringify(log.metadata, null, 2) || "null"}
                              </pre>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {total > limit && (
          <div className="flex items-center justify-between p-4 border-t border-border bg-muted/20 text-xs">
            <span className="text-muted-foreground">
              Showing {(page - 1) * limit + 1} to {Math.min(page * limit, total)} of {total}
            </span>
            <div className="flex items-center gap-1.5">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="h-7 text-xs px-2"
              >
                <ChevronLeft className="w-3.5 h-3.5 mr-1" />
                <span>Previous</span>
              </Button>
              <span className="px-2 font-mono font-medium">{page}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => p + 1)}
                disabled={page * limit >= total}
                className="h-7 text-xs px-2"
              >
                <span>Next</span>
                <ChevronRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
