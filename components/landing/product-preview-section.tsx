import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ROUTES } from "@/constants/routes";
import { MockupDashboard } from "./mockup-dashboard";

export function ProductPreviewSection() {
  return (
    <section className="py-16 sm:py-20 lg:py-24 border-t border-slate-100 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-200/70 bg-slate-50/60 p-6 sm:p-10 lg:p-14">
          <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-12 xl:gap-16">
            {/* Left Column: Dashboard Preview */}
            <div className="lg:col-span-7 order-2 lg:order-1">
              <div className="relative mx-auto max-w-2xl lg:max-w-none transform transition-transform hover:scale-[1.01] duration-300">
                <MockupDashboard variant="preview" />
              </div>
            </div>

            {/* Right Column: Copy & Link */}
            <div className="lg:col-span-5 order-1 lg:order-2 text-left">
              <span className="text-xs font-bold tracking-widest text-blue-600 uppercase block mb-3">
                PRODUCT PREVIEW
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                A clean dashboard for your job search.
              </h2>
              <p className="mt-4 text-base text-slate-600 leading-relaxed">
                See all your applications, upcoming interviews, follow-ups and more — at a glance.
              </p>
              <div className="mt-8">
                <Link
                  href={ROUTES.dashboard}
                  className="group inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white px-6 py-3 text-sm font-semibold text-blue-600 shadow-xs hover:bg-blue-50/50 hover:border-blue-300 transition-all hover:gap-3"
                >
                  <span>Explore the Product</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
