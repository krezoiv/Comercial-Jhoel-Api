import { DomainError } from '../../../../shared/domain/domain-error';

export class InvalidLandingBackgroundImageError extends DomainError {
  readonly status = 400;

  constructor(message: string) {
    super(message);
  }
}
