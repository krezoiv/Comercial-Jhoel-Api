import { DomainError } from '../../../../shared/domain/domain-error';

/** Nunca se registra una suscripción sin consentimiento explícito — punto 5 del pedido. */
export class ConsentRequiredError extends DomainError {
  readonly status = 400;

  constructor() {
    super('Debes aceptar recibir noticias por WhatsApp para poder suscribirte.');
  }
}
