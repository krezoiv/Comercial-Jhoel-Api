import { DomainError } from '../../../../shared/domain/domain-error';

export class KeyboardShortcutNotFoundError extends DomainError {
  readonly status = 404;

  constructor(identifier: string) {
    super(`Atajo de teclado no encontrado: ${identifier}`);
  }
}
