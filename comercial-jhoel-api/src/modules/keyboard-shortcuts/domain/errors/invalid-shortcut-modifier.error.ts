import { DomainError } from '../../../../shared/domain/domain-error';

/** Mirrors `CHK_keyboard_shortcuts_requires_modifier` — a shortcut with zero modifiers (or only Shift) would shadow ordinary single-key typing everywhere outside a text field. */
export class InvalidShortcutModifierError extends DomainError {
  readonly status = 400;

  constructor() {
    super('El atajo debe incluir al menos Alt, Ctrl o Cmd/Meta.');
  }
}
