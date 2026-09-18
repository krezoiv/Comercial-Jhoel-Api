import { DomainError } from '../../../../shared/domain/domain-error';

/** Reutilizado tanto para un id inválido (admin) como para un `manage_token` inválido/expirado (público) — nunca revela cuál de los dos casos ocurrió. */
export class NewsSubscriberNotFoundError extends DomainError {
  readonly status = 404;

  constructor() {
    super('No se encontró la suscripción solicitada.');
  }
}
