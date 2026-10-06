// Lets `tsc --noEmit` pass before Next.js has generated next-env.d.ts (e.g. in CI).
declare module "*.css";
