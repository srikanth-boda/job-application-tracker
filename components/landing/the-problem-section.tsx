import { Mail, Bookmark, FileText, Download } from "lucide-react";
import { SpreadsheetsIcon, WhatsAppIcon } from "./icons";

export function TheProblemSection() {
  const scatteredSources = [
    {
      label: "Spreadsheets",
      icon: <SpreadsheetsIcon className="h-6 w-6 text-emerald-600" />,
      bg: "bg-emerald-50 text-emerald-600",
    },
    {
      label: "Emails",
      icon: <Mail className="h-6 w-6 text-blue-500" />,
      bg: "bg-blue-50 text-blue-500",
    },
    {
      label: "Bookmarks",
      icon: <Bookmark className="h-6 w-6 text-indigo-500" />,
      bg: "bg-indigo-50 text-indigo-500",
    },
    {
      label: "Notes",
      icon: <FileText className="h-6 w-6 text-amber-500" />,
      bg: "bg-amber-50 text-amber-500",
    },
    {
      label: "WhatsApp",
      icon: <WhatsAppIcon className="h-6 w-6" />,
      bg: "bg-emerald-50",
    },
    {
      label: "Downloads",
      icon: <Download className="h-6 w-6 text-blue-500" />,
      bg: "bg-blue-50 text-blue-500",
    },
  ];

  return (
    <section id="problem" className="py-16 sm:py-20 lg:py-24 border-t border-slate-100 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Left Column: 2x3 Grid of Scattered Sources */}
          <div className="lg:col-span-6 xl:col-span-5 order-2 lg:order-1">
            <div className="grid grid-cols-3 gap-3 sm:gap-4 max-w-md mx-auto lg:max-w-none">
              {scatteredSources.map((item) => (
                <div
                  key={item.label}
                  className="flex flex-col items-center justify-center rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-5 shadow-xs hover:shadow-md hover:border-slate-300 transition-all text-center aspect-square"
                >
                  <div
                    className={`flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-xl ${item.bg} mb-2 shadow-2xs`}
                  >
                    {item.icon}
                  </div>
                  <span className="text-xs font-semibold text-slate-700 tracking-tight">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Problem Headline & Truth Statement */}
          <div className="lg:col-span-6 xl:col-span-7 order-1 lg:order-2 text-left">
            <span className="text-xs font-bold tracking-widest text-blue-600 uppercase block mb-3">
              THE PROBLEM
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-snug max-w-xl">
              Job applications get scattered across spreadsheets, emails, bookmarks, and notes.
            </h2>
            <p className="mt-5 text-xl sm:text-2xl font-bold text-blue-600 tracking-tight">
              One application = one source of truth.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
