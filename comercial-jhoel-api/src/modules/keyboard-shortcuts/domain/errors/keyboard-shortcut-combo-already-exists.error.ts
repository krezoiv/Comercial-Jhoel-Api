import { DomainError } from '../../../../shared/domain/domain-error';

/** Two active shortcuts can never share the exact same key + modifiers — whichever the list returned first would win silently, which is never the intent. */
export class KeyboardShortcutComboAlreadyExistsError extends DomainError {
  readonly status = 409;

  constructor(combo: string) {
    super(`Ya existe un atajo activo con la combinación: ${combo}`);
  }
}
