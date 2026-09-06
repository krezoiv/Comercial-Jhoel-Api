import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable } from 'rxjs';

import { KeyboardShortcut, ShortcutRouteOption } from '../../../core/models';
import { KeyboardShortcutService } from '../../../core/services/keyboard-shortcut.service';
import { KeyboardShortcutsService } from '../../../core/services/keyboard-shortcuts.service';
import { ConfirmDialogService } from '../../../core/services/confirm-dialog.service';
import { NotificationService } from '../../../core/services/notification.service';
import { extractErrorMessage } from '../../../core/utils/extract-error-message';
import { buildShortcutRouteOptions } from '../../../core/utils/shortcut-route-options';
import { BadgeComponent, ButtonComponent, EmptyStateComponent, IconComponent } from '../../../shared/ui';

/** Rows to render while `loading` is true — just enough to fill the fold without looking sparse. */
const SKELETON_ROWS = 3;

interface CapturedCombo {
  key: string;
  altKey: boolean;
  ctrlKey: boolean;
  shiftKey: boolean;
  metaKey: boolean;
}

/**
 * "Sistema → Atajos de Teclado" — lets an admin register/edit/desactivate
 * global keyboard shortcuts (e.g. Alt+F12 → Inventario) without touching
 * code. Self-contained, like `PresentationTypesTabComponent` — fetches and
 * mutates directly; a route's own `adminGuard` already keeps a non-admin
 * from ever reaching this page.
 *
 * Right after any create/update/deactivate succeeds, this page calls
 * `KeyboardShortcutsService.refresh()` so the change takes effect
 * immediately for the currently-open session, without requiring a full
 * page reload — the same "the write's own response drives a sibling
 * refresh" pattern already used elsewhere in this app (e.g. Recargas'
 * `closureSaved` → table refetch).
 */
@Component({
  selector: 'app-keyboard-shortcuts-page',
  standalone: true,
  imports: [ReactiveFormsModule, BadgeComponent, ButtonComponent, EmptyStateComponent, IconComponent],
  templateUrl: './keyboard-shortcuts-page.component.html',
  styleUrl: './keyboard-shortcuts-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KeyboardShortcutsPageComponent {
  private readonly keyboardShortcutService = inject(KeyboardShortcutService);
  private readonly keyboardShortcutsService = inject(KeyboardShortcutsService);
  private readonly confirmDialogService = inject(ConfirmDialogService);
  private readonly notificationService = inject(NotificationService);
  private readonly fb = inject(FormBuilder);

  readonly routeOptions: ShortcutRouteOption[] = buildShortcutRouteOptions();

  readonly items = signal<KeyboardShortcut[]>([]);
  readonly loading = signal(true);
  readonly skeletonRows = Array.from({ length: SKELETON_ROWS });

  readonly isFormOpen = signal(false);
  readonly editingItem = signal<KeyboardShortcut | null>(null);
  readonly isSubmitting = signal(false);
  readonly formError = signal<string | null>(null);
  /** `null` until the admin actually presses a key combo in the capture field — the form can't be submitted without one. */
  readonly capturedCombo = signal<CapturedCombo | null>(null);

  readonly form = this.fb.nonNullable.group({
    label: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(150)]],
    route: ['', Validators.required],
  });

  readonly totalCount = computed(() => this.items().length);
  readonly activeCount = computed(() => this.items().filter((i) => i.isActive).length);

  get isEditMode(): boolean {
    return this.editingItem() !== null;
  }

  get comboLabel(): string {
    const combo = this.capturedCombo();
    return combo ? this.describeCombo(combo) : '';
  }

  constructor() {
    this.fetch();
  }

  private fetch(): void {
    this.loading.set(true);
    this.keyboardShortcutService.getShortcuts(true).subscribe({
      next: (items) => {
        this.items.set(items);
        this.loading.set(false);
      },
      error: (error: HttpErrorResponse) => {
        this.loading.set(false);
        this.notificationService.error(extractErrorMessage(error, 'No se pudieron cargar los atajos de teclado.'));
      },
    });
  }

  describeCombo(combo: CapturedCombo): string {
    const parts: string[] = [];
    if (combo.ctrlKey) parts.push('Ctrl');
    if (combo.altKey) parts.push('Alt');
    if (combo.shiftKey) parts.push('Shift');
    if (combo.metaKey) parts.push('Cmd');
    parts.push(combo.key.length === 1 ? combo.key.toUpperCase() : combo.key);
    return parts.join(' + ');
  }

  routeLabel(route: string): string {
    return this.routeOptions.find((o) => o.route === route)?.label ?? route;
  }

  /** Captures a real `keydown` inside the "combinación" field — never lets the admin hand-type a key name (avoids typos like "f11" that would still work, but also avoids "F 11"/"F11 " style mistakes that wouldn't). Ignores a lone modifier press (Alt/Ctrl/Shift/Meta by itself is not a combo). */
  onComboCapture(event: KeyboardEvent): void {
    event.preventDefault();
    const pureModifierKeys = new Set(['Alt', 'Control', 'Shift', 'Meta']);
    if (pureModifierKeys.has(event.key)) {
      return;
    }
    if (!event.altKey && !event.ctrlKey && !event.metaKey) {
      this.formError.set('El atajo debe incluir al menos Alt, Ctrl o Cmd.');
      return;
    }
    this.formError.set(null);
    this.capturedCombo.set({
      key: event.key,
      altKey: event.altKey,
      ctrlKey: event.ctrlKey,
      shiftKey: event.shiftKey,
      metaKey: event.metaKey,
    });
  }

  openCreateForm(): void {
    this.editingItem.set(null);
    this.formError.set(null);
    this.capturedCombo.set(null);
    this.form.reset({ label: '', route: '' });
    this.isFormOpen.set(true);
  }

  openEditForm(item: KeyboardShortcut): void {
    this.editingItem.set(item);
    this.formError.set(null);
    this.capturedCombo.set({
      key: item.key,
      altKey: item.altKey,
      ctrlKey: item.ctrlKey,
      shiftKey: item.shiftKey,
      metaKey: item.metaKey,
    });
    this.form.reset({ label: item.label, route: item.route });
    this.isFormOpen.set(true);
  }

  async closeForm(): Promise<void> {
    if (this.isSubmitting()) {
      return;
    }
    if (this.form.dirty) {
      const discard = await this.confirmDialogService.confirm({ type: 'CANCEL' });
      if (!discard) {
        return;
      }
    }
    this.isFormOpen.set(false);
  }

  async submit(): Promise<void> {
    this.formError.set(null);

    const combo = this.capturedCombo();
    if (this.form.invalid || !combo || this.isSubmitting()) {
      this.form.markAllAsTouched();
      if (!combo) {
        this.formError.set('Presiona la combinación de teclas deseada en el campo correspondiente.');
      }
      return;
    }

    const confirmed = await this.confirmDialogService.confirm({ type: this.isEditMode ? 'UPDATE' : 'SAVE' });
    if (!confirmed) {
      return;
    }

    const { label, route } = this.form.getRawValue();
    const editing = this.editingItem();
    const input = {
      label: label.trim(),
      key: combo.key,
      altKey: combo.altKey,
      ctrlKey: combo.ctrlKey,
      shiftKey: combo.shiftKey,
      metaKey: combo.metaKey,
      route,
    };

    this.isSubmitting.set(true);
    const request$ = editing
      ? this.keyboardShortcutService.updateShortcut(editing.id, input)
      : this.keyboardShortcutService.createShortcut(input);

    request$.subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.isFormOpen.set(false);
        this.notificationService.success(
          editing ? 'El atajo se actualizó correctamente.' : 'El atajo se registró correctamente.',
        );
        this.fetch();
        this.keyboardShortcutsService.refresh();
      },
      error: (error: HttpErrorResponse) => {
        this.isSubmitting.set(false);
        this.formError.set(extractErrorMessage(error, 'No se pudo guardar el atajo. Inténtalo de nuevo.'));
      },
    });
  }

  async toggleActive(item: KeyboardShortcut): Promise<void> {
    const activating = !item.isActive;
    const confirmed = await this.confirmDialogService.confirm({
      type: activating ? 'UPDATE' : 'DELETE',
      title: activating ? 'Confirmar activación' : 'Confirmar desactivación',
      message: activating
        ? `¿Desea activar el atajo "${item.label}"?`
        : `¿Desea desactivar el atajo "${item.label}"? Dejará de funcionar de inmediato.`,
      confirmText: activating ? 'Activar' : 'Desactivar',
    });
    if (!confirmed) {
      return;
    }

    const request$: Observable<unknown> = activating
      ? this.keyboardShortcutService.updateShortcut(item.id, { isActive: true })
      : this.keyboardShortcutService.deactivateShortcut(item.id);

    request$.subscribe({
      next: () => {
        this.notificationService.success(
          activating ? `"${item.label}" se activó correctamente.` : `"${item.label}" se desactivó correctamente.`,
        );
        this.fetch();
        this.keyboardShortcutsService.refresh();
      },
      error: (error: HttpErrorResponse) => {
        this.notificationService.error(
          extractErrorMessage(error, activating ? 'No se pudo activar el atajo.' : 'No se pudo desactivar el atajo.'),
        );
      },
    });
  }
}
