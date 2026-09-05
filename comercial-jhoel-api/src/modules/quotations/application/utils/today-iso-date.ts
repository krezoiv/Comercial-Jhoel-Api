/**
 * `yyyy-MM-dd` in local server time — this module's own copy, matching the
 * per-module convention already established by `recharges`/`bank-deposits`/
 * `banks`/`alerts` (each owns a tiny copy rather than sharing one utility).
 * Used to derive `'VENCIDA'` at read time — never stored on the row itself,
 * same "never store a computed overdue/expired state" precedent already
 * established for `purchases.paymentStatus`.
 */
function toIsoDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function todayIsoDate(): string {
  return toIsoDate(new Date());
}
