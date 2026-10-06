import type { LucideIcon } from "lucide-react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { cn } from "@/utils/cn";

interface StatCardProps {
  label: string;
  value: number | string;
  icon?: LucideIcon;
  iconBg?: string;
  iconColor?: string;
  delta?: number;
  deltaLabel?: string;
  trend?: "up" | "down" | "neutral";
  className?: string;
}

export function StatCard({
  label,
  value,
  icon: Icon,
  iconBg = "bg-[#EEF2FF]",
  iconColor = "text-indigo-600",
  delta,
  deltaLabel,
  trend = "up",
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-slate-100 bg-white p-4.5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between",
        className,
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-[12px] font-medium text-slate-500 leading-tight">
          {label}
        </span>
        {Icon && (
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-xl ${iconBg}`}
          >
            <Icon className={`h-4 w-4 ${iconColor}`} />
          </div>
        )}
      </div>

      <div className="mt-3">
        <div className="text-[28px] font-bold text-slate-900 leading-none">
          {value}
        </div>
        {delta !== undefined && (
          <div className="mt-2 flex items-center gap-1 text-[11.5px] font-medium">
            {trend === "up" && (
              <span className="flex items-center gap-0.5 text-[#10B981]">
                <ArrowUpRight className="h-3.5 w-3.5" />
                <span>{deltaLabel ?? `+${delta} this week`}</span>
              </span>
            )}
            {trend === "down" && (
              <span className="flex items-center gap-0.5 text-[#EF4444]">
                <ArrowDownRight className="h-3.5 w-3.5" />
                <span>{deltaLabel ?? `+${delta} this week`}</span>
              </span>
            )}
            {trend === "neutral" && (
              <span className="flex items-center gap-0.5 text-slate-400">
                <ArrowDownRight className="h-3.5 w-3.5" />
                <span>{deltaLabel ?? "+0 this week"}</span>
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

