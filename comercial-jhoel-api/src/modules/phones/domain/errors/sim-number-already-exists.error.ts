import { DomainError } from '../../../../shared/domain/domain-error';

export class SimNumberAlreadyExistsError extends DomainError {
  readonly status = 409;

  constructor(simNumber: string) {
    super(`Ya existe un teléfono registrado con la SIM: ${simNumber}`);
  }
}
