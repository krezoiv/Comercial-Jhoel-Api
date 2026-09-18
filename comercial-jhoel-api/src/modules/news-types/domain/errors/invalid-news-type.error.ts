import { DomainError } from '../../../../shared/domain/domain-error';

/** El `newsTypeId` referenciado (al crear una noticia o al suscribirse) no existe o está inactivo. */
export class InvalidNewsTypeError extends DomainError {
  readonly status = 400;

  constructor() {
    super('El tipo de noticia seleccionado no existe o está inactivo.');
  }
}
