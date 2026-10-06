# Job Application Tracker

> **One application = one source of truth.**

Track every job application in one place: company, role, source, original URL, status + history, the exact resume used, contacts, interviews, follow-ups, notes and a job-description snapshot. Includes a payment foundation (Razorpay first, provider-swappable) for future premium features.

**Status:** architecture foundation. Pages are placeholders; the payment core, validation, Firebase rules and tests are real. See [What is not implemented](#what-is-not-implemented-yet).

## Stack

Next.js 15 (App Router) · React 19 · TypeScript (strict) · Tailwind CSS 4 · React Hook Form + Zod · Recharts · Lucide
Firebase Auth / Firestore / Storage / Security Rules / App Check / Emulator Suite · Razorpay (behind an abstraction)
Vitest · React Testing Library · Playwright · ESLint · Prettier · lint-staged + Husky

## Quick start

```bash
nvm use                      # Node 22 (>= 20.9 works)
npm install
cp .env.example .env.local   # fill in Firebase values; see docs/development.md
npm run emulators            # terminal 1: Auth/Firestore/Storage emulators (needs Java 21+)
npm run dev                  # terminal 2: http://localhost:3000
```

## Scripts

| Script                                        | Purpose                                             |
| --------------------------------------------- | --------------------------------------------------- |
| `npm run dev` / `build` / `start`             | Next.js                                             |
| `npm run lint` / `typecheck` / `format:check` | Code quality                                        |
| `npm test`                                    | Unit + integration tests (Vitest)                   |
| `npm run test:rules`                          | Firestore/Storage rules tests against the emulators |
| `npm run test:e2e`                            | Playwright (`npx playwright install` first)         |
| `npm run check:secrets`                       | Regex guard against committed credentials           |

## Docs

- [Architecture](docs/architecture.md)
- [Folder structure](docs/folder-structure.md)
- [Firebase](docs/firebase.md)
- [Payments](docs/payments.md)
- [Development](docs/development.md)

## What is not implemented yet

Forms and data pages (login/register/application/resume/task UIs), Firestore data-access services (they throw `NotImplementedError`), resume upload, dashboard/analytics computation, Razorpay browser checkout, subscription renewal rules, Google login, rate limiting, CSP header. Everything else listed in the docs exists and is tested.
