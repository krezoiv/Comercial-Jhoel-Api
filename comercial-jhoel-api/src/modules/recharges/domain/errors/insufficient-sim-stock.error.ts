import { DomainError } from '../../../../shared/domain/domain-error';

/** Enforced in `register_recharge_sim_sale()` under a `FOR UPDATE` row lock — never trusts the frontend's own stock check. */
export class InsufficientSimStockError extends DomainError {
  readonly status = 400;

  constructor() {
    super('No hay suficiente stock de este SIM para completar la venta.');
  }
}
