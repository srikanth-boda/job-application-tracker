# Firebase

## Where the code lives

| Concern                        | Location                                    |
| ------------------------------ | ------------------------------------------- |
| Client SDK init (lazy)         | `lib/firebase/client.ts`                    |
| App Check (reCAPTCHA v3)       | `lib/firebase/app-check.ts`                 |
| Admin SDK (server only)        | `lib/firebase/admin.ts`                     |
| Collection names               | `constants/firestore.ts`                    |
| Rules / indexes / emulator cfg | `firebase/`, `firebase.json`, `.firebaserc` |
| Rules tests                    | `tests/firebase/`                           |

## Collections

`users`, `applications`, `resumes`, `contacts`, `interviews`, `tasks`, `statusHistory`, `paymentOrders`, `payments`, `subscriptions` (doc id = uid), `plans` (optional mirror of `constants/plans.ts`).

Entitlements (`subscriptions`) are deliberately **not** on the `users` doc, so users can edit their profile without any path to granting themselves a plan.

## Rules summary

- Default deny; `/{document=**}` is closed.
- Owner-only read/write via `userId`; `userId` can't be changed or spoofed on create.
- Field validation (lengths, enums for status/source/priority, resume size/type/path).
- Cross-reference checks: `resumeId` / `applicationId` must belong to the caller (`getAfter`, so parent+child can be created in one batch).
- `statusHistory` is append-only. `resumes` can only change `name`/`archived`, and can't be deleted.
- `paymentOrders`, `payments`, `subscriptions`, `plans`: clients can read their own (plans: any signed-in user) but never write.

Keep enums in the rules in sync with `constants/` (there is no shared import in the rules language).

## Storage

`resumes/{userId}/{resumeId}.pdf`, private. Rules: owner read; create-only (no overwrite/delete); `application/pdf`; 1 B to 5 MB; filename pattern. Client-side Zod validation is a UX convenience only.

## Emulators

`npm run emulators` (Auth 9099, Firestore 8080, Storage 9199, UI 4000; project `demo-job-application-tracker`). Requires Java 21+. Set `NEXT_PUBLIC_USE_FIREBASE_EMULATORS=true`. For server code also export `FIRESTORE_EMULATOR_HOST`, `FIREBASE_AUTH_EMULATOR_HOST` (see `.env.example`).
`npm run test:rules` starts the emulators and runs `tests/firebase/*`.

## Deploying rules

`npx firebase deploy --only firestore:rules,firestore:indexes,storage --project <your-project-id>` (update `.firebaserc` first).
