import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import { JobTrackLogo } from "./jobtrack-logo";
import { XTwitterIcon, LinkedinIcon, GithubIcon, YoutubeIcon } from "./icons";

export function Footer() {
  const currentYear = 2025; // Matching design mock year

  return (
    <footer className="border-t border-slate-200/80 bg-white pt-12 pb-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Top Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 pb-10 border-b border-slate-100">
          {/* Brand & Slogan */}
          <div className="flex flex-col items-start">
            <JobTrackLogo />
            <p className="mt-2 text-xs text-slate-500">
              One application = one source of truth.
            </p>
          </div>

          {/* Center Links */}
          <nav className="flex flex-wrap items-center gap-6 sm:gap-8" aria-label="Footer Product Links">
            <a
              href="#features"
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              Features
            </a>
            <a
              href="#pricing"
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              Pricing
            </a>
            <a
              href="#problem"
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              About
            </a>
          </nav>

          {/* Right Links */}
          <div className="flex flex-wrap items-center gap-6 sm:gap-8">
            <Link
              href="/privacy"
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              Terms
            </Link>
            <Link
              href={ROUTES.login}
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-400">
            &copy; {currentYear} JobTrack. All rights reserved.
          </p>

          <div className="flex items-center gap-5 text-slate-400">
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
              className="hover:text-slate-700 transition-colors"
            >
              <LinkedinIcon className="h-4 w-4" />
            </a>
            <a
              href="https://x.com"
              target="_blank"
              rel="noreferrer"
              aria-label="X (formerly Twitter)"
              className="hover:text-slate-700 transition-colors"
            >
              <XTwitterIcon className="h-4 w-4" />
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
              className="hover:text-slate-700 transition-colors"
            >
              <GithubIcon className="h-4 w-4" />
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noreferrer"
              aria-label="YouTube"
              className="hover:text-slate-700 transition-colors"
            >
              <YoutubeIcon className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
