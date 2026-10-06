import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ROUTES } from "@/constants/routes";

export function CtaBannerSection() {
  return (
    <section className="py-8 sm:py-12 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-blue-100/90 bg-gradient-to-r from-blue-50/90 via-indigo-50/40 to-blue-50/80 p-8 sm:p-10 lg:p-12 shadow-xs">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
            <div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight">
                Stop losing track of your applications.
              </h2>
              <p className="mt-1 text-sm sm:text-base text-slate-600">
                Start your organized job search today.
              </p>
            </div>
            <div className="shrink-0">
              <Link
                href={ROUTES.register}
                className="group inline-flex items-center gap-2 rounded-full bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white shadow-md shadow-blue-500/20 hover:bg-blue-700 transition-all hover:gap-3"
              >
                <span>Start Tracking Free</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
