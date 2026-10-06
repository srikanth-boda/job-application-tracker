"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { format, isToday } from "date-fns";
import {
  FileText,
  Send,
  Calendar,
  Star,
  XCircle,
  MinusCircle,
  Plus,
  Target,
  Info,
  MoreHorizontal,
  ArrowUpRight,
  ArrowDownRight,
  ArrowRight,
  Building2,
} from "lucide-react";
import { applicationService } from "@/services/applications/application-service";
import { useAuth } from "@/features/auth/auth-context";
import type { Application } from "@/types/application";
import { APPLICATION_STATUS_LABELS } from "@/constants/application-statuses";
import { APPLICATION_SOURCE_LABELS } from "@/constants/application-sources";
import { ROUTES } from "@/constants/routes";

const DAILY_GOAL = 10;
const OVERALL_PROGRESS_TARGET = 25;

// ─────────────────────────── helpers ──────────────────────────────────────

function getTimeOfDay(): "morning" | "afternoon" | "evening" {
  const h = new Date().getHours();
  if (h < 12) return "morning";
  if (h < 17) return "afternoon";
  return "evening";
}

function getGreetingEmoji(t: "morning" | "afternoon" | "evening") {
  if (t === "morning") return "👋";
  if (t === "afternoon") return "☀️";
  return "🌙";
}

function getFormattedDate() {
  return format(new Date(), "EEE, MMM d, yyyy");
}

// ─────────────────────────── status badge styles ─────────────────────────

const STATUS_CONFIG: Record<
  string,
  { bg: string; text: string; label: string }
> = {
  applied: {
    bg: "bg-[#DCFCE7]",
    text: "text-[#15803D]",
    label: "Applied",
  },
  recruiter_response: {
    bg: "bg-[#FFEDD5]",
    text: "text-[#C2410C]",
    label: "Recruiter Response",
  },
  screening: {
    bg: "bg-[#FEF3C7]",
    text: "text-[#D97706]",
    label: "Screening",
  },
  interview: {
    bg: "bg-[#EEF2FF]",
    text: "text-[#4F46E5]",
    label: "Interview",
  },
  offer: {
    bg: "bg-[#ECFDF5]",
    text: "text-[#059669]",
    label: "Offer",
  },
  rejected: {
    bg: "bg-[#FEE2E2]",
    text: "text-[#DC2626]",
    label: "Rejected",
  },
  withdrawn: {
    bg: "bg-[#F1F5F9]",
    text: "text-[#64748B]",
    label: "Not Selected",
  },
  saved: {
    bg: "bg-[#F1F5F9]",
    text: "text-[#475569]",
    label: "Saved",
  },
  accepted: {
    bg: "bg-[#DCFCE7]",
    text: "text-[#15803D]",
    label: "Accepted",
  },
};

// ─────────────────────────── Legend Items ────────────────────────────────

const PROGRESS_LEGEND = [
  { key: "applied", label: "Applied", color: "#3B82F6" },
  { key: "recruiter_response", label: "Recruiter Response", color: "#60A5FA" },
  { key: "screening", label: "Screening", color: "#A855F7" },
  { key: "interview", label: "Interview", color: "#F59E0B" },
  { key: "offer", label: "Offer", color: "#10B981" },
  { key: "rejected", label: "Rejected", color: "#EF4444" },
  { key: "withdrawn", label: "Not Selected", color: "#94A3B8" },
];

// ─────────────────────────── Circular Donut Chart ────────────────────────

function ProgressDonut({
  total,
  goal,
}: {
  total: number;
  goal: number;
}) {
  const size = 150;
  const strokeWidth = 15;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const cx = size / 2;
  const cy = size / 2;

  const pct = goal > 0 ? Math.min(total / goal, 1) : 0;
  const dashOffset = circumference - pct * circumference;
  const displayPct = Math.round(pct * 100);

  return (
    <div className="relative flex items-center justify-center">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="transform -rotate-90"
        aria-label={`Overall progress: ${total} of ${goal} applications`}
        role="img"
      >
        {/* Track */}
        <circle
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          stroke="#F1F5F9"
          strokeWidth={strokeWidth}
        />
        {/* Progress Arc */}
        <circle
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          stroke="#00C5A0"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          className="transition-all duration-700 ease-out"
        />
      </svg>
      {/* Centered text */}
      <div className="absolute flex flex-col items-center justify-center text-center">
        <span className="text-[26px] font-extrabold text-slate-900 leading-none">
          {displayPct}%
        </span>
        <span className="text-[11.5px] font-medium text-slate-400 mt-1">
          {total} of {goal}
        </span>
      </div>
    </div>
  );
}

// ─────────────────────────── Brand & Source Logos ─────────────────────────

function CompanyLogo({ company }: { company: string }) {
  const c = company.toLowerCase().trim();

  if (c.includes("google")) {
    return (
      <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-white shadow-xs ring-1 ring-slate-100">
        <svg width="17" height="17" viewBox="0 0 24 24" aria-label="Google logo">
          <path
            fill="#4285F4"
            d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
          />
          <path
            fill="#34A853"
            d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"
          />
          <path
            fill="#FBBC05"
            d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.17 0 9.97 0 12s.45 3.83 1.25 5.42l4.03-3.15z"
          />
          <path
            fill="#EA4335"
            d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
          />
        </svg>
      </div>
    );
  }

  if (c.includes("microsoft")) {
    return (
      <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-white shadow-xs ring-1 ring-slate-100">
        <svg width="15" height="15" viewBox="0 0 21 21" aria-label="Microsoft logo">
          <rect x="1" y="1" width="9" height="9" fill="#f25022" />
          <rect x="11" y="1" width="9" height="9" fill="#7fba00" />
          <rect x="1" y="11" width="9" height="9" fill="#00a4ef" />
          <rect x="11" y="11" width="9" height="9" fill="#ffb900" />
        </svg>
      </div>
    );
  }

  if (c.includes("amazon")) {
    return (
      <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-[#131921] text-white">
        <span className="text-[10px] font-black tracking-tighter text-[#FF9900]">a</span>
        <span className="text-[10px] font-bold text-white tracking-tighter">a</span>
      </div>
    );
  }

  if (c.includes("meta")) {
    return (
      <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-[#0081FB] text-white">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 15.2c-1.8 0-3.3-1.4-3.7-3.2.4-1.8 1.9-3.2 3.7-3.2s3.3 1.4 3.7 3.2c-.4 1.8-1.9 3.2-3.7 3.2zm-6.5-3.2c0-2.4 1.7-4.4 4.1-4.8C10.5 5.8 11.2 5 12 5s1.5.8 2.4 2.2c2.4.4 4.1 2.4 4.1 4.8 0 2.8-2.2 5-5 5-1.1 0-2.1-.4-2.9-1-1.3 1-3.2.9-4.5-.4-.7-.7-1.1-1.6-1.1-2.6z"/>
        </svg>
      </div>
    );
  }

  if (c.includes("tcs") || c.includes("tata")) {
    return (
      <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-white shadow-xs ring-1 ring-slate-100">
        <span className="text-[9px] font-extrabold text-[#E50914] tracking-tighter">tcs</span>
      </div>
    );
  }

  // Fallback branded initial
  return (
    <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 text-[11.5px] font-bold uppercase ring-1 ring-indigo-100">
      {company.charAt(0)}
    </div>
  );
}

function SourceBadge({ source }: { source: string }) {
  if (source === "linkedin") {
    return (
      <div className="inline-flex items-center gap-1.5 text-[12px] font-medium text-slate-600">
        <div className="flex h-4.5 w-4.5 items-center justify-center rounded bg-[#0A66C2] text-white">
          <span className="text-[9px] font-bold leading-none">in</span>
        </div>
        <span>LinkedIn</span>
      </div>
    );
  }

  if (source === "company_portal") {
    return (
      <div className="inline-flex items-center gap-1.5 text-[12px] font-medium text-slate-600">
        <div className="flex h-4.5 w-4.5 items-center justify-center rounded bg-[#0A66C2] text-white">
          <Building2 className="h-3 w-3" />
        </div>
        <span>Company Portal</span>
      </div>
    );
  }

  if (source === "naukri") {
    return (
      <div className="inline-flex items-center gap-1.5 text-[12px] font-medium text-slate-600">
        <div className="flex h-4.5 w-4.5 items-center justify-center rounded-full bg-[#E53E3E] text-white">
          <span className="text-[8px] font-black leading-none">N</span>
        </div>
        <span>Naukri</span>
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-1 text-[12px] font-medium text-slate-600">
      <span>{APPLICATION_SOURCE_LABELS[source as keyof typeof APPLICATION_SOURCE_LABELS] ?? source}</span>
    </div>
  );
}

function getAppDate(a: Application): Date | null {
  if (a.appliedDate && typeof (a.appliedDate as { toDate?: () => Date }).toDate === "function") {
    return (a.appliedDate as { toDate: () => Date }).toDate();
  }
  if (a.appliedDate instanceof Date) {
    return a.appliedDate;
  }
  if (a.appliedAt) {
    const d = new Date(a.appliedAt);
    if (!isNaN(d.getTime())) return d;
  }
  if (a.createdAt) {
    const d = new Date(a.createdAt);
    if (!isNaN(d.getTime())) return d;
  }
  return null;
}

// ─────────────────────────── Main Dashboard Page ──────────────────────────

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [appsLoading, setAppsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading || !user) return;
    setAppsLoading(true);
    const unsubscribe = applicationService.subscribe(
      user.uid,
      (apps) => {
        setApplications(apps);
        setAppsLoading(false);
      },
      (err) => {
        setError(err.message ?? "Failed to load applications");
        setAppsLoading(false);
      },
    );
    return () => unsubscribe();
  }, [user, authLoading]);

  // ── Stats Calculations ──────────────────────────────────────────────────
  const total = applications.length;
  const applied = applications.filter((a) => a.status === "applied").length;
  const interviews = applications.filter((a) => a.status === "interview" || a.status === "screening").length;
  const offers = applications.filter((a) => a.status === "offer" || a.status === "accepted").length;
  const rejected = applications.filter((a) => a.status === "rejected").length;
  const notSelected = applications.filter((a) => a.status === "withdrawn").length;

  // Weekly deltas
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const thisWeek = (pred: (a: Application) => boolean) =>
    applications.filter((a) => {
      const d = getAppDate(a);
      return d && pred(a) && d >= oneWeekAgo;
    }).length;

  const totalThisWeek = applications.filter((a) => {
    const d = getAppDate(a);
    return d && d >= oneWeekAgo;
  }).length;
  const appliedThisWeek = thisWeek((a) => a.status === "applied");
  const interviewsThisWeek = thisWeek((a) => a.status === "interview" || a.status === "screening");
  const offersThisWeek = thisWeek((a) => a.status === "offer" || a.status === "accepted");
  const rejectedThisWeek = thisWeek((a) => a.status === "rejected");
  const notSelectedThisWeek = thisWeek((a) => a.status === "withdrawn");

  // Daily Goal Stats
  const todayCount = applications.filter((a) => {
    const d = getAppDate(a);
    return d && isToday(d);
  }).length;
  const dailyPct = Math.min(todayCount / DAILY_GOAL, 1);
  const remaining = Math.max(DAILY_GOAL - todayCount, 0);

  // Overall Progress Legend Breakdown
  const legendCounts = PROGRESS_LEGEND.map(({ key }) => ({
    key,
    count: applications.filter((a) => a.status === key).length,
  }));

  // Recent 5 Applications
  const recent = [...applications].slice(0, 5);

  const isLoading = authLoading || appsLoading;

  // Greeting & Name
  const tod = getTimeOfDay();
  const rawName =
    user?.displayName ||
    (user?.email?.includes("@") ? user.email!.split("@")[0] : user?.email) ||
    "User";
  // Capitalize nicely
  const displayName = rawName.charAt(0).toUpperCase() + rawName.slice(1);

  // Skeleton component
  const Skeleton = ({ className }: { className?: string }) => (
    <div className={`animate-pulse rounded-lg bg-slate-100 ${className ?? ""}`} />
  );

  // Stat cards definition matching image
  const statCards = [
    {
      id: "stat-total",
      label: "Total Applications",
      value: total,
      delta: totalThisWeek,
      icon: FileText,
      iconBg: "bg-[#EEF2FF]",
      iconColor: "text-blue-600",
      trend: "up" as const,
    },
    {
      id: "stat-applied",
      label: "Applied",
      value: applied,
      delta: appliedThisWeek,
      icon: Send,
      iconBg: "bg-[#E0F2FE]",
      iconColor: "text-blue-500",
      trend: "up" as const,
    },
    {
      id: "stat-interviews",
      label: "Interviews",
      value: interviews,
      delta: interviewsThisWeek,
      icon: Calendar,
      iconBg: "bg-[#EEF2FF]",
      iconColor: "text-indigo-500",
      trend: "up" as const,
    },
    {
      id: "stat-offers",
      label: "Offers",
      value: offers,
      delta: offersThisWeek,
      icon: Star,
      iconBg: "bg-[#ECFDF5]",
      iconColor: "text-emerald-500",
      trend: "neutral" as const,
    },
    {
      id: "stat-rejected",
      label: "Rejected",
      value: rejected,
      delta: rejectedThisWeek,
      icon: XCircle,
      iconBg: "bg-[#FEF2F2]",
      iconColor: "text-red-500",
      trend: "down" as const,
    },
    {
      id: "stat-not-selected",
      label: "Not Selected",
      value: notSelected,
      delta: notSelectedThisWeek,
      icon: MinusCircle,
      iconBg: "bg-[#F8FAFC]",
      iconColor: "text-slate-400",
      trend: "neutral" as const,
    },
  ];

  return (
    <div className="flex flex-col gap-6 max-w-[1280px] mx-auto pb-10">
      {/* ── Error Notification ─────────────────────────────────────────── */}
      {error && (
        <div
          role="alert"
          className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 shadow-xs"
        >
          {error}
        </div>
      )}

      {/* ── Top Greeting Header ────────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-[26px] font-bold text-slate-900 tracking-tight flex items-center gap-2">
            Good {tod}, {displayName}!{" "}
            <span aria-hidden="true">{getGreetingEmoji(tod)}</span>
          </h1>
          <p className="mt-1 text-[13.5px] text-slate-500">
            Here&apos;s your job search overview. Keep going — you&apos;re making progress!
          </p>
        </div>

        <div className="flex items-center gap-4 flex-wrap">
          <span className="text-[13px] font-medium text-slate-500 whitespace-nowrap">
            {getFormattedDate()}
          </span>
          <Link
            href={ROUTES.newApplication}
            id="dashboard-add-application"
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-[13.5px] font-semibold text-white shadow-sm shadow-indigo-100 hover:bg-indigo-500 transition-colors whitespace-nowrap"
          >
            <Plus className="h-4 w-4" strokeWidth={2.5} aria-hidden />
            <span>Add New Application</span>
          </Link>
        </div>
      </div>

      {/* ── 6 Stat Cards ───────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.id}
              id={card.id}
              className="rounded-2xl border border-slate-100 bg-white p-4.5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-medium text-slate-500 leading-tight">
                  {card.label}
                </span>
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-xl ${card.iconBg}`}
                >
                  <Icon className={`h-4 w-4 ${card.iconColor}`} />
                </div>
              </div>

              <div className="mt-3">
                {isLoading ? (
                  <>
                    <Skeleton className="h-8 w-12 mb-2" />
                    <Skeleton className="h-4 w-20" />
                  </>
                ) : (
                  <>
                    <div className="text-[28px] font-bold text-slate-900 leading-none">
                      {card.value}
                    </div>
                    <div className="mt-2 flex items-center gap-1 text-[11.5px] font-medium">
                      {card.trend === "up" && (
                        <span className="flex items-center gap-0.5 text-[#10B981]">
                          <ArrowUpRight className="h-3.5 w-3.5" />
                          <span>+{card.delta} this week</span>
                        </span>
                      )}
                      {card.trend === "down" && (
                        <span className="flex items-center gap-0.5 text-[#EF4444]">
                          <ArrowDownRight className="h-3.5 w-3.5" />
                          <span>+{card.delta} this week</span>
                        </span>
                      )}
                      {card.trend === "neutral" && (
                        <span className="flex items-center gap-0.5 text-slate-400">
                          <ArrowDownRight className="h-3.5 w-3.5" />
                          <span>+0 this week</span>
                        </span>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Middle Row: Overall Progress + Daily Goal ─────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.85fr_1.15fr] gap-5 items-stretch">
        {/* Overall Progress */}
        <div
          id="overall-progress"
          className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm flex flex-col justify-between"
        >
          <div>
            <h2 className="text-[16px] font-bold text-slate-900">
              Overall Progress
            </h2>
            <p className="text-[12.5px] text-slate-400 mt-0.5">
              Your complete job search journey
            </p>
          </div>

          <div className="mt-6 flex items-center gap-10 flex-wrap sm:flex-nowrap">
            {/* Donut Chart */}
            <div className="flex-shrink-0 mx-auto sm:mx-0">
              {isLoading ? (
                <div className="h-[150px] w-[150px] rounded-full animate-pulse bg-slate-100" />
              ) : (
                <ProgressDonut
                  total={total}
                  goal={OVERALL_PROGRESS_TARGET}
                />
              )}
            </div>

            {/* Legend breakdown list */}
            <div className="flex-1 w-full min-w-[220px]">
              <div className="flex flex-col gap-2.5">
                {PROGRESS_LEGEND.map(({ key, label, color }) => {
                  const count = legendCounts.find((l) => l.key === key)?.count ?? 0;
                  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
                  return (
                    <div
                      key={key}
                      className="flex items-center justify-between text-[13px]"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span
                          className="h-2 w-2 rounded-full flex-shrink-0"
                          style={{ backgroundColor: color }}
                        />
                        <span className="font-medium text-slate-600 truncate">
                          {label}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        {isLoading ? (
                          <Skeleton className="h-4 w-10" />
                        ) : (
                          <>
                            <span className="font-semibold text-slate-800 w-5 text-right">
                              {count}
                            </span>
                            <span className="text-slate-400 text-[11.5px] w-10 text-right">
                              ({pct}%)
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Daily Goal */}
        <div
          id="daily-goal"
          className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm flex flex-col justify-between gap-5"
        >
          <div>
            <div className="flex items-center gap-2 text-slate-900">
              <Target className="h-4.5 w-4.5 text-indigo-500" strokeWidth={2.2} />
              <h2 className="text-[16px] font-bold text-slate-900">
                Daily Goal
              </h2>
            </div>
            <p className="text-[12.5px] text-slate-400 mt-1">
              {DAILY_GOAL} applications per day
            </p>
          </div>

          {/* Progress Bar & Counter */}
          <div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
              {isLoading ? (
                <div className="h-2.5 w-1/2 rounded-full bg-slate-200 animate-pulse" />
              ) : (
                <div
                  id="daily-goal-bar"
                  className="h-2.5 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-700"
                  style={{ width: `${dailyPct * 100}%` }}
                  role="progressbar"
                  aria-valuenow={todayCount}
                  aria-valuemin={0}
                  aria-valuemax={DAILY_GOAL}
                />
              )}
            </div>

            <div className="mt-2.5 flex items-center justify-between">
              {isLoading ? (
                <Skeleton className="h-4 w-32" />
              ) : (
                <>
                  <span className="text-[13.5px] font-bold text-slate-900">
                    {todayCount} / {DAILY_GOAL}{" "}
                    <span className="font-normal text-slate-500 text-[12.5px]">
                      applications
                    </span>
                  </span>
                  <span className="text-[12px] font-medium text-slate-400">
                    {remaining} remaining
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Info callout */}
          {!isLoading && (
            <div className="rounded-xl bg-[#EFF6FF] border border-[#DBEAFE] p-3.5 flex items-start gap-2.5">
              <Info className="h-4 w-4 text-[#3B82F6] flex-shrink-0 mt-0.5" aria-hidden />
              <p className="text-[12px] text-slate-600 leading-relaxed">
                {remaining === 0
                  ? "🎉 Outstanding! You've achieved your daily goal for today!"
                  : `Keep going! You're ${remaining} application${remaining !== 1 ? "s" : ""} away from your daily goal.`}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ── Recent Applications Table ──────────────────────────────────── */}
      <section
        id="recent-applications"
        className="rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden"
      >
        {/* Card Header */}
        <div className="px-6 py-5 border-b border-slate-100">
          <h2 className="text-[16px] font-bold text-slate-900">
            Recent Applications
          </h2>
          <p className="text-[12.5px] text-slate-400 mt-0.5">
            Your latest job applications
          </p>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-7 w-7 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
          </div>
        ) : recent.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-sm text-slate-500">
              No applications yet.{" "}
              <Link
                href={ROUTES.newApplication}
                className="font-semibold text-indigo-600 hover:underline"
              >
                Add your first application →
              </Link>
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-[#F8FAFC] border-b border-slate-100 text-[11.5px] font-semibold uppercase tracking-wider text-slate-400">
                    <th className="py-3.5 px-6">Company</th>
                    <th className="py-3.5 px-6">Role</th>
                    <th className="py-3.5 px-6 whitespace-nowrap">Applied On</th>
                    <th className="py-3.5 px-6">Status</th>
                    <th className="py-3.5 px-6">Resume Used</th>
                    <th className="py-3.5 px-6">Source</th>
                    <th className="py-3.5 px-6 text-right"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recent.map((app) => {
                    const cfg = STATUS_CONFIG[app.status] ?? {
                      bg: "bg-slate-100",
                      text: "text-slate-600",
                      label:
                        APPLICATION_STATUS_LABELS[
                          app.status as keyof typeof APPLICATION_STATUS_LABELS
                        ] ?? app.status,
                    };

                    return (
                      <tr
                        key={app.id}
                        className="hover:bg-slate-50/75 transition-colors group"
                      >
                        {/* Company */}
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <CompanyLogo company={app.company} />
                            <span className="text-[13.5px] font-bold text-slate-900">
                              {app.company}
                            </span>
                          </div>
                        </td>

                        {/* Role */}
                        <td className="py-4 px-6">
                          <div className="text-[13px] font-semibold text-slate-800">
                            {app.jobTitle}
                          </div>
                          {app.location && (
                            <div className="text-[11.5px] text-slate-400 mt-0.5">
                              {app.location}
                            </div>
                          )}
                        </td>

                        {/* Applied On */}
                        <td className="py-4 px-6 text-[12.5px] font-medium text-slate-500 whitespace-nowrap">
                          {app.appliedAt
                            ? format(new Date(app.appliedAt), "MMM d, yyyy")
                            : "—"}
                        </td>

                        {/* Status Badge */}
                        <td className="py-4 px-6">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11.5px] font-semibold ${cfg.bg} ${cfg.text}`}
                          >
                            <span className="text-[10px] leading-none">★</span>
                            {cfg.label}
                          </span>
                        </td>

                        {/* Resume Used */}
                        <td className="py-4 px-6 text-[12.5px] font-medium text-slate-500">
                          {app.resumeName ?? "—"}
                        </td>

                        {/* Source */}
                        <td className="py-4 px-6">
                          <SourceBadge source={app.source} />
                        </td>

                        {/* Options */}
                        <td className="py-4 px-6 text-right">
                          <button
                            className="inline-flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
                            aria-label={`Options for ${app.company}`}
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* View All Footer */}
            <div className="border-t border-slate-100 px-6 py-4">
              <Link
                href={ROUTES.applications}
                id="view-all-applications"
                className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-indigo-600 hover:text-indigo-500 transition-colors"
              >
                <span>View all applications</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
