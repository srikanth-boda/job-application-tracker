# Architecture

Production-grade but deliberately simple: one Next.js app + Firebase. No separate API server, no Redux, no microservices.

```text
Browser (React Client Components)
   │  Firebase client SDK ──► Auth, Firestore, Storage   (protected by Security Rules)
   │  fetch /api/payments/* ─► Next.js Route Handlers     (Bearer ID token)
   ▼
Next.js server
   ├── Server Components     (session cookie verified in layouts)
   └── Route Handlers        (server-only secrets, Firebase Admin SDK)
          └── PaymentService ─► PaymentProvider ─► RazorpayPaymentProvider ─► Razorpay
```

## Layers and dependency direction

```text
app/ (routes)  →  components/  →  features/  →  services/  →  lib/ + constants/ + types/
                                    schemas/ (zod) used by all of the above
```

- **app/**: routing only. Pages compose components and call features/services.
- **components/**: presentational UI, grouped by domain. No data fetching, no provider code.
- **features/**: domain logic and hooks, one folder per business domain.
- **services/**: data access and integrations (Firestore, payments). Server-only modules import `server-only`.
- **lib/**: cross-cutting infrastructure (Firebase init, auth guards, env, errors, API helpers).
- **constants/**, **types/**, **schemas/**: single sources of truth for enums, models and validation.

Single source of truth examples: statuses/sources live in `constants/` and feed the TypeScript types, Zod schemas and (mirrored by hand) the Firestore rules; application _outcome_ is derived from `status`, never stored.

## Server / client boundaries

- Anything under `NEXT_PUBLIC_*` is public. Secrets are only read in `lib/env/server.ts` (imports `server-only`).
- `lib/firebase/client.ts` is `"use client"` and lazy: nothing initialises at import time, so builds work without env.
- `lib/firebase/admin.ts`, `lib/auth/server-auth.ts`, `services/payments/**` (except `payment-client.ts` and `razorpay/checkout.client.ts`) are server-only.

## Authentication

1. Client signs in with Firebase Auth (email/password).
2. Client posts the ID token to `POST /api/auth/session`; the server mints an httpOnly session cookie (`__session`).
3. `middleware.ts` does a cheap cookie-presence redirect. `app/(dashboard)/layout.tsx` is the real gate (`verifySessionCookie`). Route Handlers use `requireUser()` (Bearer ID token).

## Data ownership

Top-level collections, each document carries `userId`. Rules enforce ownership, validate shape, and block cross-user references (an application can only point at the caller's own resume). Payment collections are server-write only.

## Error handling

`lib/errors.ts` defines typed errors (`ValidationError`, `UnauthorizedError`, `InvalidSignatureError`, ...). Every Route Handler is wrapped in `withErrorHandling`, producing `{ "error": { "code", "message" } }`; Zod errors become 400 with issue details; unknown errors become a generic 500 (details only in server logs).

## Conventions

- Strict TypeScript (`noUncheckedIndexedAccess`), no `any` (lint error).
- ESLint blocks importing the `razorpay` SDK outside `services/payments/razorpay/`.
- Timestamps are ISO strings in domain types; convert at the repository boundary.
- Money is an integer in the smallest currency unit (paise).
