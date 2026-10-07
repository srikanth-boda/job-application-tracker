import {
  LayoutDashboard,
  Briefcase,
  CalendarCheck,
  Award,
  XCircle,
  MinusCircle,
  FileText,
  Settings,
  User,
  type LucideIcon,
} from "lucide-react";
import { ROUTES } from "@/constants/routes";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export const NAV_ITEMS: readonly NavItem[] = [
  { label: "Dashboard", href: ROUTES.dashboard, icon: LayoutDashboard },
  { label: "Applications", href: ROUTES.applications, icon: Briefcase },
  { label: "Interviews", href: "/interviews", icon: CalendarCheck },
  { label: "Offers", href: "/offers", icon: Award },
  { label: "Rejected", href: "/rejected", icon: XCircle },
  { label: "Not Selected", href: "/not-selected", icon: MinusCircle },
  { label: "Resume / Documents", href: ROUTES.resumes, icon: FileText },
  { label: "Settings", href: ROUTES.settings, icon: Settings },
  { label: "Profile", href: ROUTES.profile, icon: User },
];
