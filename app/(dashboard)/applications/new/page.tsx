import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ApplicationForm } from "@/components/applications/application-form";
import { ApplicationGuideSidebar } from "@/components/applications/application-guide-sidebar";
import { ROUTES } from "@/constants/routes";

export const metadata = {
  title: "Add New Application | JobTrack",
  description: "Keep track of your job applications and never miss an opportunity.",
};

export default function NewApplicationPage() {
  return (
    <div className="max-w-[1360px] mx-auto pb-16">
      {/* Top Breadcrumb / Back link */}
      <div className="mb-4">
        <Link
          href={ROUTES.dashboard}
          className="inline-flex items-center gap-2 text-[13px] font-medium text-slate-700 hover:text-emerald-700 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 text-slate-600" />
          <span>Back to Dashboard</span>
        </Link>
      </div>

      {/* Page Header with Doodle Slogan */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-[28px] sm:text-[32px] font-extrabold text-[#0F172A] tracking-tight">
            Add New Application
          </h1>
          <p className="mt-1 text-[13.5px] text-slate-500">
            Keep track of your job applications and never miss an opportunity.
          </p>
        </div>

        {/* Playful green doodle: "One step closer to your dream job 🚀" */}
        <div className="hidden sm:flex items-center gap-2 self-start sm:self-center pr-2">
          {/* Curved doodle arrow SVG */}
          <svg
            width="34"
            height="24"
            viewBox="0 0 42 28"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-emerald-600 -rotate-6"
            aria-hidden="true"
          >
            <path
              d="M4 22C14 20 24 14 30 6"
              stroke="#0D825F"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M24 6H30V12"
              stroke="#0D825F"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="text-[13px] font-medium text-[#0D825F] tracking-tight select-none">
            One step closer to your dream job 🚀
          </span>
        </div>
      </div>

      {/* Main 2-column Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form Cards & Actions */}
        <div className="lg:col-span-8">
          <ApplicationForm />
        </div>

        {/* Right Column: Guide & Motivation Cards */}
        <div className="lg:col-span-4">
          <ApplicationGuideSidebar />
        </div>
      </div>
    </div>
  );
}
