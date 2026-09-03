import { DomainError } from '../../../../shared/domain/domain-error';

/**
 * The later-day integrity rule (same Option A already chosen for Banks'
 * own equivalent rule — reject rather than cascade-recalculate): a
 * Recargas date is never reopened/cancelled if a strictly later date has
 * a non-cancelled CLOSED/REOPENED cycle. The user must handle the more
 * recent days first.
 */
export class RechargeLaterDayExistsError extends DomainError {
  readonly status = 400;

  constructor(date: string) {
    super(
      `No puede modificar el día de recargas ${date} porque existen días posteriores ya gestionados. Primero debe reabrir o anular los días más recientes.`,
    );
  }
}
