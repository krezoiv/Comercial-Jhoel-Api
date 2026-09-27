import { DomainError } from '../../../../shared/domain/domain-error';

/** `sendToAccountsReceivable: true` without a `clientId` — the checkbox only ever makes sense alongside a registered client, see `RegisterBankDepositOperationUseCase`. */
export class BankDepositAccountsReceivableRequiresClientError extends DomainError {
  readonly status = 400;

  constructor() {
    super(
      'Se requiere un cliente registrado para enviar la transacción a cuentas por cobrar.',
    );
  }
}

/** Registering a Cuentas por Cobrar CARGO is admin-only everywhere else in this app (`POST /accounts-receivable/:clientId/charges`) — sending a deposit to CxC through Transaccionar must respect that same rule, or a non-admin cashier could bypass it entirely. */
export class BankDepositAccountsReceivableForbiddenError extends DomainError {
  readonly status = 403;

  constructor() {
    super(
      'Solo un administrador puede enviar una transacción a cuentas por cobrar.',
    );
  }
}
