import {
  Briefcase,
  FileText,
  Calendar,
  CheckSquare,
  BarChart3,
} from "lucide-react";

export function WhatYouCanManageSection() {
  const managementFeatures = [
    {
      title: "Applications",
      description: "Track company, role, source, status and more.",
      icon: Briefcase,
    },
    {
      title: "Resumes",
      description: "Store multiple versions and use the right one for each application.",
      icon: FileText,
    },
    {
      title: "Interviews",
      description: "Keep interview details, links and outcomes organized.",
      icon: Calendar,
    },
    {
      title: "Follow-ups",
      description: "Never miss the next step with task reminders.",
      icon: CheckSquare,
    },
    {
      title: "Insights",
      description: "See your progress with simple, clear analytics.",
      icon: BarChart3,
    },
  ];

  return (
    <section id="features" className="py-16 sm:py-20 lg:py-24 border-t border-slate-100 bg-slate-50/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-12 text-left">
          <span className="text-xs font-bold tracking-widest text-blue-600 uppercase block mb-2">
            WHAT YOU CAN MANAGE
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
            Everything you need, in one place.
          </h2>
        </div>

        {/* 5 Feature Cards Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5 lg:gap-5">
          {managementFeatures.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.title}
                className="group flex flex-col justify-start rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs hover:border-blue-300 hover:shadow-md transition-all"
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl border border-blue-100/80 bg-blue-50/70 text-blue-600 group-hover:scale-105 group-hover:bg-blue-600 group-hover:text-white transition-all">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">{feat.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{feat.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
