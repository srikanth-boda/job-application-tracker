export const COLLECTIONS = {
  users: "users",
  applications: "applications",
  resumes: "resumes",
  contacts: "contacts",
  interviews: "interviews",
  tasks: "tasks",
  statusHistory: "statusHistory",
  /** Server-written only. */
  paymentOrders: "paymentOrders",
  payments: "payments",
  /** Doc id = userId. Server-written only. */
  subscriptions: "subscriptions",
  /** Optional read-only mirror of constants/plans.ts. */
  plans: "plans",
} as const;
