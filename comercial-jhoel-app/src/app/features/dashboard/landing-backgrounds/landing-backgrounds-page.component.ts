import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';

import { LandingBackground, LANDING_SECTION_OPTIONS } from '../../../core/models';
import { LandingBackgroundService } from '../../../core/services/landing-background.service';
import { ConfirmDialogService } from '../../../core/services/confirm-dialog.service';
import { NotificationService } from '../../../core/services/notification.service';
import { extractErrorMessage } from '../../../core/utils/extract-error-message';
import { ButtonComponent, IconComponent, PageHeaderComponent } from '../../../shared/ui';
import { BackgroundTableComponent } from './components/background-table/background-table.component';
import { BackgroundFormModalComponent } from './components/background-form-modal/background-form-modal.component';
import { BackgroundImageModalComponent } from './components/background-image-modal/background-image-modal.component';
import { BackgroundPreviewModalComponent } from './components/background-preview-modal/background-preview-modal.component';

/**
 * "Sistema → Fondos de Landing" — capas visuales de profundidad (imagen +
 * opacidad + overlay + posición/tamaño + efecto 3D + parallax + movimiento)
 * asignadas a una sección real de la landing pública. Clon estructural de
 * `CatalogBanksPageComponent` — sin orden (`sortOrder`), ya que a lo sumo
 * un fondo activo existe por sección, así que no hay nada que reordenar
 * entre sí.
 */
@Component({
  selector: 'app-landing-backgrounds-page',
  standalone: true,
  imports: [
    PageHeaderComponent,
    ButtonComponent,
    IconComponent,
    BackgroundTableComponent,
    BackgroundFormModalComponent,
    BackgroundImageModalComponent,
    BackgroundPreviewModalComponent,
  ],
  templateUrl: './landing-backgrounds-page.component.html',
  styleUrl: './landing-backgrounds-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LandingBackgroundsPageComponent {
  private readonly landingBackgroundService = inject(LandingBackgroundService);
  private readonly confirmDialogService = inject(ConfirmDialogService);
  private readonly notificationService = inject(NotificationService);

  readonly backgrounds = signal<LandingBackground[]>([]);
  readonly loading = signal(true);

  readonly isFormOpen = signal(false);
  readonly editingBackground = signal<LandingBackground | null>(null);

  readonly imageBackground = signal<LandingBackground | null>(null);
  readonly previewBackground = signal<LandingBackground | null>(null);

  /** Qué `sectionKey` ya tienen un fondo ACTIVO — el formulario usa esto para bloquear proactivamente esa opción al crear uno nuevo, en vez de dejar que el usuario choque con el 409 del backend. */
  readonly activeSectionKeys = computed(
    () => new Set(this.backgrounds().filter((b) => b.isActive).map((b) => b.sectionKey)),
  );

  readonly sectionLabel = (sectionKey: string): string =>
    LANDING_SECTION_OPTIONS.find((option) => option.value === sectionKey)?.label ?? sectionKey;

  constructor() {
    this.fetchBackgrounds();
  }

  fetchBackgrounds(): void {
    this.loading.set(true);
    this.landingBackgroundService.getBackgrounds(true).subscribe({
      next: (backgrounds) => {
        this.backgrounds.set(backgrounds);
        this.loading.set(false);
      },
      error: (error: HttpErrorResponse) => {
        this.loading.set(false);
        this.notificationService.error(extractErrorMessage(error, 'No se pudieron cargar los fondos de landing.'));
      },
    });
  }

  openCreateForm(): void {
    this.editingBackground.set(null);
    this.isFormOpen.set(true);
  }

  openEditForm(background: LandingBackground): void {
    this.editingBackground.set(background);
    this.isFormOpen.set(true);
  }

  closeForm(): void {
    this.isFormOpen.set(false);
  }

  onBackgroundSaved(background: LandingBackground): void {
    const wasEditing = this.editingBackground() !== null;
    this.isFormOpen.set(false);

    this.backgrounds.update((list) =>
      wasEditing ? list.map((b) => (b.id === background.id ? background : b)) : [background, ...list],
    );

    this.notificationService.success(
      wasEditing ? `"${background.name}" se actualizó correctamente.` : `"${background.name}" se creó correctamente.`,
    );

    if (!wasEditing) {
      // Un fondo recién creado no tiene imagen — se abre directo el gestor, mismo patrón que Catálogo de Bancos/Noticias.
      this.imageBackground.set(background);
    }
  }

  openImage(background: LandingBackground): void {
    this.imageBackground.set(background);
  }

  closeImage(): void {
    this.imageBackground.set(null);
  }

  onImageChanged(background: LandingBackground): void {
    this.imageBackground.set(background);
    this.backgrounds.update((list) => list.map((b) => (b.id === background.id ? background : b)));
  }

  openPreview(background: LandingBackground): void {
    this.previewBackground.set(background);
  }

  closePreview(): void {
    this.previewBackground.set(null);
  }

  async toggleActive(background: LandingBackground): Promise<void> {
    const activating = !background.isActive;
    const confirmed = await this.confirmDialogService.confirm({
      type: activating ? 'UPDATE' : 'DELETE',
      title: activating ? 'Activar fondo' : 'Desactivar fondo',
      message: activating
        ? `¿Desea activar "${background.name}"?`
        : `¿Desea desactivar "${background.name}"? Desaparecerá de la landing pública, pero se conservará su configuración.`,
    });
    if (!confirmed) {
      return;
    }

    const request$ = activating
      ? this.landingBackgroundService.activateBackground(background.id)
      : this.landingBackgroundService.deactivateBackground(background.id);

    request$.subscribe({
      next: () => {
        this.backgrounds.update((list) =>
          list.map((b) => (b.id === background.id ? { ...b, isActive: activating } : b)),
        );
        this.notificationService.success(activating ? 'Fondo activado correctamente.' : 'Fondo desactivado correctamente.');
      },
      error: (error: HttpErrorResponse) => {
        this.notificationService.error(extractErrorMessage(error, 'No se pudo actualizar el estado del fondo.'));
      },
    });
  }
}
