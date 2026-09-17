/**
 * THE single source of truth for the "precio >= Q1,000 → crédito Krediya
 * disponible" rule across the entire system (landing, API, panel,
 * solicitudes — per the ticket's own explicit requirement). Every place
 * that needs to know whether a phone qualifies for Krediya credit — the
 * public catalog mapper, the admin catalog mapper, and
 * `CreateCatalogRequestUseCase`'s server-side recalculation — calls this
 * function and only this function. Never reimplemented, never inlined as a
 * raw `>= 1000` comparison anywhere else.
 *
 * `minAmount` is `company_settings.krediyaMinAmount` (nullable): `null` or
 * `<= 0` means the business has not configured (or has deliberately turned
 * off) the Krediya credit offer — no phone ever qualifies in that case,
 * regardless of price.
 */
export function isKrediyaCreditAvailable(
  price: number,
  minAmount: number | null,
): boolean {
  if (minAmount === null || minAmount <= 0) {
    return false;
  }
  return price >= minAmount;
}
