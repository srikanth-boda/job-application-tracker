"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Building2,
  Briefcase,
  Globe,
  MapPin,
  Calendar,
  FileText,
  Upload,
  AlertCircle,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { APPLICATION_SOURCES, APPLICATION_SOURCE_LABELS } from "@/constants/application-sources";
import { APPLICATION_STATUSES, APPLICATION_STATUS_LABELS } from "@/constants/application-statuses";
import { ROUTES } from "@/constants/routes";
import { useAuth } from "@/features/auth";
import { createApplicationSchema, type CreateApplicationInput } from "@/schemas/application.schema";
import { applicationService } from "@/services/applications/application-service";
import { resumeService } from "@/services/resumes/resume-service";

interface ApplicationFormProps {
  onSuccess?: () => void;
  defaultValues?: Partial<CreateApplicationInput>;
}

export function ApplicationForm({ onSuccess, defaultValues }: ApplicationFormProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<string | null>(null);

  const today = new Date().toISOString().slice(0, 10);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateApplicationInput>({
    resolver: zodResolver(createApplicationSchema),
    defaultValues: {
      company: defaultValues?.company || "",
      companyName: defaultValues?.companyName || "",
      jobTitle: defaultValues?.jobTitle || "",
      source: defaultValues?.source || "linkedin",
      status: defaultValues?.status || "applied",
      appliedAt: defaultValues?.appliedAt || today,
      location: defaultValues?.location || "",
      jobUrl: defaultValues?.jobUrl || null,
      notes: defaultValues?.notes || "",
      jobDescriptionSnapshot: defaultValues?.jobDescriptionSnapshot || "",
      resumeName: defaultValues?.resumeName || "",
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== "application/pdf") {
        setFormError("Only PDF resume files are accepted.");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setFormError("Resume file size must be 5MB or less.");
        return;
      }
      setFormError(null);
      setSelectedFile(file);
    }
  };

  const onSubmit = async (data: CreateApplicationInput) => {
    if (!user) {
      setFormError("You must be logged in to create an application.");
      return;
    }

    try {
      setIsSubmitting(true);
      setFormError(null);

      let resumeUrl: string | null = null;
      let resumeName: string | null = data.resumeName?.trim() || null;
      let resumeId: string | null = null;

      // If the user selected a PDF file, upload to Firebase Storage
      if (selectedFile) {
        setUploadProgress("Uploading resume to storage...");
        const uploadResult = await resumeService.upload(user.uid, selectedFile, selectedFile.name);
        resumeUrl = uploadResult.downloadUrl;
        resumeName = selectedFile.name;
        resumeId = uploadResult.id;
      }

      setUploadProgress("Saving application to Firestore...");

      await applicationService.createApplication(user.uid, {
        ...data,
        company: data.company?.trim() || data.companyName?.trim() || "",
        companyName: data.companyName?.trim() || data.company?.trim() || "",
        jobTitle: data.jobTitle.trim(),
        appliedAt: data.appliedAt || today,
        resumeUrl: resumeUrl || undefined,
        resumeName: resumeName || undefined,
        resumeId: resumeId || undefined,
      });

      if (onSuccess) {
        onSuccess();
      } else {
        router.push(ROUTES.dashboard);
        router.refresh();
      }
    } catch (err: unknown) {
      console.error("Failed to create application:", err);
      const errorMsg = err instanceof Error ? err.message : "Failed to create application";
      setFormError(errorMsg);
    } finally {
      setIsSubmitting(false);
      setUploadProgress(null);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      id="add-application-form"
      className="space-y-6 max-w-2xl bg-white rounded-2xl border border-slate-100 p-6 md:p-8 shadow-sm"
    >
      {formError && (
        <div
          role="alert"
          className="flex items-center gap-2.5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 font-medium"
        >
          <AlertCircle className="h-4.5 w-4.5 flex-shrink-0 text-red-500" />
          <span>{formError}</span>
        </div>
      )}

      {/* Grid: Company & Job Title */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label htmlFor="company" className="block text-sm font-semibold text-slate-800 mb-1.5">
            Company Name <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
            <input
              id="company"
              type="text"
              placeholder="e.g. Google, Stripe"
              {...register("company")}
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none transition-all"
            />
          </div>
          {errors.company && (
            <p className="mt-1 text-xs text-red-600 font-medium">{errors.company.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="jobTitle" className="block text-sm font-semibold text-slate-800 mb-1.5">
            Job Title <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
            <input
              id="jobTitle"
              type="text"
              placeholder="e.g. Senior Frontend Engineer"
              {...register("jobTitle")}
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none transition-all"
            />
          </div>
          {errors.jobTitle && (
            <p className="mt-1 text-xs text-red-600 font-medium">{errors.jobTitle.message}</p>
          )}
        </div>
      </div>

      {/* Grid: Status & Source */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label htmlFor="status" className="block text-sm font-semibold text-slate-800 mb-1.5">
            Application Status
          </label>
          <select
            id="status"
            {...register("status")}
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 px-3.5 text-sm text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none transition-all"
          >
            {APPLICATION_STATUSES.map((status) => (
              <option key={status} value={status}>
                {APPLICATION_STATUS_LABELS[status]}
              </option>
            ))}
          </select>
          {errors.status && (
            <p className="mt-1 text-xs text-red-600 font-medium">{errors.status.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="source" className="block text-sm font-semibold text-slate-800 mb-1.5">
            Application Source
          </label>
          <select
            id="source"
            {...register("source")}
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 px-3.5 text-sm text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none transition-all"
          >
            {APPLICATION_SOURCES.map((source) => (
              <option key={source} value={source}>
                {APPLICATION_SOURCE_LABELS[source]}
              </option>
            ))}
          </select>
          {errors.source && (
            <p className="mt-1 text-xs text-red-600 font-medium">{errors.source.message}</p>
          )}
        </div>
      </div>

      {/* Grid: Applied Date & Location */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label htmlFor="appliedAt" className="block text-sm font-semibold text-slate-800 mb-1.5">
            Date Applied
          </label>
          <div className="relative">
            <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
            <input
              id="appliedAt"
              type="date"
              {...register("appliedAt")}
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none transition-all"
            />
          </div>
          {errors.appliedAt && (
            <p className="mt-1 text-xs text-red-600 font-medium">{errors.appliedAt.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="location" className="block text-sm font-semibold text-slate-800 mb-1.5">
            Location / Work Mode
          </label>
          <div className="relative">
            <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
            <input
              id="location"
              type="text"
              placeholder="e.g. Remote, Mountain View, CA"
              {...register("location")}
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none transition-all"
            />
          </div>
          {errors.location && (
            <p className="mt-1 text-xs text-red-600 font-medium">{errors.location.message}</p>
          )}
        </div>
      </div>

      {/* Job URL */}
      <div>
        <label htmlFor="jobUrl" className="block text-sm font-semibold text-slate-800 mb-1.5">
          Job Posting URL <span className="text-xs font-normal text-slate-400">(Optional)</span>
        </label>
        <div className="relative">
          <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
          <input
            id="jobUrl"
            type="url"
            placeholder="https://..."
            {...register("jobUrl")}
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none transition-all"
          />
        </div>
        {errors.jobUrl && (
          <p className="mt-1 text-xs text-red-600 font-medium">{errors.jobUrl.message}</p>
        )}
      </div>

      {/* Resume Upload / Resume Name */}
      <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/50 p-4">
        <label className="block text-sm font-semibold text-slate-800 mb-1">
          Resume PDF <span className="text-xs font-normal text-slate-400">(Saved to Firebase Storage)</span>
        </label>
        <p className="text-xs text-slate-500 mb-3">
          Upload a PDF resume (max 5MB). Stored securely in Firebase Storage with URL linked.
        </p>

        <div className="flex items-center gap-3 flex-wrap">
          <label
            htmlFor="resume-file-input"
            className="cursor-pointer inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-xs font-semibold text-slate-700 border border-slate-200 hover:bg-slate-50 transition-colors shadow-2xs"
          >
            <Upload className="h-3.5 w-3.5 text-slate-500" />
            <span>{selectedFile ? "Change PDF File" : "Choose PDF Resume"}</span>
          </label>
          <input
            id="resume-file-input"
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="hidden"
          />

          {selectedFile ? (
            <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium bg-emerald-50 px-2.5 py-1.5 rounded-lg border border-emerald-100">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>{selectedFile.name} ({(selectedFile.size / 1024).toFixed(0)} KB)</span>
            </div>
          ) : (
            <input
              id="resumeName"
              type="text"
              placeholder="Or enter resume name (e.g. React Dev v3.pdf)"
              {...register("resumeName")}
              className="flex-1 min-w-[200px] rounded-xl border border-slate-200 bg-white py-1.5 px-3 text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none"
            />
          )}
        </div>
      </div>

      {/* Notes */}
      <div>
        <label htmlFor="notes" className="block text-sm font-semibold text-slate-800 mb-1.5">
          Notes & Key Takeaways <span className="text-xs font-normal text-slate-400">(Optional)</span>
        </label>
        <textarea
          id="notes"
          rows={3}
          placeholder="Recruiter contact, interview timeline, referral details..."
          {...register("notes")}
          className="w-full rounded-xl border border-slate-200 bg-white p-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none transition-all resize-y"
        />
        {errors.notes && (
          <p className="mt-1 text-xs text-red-600 font-medium">{errors.notes.message}</p>
        )}
      </div>

      {/* Job Description Snapshot */}
      <div>
        <label htmlFor="jobDescriptionSnapshot" className="block text-sm font-semibold text-slate-800 mb-1.5">
          Job Description Snapshot <span className="text-xs font-normal text-slate-400">(Optional)</span>
        </label>
        <textarea
          id="jobDescriptionSnapshot"
          rows={4}
          placeholder="Paste full job description for interview prep and keyword matching..."
          {...register("jobDescriptionSnapshot")}
          className="w-full rounded-xl border border-slate-200 bg-white p-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none transition-all resize-y"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
        <button
          type="button"
          onClick={() => router.back()}
          disabled={isSubmitting}
          className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          id="submit-application-btn"
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm shadow-indigo-100 hover:bg-indigo-500 transition-colors disabled:opacity-75"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>{uploadProgress || "Saving..."}</span>
            </>
          ) : (
            <>
              <FileText className="h-4 w-4" />
              <span>Save Application</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
