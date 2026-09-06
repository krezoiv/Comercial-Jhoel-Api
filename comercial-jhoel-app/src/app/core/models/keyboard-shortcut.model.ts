/**
 * A global keyboard shortcut → dashboard route mapping, backed by
 * `GET/POST/PATCH/DELETE /keyboard-shortcuts` — configurable from
 * "Sistema → Atajos de Teclado". `KeyboardShortcutsService` (the listener)
 * is the only consumer that matches these against real `keydown` events;
 * this model has no awareness of navigation itself.
 */
export interface KeyboardShortcut {
  id: string;
  label: string;
  /** `KeyboardEvent.key` value (e.g. `'F11'`), always compared case-insensitively. */
  key: string;
  altKey: boolean;
  ctrlKey: boolean;
  shiftKey: boolean;
  metaKey: boolean;
  /** Absolute path, always `/dashboard/...`. */
  route: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  createdByUsername: string;
  updatedBy: string | null;
  updatedByUsername: string | null;
}

export interface CreateKeyboardShortcutInput {
  label: string;
  key: string;
  altKey?: boolean;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  metaKey?: boolean;
  route: string;
}

export interface UpdateKeyboardShortcutInput {
  label?: string;
  key?: string;
  altKey?: boolean;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  metaKey?: boolean;
  route?: string;
  isActive?: boolean;
}

/** One entry in the "Ruta destino" dropdown — built from `DASHBOARD_NAV_ITEMS` (the same list the sidebar itself renders from), never free text, so a shortcut can never point at a typo'd/nonexistent route. */
export interface ShortcutRouteOption {
  label: string;
  route: string;
}
