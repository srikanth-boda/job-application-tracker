import "server-only";
import { z } from "zod";
import { PAYMENT_PROVIDERS } from "@/constants/payments";
import { ConfigurationError } from "@/lib/errors";

const serverEnvSchema = z.object({
  PAYMENT_PROVIDER: z.enum(PAYMENT_PROVIDERS).default("razorpay"),
  NEXT_PUBLIC_RAZORPAY_KEY_ID: z.string().optional(),
  RAZORPAY_KEY_SECRET: z.string().optional(),
  RAZORPAY_WEBHOOK_SECRET: z.string().optional(),
  FIREBASE_ADMIN_PROJECT_ID: z.string().optional(),
  FIREBASE_ADMIN_CLIENT_EMAIL: z.string().optional(),
  FIREBASE_ADMIN_PRIVATE_KEY: z.string().optional(),
});

export type ServerEnv = z.infer<typeof serverEnvSchema>;

let cached: ServerEnv | undefined;

/** Parsed lazily (not at import time) so `next build` works without secrets. */
export function getServerEnv(): ServerEnv {
  if (!cached) {
    const parsed = serverEnvSchema.safeParse(process.env);
    if (!parsed.success) {
      throw new ConfigurationError(
        `Invalid server environment: ${parsed.error.issues.map((i) => i.path.join(".")).join(", ")}`,
      );
    }
    cached = parsed.data;
  }
  return cached;
}

export function requireEnv(value: string | undefined, name: string): string {
  if (!value) throw new ConfigurationError(`Missing required environment variable: ${name}`);
  return value;
}
