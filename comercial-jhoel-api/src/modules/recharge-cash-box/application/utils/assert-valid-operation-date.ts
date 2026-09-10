import { InvalidMovementDateError } from '../../domain/errors/invalid-movement-date.error';
import { maxAllowedOperationDate } from './today-iso-date';

/**
 * A movement/balance query can legitimately target a past business date —
 * catching up on a day not recorded in time — but never further than one
 * calendar day in the future. Same reasoning as Recargas' own
 * `assertValidOperationDate`, copied here per this codebase's established
 * "small per-feature copy" convention rather than importing across the
 * module boundary.
 */
export function assertValidOperationDate(date: string): void {
  if (date > maxAllowedOperationDate()) {
    throw new InvalidMovementDateError();
  }
}
