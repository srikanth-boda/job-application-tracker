import { PlusSquare, FileText, CheckSquare, ArrowRight } from "lucide-react";

export function HowItWorksSection() {
  const steps = [
    {
      step: 1,
      title: "Add Your Application",
      description: "Enter company, role, source, URL, and more.",
      icon: PlusSquare,
    },
    {
      step: 2,
      title: "Track Progress",
      description: "Update status, interviews, resume details and follow-ups.",
      icon: FileText,
    },
    {
      step: 3,
      title: "Stay on Top",
      description: "Get reminders and never miss an opportunity.",
      icon: CheckSquare,
    },
  ];

  return (
    <section className="py-16 sm:py-20 lg:py-24 border-t border-slate-100 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-14 text-left">
          <span className="text-xs font-bold tracking-widest text-blue-600 uppercase block mb-2">
            HOW IT WORKS
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
            Get started in 3 simple steps.
          </h2>
        </div>

        {/* Steps Flow */}
        <div className="flex flex-col md:flex-row items-start justify-between gap-8 lg:gap-10">
          {steps.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="flex-1 flex flex-col items-start w-full relative"
              >
                <div className="flex items-center gap-3 mb-4">
                  {/* Step Number Circle */}
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white shadow-xs">
                    {item.step}
                  </div>

                  {/* Icon Card */}
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-blue-100 bg-blue-50/70 text-blue-600 shadow-2xs">
                    <Icon className="h-6 w-6" />
                  </div>

                  {/* Arrow Connector on desktop */}
                  {index < steps.length - 1 && (
                    <div className="hidden lg:flex flex-1 justify-center items-center text-slate-300 ml-6">
                      <ArrowRight className="h-5 w-5 text-slate-300" />
                    </div>
                  )}
                </div>

                <div className="text-left max-w-sm">
                  <h3 className="text-base font-bold text-slate-900 mb-1.5">{item.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{item.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
