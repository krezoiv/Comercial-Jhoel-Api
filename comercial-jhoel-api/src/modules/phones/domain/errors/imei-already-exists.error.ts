import { DomainError } from '../../../../shared/domain/domain-error';

export class ImeiAlreadyExistsError extends DomainError {
  readonly status = 409;

  constructor(imei: string) {
    super(`Ya existe un teléfono registrado con el IMEI: ${imei}`);
  }
}
