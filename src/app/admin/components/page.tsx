"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import {
  Sliders,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Save,
  RotateCcw,
} from "lucide-react";

interface NameComponentItem {
  id: string;
  key: string;
  label: string;
  weight: number;
  isRequired: boolean;
  isEnabled: boolean;
  sortOrder: number;
}

export default function AdminComponentsPage() {
  const [components, setComponents] = useState<NameComponentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fetchComponents = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/components");
      if (res.ok) {
        const data = await res.json();
        setComponents(
          data.components.map((c: any) => ({
            ...c,
            weight: Number(c.weight),
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
    fetchComponents();
  }, []);

  const totalEnabledWeight = components
    .filter((c) => c.isEnabled)
    .reduce((sum, c) => sum + (Number(c.weight) || 0), 0);

  const isValidSum = Math.abs(totalEnabledWeight - 100) < 0.01;

  const handleWeightChange = (id: string, newWeight: number) => {
    setComponents((prev) =>
      prev.map((c) => (c.id === id ? { ...c, weight: Math.max(0, Math.min(100, newWeight)) } : c))
    );
  };

  const handleToggleEnabled = (id: string) => {
    setComponents((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isEnabled: !c.isEnabled } : c))
    );
  };

  const handleToggleRequired = (id: string) => {
    setComponents((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isRequired: !c.isRequired } : c))
    );
  };

  const handleSave = async () => {
    if (!isValidSum) {
      setMessage({
        type: "error",
        text: `Total enabled weight must equal 100.00%. Current sum: ${totalEnabledWeight.toFixed(2)}%`,
      });
      return;
    }

    try {
      setSaving(true);
      setMessage(null);

      const res = await fetch("/api/admin/components", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          components: components.map((c) => ({
            id: c.id,
            weight: c.weight,
            isEnabled: c.isEnabled,
            isRequired: c.isRequired,
            sortOrder: c.sortOrder,
          })),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update weights.");

      setMessage({ type: "success", text: "Component weights successfully saved and audited!" });
      setComponents(
        data.components.map((c: any) => ({
          ...c,
          weight: Number(c.weight),
        }))
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
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Name Components & Weights
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Dynamic weight allocation across name parts. Sum of enabled components must equal 100.00%.
          </p>
        </div>
        <Button
          variant="primary"
          onClick={handleSave}
          disabled={saving || !isValidSum}
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
              Save Weights
            </span>
          )}
        </Button>
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

      {/* Weight Sum Progress Indicator */}
      <Card glass glow={isValidSum ? "cyan" : "none"} className="p-5">
        <div className="flex items-center justify-between text-xs font-semibold mb-2">
          <span className="text-muted-foreground">Enabled Components Weight Total</span>
          <span
            className={`font-mono text-sm font-bold ${
              isValidSum ? "text-teal-600" : "text-rose-600 font-black"
            }`}
          >
            {totalEnabledWeight.toFixed(1)}% / 100.00%
          </span>
        </div>

        <div className="w-full h-3 rounded-full bg-border overflow-hidden">
          <div
            className={`h-full transition-all duration-300 rounded-full ${
              isValidSum
                ? "bg-gradient-to-r from-brand-500 to-teal-400"
                : totalEnabledWeight > 100
                ? "bg-rose-500"
                : "bg-amber-500"
            }`}
            style={{ width: `${Math.min(100, totalEnabledWeight)}%` }}
          />
        </div>

        <p className="text-[11px] text-muted-foreground mt-2">
          {isValidSum ? (
            <span className="text-teal-600 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Weights sum matches the 100% mathematical constraint.
            </span>
          ) : (
            <span className="text-rose-500">
              Adjustment needed: Total is currently off by{" "}
              {Math.abs(100 - totalEnabledWeight).toFixed(1)}%.
            </span>
          )}
        </p>
      </Card>

      {/* Components List */}
      <div className="space-y-4">
        {loading ? (
          <div className="py-16 text-center text-muted-foreground text-xs flex flex-col items-center gap-2">
            <Sparkles className="w-5 h-5 animate-spin text-brand-500" />
            <span>Loading components...</span>
          </div>
        ) : (
          components.map((comp) => (
            <Card
              key={comp.id}
              glass
              className={`p-5 transition-all ${
                !comp.isEnabled ? "opacity-60 border-dashed" : ""
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-foreground text-base">{comp.label}</span>
                    <Badge variant="outline" className="font-mono text-[10px]">
                      {comp.key}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Sort Order: {comp.sortOrder}
                  </p>
                </div>

                <div className="flex items-center gap-6">
                  {/* Weight Slider / Input */}
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min={0}
                      max={100}
                      step={1}
                      value={comp.weight}
                      disabled={!comp.isEnabled}
                      onChange={(e) => handleWeightChange(comp.id, Number(e.target.value))}
                      className="w-32 accent-brand-500 cursor-pointer disabled:cursor-not-allowed"
                    />
                    <div className="flex items-center gap-1 w-20">
                      <Input
                        type="number"
                        min={0}
                        max={100}
                        value={comp.weight}
                        disabled={!comp.isEnabled}
                        onChange={(e) => handleWeightChange(comp.id, Number(e.target.value))}
                        className="h-8 text-xs font-bold text-center"
                      />
                      <span className="text-xs font-bold text-muted-foreground">%</span>
                    </div>
                  </div>

                  {/* Toggles */}
                  <div className="flex items-center gap-2 border-l border-border pl-4">
                    <button
                      type="button"
                      onClick={() => handleToggleRequired(comp.id)}
                      className={`text-xs px-2.5 py-1 rounded-lg border font-medium transition-colors ${
                        comp.isRequired
                          ? "bg-amber-500/10 border-amber-500/20 text-amber-700 font-bold"
                          : "bg-muted text-muted-foreground border-border"
                      }`}
                    >
                      {comp.isRequired ? "Required" : "Optional"}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleToggleEnabled(comp.id)}
                      className={`text-xs px-2.5 py-1 rounded-lg border font-medium transition-colors ${
                        comp.isEnabled
                          ? "bg-teal-500/10 border-teal-500/20 text-teal-700 font-bold"
                          : "bg-muted text-muted-foreground border-border"
                      }`}
                    >
                      {comp.isEnabled ? "Enabled" : "Disabled"}
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
