import { DomainError } from '../../../../shared/domain/domain-error';

export class SimSaleHasRegistrationError extends DomainError {
  readonly status = 400;

  constructor() {
    super(
      "Esta venta de SIM ya tiene un registro de identidad asociado. Anúlela desde 'Administrar Ventas de SIM'.",
    );
  }
}
