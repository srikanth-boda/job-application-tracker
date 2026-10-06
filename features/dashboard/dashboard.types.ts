import type { Application } from "@/types/application";
import type { Interview } from "@/types/interview";
import type { Task } from "@/types/task";

export interface DashboardSummary {
  totalApplications: number;
  activeApplications: number;
  responses: number;
  interviews: number;
  offers: number;
  rejections: number;
  recentApplications: Application[];
  upcomingInterviews: Interview[];
  pendingFollowUps: Task[];
}
