import { DomainError } from '../../../../shared/domain/domain-error';

/**
 * Transaccionar reuses Banks' own día-abierto/cerrado cycle (`DAY_OPENING_REPOSITORY`,
 * exported by `BanksModule`) rather than a parallel one — see `RegisterBankDepositOperationUseCase`.
 * This is a module-scoped error class of its own (not a reuse of Banks' `DayNotOpenedError`),
 * consistent with how every other module in this codebase owns its own error classes even when
 * the underlying condition is conceptually shared (e.g. `SaleProductNotFoundError` vs
 * `PurchaseProductNotFoundError`). Never thrown for a past date — only today requires an opening.
 */
export class BankDepositDayNotOpenedError extends DomainError {
  readonly status = 400;

  constructor(date: string) {
    super(`Debe aperturar el día ${date} antes de registrar transacciones.`);
  }
}
