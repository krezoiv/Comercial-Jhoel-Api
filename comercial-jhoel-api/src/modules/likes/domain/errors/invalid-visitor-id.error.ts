import { DomainError } from '../../../../shared/domain/domain-error';

/** Falta el header `X-Visitor-Id` o no es un UUID — requerido en like/unlike, nunca confiado sin validar. */
export class InvalidVisitorIdError extends DomainError {
  readonly status = 400;

  constructor() {
    super('Identificador de visitante inválido o ausente.');
  }
}
