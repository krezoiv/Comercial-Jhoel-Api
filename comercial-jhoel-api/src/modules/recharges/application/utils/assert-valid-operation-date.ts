import { InvalidRechargeDateError } from '../../domain/errors/invalid-recharge-date.error';
import { maxAllowedOperationDate } from './today-iso-date';

/**
 * A recharge operation (purchase, saldo final via its own daily-balance id,
 * sales closure) can legitimately be dated in the past — catching up on a
 * day that wasn't closed out in time — but never further than one calendar
 * day in the future. Applied to both reads that lazily create a row
 * (`GET /recharges/daily`, `GET /recharges/sales-summary`) and writes, so a
 * caller can't create a phantom future-dated row just by querying one.
 */
export function assertValidOperationDate(date: string): void {
  if (date > maxAllowedOperationDate()) {
    throw new InvalidRechargeDateError();
  }
}
