"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import {
  Settings,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  Cpu,
  History,
  CheckCircle2,
  Mail,
  Send,
  ExternalLink,
} from "lucide-react";

interface AnalysisConfigItem {
  id: string;
  version: string;
  description: string;
  decimalPrecision: number;
  missingFieldPolicy: string;
  normalizationMaxScore: number;
  isActive: boolean;
  createdAt: string;
}

export default function AdminSettingsPage() {
  const [activeConfig, setActiveConfig] = useState<AnalysisConfigItem | null>(null);
  const [allConfigs, setAllConfigs] = useState<AnalysisConfigItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State for Bumping Formula Version (REQ-B24)
  const [version, setVersion] = useState("");
  const [description, setDescription] = useState("");
  const [decimalPrecision, setDecimalPrecision] = useState(4);
  const [missingFieldPolicy, setMissingFieldPolicy] = useState("REDISTRIBUTE_WEIGHT");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Admin Email Delivery State
  const [smtpInfo, setSmtpInfo] = useState<{ configured: boolean; host: string; port: string; from: string; mode: string } | null>(null);
  const [testEmail, setTestEmail] = useState("");
  const [testTemplate, setTestTemplate] = useState<"TEST" | "WELCOME" | "SECURITY" | "ANALYSIS">("TEST");
  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailResult, setEmailResult] = useState<{ type: "success" | "error"; text: string; previewUrl?: string } | null>(null);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const [settingsRes, emailStatusRes] = await Promise.all([
        fetch("/api/admin/settings"),
        fetch("/api/admin/email/test"),
      ]);

      if (settingsRes.ok) {
        const data = await settingsRes.json();
        setActiveConfig(data.activeConfig);
        setAllConfigs(data.allConfigs || []);
        if (data.activeConfig) {
          setDecimalPrecision(data.activeConfig.decimalPrecision);
          setMissingFieldPolicy(data.activeConfig.missingFieldPolicy);
        }
      }

      if (emailStatusRes.ok) {
        const emailData = await emailStatusRes.json();
        setSmtpInfo(emailData);
      }
    } catch {
      // Ignored
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSendTestEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testEmail.trim()) {
      setEmailResult({ type: "error", text: "Please enter a valid destination email address." });
      return;
    }

    setSendingEmail(true);
    setEmailResult(null);

    try {
      const res = await fetch("/api/admin/email/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetEmail: testEmail.trim(),
          templateType: testTemplate,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setEmailResult({ type: "error", text: data.error || "Failed to send test email." });
      } else {
        setEmailResult({
          type: "success",
          text: data.message,
          previewUrl: data.previewUrl,
        });
      }
    } catch {
      setEmailResult({ type: "error", text: "Network connection error while sending test email." });
    } finally {
      setSendingEmail(false);
    }
  };

  const handleBumpVersion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!version.trim()) {
      setMessage({ type: "error", text: "Please provide a valid formula version string." });
      return;
    }

    try {
      setSaving(true);
      setMessage(null);

      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          version: version.trim(),
          description: description.trim() || undefined,
          decimalPrecision: Number(decimalPrecision),
          missingFieldPolicy,
          normalizationMaxScore: 100,
          activateImmediately: true,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to bump formula version.");

      setMessage({
        type: "success",
        text: `Formula successfully updated to version ${data.config.version}! Historical analyses remain 100% reproducible.`,
      });
      setVersion("");
      setDescription("");
      await fetchSettings();
      setTimeout(() => setMessage(null), 5000);
    } catch (err) {
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Update failed.",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            System & Formula Configuration
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Manage formula versioning, decimal precision, and missing field redistribution policies
          </p>
        </div>
        <Badge variant="gold">Immutable Snapshots (REQ-B24)</Badge>
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

      {/* Active Formula Summary Card */}
      <Card glass glow="cyan" className="p-6">
        <div className="flex items-center justify-between border-b border-border pb-4 mb-4">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-brand-600" />
            <h2 className="text-base font-bold text-foreground">Active Scoring Engine Configuration</h2>
          </div>
          <Badge variant="brand">Currently Live</Badge>
        </div>

        {activeConfig ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-3 rounded-xl bg-muted/40 border border-border">
              <span className="text-muted-foreground block text-[11px]">Formula Version</span>
              <span className="font-extrabold text-base text-foreground mt-0.5 block font-mono">
                v{activeConfig.version}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-muted/40 border border-border">
              <span className="text-muted-foreground block text-[11px]">Missing Field Policy</span>
              <span className="font-bold text-foreground mt-0.5 block">
                {activeConfig.missingFieldPolicy}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-muted/40 border border-border">
              <span className="text-muted-foreground block text-[11px]">Internal Precision</span>
              <span className="font-bold text-foreground mt-0.5 block">
                {activeConfig.decimalPrecision} decimal places
              </span>
            </div>
          </div>
        ) : (
          <p className="text-xs text-muted-foreground">No active formula configuration found.</p>
        )}
      </Card>

      {/* Bump Formula Version Form (REQ-B24) */}
      <Card glass className="p-6 space-y-4">
        <div>
          <h2 className="text-base font-bold text-foreground flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-brand-600" />
            <span>Deploy New Formula Version</span>
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            Bumping the formula version applies to all future calculations while preserving historical reproducibility for past records.
          </p>
        </div>

        <form onSubmit={handleBumpVersion} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                New Version String <span className="text-rose-500">*</span>
              </label>
              <Input
                type="text"
                placeholder="e.g. 1.1 or 2.0"
                value={version}
                onChange={(e) => setVersion(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Missing Field Policy
              </label>
              <select
                value={missingFieldPolicy}
                onChange={(e) => setMissingFieldPolicy(e.target.value)}
                className="w-full h-9 px-3 rounded-lg border border-border bg-background text-foreground text-xs font-medium focus:outline-none focus:ring-1 focus:ring-brand-500"
              >
                <option value="REDISTRIBUTE_WEIGHT">
                  REDISTRIBUTE_WEIGHT (Dynamic Re-balancing)
                </option>
                <option value="SKIP">
                  SKIP (Ignore missing field without redistribution)
                </option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Version Changelog / Notes
            </label>
            <Input
              type="text"
              placeholder="e.g. Adjusted consonant weight distributions and enhanced NFC normalization"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-end pt-2">
            <Button type="submit" variant="primary" disabled={saving}>
              {saving ? "Deploying Version..." : "Deploy New Formula Version"}
            </Button>
          </div>
        </form>
      </Card>

      {/* Historical Versions Table */}
      <Card glass className="p-6 space-y-4">
        <h2 className="text-base font-bold text-foreground flex items-center gap-2">
          <History className="w-4 h-4 text-brand-600" />
          <span>Historical Version Registry</span>
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border bg-muted/40 text-muted-foreground">
                <th className="py-2.5 px-3 font-semibold">Version</th>
                <th className="py-2.5 px-3 font-semibold">Description</th>
                <th className="py-2.5 px-3 font-semibold">Policy</th>
                <th className="py-2.5 px-3 font-semibold">Deployed Date</th>
                <th className="py-2.5 px-3 font-semibold text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {allConfigs.map((cfg) => (
                <tr key={cfg.id}>
                  <td className="py-3 px-3 font-mono font-bold text-foreground">v{cfg.version}</td>
                  <td className="py-3 px-3 text-muted-foreground">{cfg.description}</td>
                  <td className="py-3 px-3 font-mono text-[11px]">{cfg.missingFieldPolicy}</td>
                  <td className="py-3 px-3 text-muted-foreground">
                    {new Date(cfg.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <Badge variant={cfg.isActive ? "brand" : "outline"}>
                      {cfg.isActive ? "Active" : "Archived"}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Email Delivery & SMTP Service Test Card (Moved to Admin per user request) */}
      <Card glass className="p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
          <div>
            <h2 className="text-base font-bold text-foreground flex items-center gap-2">
              <Mail className="w-4 h-4 text-brand-600" />
              <span>Email Delivery &amp; SMTP Test System (ระบบทดสอบการส่งอีเมล)</span>
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Verify mailer configuration, test deliverability, and preview transactional email templates.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={smtpInfo?.configured ? "brand" : "gold"}>
              {smtpInfo?.mode || "Ethereal / Sandbox"}
            </Badge>
          </div>
        </div>

        {/* Transporter Configuration Telemetry */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-muted/40 border border-border">
            <span className="text-[11px] font-semibold text-muted-foreground block">Active SMTP Host</span>
            <span className="font-mono font-bold text-foreground mt-0.5 block truncate">
              {smtpInfo?.host || "Local Sandbox"}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-muted/40 border border-border">
            <span className="text-[11px] font-semibold text-muted-foreground block">Connection Port</span>
            <span className="font-mono font-bold text-foreground mt-0.5 block">
              Port {smtpInfo?.port || "587"}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-muted/40 border border-border">
            <span className="text-[11px] font-semibold text-muted-foreground block">Sender Identity (FROM)</span>
            <span className="font-mono font-bold text-foreground mt-0.5 block truncate">
              {smtpInfo?.from || '"NAMENOLOGY" <notifications@namenology.com>'}
            </span>
          </div>
        </div>

        {emailResult && (
          <div
            className={`p-3.5 rounded-xl border text-xs flex flex-col gap-1.5 ${
              emailResult.type === "success"
                ? "bg-blue-50/80 border-blue-200 text-blue-900"
                : "bg-rose-50 border-rose-200 text-rose-800"
            }`}
          >
            <div className="flex items-center gap-2">
              {emailResult.type === "success" ? (
                <CheckCircle2 className="w-4 h-4 shrink-0 text-blue-600" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              )}
              <span className="font-semibold">{emailResult.text}</span>
            </div>
            {emailResult.previewUrl && (
              <a
                href={emailResult.previewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] text-blue-600 hover:underline font-bold inline-flex items-center gap-1 ml-6"
              >
                <span>Open Ethereal Email Preview (เปิดดูตัวอย่างอีเมลจริง)</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        )}

        <form onSubmit={handleSendTestEmail} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Recipient Email Address (อีเมลปลายทางที่ต้องการทดสอบ)
              </label>
              <Input
                type="email"
                placeholder="e.g. admin@namenology.com"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Email Template (ประเภทเทมเพลตอีเมล)
              </label>
              <select
                value={testTemplate}
                onChange={(e) => setTestTemplate(e.target.value as any)}
                className="w-full h-9 px-3 rounded-lg border border-border bg-background text-foreground text-xs font-medium focus:outline-none focus:ring-1 focus:ring-brand-500"
              >
                <option value="TEST">1. Verification / System Test (อีเมลทดสอบระบบ)</option>
                <option value="WELCOME">2. Welcome New Member (ต้อนรับสมาชิกใหม่)</option>
                <option value="SECURITY">3. Security Alert (แจ้งเตือนรหัสผ่านถูกเปลี่ยน)</option>
                <option value="ANALYSIS">4. Analysis Report Ready (รายงานวิเคราะห์ชื่อเสร็จสิ้น)</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end pt-2">
            <Button
              type="submit"
              variant="primary"
              disabled={sendingEmail}
              className="inline-flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{sendingEmail ? "Dispatching Email..." : "Send Test Email (ส่งอีเมลทดสอบ)"}</span>
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
