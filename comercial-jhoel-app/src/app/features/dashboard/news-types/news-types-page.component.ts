import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Observable, map } from 'rxjs';

import { NewsType } from '../../../core/models';
import { NewsTypeService } from '../../../core/services/news-type.service';
import { ConfirmDialogService } from '../../../core/services/confirm-dialog.service';
import { NotificationService } from '../../../core/services/notification.service';
import { extractErrorMessage } from '../../../core/utils/extract-error-message';
import { ButtonComponent, IconComponent, PageHeaderComponent } from '../../../shared/ui';
import { NewsTypeTableComponent } from './components/news-type-table/news-type-table.component';
import { NewsTypeFormModalComponent } from './components/news-type-form-modal/news-type-form-modal.component';

type StatusFilter = 'all' | 'active' | 'inactive';

/**
 * "Sistema → Tipos de Noticias" — catálogo maestro y configurable de
 * clasificaciones (Comercial, Educativa, Promociones, ...). Extensible sin
 * tocar código: crear un tipo nuevo aquí lo hace aparecer automáticamente
 * en el selector "Tipo de noticia" del formulario de Noticias y en el
 * formulario público de suscripción.
 */
@Component({
  selector: 'app-news-types-page',
  standalone: true,
  imports: [FormsModule, PageHeaderComponent, ButtonComponent, IconComponent, NewsTypeTableComponent, NewsTypeFormModalComponent],
  templateUrl: './news-types-page.component.html',
  styleUrl: './news-types-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewsTypesPageComponent {
  private readonly newsTypeService = inject(NewsTypeService);
  private readonly confirmDialogService = inject(ConfirmDialogService);
  private readonly notificationService = inject(NotificationService);

  readonly types = signal<NewsType[]>([]);
  readonly loading = signal(true);

  readonly searchTerm = signal('');
  readonly statusFilter = signal<StatusFilter>('all');

  readonly isFormOpen = signal(false);
  readonly editingType = signal<NewsType | null>(null);

  readonly filteredTypes = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    const status = this.statusFilter();

    return this.types().filter((type) => {
      const matchesTerm = !term || type.name.toLowerCase().includes(term);
      const matchesStatus =
        status === 'all' || (status === 'active' && type.isActive) || (status === 'inactive' && !type.isActive);
      return matchesTerm && matchesStatus;
    });
  });

  readonly hasActiveFilters = computed(() => this.searchTerm().trim().length > 0 || this.statusFilter() !== 'all');

  readonly statusOptions: { value: StatusFilter; label: string }[] = [
    { value: 'all', label: 'Todos' },
    { value: 'active', label: 'Activos' },
    { value: 'inactive', label: 'Inactivos' },
  ];

  constructor() {
    this.fetchTypes();
  }

  fetchTypes(): void {
    this.loading.set(true);
    this.newsTypeService.getTypes(true).subscribe({
      next: (types) => {
        this.types.set(types);
        this.loading.set(false);
      },
      error: (error: HttpErrorResponse) => {
        this.loading.set(false);
        this.notificationService.error(extractErrorMessage(error, 'No se pudieron cargar los tipos de noticia.'));
      },
    });
  }

  clearFilters(): void {
    this.searchTerm.set('');
    this.statusFilter.set('all');
  }

  openCreateForm(): void {
    this.editingType.set(null);
    this.isFormOpen.set(true);
  }

  openEditForm(type: NewsType): void {
    this.editingType.set(type);
    this.isFormOpen.set(true);
  }

  closeForm(): void {
    this.isFormOpen.set(false);
  }

  onTypeSaved(type: NewsType): void {
    const wasEditing = this.editingType() !== null;
    this.isFormOpen.set(false);

    this.types.update((list) => (wasEditing ? list.map((t) => (t.id === type.id ? type : t)) : [...list, type]));

    this.notificationService.success(
      wasEditing ? `"${type.name}" se actualizó correctamente.` : `"${type.name}" se creó correctamente.`,
    );
  }

  async toggleActive(type: NewsType): Promise<void> {
    const activating = !type.isActive;
    const confirmed = await this.confirmDialogService.confirm({
      type: activating ? 'UPDATE' : 'DELETE',
      title: activating ? 'Activar tipo de noticia' : 'Desactivar tipo de noticia',
      message: activating
        ? `¿Desea activar "${type.name}"?`
        : `¿Desea desactivar "${type.name}"? Dejará de aparecer como opción para noticias/suscripciones nuevas, pero las noticias existentes conservan su clasificación.`,
    });
    if (!confirmed) {
      return;
    }

    // `updateType`/`deactivateType` devuelven Observables de tipos distintos
    // (NewsType vs. void) — normalizados a `void` aquí para poder compartir
    // un solo `.subscribe()`, ya que ninguno de los dos casos necesita leer
    // el valor emitido (el estado se actualiza localmente igual en ambos).
    const request$: Observable<void> = activating
      ? this.newsTypeService.updateType(type.id, { isActive: true }).pipe(map(() => undefined))
      : this.newsTypeService.deactivateType(type.id);
    request$.subscribe({
      next: () => {
        this.types.update((list) => list.map((t) => (t.id === type.id ? { ...t, isActive: activating } : t)));
        this.notificationService.success(activating ? 'Tipo de noticia activado correctamente.' : 'Tipo de noticia desactivado correctamente.');
      },
      error: (error: HttpErrorResponse) => {
        this.notificationService.error(extractErrorMessage(error, 'No se pudo actualizar el estado.'));
      },
    });
  }

  moveUp(type: NewsType): void {
    const list = this.types();
    const index = list.findIndex((t) => t.id === type.id);
    if (index <= 0) {
      return;
    }
    this.swapOrder(list, index, index - 1);
  }

  moveDown(type: NewsType): void {
    const list = this.types();
    const index = list.findIndex((t) => t.id === type.id);
    if (index === -1 || index >= list.length - 1) {
      return;
    }
    this.swapOrder(list, index, index + 1);
  }

  private swapOrder(list: NewsType[], indexA: number, indexB: number): void {
    const reordered = [...list];
    [reordered[indexA], reordered[indexB]] = [reordered[indexB], reordered[indexA]];

    const items = reordered.map((type, index) => ({ id: type.id, sortOrder: index }));
    this.newsTypeService.reorderTypes(items).subscribe({
      next: () => {
        this.types.set(reordered.map((type, index) => ({ ...type, sortOrder: index })));
      },
      error: (error: HttpErrorResponse) => {
        this.notificationService.error(extractErrorMessage(error, 'No se pudo cambiar el orden.'));
      },
    });
  }
}
