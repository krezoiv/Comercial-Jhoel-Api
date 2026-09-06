import { KeyboardShortcutCombo } from '../../domain/repositories/keyboard-shortcut.repository';

/** Human-readable combo for error messages, e.g. `Alt + F11` — never duplicated inline in both create/update use cases. */
export function describeCombo(combo: KeyboardShortcutCombo): string {
  const parts: string[] = [];
  if (combo.ctrlKey) parts.push('Ctrl');
  if (combo.altKey) parts.push('Alt');
  if (combo.shiftKey) parts.push('Shift');
  if (combo.metaKey) parts.push('Cmd');
  parts.push(combo.key.toUpperCase());
  return parts.join(' + ');
}
