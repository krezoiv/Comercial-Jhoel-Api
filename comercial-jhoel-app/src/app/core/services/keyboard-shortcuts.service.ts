import { DestroyRef, Injectable, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { fromEvent } from 'rxjs';

import { KeyboardShortcut } from '../models';
import { KeyboardShortcutService } from './keyboard-shortcut.service';
import { ConfirmDialogService } from './confirm-dialog.service';

const TYPABLE_TAGS = new Set(['INPUT', 'TEXTAREA', 'SELECT']);

/**
 * Global keyboard-shortcut → navigation mechanism, mirroring
 * `FragmentScrollService`'s exact shape (root-provided singleton, one
 * `listen()` method started once from `AppComponent`'s constructor,
 * `takeUntilDestroyed(this.destroyRef)` for its own subscription) — not a
 * new pattern invented for this feature.
 *
 * The shortcut list itself is no longer a hardcoded frontend constant — it
 * comes from `GET /keyboard-shortcuts` (`KeyboardShortcutService`), managed
 * from "Sistema → Atajos de Teclado". This service only caches the active
 * list in memory and matches `keydown` events against it, then calls
 * `Router.navigateByUrl`, so every shortcut goes through the exact same
 * guard/lazy-loading pipeline a normal link click or address-bar navigation
 * would — there is no bypass mechanism to accidentally build here.
 */
@Injectable({ providedIn: 'root' })
export class KeyboardShortcutsService {
  private readonly router = inject(Router);
  private readonly keyboardShortcutService = inject(KeyboardShortcutService);
  private readonly confirmDialogService = inject(ConfirmDialogService);
  private readonly destroyRef = inject(DestroyRef);

  private listening = false;
  private shortcuts: KeyboardShortcut[] = [];

  /**
   * Idempotent on purpose — `AppComponent` is the only intended caller, but
   * guarding here too means a future accidental second call (e.g. from a
   * test bootstrapping the component twice) can never attach a second
   * `keydown` listener.
   */
  listen(): void {
    if (this.listening) {
      return;
    }
    this.listening = true;

    this.refresh();

    fromEvent<KeyboardEvent>(document, 'keydown')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((event) => this.handleKeydown(event));
  }

  /**
   * Re-fetches the active shortcut list — called once on startup, and
   * again by "Sistema → Atajos de Teclado" right after a create/update/
   * deactivate so a change takes effect immediately, without needing a
   * full page reload. A failed fetch just keeps whatever list was already
   * cached (or an empty one on first load) rather than breaking navigation
   * elsewhere in the app.
   */
  refresh(): void {
    this.keyboardShortcutService.getShortcuts().subscribe({
      next: (shortcuts) => (this.shortcuts = shortcuts),
      error: () => {
        // Silently keep the previous list — a transient failure here must
        // never surface as a user-facing error on an unrelated screen.
      },
    });
  }

  private handleKeydown(event: KeyboardEvent): void {
    const shortcut = this.shortcuts.find(
      (s) =>
        s.key.toLowerCase() === event.key.toLowerCase() &&
        s.altKey === event.altKey &&
        s.ctrlKey === event.ctrlKey &&
        s.shiftKey === event.shiftKey &&
        s.metaKey === event.metaKey,
    );
    if (!shortcut) {
      return;
    }

    // Never hijack normal typing — a shortcut combo is still allowed to
    // fire while a field is focused (e.g. Alt+F12 from inside a search
    // box, which can never be part of normal text entry), but a bare,
    // unmodified key never should — every shortcut in this system requires
    // at least one of Alt/Ctrl/Meta (enforced server-side,
    // `CHK_keyboard_shortcuts_requires_modifier`), so this check is
    // defense in depth, not the only thing preventing interference.
    if (this.isTypingTarget(event.target) && !event.altKey && !event.ctrlKey && !event.metaKey) {
      return;
    }

    // A confirm dialog awaiting a response, or any of the app's modals
    // (all sharing the `.modal-backdrop` wrapper), likely holds unsaved
    // input — silently ignore the shortcut rather than risk navigating
    // away from it.
    if (this.confirmDialogService.pending() || document.querySelector('.modal-backdrop')) {
      return;
    }

    if (this.router.url === shortcut.route || this.router.url.startsWith(`${shortcut.route}/`)) {
      return;
    }

    event.preventDefault();
    void this.router.navigateByUrl(shortcut.route);
  }

  private isTypingTarget(target: EventTarget | null): boolean {
    if (!(target instanceof HTMLElement)) {
      return false;
    }
    return TYPABLE_TAGS.has(target.tagName) || target.isContentEditable;
  }
}
