import { KeyboardShortcut } from '../../domain/entities/keyboard-shortcut.entity';

export interface KeyboardShortcutOutput {
  id: string;
  label: string;
  key: string;
  altKey: boolean;
  ctrlKey: boolean;
  shiftKey: boolean;
  metaKey: boolean;
  route: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  createdByUsername: string;
  updatedBy: string | null;
  updatedByUsername: string | null;
}

export function toKeyboardShortcutOutput(shortcut: KeyboardShortcut): KeyboardShortcutOutput {
  return {
    id: shortcut.id,
    label: shortcut.label,
    key: shortcut.key,
    altKey: shortcut.altKey,
    ctrlKey: shortcut.ctrlKey,
    shiftKey: shortcut.shiftKey,
    metaKey: shortcut.metaKey,
    route: shortcut.route,
    isActive: shortcut.isActive,
    createdAt: shortcut.createdAt,
    updatedAt: shortcut.updatedAt,
    createdBy: shortcut.createdBy,
    createdByUsername: shortcut.createdByUsername,
    updatedBy: shortcut.updatedBy,
    updatedByUsername: shortcut.updatedByUsername,
  };
}
