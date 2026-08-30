import { DomainError } from '../../../../shared/domain/domain-error';

export class PendingTypeClosureError extends DomainError {
  readonly status = 400;

  constructor(rechargeTypeId: string) {
    super(
      `No se puede guardar el cuadre: el tipo de recarga ${rechargeTypeId} aún no tiene saldo final registrado hoy.`,
    );
  }
}
