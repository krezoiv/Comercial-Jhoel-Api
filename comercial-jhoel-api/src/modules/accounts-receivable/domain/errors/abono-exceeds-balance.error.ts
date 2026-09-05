import { DomainError } from '../../../../shared/domain/domain-error';

/**
 * Cuentas por Cobrar has never allowed a negative balance (its own
 * `CHK_accounts_receivable_amount_positive` never lapsed, unlike Activos' —
 * see `register_account_receivable_movement`'s own doc comment) — this
 * preserves that existing rule exactly. Activos has no equivalent error: its
 * own `register_asset_movement` deliberately allows a negative balance.
 */
export class AbonoExceedsBalanceError extends DomainError {
  readonly status = 400;

  constructor() {
    super('El abono no puede ser mayor al saldo pendiente del cliente.');
  }
}
