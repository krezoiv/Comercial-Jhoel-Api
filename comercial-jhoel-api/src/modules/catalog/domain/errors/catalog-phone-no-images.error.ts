import { DomainError } from '../../../../shared/domain/domain-error';

export class CatalogPhoneNoImagesError extends DomainError {
  readonly status = 400;

  constructor() {
    super('Debe agregar al menos una imagen antes de publicar el teléfono.');
  }
}
