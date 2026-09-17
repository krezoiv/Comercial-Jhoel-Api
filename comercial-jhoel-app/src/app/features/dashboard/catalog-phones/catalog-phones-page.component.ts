import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { CatalogPhone } from '../../../core/models';
import { CatalogPhoneService } from '../../../core/services/catalog-phone.service';
import { ConfirmDialogService } from '../../../core/services/confirm-dialog.service';
import { NotificationService } from '../../../core/services/notification.service';
import { extractErrorMessage } from '../../../core/utils/extract-error-message';
import { ButtonComponent, IconComponent, PageHeaderComponent } from '../../../shared/ui';
import { CatalogPhoneTableComponent } from './components/catalog-phone-table/catalog-phone-table.component';
import { CatalogPhoneFormModalComponent } from './components/catalog-phone-form-modal/catalog-phone-form-modal.component';
import { CatalogPhoneImagesModalComponent } from './components/catalog-phone-images-modal/catalog-phone-images-modal.component';

type StatusFilter = 'all' | 'active' | 'inactive' | 'published' | 'unpublished';

/**
 * "Catálogo → Teléfonos" — administración completa de la vitrina comercial
 * pública. Ruta ya `adminGuard`-gated en `app.routes.ts` (todo el
 * `CatalogPhonesController` es admin-only en el backend, incluido el
 * listado, porque expone teléfonos no publicados) — sin `canManage`, mismo
 * "ya inalcanzable para un no-admin" que Usuarios/Roles.
 */
@Component({
  selector: 'app-catalog-phones-page',
  standalone: true,
  imports: [
    FormsModule,
    PageHeaderComponent,
    ButtonComponent,
    IconComponent,
    CatalogPhoneTableComponent,
    CatalogPhoneFormModalComponent,
    CatalogPhoneImagesModalComponent,
  ],
  templateUrl: './catalog-phones-page.component.html',
  styleUrl: './catalog-phones-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CatalogPhonesPageComponent {
  private readonly catalogPhoneService = inject(CatalogPhoneService);
  private readonly confirmDialogService = inject(ConfirmDialogService);
  private readonly notificationService = inject(NotificationService);

  readonly phones = signal<CatalogPhone[]>([]);
  readonly loading = signal(true);

  readonly searchTerm = signal('');
  readonly statusFilter = signal<StatusFilter>('all');

  readonly isFormOpen = signal(false);
  readonly editingPhone = signal<CatalogPhone | null>(null);

  readonly imagesPhone = signal<CatalogPhone | null>(null);

  readonly filteredPhones = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    const status = this.statusFilter();

    return this.phones().filter((phone) => {
      const matchesTerm =
        !term || phone.brand.toLowerCase().includes(term) || phone.model.toLowerCase().includes(term);
      const matchesStatus =
        status === 'all' ||
        (status === 'active' && phone.isActive) ||
        (status === 'inactive' && !phone.isActive) ||
        (status === 'published' && phone.isPublished) ||
        (status === 'unpublished' && !phone.isPublished);
      return matchesTerm && matchesStatus;
    });
  });

  readonly hasActiveFilters = computed(() => this.searchTerm().trim().length > 0 || this.statusFilter() !== 'all');

  readonly statusOptions: { value: StatusFilter; label: string }[] = [
    { value: 'all', label: 'Todos' },
    { value: 'published', label: 'Publicados' },
    { value: 'unpublished', label: 'Sin publicar' },
    { value: 'active', label: 'Activos' },
    { value: 'inactive', label: 'Inactivos' },
  ];

  constructor() {
    this.fetchPhones();
  }

  fetchPhones(): void {
    this.loading.set(true);
    this.catalogPhoneService.getPhones(true).subscribe({
      next: (phones) => {
        this.phones.set(phones);
        this.loading.set(false);
      },
      error: (error: HttpErrorResponse) => {
        this.loading.set(false);
        this.notificationService.error(extractErrorMessage(error, 'No se pudieron cargar los teléfonos del catálogo.'));
      },
    });
  }

  clearFilters(): void {
    this.searchTerm.set('');
    this.statusFilter.set('all');
  }

  openCreateForm(): void {
    this.editingPhone.set(null);
    this.isFormOpen.set(true);
  }

  openEditForm(phone: CatalogPhone): void {
    this.editingPhone.set(phone);
    this.isFormOpen.set(true);
  }

  closeForm(): void {
    this.isFormOpen.set(false);
  }

  onPhoneSaved(phone: CatalogPhone): void {
    const wasEditing = this.editingPhone() !== null;
    this.isFormOpen.set(false);

    this.phones.update((list) =>
      wasEditing ? list.map((p) => (p.id === phone.id ? phone : p)) : [phone, ...list],
    );

    this.notificationService.success(
      wasEditing ? `"${phone.brand} ${phone.model}" se actualizó correctamente.` : `"${phone.brand} ${phone.model}" se agregó correctamente.`,
    );

    if (!wasEditing) {
      // A un teléfono recién creado le faltan fotos — se abre directo el gestor de imágenes.
      this.imagesPhone.set(phone);
    }
  }

  openImages(phone: CatalogPhone): void {
    this.imagesPhone.set(phone);
  }

  closeImages(): void {
    this.imagesPhone.set(null);
  }

  onImagesChanged(phone: CatalogPhone): void {
    this.imagesPhone.set(phone);
    this.phones.update((list) => list.map((p) => (p.id === phone.id ? phone : p)));
  }

  async toggleActive(phone: CatalogPhone): Promise<void> {
    const activating = !phone.isActive;
    const confirmed = await this.confirmDialogService.confirm({
      type: activating ? 'UPDATE' : 'DELETE',
      title: activating ? 'Activar teléfono' : 'Desactivar teléfono',
      message: activating
        ? `¿Desea activar "${phone.brand} ${phone.model}"?`
        : `¿Desea desactivar "${phone.brand} ${phone.model}"? Se desactivará y se ocultará del catálogo público si estaba publicado.`,
    });
    if (!confirmed) {
      return;
    }

    const request$ = activating ? this.catalogPhoneService.activatePhone(phone.id) : this.catalogPhoneService.deactivatePhone(phone.id);
    request$.subscribe({
      next: () => {
        this.phones.update((list) =>
          list.map((p) =>
            p.id === phone.id ? { ...p, isActive: activating, isPublished: activating ? p.isPublished : false } : p,
          ),
        );
        this.notificationService.success(activating ? 'Teléfono activado correctamente.' : 'Teléfono desactivado correctamente.');
      },
      error: (error: HttpErrorResponse) => {
        this.notificationService.error(extractErrorMessage(error, 'No se pudo actualizar el estado del teléfono.'));
      },
    });
  }

  async togglePublish(phone: CatalogPhone): Promise<void> {
    const publishing = !phone.isPublished;
    const confirmed = await this.confirmDialogService.confirm({
      type: 'UPDATE',
      title: publishing ? 'Publicar en el catálogo' : 'Quitar del catálogo',
      message: publishing
        ? `¿Desea publicar "${phone.brand} ${phone.model}" en la landing pública?`
        : `¿Desea despublicar "${phone.brand} ${phone.model}"? Dejará de mostrarse en la landing pública.`,
    });
    if (!confirmed) {
      return;
    }

    const request$ = publishing ? this.catalogPhoneService.publishPhone(phone.id) : this.catalogPhoneService.unpublishPhone(phone.id);
    request$.subscribe({
      next: () => {
        this.phones.update((list) => list.map((p) => (p.id === phone.id ? { ...p, isPublished: publishing } : p)));
        this.notificationService.success(publishing ? 'Teléfono publicado en el catálogo.' : 'Teléfono despublicado.');
      },
      error: (error: HttpErrorResponse) => {
        this.notificationService.error(extractErrorMessage(error, 'No se pudo publicar el teléfono.'));
      },
    });
  }

  moveUp(phone: CatalogPhone): void {
    const list = this.phones();
    const index = list.findIndex((p) => p.id === phone.id);
    if (index <= 0) {
      return;
    }
    this.swapOrder(list, index, index - 1);
  }

  moveDown(phone: CatalogPhone): void {
    const list = this.phones();
    const index = list.findIndex((p) => p.id === phone.id);
    if (index === -1 || index >= list.length - 1) {
      return;
    }
    this.swapOrder(list, index, index + 1);
  }

  private swapOrder(list: CatalogPhone[], indexA: number, indexB: number): void {
    const reordered = [...list];
    [reordered[indexA], reordered[indexB]] = [reordered[indexB], reordered[indexA]];

    const items = reordered.map((phone, index) => ({ id: phone.id, sortOrder: index }));
    this.catalogPhoneService.reorderPhones(items).subscribe({
      next: () => {
        this.phones.set(reordered.map((phone, index) => ({ ...phone, sortOrder: index })));
      },
      error: (error: HttpErrorResponse) => {
        this.notificationService.error(extractErrorMessage(error, 'No se pudo cambiar el orden.'));
      },
    });
  }
}
