import { DomainError } from '../../../../shared/domain/domain-error';

/**
 * The later-day integrity rule (Option A, the safest of the options
 * evaluated): a date is never reopened/cancelled if a strictly later date
 * has a non-cancelled CLOSED/REOPENED cycle — this avoids inconsistencies
 * in later balances without needing a cascading recalculation. The user
 * must handle the more recent days first.
 */
export class LaterDayExistsError extends DomainError {
  readonly status = 400;

  constructor(date: string) {
    super(
      `No puede modificar el día ${date} porque existen días posteriores ya gestionados. Primero debe reabrir o anular los días más recientes.`,
    );
  }
}
