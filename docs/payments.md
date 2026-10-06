# Payments

Razorpay is the first provider, hidden behind an abstraction so it can be replaced without touching the UI.

```text
UI (components/payments, features/payments/use-checkout)
   │ fetch
   ▼
Route Handlers  app/api/payments/{create-order,verify,webhook}
   ▼
PaymentService  services/payments/payment-service.ts      (provider-agnostic rules)
   ├── PaymentProvider (interface)  ──► RazorpayPaymentProvider ──► Razorpay
   └── PaymentRepository (interface) ─► FirestorePaymentRepository ─► Firestore (Admin SDK)
```

## Where things belong

| What                               | Where                                                      |
| ---------------------------------- | ---------------------------------------------------------- |
| Razorpay SDK, signatures, payloads | `services/payments/razorpay/` (ESLint blocks it elsewhere) |
| Provider-neutral orchestration     | `services/payments/payment-service.ts`                     |
| Plans and prices (source of truth) | `constants/plans.ts`                                       |
| Server-only operations             | `app/api/payments/*` + `getPaymentService()`               |
| Browser checkout (placeholder)     | `services/payments/razorpay/checkout.client.ts`            |
| UI building blocks                 | `components/payments/*`, `app/(dashboard)/billing`         |
| Records                            | Firestore `paymentOrders`, `payments`, `subscriptions`     |

## Secrets

- Server-only (never `NEXT_PUBLIC_`): `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET`, Firebase Admin credentials.
- Public: `NEXT_PUBLIC_RAZORPAY_KEY_ID` (publishable key id).
- Set real values only in `.env.local` / your host's secret store. `npm run check:secrets` runs in CI.

## Flow

1. **Create order** - `POST /api/payments/create-order` `{ planId }`. Requires a Firebase ID token. The server looks up the price in `constants/plans.ts` (the client can't choose an amount), creates the Razorpay order, stores `paymentOrders/{id}` and returns `{ orderId, providerOrderId, amount, currency }`.
2. **Checkout** - browser opens Razorpay with the public key id + `providerOrderId` (to be built).
3. **Verify** - browser sends `{ providerOrderId, providerPaymentId, signature }` to `POST /api/payments/verify`. The server checks the order belongs to the caller, verifies `HMAC_SHA256(order_id|payment_id, key_secret)` in constant time, then in one Firestore transaction writes `payments/{provider}_{paymentId}`, marks the order paid and sets `subscriptions/{uid}`. A client-side "success" flag is never trusted.
4. **Webhook** - `POST /api/payments/webhook` (no user auth). Signature = `HMAC_SHA256(raw body, webhook_secret)` from the `x-razorpay-signature` header; amount/currency must match the stored order. Handles `payment.captured` and `payment.failed`, ignores other events, always replies 200 to handled/ignored events so Razorpay doesn't retry them.

Verify and webhook converge on the same deterministic payment id, so processing is **idempotent** whichever arrives first.

Configure the webhook in the Razorpay dashboard: URL `https://<your-domain>/api/payments/webhook`, events `payment.captured`, `payment.failed`, secret = `RAZORPAY_WEBHOOK_SECRET`. For local testing use a tunnel.

## Adding another provider (e.g. Stripe)

1. Add the name to `PAYMENT_PROVIDERS` in `constants/payments.ts`.
2. Create `services/payments/stripe/` with a class implementing `PaymentProvider` (order creation, signature check, webhook parsing) and allow its SDK in the ESLint override.
3. Add a `case` in `createPaymentProvider` (`services/payments/index.ts`) and its env vars.
4. Add a browser checkout module next to it; set `PAYMENT_PROVIDER=stripe`.
   `PaymentService`, repository, routes, schemas, plans and UI components stay unchanged.

## Not implemented yet

Browser checkout, billing page data, refunds, subscription renewal/extension logic, rate limiting on the payment routes, a Content-Security-Policy that allows `checkout.razorpay.com`. Pricing in `constants/plans.ts` is a placeholder.
