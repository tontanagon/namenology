"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import {
  Users,
  Search,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  Plus,
  Coins,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface AdminUserItem {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt: string;
  balances: {
    firstName: number;
    surname: number;
    combined: number;
  };
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 15;

  // Credit Adjustment Modal State
  const [selectedUser, setSelectedUser] = useState<AdminUserItem | null>(null);
  const [adjustType, setAdjustType] = useState<"FIRST_NAME" | "SURNAME" | "COMBINED">("COMBINED");
  const [adjustAmount, setAdjustAmount] = useState<number>(1);
  const [adjustReason, setAdjustReason] = useState("");
  const [adjusting, setAdjusting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      if (search.trim()) params.append("search", search.trim());

      const res = await fetch(`/api/admin/users?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users || []);
        setTotal(data.total || 0);
      }
    } catch {
      // Ignored
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchUsers();
  };

  const handleOpenAdjust = (user: AdminUserItem) => {
    setSelectedUser(user);
    setAdjustType("COMBINED");
    setAdjustAmount(1);
    setAdjustReason("Customer support complimentary grant");
    setMessage(null);
  };

  const handleExecuteAdjust = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    try {
      setAdjusting(true);
      setMessage(null);

      const res = await fetch(`/api/admin/users/${selectedUser.id}/adjust-credits`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          creditType: adjustType,
          amount: Number(adjustAmount),
          reason: adjustReason,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to adjust credits.");

      setMessage({ type: "success", text: "Credits adjusted and recorded in audit ledger!" });
      // Update local state
      setUsers((prev) =>
        prev.map((u) => {
          if (u.id === selectedUser.id) {
            return {
              ...u,
              balances: {
                firstName: data.balances.FIRST_NAME ?? u.balances.firstName,
                surname: data.balances.SURNAME ?? u.balances.surname,
                combined: data.balances.COMBINED ?? u.balances.combined,
              },
            };
          }
          return u;
        })
      );
      setSelectedUser(null);
      setTimeout(() => setMessage(null), 4000);
    } catch (err) {
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Adjustment failed.",
      });
    } finally {
      setAdjusting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            User Management & Quota Controls
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Inspect individual user quotas across First Name, Surname, and Combined buckets (REQ-B03, B50)
          </p>
        </div>
        <span className="text-xs text-muted-foreground font-mono">Total Users: {total}</span>
      </div>

      {message && (
        <div
          className={`p-3 rounded-lg border text-xs flex items-center gap-2 ${
            message.type === "success"
              ? "bg-teal-500/10 border-teal-500/20 text-teal-700"
              : "bg-rose-500/10 border-rose-500/20 text-rose-600"
          }`}
        >
          {message.type === "success" ? (
            <ShieldCheck className="w-4 h-4 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Search Bar */}
      <Card glass className="p-4">
        <form onSubmit={handleSearchSubmit} className="relative w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search users by name or email address..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 text-xs"
          />
        </form>
      </Card>

      {/* Users Table */}
      <Card glass className="overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-muted-foreground text-xs flex flex-col items-center gap-2">
            <Sparkles className="w-5 h-5 animate-spin text-brand-500" />
            <span>Loading user accounts...</span>
          </div>
        ) : users.length === 0 ? (
          <div className="py-16 text-center text-muted-foreground text-xs">
            No registered users found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border bg-muted/40 text-muted-foreground">
                  <th className="py-3 px-4 font-semibold">User Profile</th>
                  <th className="py-3 px-4 font-semibold">Role</th>
                  <th className="py-3 px-4 font-semibold">First Name Quota</th>
                  <th className="py-3 px-4 font-semibold">Surname Quota</th>
                  <th className="py-3 px-4 font-semibold">Combined Quota</th>
                  <th className="py-3 px-4 font-semibold">Joined Date</th>
                  <th className="py-3 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-muted/30 transition-colors">
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-foreground block">{u.name}</span>
                      <span className="text-[11px] text-muted-foreground">{u.email}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge variant={u.role === "ADMIN" ? "gold" : "outline"}>
                        {u.role}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-teal-600">
                      {u.balances.firstName}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-teal-600">
                      {u.balances.surname}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-amber-600">
                      {u.balances.combined}
                    </td>
                    <td className="py-3.5 px-4 text-muted-foreground text-[11px]">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenAdjust(u)}
                        className="h-7 text-xs px-2.5"
                      >
                        <Coins className="w-3.5 h-3.5 mr-1 text-amber-500" />
                        <span>Adjust Credits</span>
                      </Button>
                    </td>
                  </tr>
                ))}
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

      {/* Credit Adjustment Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card glass glow="gold" className="max-w-md w-full p-6 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <Coins className="w-5 h-5 text-amber-500" />
                <h3 className="font-bold text-foreground">Adjust User Credits</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedUser(null)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-muted-foreground">
              Adjusting credit balance for <strong className="text-foreground">{selectedUser.name}</strong> ({selectedUser.email}).
            </p>

            <form onSubmit={handleExecuteAdjust} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Credit Bucket
                </label>
                <select
                  value={adjustType}
                  onChange={(e) => setAdjustType(e.target.value as any)}
                  className="w-full h-9 px-3 rounded-lg border border-border bg-background text-foreground text-xs font-medium focus:outline-none focus:ring-1 focus:ring-brand-500"
                >
                  <option value="FIRST_NAME">First Name Credit</option>
                  <option value="SURNAME">Surname Credit</option>
                  <option value="COMBINED">Combined (Full Name) Credit</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Adjustment Amount (Use positive to grant, negative to deduct)
                </label>
                <Input
                  type="number"
                  value={adjustAmount}
                  onChange={(e) => setAdjustAmount(Number(e.target.value))}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Audit Reason <span className="text-rose-500">*</span>
                </label>
                <Input
                  type="text"
                  placeholder="e.g. VIP promotion or manual compensation"
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedUser(null)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  disabled={adjusting}
                >
                  {adjusting ? "Applying..." : "Apply Adjustment"}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
