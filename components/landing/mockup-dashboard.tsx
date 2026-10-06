import {
  Search,
  LayoutDashboard,
  Briefcase,
  FileText,
  Calendar,
  CheckSquare,
  BarChart3,
  Settings,
  ChevronRight,
  Plus,
} from "lucide-react";
import {
  GoogleLogo,
  MicrosoftLogo,
  AmazonLogo,
  MetaLogo,
  TcsLogo,
} from "./icons";
import { cn } from "@/utils/cn";

interface MockupDashboardProps {
  variant?: "hero" | "preview";
  className?: string;
}

export function MockupDashboard({ variant = "hero", className }: MockupDashboardProps) {
  const isHero = variant === "hero";

  const rows = [
    {
      company: "Google",
      role: "Software Engineer",
      logo: <GoogleLogo className="h-4 w-4 shrink-0" />,
      status: "Interview",
      statusStyle: "bg-blue-50 text-blue-700 border-blue-200/70",
      date: "Apr 12, 2025",
    },
    {
      company: "Microsoft",
      role: "Frontend Developer",
      logo: <MicrosoftLogo className="h-4 w-4 shrink-0" />,
      status: "Screening",
      statusStyle: "bg-amber-50 text-amber-700 border-amber-200/70",
      date: "Apr 10, 2025",
    },
    {
      company: "Amazon",
      role: "SDE Intern",
      logo: <AmazonLogo className="h-4 w-4 shrink-0" />,
      status: "Applied",
      statusStyle: "bg-emerald-50 text-emerald-700 border-emerald-200/70",
      date: "Apr 8, 2025",
    },
    {
      company: "Meta",
      role: "Frontend Engineer",
      logo: <MetaLogo className="h-4 w-4 shrink-0" />,
      status: "Recruiter Response",
      statusStyle: "bg-orange-50 text-orange-700 border-orange-200/70",
      date: "Apr 3, 2025",
    },
    {
      company: "TCS",
      role: "Software Developer",
      logo: <TcsLogo className="h-4 w-4 shrink-0" />,
      status: "Saved",
      statusStyle: "bg-slate-100 text-slate-700 border-slate-200",
      date: "Apr 1, 2025",
    },
  ];

  return (
    <div
      className={cn(
        "rounded-2xl border border-slate-200/80 bg-white p-3 sm:p-4 text-left shadow-2xl shadow-slate-300/40 select-none overflow-hidden",
        className,
      )}
    >
      {/* Top Bar: Search & Avatar */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3 gap-2">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <input
            readOnly
            tabIndex={-1}
            type="text"
            placeholder={isHero ? "Search companies, roles..." : "Search..."}
            className="w-full rounded-md border border-slate-200 bg-slate-50/70 py-1 pl-8 pr-3 text-[11px] sm:text-xs text-slate-600 placeholder-slate-400 focus:outline-none pointer-events-none"
          />
        </div>
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 sm:h-7 sm:w-7 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 p-0.5 flex items-center justify-center text-white text-[10px] sm:text-xs font-semibold shadow-xs">
            <span className="leading-none">JD</span>
          </div>
        </div>
      </div>

      {/* Main Container: Sidebar + Content */}
      <div className="flex gap-3 sm:gap-4 min-h-[300px]">
        {/* Left Mini Sidebar */}
        <div className="w-24 sm:w-28 shrink-0 flex flex-col gap-1 border-r border-slate-100 pr-2">
          {/* Logo */}
          <div className="flex items-center gap-1.5 px-1 py-1 mb-1">
            <div className="h-4 w-4 rounded-md bg-blue-600 flex items-center justify-center text-white text-[8px] font-bold">
              J
            </div>
            <span className="text-[11px] font-bold text-slate-900 tracking-tight">JobTrack</span>
          </div>

          <div
            className={cn(
              "flex items-center gap-1.5 rounded-md px-2 py-1 text-[11px] font-medium transition-colors",
              isHero ? "bg-blue-50 text-blue-600 font-semibold" : "text-slate-600",
            )}
          >
            <LayoutDashboard className="h-3 w-3" />
            <span>Dashboard</span>
          </div>

          <div
            className={cn(
              "flex items-center gap-1.5 rounded-md px-2 py-1 text-[11px] font-medium transition-colors",
              !isHero ? "bg-blue-50 text-blue-600 font-semibold" : "text-slate-600",
            )}
          >
            <Briefcase className="h-3 w-3" />
            <span>Applications</span>
          </div>

          <div className="flex items-center gap-1.5 rounded-md px-2 py-1 text-[11px] font-medium text-slate-600">
            <FileText className="h-3 w-3" />
            <span>Resumes</span>
          </div>

          <div className="flex items-center gap-1.5 rounded-md px-2 py-1 text-[11px] font-medium text-slate-600">
            <Calendar className="h-3 w-3" />
            <span>Interviews</span>
          </div>

          <div className="flex items-center gap-1.5 rounded-md px-2 py-1 text-[11px] font-medium text-slate-600">
            <CheckSquare className="h-3 w-3" />
            <span>Tasks</span>
          </div>

          <div className="flex items-center gap-1.5 rounded-md px-2 py-1 text-[11px] font-medium text-slate-600">
            <BarChart3 className="h-3 w-3" />
            <span>Analytics</span>
          </div>

          <div className="flex items-center gap-1.5 rounded-md px-2 py-1 text-[11px] font-medium text-slate-600 mt-auto">
            <Settings className="h-3 w-3" />
            <span>Settings</span>
          </div>
        </div>

        {/* Right Main Panel */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header Row */}
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs sm:text-sm font-bold text-slate-900">
              {isHero ? "My Applications" : "Applications"}
            </h4>
            {!isHero && (
              <button
                type="button"
                className="inline-flex items-center gap-1 rounded-md bg-blue-600 px-2.5 py-1 text-[11px] font-medium text-white shadow-xs pointer-events-none"
              >
                <Plus className="h-3 w-3" />
                <span>Add Application</span>
              </button>
            )}
          </div>

          {/* Metric Stats Cards (Hero Variant) */}
          {isHero && (
            <div className="grid grid-cols-4 gap-2 mb-3">
              <div className="rounded-lg border border-slate-100 bg-slate-50/70 p-1.5 text-center">
                <span className="text-[10px] text-slate-500 block">Total</span>
                <span className="text-xs sm:text-sm font-bold text-slate-900">12</span>
              </div>
              <div className="rounded-lg border border-slate-100 bg-slate-50/70 p-1.5 text-center">
                <span className="text-[10px] text-slate-500 block">Active</span>
                <span className="text-xs sm:text-sm font-bold text-emerald-600">8</span>
              </div>
              <div className="rounded-lg border border-slate-100 bg-slate-50/70 p-1.5 text-center">
                <span className="text-[10px] text-slate-500 block">Interviews</span>
                <span className="text-xs sm:text-sm font-bold text-blue-600">3</span>
              </div>
              <div className="rounded-lg border border-slate-100 bg-slate-50/70 p-1.5 text-center">
                <span className="text-[10px] text-slate-500 block">Offers</span>
                <span className="text-xs sm:text-sm font-bold text-slate-900">1</span>
              </div>
            </div>
          )}

          {/* Table Container */}
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-[10px] font-semibold text-slate-400">
                  <th className="pb-1.5 font-medium">Company / Role</th>
                  <th className="pb-1.5 font-medium">Status</th>
                  <th className="pb-1.5 font-medium text-right sm:text-left">Applied On</th>
                  <th className="pb-1.5 w-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-[11px]">
                {rows.map((row) => (
                  <tr key={row.company} className="group hover:bg-slate-50/50 transition-colors">
                    <td className="py-2 pr-2">
                      <div className="flex items-center gap-2">
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-slate-100 bg-white p-0.5 shadow-xs">
                          {row.logo}
                        </div>
                        <div className="leading-tight">
                          <span className="font-semibold text-slate-900 block truncate max-w-[90px] sm:max-w-[120px]">
                            {row.company}
                          </span>
                          <span className="text-[10px] text-slate-500 block truncate max-w-[90px] sm:max-w-[120px]">
                            {row.role}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-2 pr-2 whitespace-nowrap">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium",
                          row.statusStyle,
                        )}
                      >
                        <span className="h-1 w-1 rounded-full bg-current opacity-80" />
                        {row.status}
                      </span>
                    </td>
                    <td className="py-2 text-[10px] text-slate-500 whitespace-nowrap text-right sm:text-left">
                      {row.date}
                    </td>
                    <td className="py-2 text-right text-slate-300 group-hover:text-slate-400">
                      <ChevronRight className="h-3 w-3 inline" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
