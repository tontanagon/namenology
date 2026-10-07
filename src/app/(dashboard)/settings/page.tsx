"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import {
  User,
  Bell,
  Lock,
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Save,
  ArrowRight,
  ExternalLink,
  Sparkles,
  Mail,
  Calendar,
  Layers,
  KeyRound,
} from "lucide-react";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  emailVerified: string | null;
  receiveNotifications: boolean;
  notifyEmail: boolean;
  notifyMarketing: boolean;
  notifySecurity: boolean;
  createdAt: string;
}

interface EntitlementSummary {
  balances: {
    total: number;
    firstName: number;
    surname: number;
    combined: number;
  };
}

function SettingsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialTab = searchParams.get("tab") || "profile";
  const [activeTab, setActiveTab] = useState<string>(initialTab);

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [entitlements, setEntitlements] = useState<EntitlementSummary | null>(null);

  // Profile Form State
  const [name, setName] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Notification Preferences State
  const [receiveNotifications, setReceiveNotifications] = useState(true);
  const [notifyEmail, setNotifyEmail] = useState(true);
  const [notifyMarketing, setNotifyMarketing] = useState(false);
  const [notifySecurity, setNotifySecurity] = useState(true);
  const [savingNotifications, setSavingNotifications] = useState(false);
  const [notifMsg, setNotifMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Password Form State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Email Verification State
  const [resendingVerification, setResendingVerification] = useState(false);
  const [verificationFeedback, setVerificationFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleResendVerification = async () => {
    if (!user?.email) return;
    setResendingVerification(true);
    setVerificationFeedback(null);
    try {
      const res = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setVerificationFeedback({
          type: "success",
          text: data.message || "Verification link sent to your inbox!",
        });
      } else {
        setVerificationFeedback({
          type: "error",
          text: data.message || "Failed to send verification link.",
        });
      }
    } catch {
      setVerificationFeedback({
        type: "error",
        text: "Network error. Please try again.",
      });
    } finally {
      setResendingVerification(false);
    }
  };

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/user/settings");
        if (!res.ok) {
          if (res.status === 401) {
            router.push("/signin?callbackUrl=/settings");
            return;
          }
          throw new Error("Failed to load settings");
        }
        const data = await res.json();
        setUser(data.user);
        setName(data.user.name);
        setReceiveNotifications(data.user.receiveNotifications ?? true);
        setNotifyEmail(data.user.notifyEmail ?? true);
        setNotifyMarketing(data.user.notifyMarketing ?? false);
        setNotifySecurity(data.user.notifySecurity ?? true);
        setEntitlements(data.entitlements);
      } catch (err) {
        console.error("Error loading settings:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, [router]);

  // Update Profile
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileMsg(null);
    setSavingProfile(true);

    try {
      const res = await fetch("/api/user/settings/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      const data = await res.json();

      if (!res.ok) {
        setProfileMsg({ type: "error", text: data.error || "Failed to update profile." });
      } else {
        setProfileMsg({ type: "success", text: "Your profile information has been successfully updated." });
        setUser((prev) => (prev ? { ...prev, name: data.user.name } : null));
      }
    } catch {
      setProfileMsg({ type: "error", text: "Network connection error. Please try again." });
    } finally {
      setSavingProfile(false);
    }
  };

  // Update Notifications
  const handleSaveNotifications = async (e: React.FormEvent) => {
    e.preventDefault();
    setNotifMsg(null);
    setSavingNotifications(true);

    try {
      const res = await fetch("/api/user/settings/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          receiveNotifications,
          notifyEmail,
          notifyMarketing,
          notifySecurity,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setNotifMsg({ type: "error", text: data.error || "Failed to update email preferences." });
      } else {
        setNotifMsg({
          type: "success",
          text: "Email notification preferences updated successfully.",
        });
      }
    } catch {
      setNotifMsg({ type: "error", text: "Network connection error. Please try again." });
    } finally {
      setSavingNotifications(false);
    }
  };

  // Change Password
  const handleSavePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMsg(null);

    if (newPassword !== confirmPassword) {
      setPasswordMsg({ type: "error", text: "The new passwords you entered do not match." });
      return;
    }

    if (newPassword.length < 8) {
      setPasswordMsg({ type: "error", text: "New password must be at least 8 characters in length." });
      return;
    }

    setSavingPassword(true);

    try {
      const res = await fetch("/api/user/settings/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();

      if (!res.ok) {
        setPasswordMsg({ type: "error", text: data.error || "Failed to update password." });
      } else {
        setPasswordMsg({
          type: "success",
          text: "Your password has been changed successfully. A security confirmation email was dispatched.",
        });
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch {
      setPasswordMsg({ type: "error", text: "Network connection error. Please try again." });
    } finally {
      setSavingPassword(false);
    }
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "notifications", label: "Email Notifications", icon: Mail },
    { id: "security", label: "Security & Password", icon: Lock },
    { id: "billing", label: "Plan & Credits", icon: CreditCard },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Navbar />
        <main className="flex-1 max-w-5xl mx-auto px-4 py-16 w-full flex items-center justify-center">
          <div className="flex flex-col items-center gap-3 text-slate-500">
            <Sparkles className="w-6 h-6 animate-spin text-blue-600" />
            <p className="text-xs font-semibold">Loading account settings...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFF] text-slate-900">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
        {/* Header */}
        <div className="border-b border-indigo-100/80 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Badge variant="brand">Account Settings</Badge>
              <span className="text-xs text-slate-500">ID: {user?.id.slice(0, 8)}...</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 font-outfit">
              Account Settings
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Manage your personal identity, email notification preferences, security credentials, and credit entitlements.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/dashboard">
              <Button variant="outline" size="sm" className="border-slate-200">
                <span>Back to Dashboard</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Settings Navigation Tabs */}
        <div className="flex items-center gap-1.5 border-b border-indigo-100 overflow-x-auto pb-px">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveTab(tab.id);
                  router.replace(`/settings?tab=${tab.id}`, { scroll: false });
                }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all border-b-2 whitespace-nowrap cursor-pointer ${isActive
                    ? "border-blue-600 text-blue-700 bg-white shadow-2xs"
                    : "border-transparent text-slate-500 hover:text-slate-800 hover:bg-white/60"
                  }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-blue-600" : "text-slate-400"}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab 1: Profile */}
        {activeTab === "profile" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left Card: Monogram & Identity */}
            <Card variant="elevated" className="md:col-span-1 p-6 space-y-6 bg-white border-indigo-100/80">
              <div className="text-center space-y-3">
                <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 text-white flex items-center justify-center font-bold text-2xl shadow-lg shadow-indigo-500/20">
                  {user?.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">{user?.name}</h3>
                  <p className="text-xs text-slate-500">{user?.email}</p>
                </div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-[11px] font-bold text-blue-700">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Role: {user?.role}</span>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-4 space-y-3 text-xs text-slate-600">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-slate-500">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Member Since</span>
                  </span>
                  <span className="font-semibold text-slate-800">
                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "-"}
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-slate-500">
                      <Mail className="w-3.5 h-3.5" />
                      <span>Email Status</span>
                    </span>
                    {user?.emailVerified ? (
                      <span className="font-semibold text-emerald-600 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Verified</span>
                      </span>
                    ) : (
                      <span className="font-semibold text-amber-600 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>Pending</span>
                      </span>
                    )}
                  </div>

                  {!user?.emailVerified && (
                    <div className="pt-1 space-y-1.5">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={resendingVerification}
                        onClick={handleResendVerification}
                        className="w-full text-[11px] h-7 border-amber-200 text-amber-800 hover:bg-amber-50"
                      >
                        {resendingVerification ? "Sending Link..." : "Resend Verification Link"}
                      </Button>
                      {verificationFeedback && (
                        <p
                          className={`text-[10px] text-center font-medium leading-tight ${verificationFeedback.type === "success"
                              ? "text-emerald-600"
                              : "text-rose-600"
                            }`}
                        >
                          {verificationFeedback.text}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </Card>

            {/* Right Card: Edit Form */}
            <Card variant="elevated" className="md:col-span-2 p-6 space-y-6 bg-white border-indigo-100/80">
              <div>
                <h2 className="text-base font-bold text-slate-900 font-outfit">
                  Personal Information
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Update your display name and review your registered account details.
                </p>
              </div>

              {profileMsg && (
                <div
                  className={`p-3.5 rounded-xl border text-xs flex items-center gap-2.5 ${profileMsg.type === "success"
                      ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                      : "bg-rose-50 border-rose-200 text-rose-800"
                    }`}
                >
                  {profileMsg.type === "success" ? (
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                  ) : (
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  )}
                  <span>{profileMsg.text}</span>
                </div>
              )}

              <form onSubmit={handleSaveProfile} className="space-y-4">
                <Input
                  label="Full Name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Johnathan Sterling"
                  required
                />

                <Input
                  label="Email Address"
                  type="email"
                  value={user?.email || ""}
                  disabled
                  helperText="Your email address is your unique identity key and cannot be edited directly for audit security."
                />

                <div className="pt-2 flex justify-end">
                  <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                    isLoading={savingProfile}
                  >
                    <Save className="w-4 h-4 mr-1.5" />
                    <span>Save Changes</span>
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        )}

        {/* Tab 2: Email Notifications */}
        {activeTab === "notifications" && (
          <div className="space-y-6">
            <Card variant="elevated" className="p-6 space-y-6 bg-white border-indigo-100/80">
              <div>
                <div className="flex items-center gap-2">
                  <Mail className="w-5 h-5 text-blue-600" />
                  <h2 className="text-base font-bold text-slate-900 font-outfit">
                    Email Notification Preferences
                  </h2>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Control which newsletters, news updates, and promotions are sent to <strong>{user?.email}</strong>.
                </p>
              </div>

              {notifMsg && (
                <div
                  className={`p-3.5 rounded-xl border text-xs flex items-center gap-2.5 ${notifMsg.type === "success"
                      ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                      : "bg-rose-50 border-rose-200 text-rose-800"
                    }`}
                >
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span>{notifMsg.text}</span>
                </div>
              )}

              <form onSubmit={handleSaveNotifications} className="space-y-6">
                {/* Master Email Notification Toggle */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50/70 via-indigo-50/50 to-purple-50/40 border border-blue-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900">
                        Receive Email Notifications
                      </span>
                      <Badge variant={receiveNotifications ? "brand" : "outline"}>
                        {receiveNotifications ? "Active" : "Disabled"}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      This setting matches the choice you made during registration. When switched off, all non-critical emails will be suppressed.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setReceiveNotifications(!receiveNotifications)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${receiveNotifications ? "bg-blue-600" : "bg-slate-300"
                      }`}
                    role="switch"
                    aria-checked={receiveNotifications}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${receiveNotifications ? "translate-x-5" : "translate-x-0"
                        }`}
                    />
                  </button>
                </div>

                {/* Sub-Notification Settings */}
                <div className={`space-y-4 transition-opacity ${receiveNotifications ? "opacity-100" : "opacity-50 pointer-events-none"}`}>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Email Categories &amp; Alerts
                  </h3>

                  {/* 1. News & Announcements */}
                  <div className="p-4 rounded-xl border border-slate-200 bg-white flex items-center justify-between gap-4 hover:border-blue-200 transition-colors">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-blue-600" />
                        <span className="text-xs font-bold text-slate-800">
                          News &amp; Announcements
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500">
                        Receive platform news, astrological articles, cosmic numerology calculation insights, and general announcements.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setNotifyEmail(!notifyEmail)}
                      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ${notifyEmail ? "bg-blue-600" : "bg-slate-300"
                        }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition duration-200 ${notifyEmail ? "translate-x-4" : "translate-x-0"
                          }`}
                      />
                    </button>
                  </div>

                  {/* 2. Special Promotions & Package Discounts */}
                  <div className="p-4 rounded-xl border border-slate-200 bg-white flex items-center justify-between gap-4 hover:border-blue-200 transition-colors">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-purple-600" />
                        <span className="text-xs font-bold text-slate-800">
                          Special Promotions &amp; Package Discounts
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500">
                        Be the first to learn about seasonal credit package discounts, calculation formula bumps, and new feature launches.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setNotifyMarketing(!notifyMarketing)}
                      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ${notifyMarketing ? "bg-blue-600" : "bg-slate-300"
                        }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition duration-200 ${notifyMarketing ? "translate-x-4" : "translate-x-0"
                          }`}
                      />
                    </button>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                    isLoading={savingNotifications}
                  >
                    <Save className="w-4 h-4 mr-1.5" />
                    <span>Save Preferences</span>
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        )}

        {/* Tab 3: Security */}
        {activeTab === "security" && (
          <div className="space-y-6">
            <Card variant="elevated" className="p-6 space-y-6 bg-white border-indigo-100/80 max-w-2xl">
              <div>
                <div className="flex items-center gap-2">
                  <KeyRound className="w-5 h-5 text-blue-600" />
                  <h2 className="text-base font-bold text-slate-900 font-outfit">
                    Change Password
                  </h2>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Your password is cryptographically secured with memory-hard Argon2id hashing according to OWASP guidelines.
                </p>
              </div>

              {passwordMsg && (
                <div
                  className={`p-3.5 rounded-xl border text-xs flex items-center gap-2.5 ${passwordMsg.type === "success"
                      ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                      : "bg-rose-50 border-rose-200 text-rose-800"
                    }`}
                >
                  {passwordMsg.type === "success" ? (
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                  ) : (
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  )}
                  <span>{passwordMsg.text}</span>
                </div>
              )}

              <form onSubmit={handleSavePassword} className="space-y-4">
                <Input
                  label="Current Password"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />

                <Input
                  label="New Password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Minimum 8 characters"
                  required
                />

                <Input
                  label="Confirm New Password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-type new password"
                  required
                />

                <div className="pt-2 flex justify-end">
                  <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                    isLoading={savingPassword}
                  >
                    <Lock className="w-4 h-4 mr-1.5" />
                    <span>Update Password</span>
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        )}

        {/* Tab 4: Billing & Plan */}
        {activeTab === "billing" && (
          <div className="space-y-6">
            <Card variant="elevated" className="p-6 space-y-6 bg-white border-indigo-100/80">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-base font-bold text-slate-900 font-outfit">
                    Analysis Credits & Entitlements
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Your real-time credit balance across specific name calculation tiers.
                  </p>
                </div>
                <Link href="/pricing">
                  <Button variant="gradient" size="sm">
                    <Sparkles className="w-4 h-4 mr-1.5" />
                    <span>Purchase Credit Packages</span>
                  </Button>
                </Link>
              </div>

              {/* Credit Breakdown Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-100">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-600">First Name Credits</span>
                    <Badge variant="brand">First Name</Badge>
                  </div>
                  <div className="text-2xl font-black text-blue-700 mt-2">
                    {entitlements?.balances.firstName ?? 0}
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 block">Individual given name analysis</span>
                </div>

                <div className="p-4 rounded-xl bg-indigo-50/50 border border-indigo-100">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-600">Surname Credits</span>
                    <Badge variant="indigo">Surname</Badge>
                  </div>
                  <div className="text-2xl font-black text-indigo-700 mt-2">
                    {entitlements?.balances.surname ?? 0}
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 block">Family surname energetic resonance</span>
                </div>

                <div className="p-4 rounded-xl bg-purple-50/50 border border-purple-100">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-600">Combined Credits</span>
                    <Badge variant="gold">Full Name Pair</Badge>
                  </div>
                  <div className="text-2xl font-black text-purple-700 mt-2">
                    {entitlements?.balances.combined ?? 0}
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 block">Unified full name harmony calculation</span>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
                <p>Looking for your past name analysis calculations and saved reports?</p>
                <Link href="/analysis-history" className="text-blue-600 font-bold hover:underline inline-flex items-center gap-1">
                  <span>View Complete Analysis History</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-white text-slate-500 text-xs">
          Loading settings...
        </div>
      }
    >
      <SettingsContent />
    </Suspense>
  );
}
