import { DomainError } from '../../../../shared/domain/domain-error';

/**
 * "El día ya fue cerrado y no puede ser modificado" — cubre las tres
 * operaciones que quedan bloqueadas una vez `day_openings.closed_at` no
 * es null: guardar/modificar saldos bancarios de esa fecha
 * (`SaveBankBalancesUseCase`) y guardar un nuevo cuadre para la misma
 * fecha (`CloseAgentDayUseCase`, que también es quien la cierra). Nunca
 * se lanza para una fecha que nunca fue aperturada — ese caso sigue
 * siendo `DayNotOpenedError`, un estado distinto.
 */
export class DayAlreadyClosedError extends DomainError {
  readonly status = 400;

  constructor(date: string) {
    super(`El día correspondiente a esta operación (${date}) ya se encuentra cerrado.`);
  }
}
