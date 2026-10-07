"use client";

import { Target, Star, Zap, Lightbulb, Check } from "lucide-react";

export function ApplicationGuideSidebar() {
  return (
    <div className="space-y-5 select-none">
      {/* 1. What is this? */}
      <div className="relative overflow-hidden rounded-2xl border border-emerald-100/70 bg-gradient-to-br from-[#F0FDF4] via-[#F4FDF7] to-[#ECFDF5] p-5 shadow-2xs">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 pr-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
              <Target className="h-4.5 w-4.5" strokeWidth={2.2} />
            </div>
            <h3 className="mt-3 text-[14px] font-bold text-slate-900 tracking-tight">
              What is this?
            </h3>
            <p className="mt-2 text-[12px] leading-relaxed text-slate-600 max-w-[210px]">
              Track your job applications in one place. Stay organized, be consistent, and take
              control of your career journey.
            </p>
          </div>

          {/* Stylized vector illustration of professional working on laptop */}
          <div className="relative flex-shrink-0 w-28 h-28 self-center">
            <svg
              viewBox="0 0 140 140"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full drop-shadow-sm"
              aria-hidden="true"
            >
              {/* Mint background aura */}
              <circle cx="70" cy="70" r="54" fill="#D1FAE5" fillOpacity="0.6" />
              <path
                d="M108 44C118 56 122 72 114 86C106 100 90 108 74 112C58 116 42 110 32 98C22 86 24 68 34 54C44 40 64 34 82 36C94 38 102 40 108 44Z"
                fill="#A7F3D0"
                fillOpacity="0.4"
              />

              {/* Plant leaves in background */}
              <path
                d="M110 92C110 92 118 78 126 80C126 80 120 92 110 92Z"
                fill="#10B981"
              />
              <path
                d="M112 96C112 96 124 92 128 100C128 100 118 102 112 96Z"
                fill="#059669"
              />

              {/* Desk surface */}
              <path
                d="M20 118C50 115 90 115 125 118"
                stroke="#CBD5E1"
                strokeWidth="2.5"
                strokeLinecap="round"
              />

              {/* Person body (Yellow sweater) */}
              <path
                d="M48 118V102C48 93 54 87 64 87H82C92 87 98 93 98 102V118"
                fill="#FBBF24"
              />

              {/* Person neck */}
              <rect x="68" y="74" width="10" height="14" rx="2" fill="#FCD34D" />

              {/* Person head */}
              <ellipse cx="73" cy="62" rx="13" ry="15" fill="#FDE68A" />

              {/* Dark hair */}
              <path
                d="M59 60C59 47 67 42 77 42C88 42 90 48 90 56C87 56 81 58 78 62C75 58 66 58 59 60Z"
                fill="#1E293B"
              />
              <path
                d="M87 56C91 62 94 72 90 80C86 78 84 72 87 56Z"
                fill="#1E293B"
              />

              {/* Face features (subtle) */}
              <circle cx="78" cy="61" r="1.5" fill="#1E293B" />
              <path
                d="M78 67C80 68 83 67 84 66"
                stroke="#B45309"
                strokeWidth="1.2"
                strokeLinecap="round"
              />

              {/* Laptop */}
              <path
                d="M44 116H78L72 98H42L44 116Z"
                fill="#334155"
              />
              <path
                d="M45 116H77L79 118H43L45 116Z"
                fill="#64748B"
              />
              <rect x="47" y="101" width="22" height="12" rx="1.5" fill="#38BDF8" fillOpacity="0.8" />

              {/* Arms typing on laptop */}
              <path
                d="M58 92L48 108H60"
                stroke="#FBBF24"
                strokeWidth="5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M88 92L72 108H65"
                stroke="#F59E0B"
                strokeWidth="5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* 2. Why use it? */}
      <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-2xs">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-50 text-amber-500">
            <Star className="h-4 w-4 fill-amber-400 text-amber-500" />
          </div>
          <h3 className="text-[14px] font-bold text-slate-900 tracking-tight">
            Why use it?
          </h3>
        </div>

        <ul className="mt-4 space-y-3">
          {[
            "Keep all your applications in one place",
            "Track your progress and respond faster",
            "Never miss important follow-ups",
            "See your job search insights",
          ].map((item, idx) => (
            <li key={idx} className="flex items-center gap-2.5">
              <div className="flex h-4.5 w-4.5 flex-shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                <Check className="h-3 w-3" strokeWidth={3} />
              </div>
              <span className="text-[12.5px] font-medium text-slate-700">{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* 3. How it works? */}
      <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-2xs">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-50 text-amber-500">
            <Zap className="h-4 w-4 fill-amber-400 text-amber-500" />
          </div>
          <h3 className="text-[14px] font-bold text-slate-900 tracking-tight">
            How it works?
          </h3>
        </div>

        <div className="mt-4 space-y-4">
          {/* Step 1 */}
          <div className="flex items-start gap-3">
            <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-emerald-50 text-[12px] font-bold text-emerald-700">
              1
            </div>
            <div>
              <h4 className="text-[12.5px] font-bold text-slate-900">
                Add job details
              </h4>
              <p className="mt-0.5 text-[11.5px] text-slate-500 leading-snug">
                Enter company, role, source, date and other basic information.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex items-start gap-3">
            <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-purple-50 text-[12px] font-bold text-purple-700">
              2
            </div>
            <div>
              <h4 className="text-[12.5px] font-bold text-slate-900">
                Upload your resume
              </h4>
              <p className="mt-0.5 text-[11.5px] text-slate-500 leading-snug">
                Attach the exact resume you used for this application.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex items-start gap-3">
            <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-amber-50 text-[12px] font-bold text-amber-700">
              3
            </div>
            <div>
              <h4 className="text-[12.5px] font-bold text-slate-900">
                Save &amp; track
              </h4>
              <p className="mt-0.5 text-[11.5px] text-slate-500 leading-snug">
                Your application will be saved and visible in your dashboard.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Small steps every day banner */}
      <div className="relative overflow-hidden rounded-2xl border border-amber-200/70 bg-[#FEF7EC] p-4.5 shadow-2xs">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-600">
              <Lightbulb className="h-4.5 w-4.5" />
            </div>
            <p className="text-[12.5px] leading-snug text-slate-800">
              <span className="font-bold text-slate-950">Small steps every day</span>
              <br />
              lead to big opportunities.
            </p>
          </div>

          {/* Doodle curved arrow */}
          <div className="flex-shrink-0 pr-1 text-amber-500">
            <svg
              width="36"
              height="28"
              viewBox="0 0 48 36"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M6 30C12 28 22 22 28 14C32 9 38 6 44 8"
                stroke="#F59E0B"
                strokeWidth="2.2"
                strokeLinecap="round"
              />
              <path
                d="M38 6L44 8L42 14"
                stroke="#F59E0B"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
