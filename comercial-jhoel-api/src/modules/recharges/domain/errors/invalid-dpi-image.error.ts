import { DomainError } from '../../../../shared/domain/domain-error';

export class InvalidDpiImageError extends DomainError {
  readonly status = 400;

  constructor(message: string) {
    super(message);
  }
}
