import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { ROUTES } from "@/constants/routes";
import { getSessionUser } from "@/lib/auth/server-auth";

/** Authoritative auth gate: verifies the session cookie with the Admin SDK. */
export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const user = await getSessionUser();
  if (!user) redirect(ROUTES.login);
  return <AppShell userEmail={user.email}>{children}</AppShell>;
}
