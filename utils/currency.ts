/** Formats an amount in the smallest currency unit (e.g. paise) for display. */
export function formatCurrency(amountMinor: number, currency: string, locale = "en-IN"): string {
  return new Intl.NumberFormat(locale, { style: "currency", currency }).format(amountMinor / 100);
}
