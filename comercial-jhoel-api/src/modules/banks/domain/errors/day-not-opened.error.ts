import { DomainError } from '../../../../shared/domain/domain-error';

/**
 * "The user must NOT be able to freely access... until the sequence is
 * properly completed: open the day → register balances → save → confirm."
 * This error covers the two halves of that sequence that depend on
 * having opened the day first: saving TODAY's bank balances
 * (`SaveBankBalancesUseCase`) and saving an agent reconciliation
 * (`CloseAgentDayUseCase`). Never thrown for a past date — those
 * historical corrections are pre-existing functionality this ticket was
 * required to preserve unchanged.
 */
export class DayNotOpenedError extends DomainError {
  readonly status = 400;

  constructor(
    date: string,
    action: 'balances' | 'reconciliation' = 'balances',
  ) {
    super(
      action === 'reconciliation'
        ? `Debe aperturar el día y guardar los saldos bancarios correspondientes antes de realizar el cuadre de agentes.`
        : `Debe aperturar el día ${date} antes de registrar los saldos bancarios.`,
    );
  }
}
