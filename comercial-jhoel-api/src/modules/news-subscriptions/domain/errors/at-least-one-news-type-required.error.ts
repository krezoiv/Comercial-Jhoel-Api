import { DomainError } from '../../../../shared/domain/domain-error';

export class AtLeastOneNewsTypeRequiredError extends DomainError {
  readonly status = 400;

  constructor() {
    super('Selecciona al menos un tipo de noticias que deseas recibir.');
  }
}
