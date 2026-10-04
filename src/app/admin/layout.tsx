import React from "react";
import { requireAdmin } from "@/lib/auth/rbac";
import { AdminShell } from "@/components/admin/AdminShell";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Enforces server-side ADMIN authorization guard
  const user = await requireAdmin("/admin/dashboard");

  return <AdminShell user={user}>{children}</AdminShell>;
}

