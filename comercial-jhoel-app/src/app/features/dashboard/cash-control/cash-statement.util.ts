import {
  CASH_MOVEMENT_TYPE_LABEL,
  CashMovementType,
  CashStatementLocation,
  CashStatementPeriod,
  CashStatementRow,
  WAREHOUSE_STATEMENT_TYPE_LABEL,
} from '../../../core/models';
import { formatIsoDate } from './cash-control.util';

/** Spanish name of a Kardex type of the given location (an annulment says what it reverses). */
export function statementTypeLabel(
  row: Pick<CashStatementRow, 'movementType' | 'originalMovementType'>,
  location: CashStatementLocation,
): string {
  const label = (type: string) =>
    location === 'BODEGA'
      ? (WAREHOUSE_STATEMENT_TYPE_LABEL[type] ?? type)
      : (CASH_MOVEMENT_TYPE_LABEL[type as CashMovementType] ?? type);
  const base = label(row.movementType);
  return row.originalMovementType ? `${base} de ${label(row.originalMovementType).toLowerCase()}` : base;
}

/** "Día bancario 21/11/2026 (en curso)" / "01/11/2026 – 21/11/2026". */
export function statementPeriodLabel(period: CashStatementPeriod): string {
  if (period.kind === 'BANK_DAY' && period.businessDate) {
    return `Día bancario ${formatIsoDate(period.businessDate)}${period.isCurrent ? ' (en curso)' : ''}`;
  }
  return period.dateFrom === period.dateTo
    ? formatIsoDate(period.dateFrom)
    : `${formatIsoDate(period.dateFrom)} – ${formatIsoDate(period.dateTo)}`;
}

/** `dd/MM/yyyy` of a server instant in America/Guatemala. */
export function guatemalaDate(iso: string): string {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Guatemala',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date(iso));
  const part = (type: string) => parts.find((p) => p.type === type)?.value ?? '';
  return `${part('day')}/${part('month')}/${part('year')}`;
}
