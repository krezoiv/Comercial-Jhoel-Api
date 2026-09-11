import { DomainError } from '../../../../shared/domain/domain-error';

/** The `clientId` sent for a deposit doesn't exist, or exists but is inactive — mirrors `ReferencedClientInactiveError`/`ReferencedClientNotFoundError` from the accounts-receivable module, kept module-local per this codebase's per-module error ownership convention. Enforced both here (TypeScript pre-check) and inside `register_bank_deposit_operation` itself (`BANK_DEPOSIT_CLIENT_INVALID`), so a manipulated request can never slip a bogus client id past the pre-check. */
export class InvalidBankDepositClientError extends DomainError {
  readonly status = 400;

  constructor() {
    super('El cliente seleccionado no existe o se encuentra inactivo.');
  }
}
