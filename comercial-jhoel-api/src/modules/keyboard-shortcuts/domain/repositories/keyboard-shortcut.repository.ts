import { KeyboardShortcut } from '../entities/keyboard-shortcut.entity';

export const KEYBOARD_SHORTCUT_REPOSITORY = Symbol('KEYBOARD_SHORTCUT_REPOSITORY');

export interface KeyboardShortcutCombo {
  key: string;
  altKey: boolean;
  ctrlKey: boolean;
  shiftKey: boolean;
  metaKey: boolean;
}

export interface CreateKeyboardShortcutData extends KeyboardShortcutCombo {
  label: string;
  route: string;
  createdBy: string;
}

export interface UpdateKeyboardShortcutData {
  label?: string;
  key?: string;
  altKey?: boolean;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  metaKey?: boolean;
  route?: string;
  isActive?: boolean;
  updatedBy: string;
}

export interface FindKeyboardShortcutsOptions {
  activeOnly: boolean;
}

export interface KeyboardShortcutRepository {
  findAll(options: FindKeyboardShortcutsOptions): Promise<KeyboardShortcut[]>;
  findById(id: string): Promise<KeyboardShortcut | null>;
  /** Case-insensitive exact-combo lookup among active rows — mirrors `UQ_keyboard_shortcuts_combo_active`. */
  findByActiveCombo(combo: KeyboardShortcutCombo): Promise<KeyboardShortcut | null>;
  create(data: CreateKeyboardShortcutData): Promise<KeyboardShortcut>;
  update(id: string, data: UpdateKeyboardShortcutData): Promise<KeyboardShortcut>;
  deactivate(id: string): Promise<void>;
}
