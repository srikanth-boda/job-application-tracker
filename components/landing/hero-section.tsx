import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ROUTES } from "@/constants/routes";
import { MockupDashboard } from "./mockup-dashboard";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-10 pb-16 sm:pt-14 sm:pb-20 lg:pt-16 lg:pb-24">
      {/* Background Soft Glow / Ambient Light */}
      <div
        className="pointer-events-none absolute -top-24 right-1/4 h-96 w-96 rounded-full bg-blue-100/50 blur-3xl -z-10"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute top-1/2 -left-20 h-72 w-72 rounded-full bg-indigo-50/60 blur-3xl -z-10"
        aria-hidden="true"
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-8 xl:gap-12">
          {/* Left Column: Copy & Actions */}
          <div className="lg:col-span-6 xl:col-span-5 text-left">
            {/* Pill Badge */}
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-200/80 bg-blue-50/80 px-3.5 py-1 text-xs font-semibold text-blue-600 shadow-xs">
              <span>Your Job Search, Organized</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-[46px] xl:text-5xl leading-[1.15]">
              Track Every Job Application. Stay on Top{" "}
              <span className="text-blue-600 block sm:inline">of Your Job Search.</span>
            </h1>

            {/* Subheading */}
            <p className="mt-5 text-base sm:text-lg text-slate-600 leading-relaxed max-w-lg">
              Keep your applications, resumes, interviews, and follow-ups organized in one place.
            </p>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href={ROUTES.register}
                className="group inline-flex items-center gap-2 rounded-full bg-blue-600 px-6 py-3.5 text-sm sm:text-base font-semibold text-white shadow-md shadow-blue-500/25 hover:bg-blue-700 transition-all hover:gap-3"
              >
                <span>Start Tracking Free</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                href={ROUTES.login}
                className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-7 py-3.5 text-sm sm:text-base font-semibold text-slate-700 shadow-xs hover:bg-slate-50 transition-colors"
              >
                Sign In
              </Link>
            </div>
          </div>

          {/* Right Column: Hero Dashboard Mockup Card */}
          <div className="lg:col-span-6 xl:col-span-7">
            <div className="relative mx-auto max-w-2xl lg:max-w-none">
              <div className="relative transform transition-all duration-300 hover:scale-[1.01]">
                <MockupDashboard variant="hero" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
