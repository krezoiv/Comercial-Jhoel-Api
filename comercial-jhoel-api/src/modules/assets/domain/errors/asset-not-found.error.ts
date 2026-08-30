import { DomainError } from '../../../../shared/domain/domain-error';

export class AssetNotFoundError extends DomainError {
  readonly status = 404;

  constructor() {
    super('El registro solicitado no existe.');
  }
}
