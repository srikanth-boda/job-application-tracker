export const ROUTES = {
  home: "/",
  login: "/login",
  register: "/register",
  forgotPassword: "/forgot-password",
  dashboard: "/dashboard",
  applications: "/applications",
  newApplication: "/applications/new",
  application: (id: string) => `/applications/${id}`,
  resumes: "/resumes",
  tasks: "/tasks",
  analytics: "/analytics",
  settings: "/settings",
  profile: "/profile",
  billing: "/billing",
} as const;

export const AUTH_ROUTES: readonly string[] = [
  ROUTES.login,
  ROUTES.register,
  ROUTES.forgotPassword,
];

/** Anything under these prefixes requires a signed-in user. */
export const PROTECTED_ROUTE_PREFIXES: readonly string[] = [
  ROUTES.dashboard,
  ROUTES.applications,
  ROUTES.resumes,
  ROUTES.tasks,
  ROUTES.analytics,
  ROUTES.settings,
  ROUTES.billing,
];
