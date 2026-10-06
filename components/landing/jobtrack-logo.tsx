import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/utils/cn";

interface JobTrackLogoProps {
  className?: string;
  iconOnly?: boolean;
  href?: string;
}

export function JobTrackLogo({ className, iconOnly = false, href = ROUTES.home }: JobTrackLogoProps) {
  const content = (
    <div className={cn("inline-flex items-center gap-2.5", className)}>
      <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm shadow-blue-500/20">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          aria-hidden="true"
        >
          {/* Stylized JobTrack geometric mark: two parallel slanted track pills */}
          <rect
            x="5.5"
            y="7.5"
            width="4.5"
            height="11"
            rx="2.25"
            transform="rotate(-20 5.5 7.5)"
            fill="white"
          />
          <rect
            x="12.5"
            y="4.5"
            width="4.5"
            height="15"
            rx="2.25"
            transform="rotate(-20 12.5 4.5)"
            fill="white"
          />
        </svg>
      </div>
      {!iconOnly && (
        <span className="text-xl font-bold tracking-tight text-slate-900">
          JobTrack
        </span>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex items-center hover:opacity-95 transition-opacity">
        {content}
      </Link>
    );
  }

  return content;
}
