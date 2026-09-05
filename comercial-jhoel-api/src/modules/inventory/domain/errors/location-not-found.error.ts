import { DomainError } from '../../../../shared/domain/domain-error';

export class LocationNotFoundError extends DomainError {
  readonly status = 404;

  constructor(identifier: string) {
    super(`No se encontró la ubicación de inventario: ${identifier}.`);
  }
}

export class LocationInactiveError extends DomainError {
  readonly status = 400;

  constructor(identifier: string) {
    super(`La ubicación de inventario ${identifier} no está activa.`);
  }
}
