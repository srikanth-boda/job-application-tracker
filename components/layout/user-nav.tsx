"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Loader2 } from "lucide-react";
import { ROUTES } from "@/constants/routes";
import { useAuth } from "@/features/auth";

export function UserNav({ fallbackEmail }: { fallbackEmail: string | null }) {
  const router = useRouter();
  const { user, signOut: authSignOut } = useAuth();
  const [loggingOut, setLoggingOut] = useState(false);

  const email = user?.email || fallbackEmail || "User";
  const displayName = user?.displayName || (email.includes("@") ? email.split("@")[0] : email) || "User";
  const initial = displayName.charAt(0).toUpperCase() || "U";

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      await authSignOut();
      router.push(ROUTES.login);
      router.refresh();
    } catch (err) {
      console.error("Logout failed:", err);
      // Fallback redirect even on failure
      window.location.href = ROUTES.login;
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-xs font-semibold text-indigo-700">
          {initial}
        </div>
        <div className="hidden sm:flex sm:flex-col sm:items-start text-left">
          <span className="text-xs font-semibold text-slate-900 leading-tight">
            {displayName}
          </span>
          <span className="text-[11px] text-slate-500 leading-tight">{email}</span>
        </div>
      </div>

      <div className="h-4 w-px bg-slate-200" aria-hidden="true" />

      <button
        onClick={handleLogout}
        disabled={loggingOut}
        className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors disabled:opacity-60"
        title="Sign out"
      >
        {loggingOut ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin text-slate-400" />
        ) : (
          <LogOut className="h-3.5 w-3.5 text-slate-500" />
        )}
        <span className="hidden sm:inline">Log out</span>
      </button>
    </div>
  );
}
