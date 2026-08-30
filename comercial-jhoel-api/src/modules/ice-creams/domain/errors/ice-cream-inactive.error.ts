import { DomainError } from '../../../../shared/domain/domain-error';

export class IceCreamInactiveError extends DomainError {
  readonly status = 400;

  constructor(iceCreamId: string) {
    super(`Este helado no está disponible: ${iceCreamId}`);
  }
}
