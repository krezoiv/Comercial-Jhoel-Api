import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';

import { Supplier } from '../../../core/models';
import { AuthService } from '../../../core/services/auth.service';
import { SupplierService } from '../../../core/services/supplier.service';
import { NotificationService } from '../../../core/services/notification.service';
import { extractErrorMessage } from '../../../core/utils/extract-error-message';
import { PageHeaderComponent } from '../../../shared/ui';
import { SupplierSummaryComponent } from './components/supplier-summary/supplier-summary.component';
import { SupplierToolbarComponent, StatusFilterValue } from './components/supplier-toolbar/supplier-toolbar.component';
import { SupplierTableComponent } from './components/supplier-table/supplier-table.component';
import { SupplierFormModalComponent } from './components/supplier-form-modal/supplier-form-modal.component';
import { DeleteConfirmModalComponent } from './components/delete-confirm-modal/delete-confirm-modal.component';

@Component({
  selector: 'app-suppliers-page',
  standalone: true,
  imports: [
    PageHeaderComponent,
    SupplierSummaryComponent,
    SupplierToolbarComponent,
    SupplierTableComponent,
    SupplierFormModalComponent,
    DeleteConfirmModalComponent,
  ],
  templateUrl: './suppliers-page.component.html',
  styleUrl: './suppliers-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
/** A structural clone of `CategoriesPageComponent` — see that component's own doc comment. One real difference: uniqueness is on `taxId`, not `name` (see the backend's `SuppliersController`), so this screen's search/filter never assumes `name` is unique. */
export class SuppliersPageComponent {
  private readonly supplierService = inject(SupplierService);
  private readonly notificationService = inject(NotificationService);
  private readonly authService = inject(AuthService);

  /** ADMIN/SUPER_ADMIN only — passed down to hide add/edit/delete for USER. The backend enforces this regardless. */
  readonly isAdmin = this.authService.isAdmin;

  /** The full catalog — always the unfiltered list, so summary tiles never shrink while searching. */
  readonly suppliers = signal<Supplier[]>([]);
  readonly loading = signal(true);

  readonly searchTerm = signal('');
  readonly statusFilter = signal<StatusFilterValue>('all');
  /** `null` = no active server search; set from the debounced backend search below. */
  private readonly searchResults = signal<Supplier[] | null>(null);
  private readonly searchTerm$ = new Subject<string>();

  readonly isFormOpen = signal(false);
  readonly editingSupplier = signal<Supplier | null>(null);

  readonly isDeleteOpen = signal(false);
  readonly deletingSupplier = signal<Supplier | null>(null);
  readonly isDeleting = signal(false);

  /**
   * With a search term, the backend already matched name/taxId/phone
   * accent/case-insensitively (see `SupplierService.getSuppliers`'s `search`
   * param, backed by `search_normalize()`) — this only narrows further by
   * status, never re-does text matching in JS.
   */
  readonly filteredSuppliers = computed(() => {
    const term = this.searchTerm().trim();
    const status = this.statusFilter();
    const base = term ? (this.searchResults() ?? []) : this.suppliers();

    return base.filter((supplier) => {
      const matchesStatus =
        status === 'all' || (status === 'active' ? supplier.isActive : !supplier.isActive);
      return matchesStatus;
    });
  });

  readonly hasActiveFilters = computed(() => this.searchTerm().trim().length > 0 || this.statusFilter() !== 'all');

  constructor() {
    this.fetchSuppliers();

    this.searchTerm$
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntilDestroyed())
      .subscribe((term) => {
        const trimmed = term.trim();
        if (!trimmed) {
          this.searchResults.set(null);
          return;
        }
        this.supplierService.getSuppliers(true, trimmed).subscribe({
          next: (suppliers) => this.searchResults.set(suppliers),
          error: () => this.notificationService.error('No se pudo buscar proveedores.'),
        });
      });
  }

  private fetchSuppliers(): void {
    this.loading.set(true);
    // Admin management screen — shows inactive suppliers too (with a status badge/filter).
    this.supplierService.getSuppliers(true).subscribe({
      next: (suppliers) => {
        this.suppliers.set(suppliers);
        this.loading.set(false);
      },
      error: (error: HttpErrorResponse) => {
        this.loading.set(false);
        this.notificationService.error(extractErrorMessage(error, 'No se pudieron cargar los proveedores.'));
      },
    });
  }

  onSearchTermChange(value: string): void {
    this.searchTerm.set(value);
    if (!value.trim()) {
      this.searchResults.set(null);
    }
    this.searchTerm$.next(value);
  }

  openCreateForm(): void {
    this.editingSupplier.set(null);
    this.isFormOpen.set(true);
  }

  openEditForm(supplier: Supplier): void {
    this.editingSupplier.set(supplier);
    this.isFormOpen.set(true);
  }

  closeForm(): void {
    this.isFormOpen.set(false);
  }

  onSupplierSaved(supplier: Supplier): void {
    const wasEditing = this.editingSupplier() !== null;
    this.isFormOpen.set(false);

    this.suppliers.update((list) =>
      wasEditing ? list.map((s) => (s.id === supplier.id ? supplier : s)) : [supplier, ...list]
    );

    this.notificationService.success(
      wasEditing ? `"${supplier.name}" se actualizó correctamente.` : `"${supplier.name}" se agregó correctamente.`
    );
  }

  requestDelete(supplier: Supplier): void {
    this.deletingSupplier.set(supplier);
    this.isDeleteOpen.set(true);
  }

  cancelDelete(): void {
    this.isDeleteOpen.set(false);
    this.deletingSupplier.set(null);
  }

  confirmDelete(): void {
    const supplier = this.deletingSupplier();
    if (!supplier) {
      return;
    }

    this.isDeleting.set(true);
    this.supplierService.deleteSupplier(supplier.id).subscribe({
      next: () => {
        this.isDeleting.set(false);
        this.isDeleteOpen.set(false);
        this.deletingSupplier.set(null);
        this.suppliers.update((list) =>
          list.map((s) => (s.id === supplier.id ? { ...s, isActive: false } : s))
        );
        this.notificationService.success(`"${supplier.name}" se desactivó correctamente.`);
      },
      error: (error: HttpErrorResponse) => {
        this.isDeleting.set(false);
        this.notificationService.error(extractErrorMessage(error, 'No se pudo desactivar el proveedor.'));
      },
    });
  }

  clearFilters(): void {
    this.searchTerm.set('');
    this.statusFilter.set('all');
    this.searchResults.set(null);
  }
}
