import { DomainError } from '../../../../shared/domain/domain-error';

export class PresentationTypeNameAlreadyExistsError extends DomainError {
  readonly status = 409;

  constructor(name: string, isInactive = false) {
    super(
      isInactive
        ? `Ya existe una presentación con el nombre "${name}", pero está inactiva. Actívala en vez de crear una nueva.`
        : `Ya existe una presentación con el nombre: ${name}`,
    );
  }
}
