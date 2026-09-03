import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subject, debounceTime } from 'rxjs';

import { Asset, Client } from '../../../core/models';
import { AssetService } from '../../../core/services/asset.service';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';
import { extractErrorMessage } from '../../../core/utils/extract-error-message';
import { ReportPaginationComponent } from '../reports/components/report-pagination/report-pagination.component';
import { AssetToolbarComponent, AssetStatusFilterValue } from './components/asset-toolbar/asset-toolbar.component';
import { AssetTableComponent } from './components/asset-table/asset-table.component';
import { AssetFormModalComponent } from './components/asset-form-modal/asset-form-modal.component';
import { DeleteConfirmModalComponent } from './components/delete-confirm-modal/delete-confirm-modal.component';

const LIMIT = 20;

@Component({
  selector: 'app-assets-page',
  standalone: true,
  imports: [
    AssetToolbarComponent,
    AssetTableComponent,
    AssetFormModalComponent,
    DeleteConfirmModalComponent,
    ReportPaginationComponent,
  ],
  templateUrl: './assets-page.component.html',
  styleUrl: './assets-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
/**
 * Unlike `UsersPageComponent`/`BanksPageComponent` (client-side filtering
 * over one fully-fetched list, optimistic local patching after save/
 * delete), this page uses real server-side pagination — every filter
 * change (search, status, client, date range, page) calls `fetchRecords()`
 * again rather than filtering an in-memory array, and a save/delete
 * refetches the current page rather than patching `records` in place,
 * since a deactivated/edited row may need to leave the page it was on
 * entirely. `AccountsReceivablePageComponent` is the identical clone.
 */
export class AssetsPageComponent {
  private readonly assetService = inject(AssetService);
  private readonly notificationService = inject(NotificationService);
  private readonly authService = inject(AuthService);

  /** ADMIN/SUPER_ADMIN only — passed down to hide add/edit/delete for other roles. The backend enforces this regardless. */
  readonly isAdmin = this.authService.isAdmin;

  readonly records = signal<Asset[]>([]);
  readonly total = signal(0);
  readonly loading = signal(true);
  readonly limit = LIMIT;

  readonly searchTerm = signal('');
  readonly statusFilter = signal<AssetStatusFilterValue>('all');
  readonly clientFilter = signal<Client | null>(null);
  readonly dateFrom = signal('');
  readonly dateTo = signal('');
  readonly page = signal(1);

  readonly isFormOpen = signal(false);
  readonly editingRecord = signal<Asset | null>(null);

  readonly isDeleteOpen = signal(false);
  readonly deletingRecord = signal<Asset | null>(null);
  readonly isDeleting = signal(false);

  readonly hasActiveFilters = computed(
    () =>
      this.searchTerm().trim().length > 0 ||
      this.statusFilter() !== 'all' ||
      this.clientFilter() !== null ||
      this.dateFrom() !== '' ||
      this.dateTo() !== '',
  );

  private readonly searchTerm$ = new Subject<void>();

  constructor() {
    this.searchTerm$.pipe(debounceTime(300), takeUntilDestroyed()).subscribe(() => {
      this.page.set(1);
      this.fetchRecords();
    });
    this.fetchRecords();
  }

  private fetchRecords(): void {
    this.loading.set(true);
    const status = this.statusFilter();
    this.assetService
      .getAssets({
        search: this.searchTerm().trim() || undefined,
        clientId: this.clientFilter()?.id,
        dateFrom: this.dateFrom() || undefined,
        dateTo: this.dateTo() || undefined,
        isActive: status === 'all' ? undefined : status === 'active',
        page: this.page(),
        limit: this.limit,
      })
      .subscribe({
        next: (result) => {
          this.records.set(result.items);
          this.total.set(result.total);
          this.loading.set(false);
        },
        error: (error: HttpErrorResponse) => {
          this.loading.set(false);
          this.notificationService.error(extractErrorMessage(error, 'No se pudieron cargar los activos.'));
        },
      });
  }

  onSearchTermChange(value: string): void {
    this.searchTerm.set(value);
    this.searchTerm$.next();
  }

  onStatusFilterChange(value: AssetStatusFilterValue): void {
    this.statusFilter.set(value);
    this.page.set(1);
    this.fetchRecords();
  }

  onClientFilterChange(client: Client | null): void {
    this.clientFilter.set(client);
    this.page.set(1);
    this.fetchRecords();
  }

  onDateFromChange(value: string): void {
    this.dateFrom.set(value);
    this.page.set(1);
    this.fetchRecords();
  }

  onDateToChange(value: string): void {
    this.dateTo.set(value);
    this.page.set(1);
    this.fetchRecords();
  }

  onPageChange(page: number): void {
    this.page.set(page);
    this.fetchRecords();
  }

  clearFilters(): void {
    this.searchTerm.set('');
    this.statusFilter.set('all');
    this.clientFilter.set(null);
    this.dateFrom.set('');
    this.dateTo.set('');
    this.page.set(1);
    this.fetchRecords();
  }

  openCreateForm(): void {
    this.editingRecord.set(null);
    this.isFormOpen.set(true);
  }

  openEditForm(record: Asset): void {
    this.editingRecord.set(record);
    this.isFormOpen.set(true);
  }

  closeForm(): void {
    this.isFormOpen.set(false);
  }

  onRecordSaved(record: Asset): void {
    const wasEditing = this.editingRecord() !== null;
    this.isFormOpen.set(false);
    this.notificationService.success(
      wasEditing ? 'El activo se actualizó correctamente.' : 'El activo se registró correctamente.',
    );
    this.fetchRecords();
  }

  requestDelete(record: Asset): void {
    this.deletingRecord.set(record);
    this.isDeleteOpen.set(true);
  }

  cancelDelete(): void {
    this.isDeleteOpen.set(false);
    this.deletingRecord.set(null);
  }

  confirmDelete(): void {
    const record = this.deletingRecord();
    if (!record) {
      return;
    }

    this.isDeleting.set(true);
    this.assetService.deleteAsset(record.id).subscribe({
      next: () => {
        this.isDeleting.set(false);
        this.isDeleteOpen.set(false);
        this.deletingRecord.set(null);
        this.notificationService.success('El activo se desactivó correctamente.');
        this.fetchRecords();
      },
      error: (error: HttpErrorResponse) => {
        this.isDeleting.set(false);
        this.notificationService.error(extractErrorMessage(error, 'No se pudo desactivar el activo.'));
      },
    });
  }
}
