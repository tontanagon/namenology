"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import {
  Award,
  Sparkles,
  Filter,
  CheckCircle2,
  AlertCircle,
  FileText,
  User,
  Calendar,
  Send,
  Save,
  Lock,
} from "lucide-react";

interface ServiceOrderItem {
  id: string;
  status: string;
  formData: any;
  notes: string | null;
  resultDelivery: string | null;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  product: {
    id: string;
    code: string;
    name: string;
    price: number;
  };
}

export default function AdminServiceOrdersPage() {
  const [orders, setOrders] = useState<ServiceOrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedOrder, setSelectedOrder] = useState<ServiceOrderItem | null>(null);

  // Edit / Delivery State
  const [updateStatus, setUpdateStatus] = useState("");
  const [internalNotes, setInternalNotes] = useState("");
  const [resultDelivery, setResultDelivery] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/service-orders?status=${statusFilter}`);
      if (res.ok) {
        const data = await res.json();
        setOrders(data.serviceOrders || []);
      }
    } catch {
      // Ignored
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const handleSelectOrder = (order: ServiceOrderItem) => {
    setSelectedOrder(order);
    setUpdateStatus(order.status);
    setInternalNotes(order.notes || "");
    setResultDelivery(order.resultDelivery || "");
    setMessage(null);
  };

  const handleSaveOrder = async () => {
    if (!selectedOrder) return;

    try {
      setSaving(true);
      setMessage(null);

      const res = await fetch(`/api/admin/service-orders/${selectedOrder.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: updateStatus,
          notes: internalNotes,
          resultDelivery,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update service order.");

      setMessage({ type: "success", text: "Service order and deliverables successfully updated!" });
      setSelectedOrder(data.serviceOrder);
      setOrders((prev) =>
        prev.map((o) => (o.id === selectedOrder.id ? data.serviceOrder : o))
      );
      setTimeout(() => setMessage(null), 4000);
    } catch (err) {
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Save failed.",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Bespoke Service Order Operations
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Review client scientific intake submissions, manage workflow, and deliver specialist findings (REQ-B45, B55)
          </p>
        </div>
        <Badge variant="gold">Professional Workflows</Badge>
      </div>

      {/* Filter Bar */}
      <Card glass className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-9 px-3 rounded-lg border border-border bg-background text-foreground text-xs font-medium focus:outline-none focus:ring-1 focus:ring-brand-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="PAID">Paid (Pending Client Intake)</option>
            <option value="FORM_SUBMITTED">Form Submitted (Ready for Review)</option>
            <option value="IN_REVIEW">In Specialist Review</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed / Delivered</option>
            <option value="REFUNDED">Refunded</option>
          </select>
        </div>
        <span className="text-xs text-muted-foreground font-mono">{orders.length} order(s)</span>
      </Card>

      {/* Two Column Layout: Orders List & Review Detail Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Orders Table */}
        <div className="lg:col-span-6">
          <Card glass className="overflow-hidden">
            {loading ? (
              <div className="py-16 text-center text-muted-foreground text-xs flex flex-col items-center gap-2">
                <Sparkles className="w-5 h-5 animate-spin text-brand-500" />
                <span>Loading service orders...</span>
              </div>
            ) : orders.length === 0 ? (
              <div className="py-16 text-center text-muted-foreground text-xs">
                No service orders found matching criteria.
              </div>
            ) : (
              <div className="divide-y divide-border/60">
                {orders.map((o) => {
                  const isSelected = selectedOrder?.id === o.id;

                  return (
                    <div
                      key={o.id}
                      onClick={() => handleSelectOrder(o)}
                      className={`p-4 cursor-pointer transition-colors ${
                        isSelected
                          ? "bg-brand-500/10 border-l-4 border-brand-500"
                          : "hover:bg-muted/30"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-foreground">{o.product.name}</span>
                        <Badge variant={o.status === "COMPLETED" ? "success" : "brand"}>
                          {o.status.replace("_", " ")}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-muted-foreground mt-2">
                        <span>
                          {o.user.name} ({o.user.email})
                        </span>
                        <span className="font-mono">
                          {new Date(o.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </div>

        {/* Detail & Action Drawer */}
        <div className="lg:col-span-6">
          {selectedOrder ? (
            <Card glass glow="gold" className="p-6 space-y-6">
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div>
                  <h2 className="text-base font-bold text-foreground">
                    {selectedOrder.product.name}
                  </h2>
                  <span className="text-[11px] text-muted-foreground font-mono">
                    Client: {selectedOrder.user.name} ({selectedOrder.user.email})
                  </span>
                </div>
                <Badge variant="outline" className="font-mono text-[10px]">
                  ID: {selectedOrder.id.slice(0, 8)}
                </Badge>
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
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 shrink-0" />
                  )}
                  <span>{message.text}</span>
                </div>
              )}

              {/* Submitted Client Intake Details */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-brand-600" />
                  <span>Submitted Client Intake</span>
                </h3>

                {selectedOrder.formData ? (
                  <div className="grid grid-cols-2 gap-3 text-xs p-3 rounded-xl bg-muted/40 border border-border">
                    <div>
                      <span className="text-muted-foreground block text-[10px]">Target Name:</span>
                      <span className="font-bold text-foreground">
                        {selectedOrder.formData.targetName || "Not provided"}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-[10px]">Birth Date:</span>
                      <span className="font-bold text-foreground">
                        {selectedOrder.formData.birthDate || "Not provided"}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-[10px]">Birth Time:</span>
                      <span className="font-bold text-foreground">
                        {selectedOrder.formData.birthTime || "Not provided"}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-[10px]">Life Goals:</span>
                      <span className="font-bold text-foreground">
                        {selectedOrder.formData.lifeGoals || "General"}
                      </span>
                    </div>
                    {selectedOrder.formData.specialPreferences && (
                      <div className="col-span-2 pt-1 border-t border-border">
                        <span className="text-muted-foreground block text-[10px]">Preferences:</span>
                        <p className="text-foreground text-[11px]">
                          {selectedOrder.formData.specialPreferences}
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground italic p-3 rounded-xl bg-muted/20 border border-border">
                    Client has not yet submitted their scientific intake form.
                  </p>
                )}
              </div>

              {/* Status & Management Controls */}
              <div className="space-y-4 pt-2 border-t border-border">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Workflow Status
                  </label>
                  <select
                    value={updateStatus}
                    onChange={(e) => setUpdateStatus(e.target.value)}
                    className="w-full h-9 px-3 rounded-lg border border-border bg-background text-foreground text-xs font-medium focus:outline-none focus:ring-1 focus:ring-brand-500"
                  >
                    <option value="PAID">PAID</option>
                    <option value="FORM_SUBMITTED">FORM_SUBMITTED</option>
                    <option value="IN_REVIEW">IN_REVIEW</option>
                    <option value="IN_PROGRESS">IN_PROGRESS</option>
                    <option value="COMPLETED">COMPLETED (Delivers result to customer)</option>
                    <option value="REFUNDED">REFUNDED</option>
                  </select>
                </div>

                {/* Internal Notes (Confidential per REQ-B45) */}
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1 flex items-center gap-1">
                    <Lock className="w-3 h-3 text-amber-500" />
                    <span>Internal Specialist Notes (Confidential)</span>
                  </label>
                  <textarea
                    rows={2}
                    value={internalNotes}
                    onChange={(e) => setInternalNotes(e.target.value)}
                    placeholder="Internal calculations, planetary deity cross-checks, or notes..."
                    className="w-full px-3 py-2 rounded-xl border border-border bg-background text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-brand-500"
                  />
                  <span className="text-[10px] text-muted-foreground block mt-0.5">
                    Internal notes are never displayed to the customer (REQ-B45).
                  </span>
                </div>

                {/* Deliverable Text to Customer */}
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1 flex items-center gap-1">
                    <Send className="w-3.5 h-3.5 text-teal-600" />
                    <span>Specialist Result Delivery (Client Visible upon Completion)</span>
                  </label>
                  <textarea
                    rows={4}
                    value={resultDelivery}
                    onChange={(e) => setResultDelivery(e.target.value)}
                    placeholder="Provide candidate auspicious names, planetary deity recommendations, and auspicious submission dates..."
                    className="w-full px-3 py-2 rounded-xl border border-border bg-background text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-brand-500 font-mono"
                  />
                </div>

                <div className="flex items-center justify-end pt-2">
                  <Button
                    variant="primary"
                    onClick={handleSaveOrder}
                    disabled={saving}
                    className="min-w-[140px]"
                  >
                    {saving ? (
                      <span className="flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 animate-spin" />
                        Saving...
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5">
                        <Save className="w-4 h-4" />
                        Update Order
                      </span>
                    )}
                  </Button>
                </div>
              </div>
            </Card>
          ) : (
            <Card glass className="p-12 text-center text-muted-foreground text-xs">
              <Award className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p>Select a service order from the list to inspect client intake and deliver findings.</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
