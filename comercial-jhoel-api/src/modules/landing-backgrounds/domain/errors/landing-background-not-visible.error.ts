import { DomainError } from '../../../../shared/domain/domain-error';

/** Reusado tanto para "no existe" como para "existe pero está inactivo/sin imagen" — un 404 público nunca revela cuál de los casos ocurrió. */
export class LandingBackgroundNotVisibleError extends DomainError {
  readonly status = 404;

  constructor() {
    super('El fondo solicitado no está disponible.');
  }
}
