function toIsoDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * `yyyy-MM-dd` in local server time — no explicit UTC normalization,
 * consistent with how the Reports module and `CreatePurchaseUseCase`
 * already treat "today"/date filters elsewhere in this codebase.
 */
export function todayIsoDate(): string {
  return toIsoDate(new Date());
}

/**
 * One calendar day past today, local server time — the furthest
 * `operationDate` an authenticated caller may write to (see
 * `assertValidOperationDate`). Expressed in whole days, not milliseconds,
 * since every Recargas date is a plain calendar day, never a timestamp —
 * the day-granularity equivalent of `CreatePurchaseUseCase`'s
 * `FUTURE_DATE_GRACE_MS`, which exists to absorb client/server clock and
 * timezone skew around "today" rather than to permit genuine backdating
 * into the future.
 */
export function maxAllowedOperationDate(): string {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  return toIsoDate(date);
}
