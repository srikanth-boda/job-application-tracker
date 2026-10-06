export const PAYMENT_PROVIDERS = ["razorpay"] as const; // add "stripe" etc. here later
export type PaymentProviderName = (typeof PAYMENT_PROVIDERS)[number];

export const PAYMENT_ORDER_STATUSES = ["created", "paid", "failed"] as const;
export type PaymentOrderStatus = (typeof PAYMENT_ORDER_STATUSES)[number];

export const PAYMENT_STATUSES = ["pending", "verified", "failed", "refunded"] as const;
export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];

export const DEFAULT_CURRENCY = "INR";
