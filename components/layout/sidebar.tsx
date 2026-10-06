"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { isToday } from "date-fns";
import { Plus, Target, ChevronRight } from "lucide-react";
import { ROUTES } from "@/constants/routes";
import { useAuth } from "@/features/auth";
import { applicationService } from "@/services/applications/application-service";
import type { Application } from "@/types/application";
import { cn } from "@/utils/cn";
import { NAV_ITEMS } from "./nav-items";

const DAILY_GOAL = 10;

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);

  useEffect(() => {
    if (!user) return;
    const unsubscribe = applicationService.subscribe(
      user.uid,
      (apps) => setApplications(apps),
      () => {},
    );
    return () => unsubscribe();
  }, [user]);

  const displayName =
    user?.displayName ||
    (user?.email?.includes("@") ? user.email.split("@")[0] : user?.email) ||
    "User";
  const email = user?.email || "";
  
  // Format initials
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase() || "U";

  const todayCount = applications.filter((a) => {
    let d: Date | null = null;
    if (a.appliedDate && typeof (a.appliedDate as { toDate?: () => Date }).toDate === "function") {
      d = (a.appliedDate as { toDate: () => Date }).toDate();
    } else if (a.appliedDate instanceof Date) {
      d = a.appliedDate;
    } else if (a.appliedAt) {
      const parsed = new Date(a.appliedAt);
      if (!isNaN(parsed.getTime())) d = parsed;
    } else if (a.createdAt) {
      const parsed = new Date(a.createdAt);
      if (!isNaN(parsed.getTime())) d = parsed;
    }
    return d ? isToday(d) : false;
  }).length;
  const dailyPct = Math.min(todayCount / DAILY_GOAL, 1);
  const remaining = Math.max(DAILY_GOAL - todayCount, 0);

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push(ROUTES.login);
      router.refresh();
    } catch {
      window.location.href = ROUTES.login;
    }
  };

  // Split nav items to place "+ Add New Application" right after Applications
  const firstNavItems = NAV_ITEMS.slice(0, 2); // Dashboard, Applications
  const restNavItems = NAV_ITEMS.slice(2); // Interviews, Offers, Rejected, Not Selected, Resume / Documents, Settings

  return (
    <aside
      aria-label="Main Navigation"
      className="flex w-64 flex-col border-r border-slate-100 bg-white min-h-screen select-none"
      style={{ flexShrink: 0 }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-6 py-5">
        <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center flex-shrink-0 shadow-sm shadow-indigo-200">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M12 2L3 7v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5z"
              fill="white"
              fillOpacity="0.2"
            />
            <path
              d="M12 2L3 7v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5z"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M9 12l2 2 4-4"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <span className="text-lg font-bold text-slate-900 tracking-tight">
          JobTrack
        </span>
      </div>

      {/* Nav links */}
      <div className="flex flex-col gap-1 px-3.5 py-2">
        {firstNavItems.map(({ label, href, icon: Icon }) => {
          const active =
            pathname === href || (href !== "/" && pathname.startsWith(`${href}/`));
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex items-center gap-3.5 rounded-xl px-3.5 py-2.5 text-[13.5px] font-medium transition-all duration-150",
                active
                  ? "bg-[#EEF2FF] text-indigo-600 font-semibold"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
              )}
            >
              <Icon
                className={cn(
                  "h-4.5 w-4.5 flex-shrink-0",
                  active ? "text-indigo-600" : "text-slate-400",
                )}
                style={{ width: 18, height: 18 }}
                aria-hidden
              />
              <span>{label}</span>
            </Link>
          );
        })}

        {/* Add New Application button right after Applications */}
        <div className="my-1 px-0.5">
          <Link
            href={ROUTES.newApplication}
            id="sidebar-add-application"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-[13.5px] font-semibold text-white shadow-sm shadow-indigo-100 hover:bg-indigo-500 transition-colors"
          >
            <Plus className="h-4 w-4" strokeWidth={2.5} aria-hidden />
            <span>Add New Application</span>
          </Link>
        </div>

        {restNavItems.map(({ label, href, icon: Icon }) => {
          const active =
            pathname === href || (href !== "/" && pathname.startsWith(`${href}/`));
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex items-center gap-3.5 rounded-xl px-3.5 py-2.5 text-[13.5px] font-medium transition-all duration-150",
                active
                  ? "bg-[#EEF2FF] text-indigo-600 font-semibold"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
              )}
            >
              <Icon
                className={cn(
                  "h-4.5 w-4.5 flex-shrink-0",
                  active ? "text-indigo-600" : "text-slate-400",
                )}
                style={{ width: 18, height: 18 }}
                aria-hidden
              />
              <span>{label}</span>
            </Link>
          );
        })}
      </div>

      {/* Spacer */}
      <div className="flex-1 min-h-6" />

      {/* Daily Goal mini widget */}
      <div className="px-4 pb-4">
        <div className="rounded-2xl bg-[#F8FAFC] border border-slate-100 p-4">
          <div className="flex items-center gap-1.5 mb-1 text-slate-700">
            <Target className="h-4 w-4 text-indigo-500" strokeWidth={2.2} aria-hidden />
            <span className="text-[12px] font-bold text-slate-800">
              Daily Goal
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mb-1.5">Today&apos;s Progress</p>
          <div
            id="sidebar-daily-goal-display"
            className="text-[19px] font-bold text-slate-900 mb-2"
          >
            {todayCount} / {DAILY_GOAL}
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
            <div
              id="sidebar-daily-goal-bar"
              className="h-2 rounded-full bg-indigo-500 transition-all duration-500"
              style={{ width: `${dailyPct * 100}%` }}
            />
          </div>
          <p className="mt-2.5 text-[11px] text-slate-500 leading-snug">
            {remaining === 0
              ? "Goal achieved! Outstanding job today!"
              : `You're ${remaining} application${remaining !== 1 ? "s" : ""} away from reaching your goal!`}
          </p>
        </div>
      </div>

      {/* User footer */}
      <div className="border-t border-slate-100 p-3">
        <button
          onClick={handleSignOut}
          className="flex w-full items-center gap-3 rounded-xl p-2 text-left hover:bg-slate-50 transition-colors group"
          title="Click to sign out"
          id="sidebar-user-profile"
        >
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-slate-900 text-[12px] font-bold text-white shadow-sm">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-bold text-slate-900 truncate leading-snug">
              {displayName}
            </p>
            <p className="text-[11px] text-slate-400 truncate leading-none mt-0.5">{email}</p>
          </div>
          <ChevronRight className="h-4 w-4 text-slate-400 flex-shrink-0 group-hover:text-slate-600 transition-colors" />
        </button>
      </div>
    </aside>
  );
}
