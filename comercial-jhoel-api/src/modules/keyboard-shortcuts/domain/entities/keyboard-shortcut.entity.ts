export interface KeyboardShortcutProps {
  id: string;
  label: string;
  /** `KeyboardEvent.key` value (e.g. `'F11'`) — always compared case-insensitively. */
  key: string;
  altKey: boolean;
  ctrlKey: boolean;
  shiftKey: boolean;
  metaKey: boolean;
  /** Absolute path, always `/dashboard/...` — enforced by `CHK_keyboard_shortcuts_route_is_dashboard`. */
  route: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  createdByUsername: string;
  updatedBy: string | null;
  updatedByUsername: string | null;
}

/**
 * A global keyboard shortcut → dashboard route mapping, configurable from
 * "Sistema → Atajos de Teclado". Read by `KeyboardShortcutsService`
 * (frontend) to drive `Router.navigateByUrl` — this entity itself has no
 * awareness of navigation, guards, or the frontend at all, same separation
 * every other Sistema catalog (Categorías, Tipos de Transacción...) keeps.
 */
export class KeyboardShortcut {
  private constructor(private readonly props: KeyboardShortcutProps) {}

  static create(props: KeyboardShortcutProps): KeyboardShortcut {
    return new KeyboardShortcut(props);
  }

  get id(): string {
    return this.props.id;
  }

  get label(): string {
    return this.props.label;
  }

  get key(): string {
    return this.props.key;
  }

  get altKey(): boolean {
    return this.props.altKey;
  }

  get ctrlKey(): boolean {
    return this.props.ctrlKey;
  }

  get shiftKey(): boolean {
    return this.props.shiftKey;
  }

  get metaKey(): boolean {
    return this.props.metaKey;
  }

  get route(): string {
    return this.props.route;
  }

  get isActive(): boolean {
    return this.props.isActive;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  get createdBy(): string {
    return this.props.createdBy;
  }

  get createdByUsername(): string {
    return this.props.createdByUsername;
  }

  get updatedBy(): string | null {
    return this.props.updatedBy;
  }

  get updatedByUsername(): string | null {
    return this.props.updatedByUsername;
  }

  /** Mirrors `CHK_keyboard_shortcuts_requires_modifier` — Shift alone never counts (Shift+letter is normal typing for a capital letter). */
  hasRequiredModifier(): boolean {
    return this.altKey || this.ctrlKey || this.metaKey;
  }
}
