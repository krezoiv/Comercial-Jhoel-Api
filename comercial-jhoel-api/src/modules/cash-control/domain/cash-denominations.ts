/**
 * Every bill/coin the business counts, in display order (Q200 … Q0.01). The
 * SQL mirror is `cash_valid_denomination` (migration 1760007600000).
 */
export const CASH_DENOMINATIONS = [
  200, 100, 50, 20, 10, 5, 1, 0.5, 0.25, 0.1, 0.05, 0.01,
] as const;

export interface DenominationQuantity {
  denomination: number;
  quantity: number;
}

export interface DenominationLine extends DenominationQuantity {
  subtotal: number;
}

/** Denomination in whole centavos — all cash arithmetic is done in integers. */
export function toCents(value: number): number {
  return Math.round(value * 100);
}

export function isValidDenomination(value: number): boolean {
  return (CASH_DENOMINATIONS as readonly number[]).some(
    (denomination) => toCents(denomination) === toCents(value),
  );
}

/** Exact total of a breakdown (integer centavo math, never float sums). */
export function breakdownTotal(rows: DenominationQuantity[]): number {
  const cents = rows.reduce(
    (sum, row) => sum + toCents(row.denomination) * row.quantity,
    0,
  );
  return cents / 100;
}

/**
 * The full 12-row breakdown for a form: every denomination in display order,
 * quantity 0 where the stored rows have none (e.g. Q0.01 in counts saved
 * before it existed). Only builds a new view — the stored rows are untouched.
 */
export function completeBreakdown(
  rows: DenominationQuantity[],
): DenominationLine[] {
  return CASH_DENOMINATIONS.map((denomination) => {
    const quantity =
      rows.find((row) => toCents(row.denomination) === toCents(denomination))
        ?.quantity ?? 0;
    return {
      denomination,
      quantity,
      subtotal: (toCents(denomination) * quantity) / 100,
    };
  });
}
