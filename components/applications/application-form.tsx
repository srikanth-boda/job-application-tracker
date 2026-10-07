"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Building2,
  Briefcase,
  Link as LinkIcon,
  Calendar,
  Laptop,
  MapPin,
  RefreshCw,
  FileText,
  CloudUpload,
  Lightbulb,
  FileEdit,
  Save,
  X,
  AlertCircle,
  Loader2,
  CheckCircle2,
} from "lucide-react";
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
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedFileMeta, setSelectedFileMeta] = useState<{
    name: string;
    sizeFormatted: string;
  } | null>({
    name: "Srikanth_Resume.pdf",
    sizeFormatted: "1.2 MB",
  });
  const [isDragging, setIsDragging] = useState(false);
  const [notesLength, setNotesLength] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const today = new Date().toISOString().slice(0, 10);

  const {
    register,
    handleSubmit,
    setValue,
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
      workMode: defaultValues?.workMode || "remote",
      location: defaultValues?.location || "",
      jobUrl: defaultValues?.jobUrl || null,
      notes: defaultValues?.notes || "",
      resumeName: defaultValues?.resumeName || "Srikanth_Resume.pdf",
    },
  });

  const handleFile = (file: File) => {
    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      setFormError("Only PDF resume files are accepted.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setFormError("Resume file size must be 5MB or less.");
      return;
    }
    setFormError(null);
    setSelectedFile(file);
    const sizeInMb = (file.size / (1024 * 1024)).toFixed(1);
    setSelectedFileMeta({
      name: file.name,
      sizeFormatted: `${sizeInMb} MB`,
    });
    setValue("resumeName", file.name);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setSelectedFileMeta(null);
    setValue("resumeName", "");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const onSubmit = async (data: CreateApplicationInput) => {
    if (!user) {
      setFormError("You must be signed in to create an application.");
      return;
    }

    try {
      setIsSubmitting(true);
      setFormError(null);
      setSuccessMessage(null);

      let resumeUrl: string | null = null;
      let resumeName: string | null = selectedFileMeta?.name || data.resumeName?.trim() || null;
      let resumeId: string | null = null;

      // If a real PDF file was provided, upload to Firebase Storage
      if (selectedFile) {
        const uploadResult = await resumeService.upload(user.uid, selectedFile, selectedFile.name);
        resumeUrl = uploadResult.downloadUrl;
        resumeName = selectedFile.name;
        resumeId = uploadResult.id;
      }

      const compName = data.company?.trim() || data.companyName?.trim() || "";

      await applicationService.createApplication(user.uid, {
        ...data,
        company: compName,
        companyName: compName,
        jobTitle: data.jobTitle.trim(),
        appliedAt: data.appliedAt || today,
        location: data.location?.trim() || null,
        workMode: data.workMode?.trim() || null,
        jobUrl: data.jobUrl?.trim() || null,
        notes: data.notes?.trim() || null,
        resumeUrl: resumeUrl || undefined,
        resumeName: resumeName || undefined,
        resumeId: resumeId || undefined,
      });

      setSuccessMessage("Application saved successfully! Redirecting...");

      setTimeout(() => {
        if (onSuccess) {
          onSuccess();
        } else {
          router.push(ROUTES.dashboard);
          router.refresh();
        }
      }, 700);
    } catch (err: unknown) {
      console.error("Failed to save application:", err);
      const errorMsg = err instanceof Error ? err.message : "Failed to create application";
      setFormError(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 select-none" id="new-application-form">
      {/* Alert banner */}
      {formError && (
        <div
          role="alert"
          className="flex items-center gap-3 rounded-2xl border border-rose-200 bg-rose-50/80 p-4 text-sm text-rose-800 font-medium shadow-2xs"
        >
          <AlertCircle className="h-5 w-5 flex-shrink-0 text-rose-500" />
          <span>{formError}</span>
        </div>
      )}

      {successMessage && (
        <div
          role="status"
          className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50/80 p-4 text-sm text-emerald-800 font-medium shadow-2xs"
        >
          <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-emerald-600" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          CARD 1: Basic Information
      ───────────────────────────────────────────────────────────── */}
      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-2xs">
        {/* Card Header */}
        <div className="flex items-center gap-3 pb-5 border-b border-slate-100">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-500">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-[15px] font-bold text-slate-900 tracking-tight">
              Basic Information
            </h2>
            <p className="text-[12px] text-slate-400 mt-0.5">
              Tell us about the job and company.
            </p>
          </div>
        </div>

        {/* Card Fields: 2-column grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-4 pt-5">
          {/* Company * */}
          <div>
            <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
              Company <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
              <input
                type="text"
                placeholder="e.g. Google"
                {...register("company")}
                className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-3.5 text-[13.5px] text-slate-800 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100 transition-all"
              />
            </div>
            {errors.company && (
              <p className="mt-1 text-xs text-rose-500">{errors.company.message}</p>
            )}
          </div>

          {/* Job Title * */}
          <div>
            <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
              Job Title <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
              <input
                type="text"
                placeholder="e.g. Software Engineer"
                {...register("jobTitle")}
                className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-3.5 text-[13.5px] text-slate-800 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100 transition-all"
              />
            </div>
            {errors.jobTitle && (
              <p className="mt-1 text-xs text-rose-500">{errors.jobTitle.message}</p>
            )}
          </div>

          {/* Application Source * */}
          <div>
            <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
              Application Source <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <LinkIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
              <select
                {...register("source")}
                className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-8 text-[13.5px] text-slate-800 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100 transition-all appearance-none cursor-pointer"
              >
                <option value="linkedin">LinkedIn</option>
                <option value="indeed">Indeed</option>
                <option value="company_portal">Company Career Portal</option>
                <option value="naukri">Naukri</option>
                <option value="referral">Referral</option>
                <option value="recruiter">Recruiter</option>
                <option value="internshala">Internshala</option>
                <option value="wellfound">Wellfound</option>
                <option value="other">Other</option>
              </select>
              <div className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </div>
            </div>
          </div>

          {/* Job URL (Optional) */}
          <div>
            <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
              Job URL <span className="text-slate-400 font-normal">(Optional)</span>
            </label>
            <div className="relative">
              <LinkIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
              <input
                type="url"
                placeholder="https://..."
                {...register("jobUrl")}
                className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-3.5 text-[13.5px] text-slate-800 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100 transition-all"
              />
            </div>
            {errors.jobUrl && (
              <p className="mt-1 text-xs text-rose-500">{errors.jobUrl.message}</p>
            )}
          </div>

          {/* Application Date * */}
          <div>
            <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
              Application Date <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
              <input
                type="date"
                {...register("appliedAt")}
                className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-3.5 text-[13.5px] text-slate-800 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100 transition-all cursor-pointer"
              />
            </div>
          </div>

          {/* Work Mode */}
          <div>
            <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
              Work Mode
            </label>
            <div className="relative">
              <Laptop className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
              <select
                {...register("workMode")}
                className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-8 text-[13.5px] text-slate-800 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100 transition-all appearance-none cursor-pointer"
              >
                <option value="remote">Remote</option>
                <option value="on-site">On-site</option>
                <option value="hybrid">Hybrid</option>
              </select>
              <div className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </div>
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
              Location
            </label>
            <div className="relative">
              <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
              <input
                type="text"
                placeholder="e.g. Bangalore, India"
                {...register("location")}
                className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-3.5 text-[13.5px] text-slate-800 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100 transition-all"
              />
            </div>
          </div>

          {/* Current Status * */}
          <div>
            <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
              Current Status <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <RefreshCw className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
              <select
                {...register("status")}
                className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-8 text-[13.5px] text-slate-800 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100 transition-all appearance-none cursor-pointer"
              >
                <option value="applied">Applied</option>
                <option value="screening">Screening</option>
                <option value="interview">Interview</option>
                <option value="offer">Offer</option>
                <option value="saved">Saved</option>
                <option value="rejected">Rejected</option>
                <option value="withdrawn">Not Selected</option>
              </select>
              <div className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          CARD 2: Resume Used *
      ───────────────────────────────────────────────────────────── */}
      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-2xs">
        {/* Card Header */}
        <div className="flex items-center gap-3 pb-5 border-b border-slate-100">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-[15px] font-bold text-slate-900 tracking-tight">
              Resume Used <span className="text-rose-500">*</span>
            </h2>
            <p className="text-[12px] text-slate-400 mt-0.5">
              Upload the exact resume you used for this application.
            </p>
          </div>
        </div>

        {/* Card Body: Left dropzone, Right Why this matters */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 pt-5 items-stretch">
          {/* Left Dropzone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`md:col-span-7 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 text-center transition-all cursor-pointer ${
              isDragging
                ? "border-indigo-400 bg-indigo-50/40"
                : "border-indigo-200/80 bg-[#FAFAFD] hover:bg-[#F5F3FF]/40"
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="application/pdf"
              className="hidden"
            />
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-2xs text-indigo-500 mb-2">
              <CloudUpload className="h-6 w-6" />
            </div>
            <p className="text-[12.5px] font-semibold text-slate-700">
              Drag &amp; drop your PDF here
            </p>
            <p className="text-[11px] text-slate-400 my-1">or</p>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
              className="mt-1 rounded-xl border border-indigo-200 bg-[#F5F3FF] px-4 py-1.5 text-[12px] font-semibold text-indigo-600 shadow-2xs hover:bg-indigo-100 transition-colors"
            >
              Browse from computer
            </button>
            <p className="mt-3 text-[11px] text-slate-400">
              PDF only &bull; Max 5 MB
            </p>
          </div>

          {/* Right: Why this matters + Uploaded File card */}
          <div className="md:col-span-5 flex flex-col justify-between rounded-2xl border border-purple-100/60 bg-[#F8F6FF] p-4.5">
            <div>
              <div className="flex items-center gap-2">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-purple-200/70 text-purple-700">
                  <Lightbulb className="h-3 w-3" />
                </div>
                <h3 className="text-[12px] font-bold text-slate-900 tracking-tight">
                  Why this matters?
                </h3>
              </div>
              <p className="mt-1.5 text-[11.5px] leading-relaxed text-slate-600">
                The exact resume you used helps us keep your{" "}
                <span className="font-semibold text-slate-800">application</span> history accurate
                and lets you track which resume worked best for each job.
              </p>
            </div>

            {/* Selected File Card */}
            {selectedFileMeta ? (
              <div className="mt-4 flex items-center justify-between gap-3 rounded-xl border border-purple-100 bg-white p-3 shadow-2xs">
                <div className="flex items-center gap-2.5 min-w-0">
                  {/* Red PDF Icon badge */}
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-rose-500 text-white shadow-2xs">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <path d="M14 2v6h6" />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <p className="text-[12px] font-bold text-slate-900 truncate max-w-[130px]">
                      {selectedFileMeta.name}
                    </p>
                    <p className="text-[10.5px] text-slate-400">
                      PDF &bull; {selectedFileMeta.sizeFormatted}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleRemoveFile}
                  title="Remove resume"
                  className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="mt-4 rounded-xl border border-dashed border-purple-200/80 bg-white/60 p-3 text-center">
                <p className="text-[11.5px] text-slate-500">No file selected yet</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          CARD 3: Additional Details (Optional)
      ───────────────────────────────────────────────────────────── */}
      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-2xs">
        {/* Card Header */}
        <div className="flex items-center gap-2.5 pb-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
            <FileEdit className="h-4 w-4" />
          </div>
          <h2 className="text-[14px] font-bold text-slate-900 tracking-tight">
            Additional Details <span className="text-slate-400 font-normal">(Optional)</span>
          </h2>
        </div>

        {/* Textarea */}
        <div className="relative">
          <textarea
            rows={4}
            maxLength={500}
            placeholder="Add notes, job description snapshot, or any other details..."
            {...register("notes", {
              onChange: (e) => setNotesLength(e.target.value.length),
            })}
            className="w-full rounded-xl border border-slate-200 bg-white p-3.5 pb-7 text-[13px] text-slate-800 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100 transition-all resize-y min-h-[90px]"
          />
          <div className="absolute right-3 bottom-2.5 text-[11px] text-slate-400 font-medium pointer-events-none">
            {notesLength}/500
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          BOTTOM BUTTONS
      ───────────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={() => router.push(ROUTES.dashboard)}
          className="rounded-xl border border-slate-200 bg-white px-6 py-2.5 text-[13.5px] font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 hover:text-slate-900 transition-colors"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          id="save-application-btn"
          className="flex items-center gap-2 rounded-xl bg-[#0D825F] hover:bg-[#0B6E50] px-6 py-2.5 text-[13.5px] font-semibold text-white shadow-sm transition-all disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Saving Application...</span>
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              <span>Save Application</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
