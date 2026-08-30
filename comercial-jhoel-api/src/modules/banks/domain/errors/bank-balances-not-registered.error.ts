import { DomainError } from '../../../../shared/domain/domain-error';

/**
 * "No se puede realizar un Cuadre de Agentes si primero no se han
 * registrado y guardado los saldos de los bancos para esa misma fecha" —
 * the one hard backend gate this rule needs. Thrown by
 * `CloseAgentDayUseCase` before it ever computes/persists a
 * reconciliation; the frontend's own pre-check (`ValidateBankBalancesForDateUseCase`
 * surfaced via `GET /banks/balances/validation`) is UX only and can never
 * be the real guarantee.
 */
export class BankBalancesNotRegisteredError extends DomainError {
  readonly status = 400;

  constructor(date: string) {
    super(
      `Debe registrar y guardar los saldos bancarios de la fecha ${date} antes de realizar el cuadre de agentes.`,
    );
  }
}
