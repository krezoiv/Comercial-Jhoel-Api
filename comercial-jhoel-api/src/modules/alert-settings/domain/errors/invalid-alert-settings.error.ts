import { DomainError } from '../../../../shared/domain/domain-error';

export class InvalidAlertSettingsError extends DomainError {
  readonly status = 400;

  constructor(message: string) {
    super(message);
  }
}
