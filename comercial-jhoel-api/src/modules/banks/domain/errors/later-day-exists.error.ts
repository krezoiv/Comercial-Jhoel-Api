import { DomainError } from '../../../../shared/domain/domain-error';

/**
 * Regla de integridad de días posteriores (Opción A, la más segura de las
 * evaluadas): nunca se reabre/anula una fecha si existe una fecha
 * estrictamente posterior con un ciclo CLOSED/REOPENED no anulado — evita
 * inconsistencias en saldos posteriores sin necesitar un recálculo en
 * cascada. El usuario debe gestionar primero los días más recientes.
 */
export class LaterDayExistsError extends DomainError {
  readonly status = 400;

  constructor(date: string) {
    super(
      `No puede modificar el día ${date} porque existen días posteriores ya gestionados. Primero debe reabrir o anular los días más recientes.`,
    );
  }
}
