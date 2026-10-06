"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import {
  Plus,
  Search,
  Trash2,
  ExternalLink,
  Building2,
  Calendar,
  FileText,
  Filter,
} from "lucide-react";
import { APPLICATION_SOURCES, APPLICATION_SOURCE_LABELS } from "@/constants/application-sources";
import { APPLICATION_STATUSES, APPLICATION_STATUS_LABELS, type ApplicationStatus } from "@/constants/application-statuses";
import { ROUTES } from "@/constants/routes";
import { useAuth } from "@/features/auth";
import { applicationService } from "@/services/applications/application-service";
import type { Application } from "@/types/application";

const STATUS_BADGE_STYLES: Record<string, { bg: string; text: string }> = {
  applied: { bg: "bg-[#DCFCE7]", text: "text-[#15803D]" },
  recruiter_response: { bg: "bg-[#FFEDD5]", text: "text-[#C2410C]" },
  screening: { bg: "bg-[#FEF3C7]", text: "text-[#D97706]" },
  interview: { bg: "bg-[#EEF2FF]", text: "text-[#4F46E5]" },
  offer: { bg: "bg-[#ECFDF5]", text: "text-[#059669]" },
  rejected: { bg: "bg-[#FEE2E2]", text: "text-[#DC2626]" },
  withdrawn: { bg: "bg-[#F1F5F9]", text: "text-[#64748B]" },
  saved: { bg: "bg-[#F1F5F9]", text: "text-[#475569]" },
  accepted: { bg: "bg-[#DCFCE7]", text: "text-[#15803D]" },
};

export default function ApplicationsPage() {
  const { user, loading: authLoading } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedSource, setSelectedSource] = useState<string>("all");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading || !user) return;
    setLoading(true);

    const unsubscribe = applicationService.subscribe(
      user.uid,
      (apps) => {
        setApplications(apps);
        setLoading(false);
      },
      (err) => {
        setError(err.message || "Failed to load applications");
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, [user, authLoading]);

  const handleDelete = async (id: string) => {
    if (!user) return;
    if (!confirm("Are you sure you want to delete this application?")) return;

    try {
      setDeletingId(id);
      await applicationService.deleteApplication(id, user.uid);
    } catch (err: unknown) {
      console.error("Failed to delete application:", err);
      alert(err instanceof Error ? err.message : "Failed to delete application");
    } finally {
      setDeletingId(null);
    }
  };

  const handleStatusChange = async (app: Application, newStatus: ApplicationStatus) => {
    if (!user || app.status === newStatus) return;
    try {
      await applicationService.changeStatus(app.id, user.uid, newStatus, app.status);
    } catch (err: unknown) {
      console.error("Failed to change status:", err);
      alert(err instanceof Error ? err.message : "Failed to update status");
    }
  };

  const filteredApplications = useMemo(() => {
    return applications.filter((app) => {
      const company = (app.companyName || app.company || "").toLowerCase();
      const jobTitle = (app.jobTitle || "").toLowerCase();
      const location = (app.location || "").toLowerCase();
      const query = searchQuery.toLowerCase().trim();

      const matchesSearch =
        !query || company.includes(query) || jobTitle.includes(query) || location.includes(query);

      const matchesStatus = selectedStatus === "all" || app.status === selectedStatus;
      const matchesSource = selectedSource === "all" || app.source === selectedSource;

      return matchesSearch && matchesStatus && matchesSource;
    });
  }, [applications, searchQuery, selectedStatus, selectedSource]);

  return (
    <div className="max-w-[1280px] mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Applications</h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage, filter, and track all your job applications in real-time.
          </p>
        </div>

        <Link
          href={ROUTES.newApplication}
          id="btn-new-application"
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition-colors"
        >
          <Plus className="h-4 w-4" strokeWidth={2.5} />
          <span>New Application</span>
        </Link>
      </div>

      {error && (
        <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
        {/* Search */}
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
          <input
            type="search"
            placeholder="Search company, job title, or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-indigo-500 focus:outline-none transition-all"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="h-4 w-4 text-slate-400 hidden sm:block" />
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full sm:w-auto rounded-xl border border-slate-200 bg-white py-2 px-3 text-sm text-slate-700 focus:border-indigo-500 focus:outline-none"
          >
            <option value="all">All Statuses ({applications.length})</option>
            {APPLICATION_STATUSES.map((status) => {
              const count = applications.filter((a) => a.status === status).length;
              return (
                <option key={status} value={status}>
                  {APPLICATION_STATUS_LABELS[status]} ({count})
                </option>
              );
            })}
          </select>

          {/* Source Filter */}
          <select
            value={selectedSource}
            onChange={(e) => setSelectedSource(e.target.value)}
            className="w-full sm:w-auto rounded-xl border border-slate-200 bg-white py-2 px-3 text-sm text-slate-700 focus:border-indigo-500 focus:outline-none"
          >
            <option value="all">All Sources</option>
            {APPLICATION_SOURCES.map((source) => (
              <option key={source} value={source}>
                {APPLICATION_SOURCE_LABELS[source]}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Applications List Table */}
      <div className="rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-7 w-7 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
          </div>
        ) : filteredApplications.length === 0 ? (
          <div className="py-20 text-center px-4">
            <Building2 className="mx-auto h-12 w-12 text-slate-300 mb-3" />
            <p className="text-base font-semibold text-slate-700">No applications found</p>
            <p className="text-sm text-slate-400 mt-1 max-w-sm mx-auto">
              {searchQuery || selectedStatus !== "all" || selectedSource !== "all"
                ? "Try adjusting your filters or search query."
                : "Get started by adding your first job application to track your progress."}
            </p>
            <Link
              href={ROUTES.newApplication}
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Add Application</span>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-slate-100 text-[11.5px] font-semibold uppercase tracking-wider text-slate-400">
                  <th className="py-3.5 px-6">Company & Role</th>
                  <th className="py-3.5 px-6">Applied Date</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6">Source</th>
                  <th className="py-3.5 px-6">Resume</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredApplications.map((app) => {
                  const company = app.companyName || app.company || "Unknown";
                  const badge = STATUS_BADGE_STYLES[app.status] || {
                    bg: "bg-slate-100",
                    text: "text-slate-600",
                  };

                  let formattedDate = "—";
                  if (app.appliedAt) {
                    try {
                      formattedDate = format(new Date(app.appliedAt), "MMM d, yyyy");
                    } catch {
                      formattedDate = app.appliedAt;
                    }
                  }

                  return (
                    <tr key={app.id} className="hover:bg-slate-50/75 transition-colors group">
                      {/* Company & Role */}
                      <td className="py-4 px-6">
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2">
                            <span className="text-[14px] font-bold text-slate-900">{company}</span>
                            {app.jobUrl && (
                              <a
                                href={app.jobUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-slate-400 hover:text-indigo-600 transition-colors"
                                title="Open Job Posting"
                              >
                                <ExternalLink className="h-3.5 w-3.5" />
                              </a>
                            )}
                          </div>
                          <span className="text-xs font-medium text-slate-600 mt-0.5">{app.jobTitle}</span>
                          {app.location && (
                            <span className="text-[11.5px] text-slate-400">{app.location}</span>
                          )}
                        </div>
                      </td>

                      {/* Applied Date */}
                      <td className="py-4 px-6 text-xs font-medium text-slate-600 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5 text-slate-400" />
                          <span>{formattedDate}</span>
                        </div>
                      </td>

                      {/* Status select */}
                      <td className="py-4 px-6">
                        <select
                          value={app.status}
                          onChange={(e) => handleStatusChange(app, e.target.value as ApplicationStatus)}
                          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${badge.bg} ${badge.text} border border-transparent hover:border-slate-200 focus:outline-none transition-colors cursor-pointer`}
                        >
                          {APPLICATION_STATUSES.map((status) => (
                            <option key={status} value={status} className="bg-white text-slate-900">
                              {APPLICATION_STATUS_LABELS[status]}
                            </option>
                          ))}
                        </select>
                      </td>

                      {/* Source */}
                      <td className="py-4 px-6 text-xs text-slate-600">
                        {APPLICATION_SOURCE_LABELS[app.source as keyof typeof APPLICATION_SOURCE_LABELS] || app.source}
                      </td>

                      {/* Resume */}
                      <td className="py-4 px-6 text-xs text-slate-600">
                        {app.resumeUrl ? (
                          <a
                            href={app.resumeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-indigo-600 hover:underline font-medium"
                          >
                            <FileText className="h-3.5 w-3.5" />
                            <span>{app.resumeName || "View Resume"}</span>
                          </a>
                        ) : app.resumeName ? (
                          <span className="inline-flex items-center gap-1 text-slate-600">
                            <FileText className="h-3.5 w-3.5 text-slate-400" />
                            <span>{app.resumeName}</span>
                          </span>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => handleDelete(app.id)}
                          disabled={deletingId === app.id}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors disabled:opacity-50"
                          title="Delete application"
                          aria-label={`Delete application for ${company}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
