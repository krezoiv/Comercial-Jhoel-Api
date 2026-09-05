import { DomainError } from '../../../../shared/domain/domain-error';

export class BankDepositDayAlreadyClosedError extends DomainError {
  readonly status = 400;

  constructor(date: string) {
    super(
      `El día correspondiente a esta operación (${date}) ya se encuentra cerrado.`,
    );
  }
}
