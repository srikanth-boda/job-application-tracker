"use client";

import { Button, type ButtonProps } from "@/components/ui/button";

export interface PaymentButtonProps extends Omit<ButtonProps, "onClick"> {
  label?: string;
  loading?: boolean;
  onPay?: () => void;
}

/**
 * Presentational. It receives `onPay` from a hook (features/payments/useCheckout) and knows
 * nothing about Razorpay or any other provider.
 */
export function PaymentButton({
  label = "Upgrade",
  loading = false,
  onPay,
  disabled,
  ...props
}: PaymentButtonProps) {
  return (
    <Button onClick={onPay} disabled={disabled || loading} {...props}>
      {loading ? "Processing..." : label}
    </Button>
  );
}
