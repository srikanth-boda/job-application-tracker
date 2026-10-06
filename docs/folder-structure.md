# Folder structure

```text
app/
  (public)/page.tsx               landing page ( "/" )
  (auth)/{login,register,forgot-password}/   auth pages; layout redirects signed-in users
  (dashboard)/                    layout verifies session; pages below are placeholders
    dashboard/ applications/ applications/new/ applications/[id]/
    resumes/ tasks/ analytics/ settings/ billing/
  api/
    auth/session/route.ts         create/clear httpOnly session cookie
    payments/create-order/route.ts
    payments/verify/route.ts
    payments/webhook/route.ts
  layout.tsx  globals.css
components/
  ui/ layout/ applications/ resumes/ interviews/ tasks/ dashboard/ analytics/
  payments/                       PricingCard, PlanCard, PaymentButton, PaymentStatus, BillingSummary
features/                         auth applications resumes interviews tasks contacts
                                  dashboard analytics payments settings
hooks/                            use-auth.ts
lib/
  firebase/ (client.ts, admin.ts, app-check.ts)   auth/ (route-guard, server-auth)
  env/ (client.ts, server.ts)     api/route-handler.ts   security/   payments/   errors.ts
services/
  applications resumes interviews tasks contacts analytics   (data access, placeholders)
  payments/
    payment-service.ts            provider-agnostic orchestration
    payment-provider.ts           PaymentProvider interface
    payment-repository.ts         persistence port
    firestore-payment-repository.ts
    payment-client.ts             browser -> our API
    index.ts                      getPaymentService() (chooses provider by env)
    razorpay/                     ONLY place that knows Razorpay
types/  schemas/  constants/  utils/
firebase/                         firestore.rules  storage.rules  firestore.indexes.json  README.md
tests/                            unit/  integration/  e2e/  firebase/  setup/
docs/  scripts/  public/  .github/workflows/ci.yml  .husky/
```

Deviations from the suggested tree (on purpose):

- **No `app/page.tsx`**: the landing page is `app/(public)/page.tsx` (two pages cannot both own `/`).
- **`services/contacts`**, **`schemas/contact.schema.ts`**, **`schemas/auth.schema.ts`** added (contacts are a core domain; auth forms need validation).
- **`app/api/auth/session`** added so server-side route protection works.
- **`types/css.d.ts`** lets `tsc` pass before the first `next build` (CI).
