import { DomainError } from '../../../../shared/domain/domain-error';

export class NewsTypeNameAlreadyExistsError extends DomainError {
  readonly status = 409;

  constructor(name: string, isInactive = false) {
    super(
      isInactive
        ? `Ya existe un tipo de noticia con el nombre "${name}", pero está inactivo. Actívalo en vez de crear uno nuevo.`
        : `Ya existe un tipo de noticia con el nombre: ${name}`,
    );
  }
}
