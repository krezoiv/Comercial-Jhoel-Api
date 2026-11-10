import { cashControlError } from '../errors/cash-control.errors';

/** Accounts that may open the day and start/finish the cash cuts (decided with the business owner). */
export const CASH_CUT_MANAGER_ROLES = [
  'SUPER_ADMIN',
  'ADMIN',
  'SUPERVISOR_DE_TURNO',
] as const;

/** Accounts that may authorize a manual opening, adjustments, voids and reopen a cut. */
export const CASH_ADMIN_ROLES = ['SUPER_ADMIN', 'ADMIN'] as const;

export const GUATEMALA_TIME_ZONE = 'America/Guatemala';

export function isCashAdmin(role: string | undefined): boolean {
  return (CASH_ADMIN_ROLES as readonly string[]).includes(role ?? '');
}

const TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/;

/** `HH:mm`, 24 h. */
export function isValidCutTime(
  value: string | null | undefined,
): value is string {
  return typeof value === 'string' && TIME_PATTERN.test(value);
}

function minutes(value: string): number {
  const [hours, mins] = value.split(':').map(Number);
  return hours * 60 + mins;
}

/**
 * Early, friendly validation of a cut's scheduled window — the SQL functions
 * re-validate under the lock (`CASH_CUT_INVALID_SCHEDULE`/`_OVERLAP`).
 * `sibling` is the other cut of the same day, when known.
 */
export function assertCutSchedule(
  periodNumber: 1 | 2,
  start: string,
  end: string,
  sibling?: { start: string; end: string } | null,
): void {
  if (
    !isValidCutTime(start) ||
    !isValidCutTime(end) ||
    minutes(end) <= minutes(start)
  ) {
    throw cashControlError('CASH_CUT_INVALID_SCHEDULE');
  }
  if (!sibling) {
    return;
  }
  const overlaps =
    periodNumber === 1
      ? minutes(end) > minutes(sibling.start)
      : minutes(start) < minutes(sibling.end);
  if (overlaps) {
    throw cashControlError('CASH_CUT_SCHEDULE_OVERLAP');
  }
}

/** Mandatory reason for manual adjustments, authorized openings, voids and reopenings. */
export function requireReason(reason: string | null | undefined): string {
  const trimmed = (reason ?? '').trim();
  if (trimmed.length < 5) {
    throw cashControlError('CASH_REASON_REQUIRED');
  }
  return trimmed;
}

/** `yyyy-MM-dd` of `now` in America/Guatemala — never the server's or browser's zone. */
export function guatemalaIsoDate(now: Date = new Date()): string {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: GUATEMALA_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(now);
  const get = (type: string) =>
    parts.find((part) => part.type === type)?.value ?? '';
  return `${get('year')}-${get('month')}-${get('day')}`;
}

/** `HH:mm` of an instant in America/Guatemala. */
export function guatemalaTime(instant: Date): string {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: GUATEMALA_TIME_ZONE,
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).format(instant);
}
