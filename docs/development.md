# Development

## Setup

1. Node 22 (`.nvmrc`), Java 21+ (emulators only).
2. `npm install`
3. Create a Firebase project (or keep the `demo-` project for pure emulator work) and copy the web-app config into `.env.local` from `.env.example`.
4. For server code (session cookie, payments) provide Admin credentials or use emulators:
   `FIRESTORE_EMULATOR_HOST=127.0.0.1:8080`, `FIREBASE_AUTH_EMULATOR_HOST=127.0.0.1:9099`, and `FIREBASE_ADMIN_PROJECT_ID`.
5. `npm run emulators` then `npm run dev`.

Until Firebase env vars are set, public pages work; protected pages redirect to `/login`.

## Quality gates

`npm run lint && npm run typecheck && npm test && npm run build` (same as CI). Pre-commit runs lint-staged (ESLint + Prettier).

## Suggested implementation order

1. **Auth** - login/register/forgot forms with React Hook Form + `schemas/auth.schema.ts` + `features/auth/auth.service.ts`; create `users/{uid}` on register. Add Auth-emulator seeding for the Playwright fixme test.
2. **Applications** - implement `services/applications` (create writes the first `statusHistory` entry in the same batch; `changeStatus` is a batch), list/detail/new pages.
3. **Resume Vault** - upload to `resumes/{uid}/{id}.pdf`, create `resumes/{id}`, list/rename/archive, "applications using this resume".
4. **Contacts, interviews, tasks** - services + forms on the application detail page.
5. **Dashboard** then **Analytics** (descriptive only; prefer reading statusHistory for response/interview rates).
6. **Billing** - `useCheckout` + `openRazorpayCheckout`, then entitlement checks reading `subscriptions/{uid}`.

For each feature: add/extend the Zod schema, the Firestore rule, a rules test, and a unit test.

## Testing

- `tests/unit` (pure logic, schemas, components), `tests/integration` (route handlers with mocked services), `tests/firebase` (rules, emulators), `tests/e2e` (Playwright; run `npx playwright install chromium` once).
- `server-only` is aliased to an empty stub in `vitest.config.mts`.

## Before production

Rate limiting, CSP, Firebase App Check enforcement, real plan pricing, monitoring/logging, Firestore backups, and a security review of the payment flow with Razorpay test mode end to end.
