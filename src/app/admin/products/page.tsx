"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import {
  ShoppingBag,
  Sparkles,
  Edit2,
  Check,
  X,
  ShieldCheck,
  AlertCircle,
  Tag,
  DollarSign,
} from "lucide-react";

interface EntitlementItem {
  id: string;
  creditType: string;
  quantity: number;
}

interface ProductItem {
  id: string;
  code: string;
  name: string;
  description: string | null;
  productType: "ANALYSIS_PACKAGE" | "SERVICE" | "SUBSCRIPTION";
  price: number;
  currency: string;
  stripePriceId: string | null;
  isActive: boolean;
  entitlements: EntitlementItem[];
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Edit State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState<number>(0);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/products");
      if (res.ok) {
        const data = await res.json();
        setProducts(
          data.products.map((p: any) => ({
            ...p,
            price: Number(p.price),
          }))
        );
      }
    } catch {
      // Ignored
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleStartEdit = (prod: ProductItem) => {
    setEditingId(prod.id);
    setEditPrice(prod.price);
    setMessage(null);
  };

  const handleSavePrice = async (id: string) => {
    try {
      setSaving(true);
      setMessage(null);

      const res = await fetch(`/api/admin/products/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ price: Number(editPrice) }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update product price.");

      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, price: Number(editPrice) } : p))
      );
      setMessage({ type: "success", text: "Product price updated and recorded in audit log." });
      setEditingId(null);
      setTimeout(() => setMessage(null), 3500);
    } catch (err) {
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Save failed.",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (id: string, current: boolean) => {
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !current }),
      });

      if (res.ok) {
        setProducts((prev) =>
          prev.map((p) => (p.id === id ? { ...p, isActive: !current } : p))
        );
      }
    } catch {
      // Ignored
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Product Catalog Management
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Configure dynamic pricing for analysis packages and professional consulting services (REQ-B01, B49)
          </p>
        </div>
        <Badge variant="brand">Configuration-Driven</Badge>
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

      {/* Products Table */}
      <Card glass className="overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-muted-foreground text-xs flex flex-col items-center gap-2">
            <Sparkles className="w-5 h-5 animate-spin text-brand-500" />
            <span>Loading product catalog...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border bg-muted/40 text-muted-foreground">
                  <th className="py-3 px-4 font-semibold">Product</th>
                  <th className="py-3 px-4 font-semibold">Type</th>
                  <th className="py-3 px-4 font-semibold">Price (USD)</th>
                  <th className="py-3 px-4 font-semibold">Entitlements / Deliverables</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {products.map((prod) => {
                  const isEditing = editingId === prod.id;

                  return (
                    <tr key={prod.id} className="hover:bg-muted/30 transition-colors">
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-foreground block">{prod.name}</span>
                        <span className="font-mono text-[10px] text-muted-foreground">
                          {prod.code}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <Badge
                          variant={
                            prod.productType === "SERVICE"
                              ? "gold"
                              : prod.productType === "ANALYSIS_PACKAGE"
                              ? "brand"
                              : "outline"
                          }
                        >
                          {prod.productType.replace("_", " ")}
                        </Badge>
                      </td>
                      <td className="py-3.5 px-4">
                        {isEditing ? (
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-xs">$</span>
                            <Input
                              type="number"
                              min={0}
                              step={1}
                              value={editPrice}
                              onChange={(e) => setEditPrice(Number(e.target.value))}
                              className="w-20 h-8 text-xs font-bold"
                            />
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => handleSavePrice(prod.id)}
                              disabled={saving}
                              className="h-8 px-2"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setEditingId(null)}
                              className="h-8 px-2"
                            >
                              <X className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        ) : (
                          <span className="font-bold text-sm text-foreground">
                            ${prod.price.toFixed(2)}
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        {prod.productType === "ANALYSIS_PACKAGE" ? (
                          <div className="flex flex-wrap gap-1">
                            {prod.entitlements.map((ent) => (
                              <span
                                key={ent.id}
                                className="px-2 py-0.5 rounded bg-muted/60 text-[10px] font-medium"
                              >
                                {ent.quantity}x {ent.creditType.replace("_", " ")}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-[11px] text-muted-foreground">
                            Specialist Consultation
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <button
                          type="button"
                          onClick={() => handleToggleActive(prod.id, prod.isActive)}
                          className={`text-xs font-semibold px-2 py-0.5 rounded-full border cursor-pointer ${
                            prod.isActive
                              ? "bg-teal-500/10 text-teal-700 border-teal-500/20"
                              : "bg-muted text-muted-foreground border-border"
                          }`}
                        >
                          {prod.isActive ? "Active" : "Disabled"}
                        </button>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {!isEditing && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleStartEdit(prod)}
                            className="h-7 text-xs px-2"
                          >
                            <Edit2 className="w-3.5 h-3.5 mr-1" />
                            <span>Edit Price</span>
                          </Button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
