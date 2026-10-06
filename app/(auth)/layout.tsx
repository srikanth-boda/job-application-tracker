import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { ROUTES } from "@/constants/routes";
import { getSessionUser } from "@/lib/auth/server-auth";

export default async function AuthLayout({ children }: { children: ReactNode }) {
  if (await getSessionUser()) redirect(ROUTES.dashboard);
  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center gap-4 p-6">
      {children}
    </main>
  );
}
