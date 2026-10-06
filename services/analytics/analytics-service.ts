import { notImplemented } from "@/lib/errors";
import type { AnalyticsSummary } from "@/features/analytics/analytics.types";

/**
 * PLACEHOLDER. Analytics are DESCRIPTIVE only (counts, rates, groupings).
 * No predictions, scores or causal claims.
 */
export const analyticsService = {
  getSummary: async (_userId: string): Promise<AnalyticsSummary> =>
    notImplemented("analyticsService.getSummary"),
};
