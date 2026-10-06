"use client";

import { Search, Bell } from "lucide-react";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import { useAuth } from "@/features/auth";

export function TopBar({ fallbackEmail }: { fallbackEmail: string | null }) {
  const { user, signOut } = useAuth();
  const router = useRouter();

  const email = user?.email || fallbackEmail || "";
  const displayName =
    user?.displayName ||
    (email.includes("@") ? email.split("@")[0] : email) ||
    "John Doe";
  
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase() || "JD";

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push(ROUTES.login);
      router.refresh();
    } catch {
      window.location.href = ROUTES.login;
    }
  };

  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-100 bg-white px-8 gap-4 flex-shrink-0">
      {/* Search Bar */}
      <div className="flex items-center gap-2 flex-1 max-w-lg">
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
          <input
            type="search"
            placeholder="Search applications, companies, roles..."
            className="w-full rounded-xl border border-transparent bg-[#F1F5F9] py-2 pl-10 pr-4 text-[13.5px] text-slate-700 placeholder:text-slate-400 focus:border-indigo-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all"
            id="topbar-search"
          />
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-4">
        {/* Bell Notifications */}
        <button
          className="relative flex h-9 w-9 items-center justify-center rounded-full text-slate-600 hover:bg-slate-100 transition-colors"
          aria-label="Notifications"
          id="topbar-notifications"
        >
          <Bell className="h-5 w-5" style={{ width: 19, height: 19 }} />
          {/* Red dot badge */}
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
        </button>

        {/* User avatar */}
        <button
          onClick={handleSignOut}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-[12px] font-bold text-white shadow-sm hover:opacity-90 transition-opacity"
          title="Click to sign out"
          id="topbar-user-menu"
        >
          {initials}
        </button>
      </div>
    </header>
  );
}

