import { DomainError } from '../../../../shared/domain/domain-error';

/**
 * "Cerrar Día" (see `CloseRechargeDayUseCase`/`close_recharge_day`) is a
 * standalone action carrying no cuadre data of its own, deliberately
 * decoupled from "Guardar Cuadre" so this module's existing multi-cycle-
 * per-day cuadre feature keeps working unchanged. Without this
 * precondition, an operator could open a day, sell recargas all day, and
 * close it without ever reconciling cash — this error is what stops that.
 */
export class RechargeDayNotReadyToCloseError extends DomainError {
  readonly status = 400;

  constructor(date: string) {
    super(
      `Debe guardar al menos un cuadre de recargas para la fecha ${date} antes de cerrar el día.`,
    );
  }
}
