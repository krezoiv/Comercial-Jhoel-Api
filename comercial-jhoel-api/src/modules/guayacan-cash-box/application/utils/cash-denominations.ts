import { GuayacanCashDenominationData } from '../../domain/repositories/guayacan-cash-box.repository';
import {
  GuayacanCashBreakdownMismatchError,
  GuayacanInvalidDateError,
  GuayacanInvalidDenominationError,
} from '../../domain/errors/guayacan-cash-box.errors';
import { todayIsoDate } from './today-iso-date';

/** Las mismas denominaciones de Transaccionar (y de `guayacan_valid_denomination` en SQL). */
export const GUAYACAN_CASH_DENOMINATIONS = [
  200, 100, 50, 20, 10, 5, 1, 0.5, 0.25, 0.1, 0.05, 0.01,
] as const;

function round2(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

/** Sin filas en cero, denominación válida y una sola fila por denominación. */
export function normalizeDenominations(
  rows: GuayacanCashDenominationData[],
  options: { keepZero: boolean },
): GuayacanCashDenominationData[] {
  const seen = new Set<number>();
  return rows
    .filter((row) => options.keepZero || row.quantity > 0)
    .map((row) => {
      const denomination = round2(row.denomination);
      if (
        !(GUAYACAN_CASH_DENOMINATIONS as readonly number[]).includes(
          denomination,
        ) ||
        !Number.isInteger(row.quantity) ||
        row.quantity < 0 ||
        seen.has(denomination)
      ) {
        throw new GuayacanInvalidDenominationError();
      }
      seen.add(denomination);
      return { denomination, quantity: row.quantity };
    });
}

export function denominationsTotal(
  rows: GuayacanCashDenominationData[],
): number {
  return round2(
    rows.reduce((sum, row) => sum + row.denomination * row.quantity, 0),
  );
}

/** Mensaje claro antes de llegar a SQL (que lo vuelve a validar). */
export function assertBreakdownMatches(
  rows: GuayacanCashDenominationData[],
  amount: number,
): void {
  if (
    rows.length > 0 &&
    denominationsTotal(rows) !== round2(Math.abs(amount))
  ) {
    throw new GuayacanCashBreakdownMismatchError();
  }
}

/** Fecha de negocio: hoy por defecto; nunca futura (el pasado se permite para registrar un día atrasado). */
export function resolveBusinessDate(date: string | undefined): string {
  const today = todayIsoDate();
  if (!date) {
    return today;
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || date > today) {
    throw new GuayacanInvalidDateError();
  }
  return date;
}
