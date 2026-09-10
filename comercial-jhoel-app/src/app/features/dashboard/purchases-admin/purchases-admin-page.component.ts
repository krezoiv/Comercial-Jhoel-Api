import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ListPurchasesFilters, Purchase, PurchaseStatusFilter, Supplier, formatCurrency } from '../../../core/models';
import { NotificationService } from '../../../core/services/notification.service';
import { PurchasesService } from '../../../core/services/purchases.service';
import { SupplierService } from '../../../core/services/supplier.service';
import { extractErrorMessage } from '../../../core/utils/extract-error-message';
import { BadgeComponent, ButtonComponent, IconComponent, PageHeaderComponent } from '../../../shared/ui';
import { ReportPaginationComponent } from '../reports/components/report-pagination/report-pagination.component';
import { PurchaseDetailModalComponent } from './components/purchase-detail-modal/purchase-detail-modal.component';
import { VoidPurchaseConfirmModalComponent } from './components/void-purchase-confirm-modal/void-purchase-confirm-modal.component';

const PAGE_LIMIT = 20;

const DEFAULT_FILTERS: {
  search: string;
  startDate: string;
  endDate: string;
  supplierId: string;
  status: PurchaseStatusFilter | '';
} = {
  search: '',
  startDate: '',
  endDate: '',
  supplierId: '',
  status: '',
};

/**
 * "Administrar Facturas de Compras" — Sistema, admin-only (route-guarded).
 * Localiza una factura ya registrada, ve su detalle completo, y la anula
 * (nunca la edita ni la elimina físicamente — ver `VoidPurchaseConfirmModalComponent`'s
 * own doc comment for why "editar factura" fue deliberadamente excluido de
 * este módulo: la corrección siempre es anular + registrar una compra
 * nueva y correcta, el mismo patrón ya usado para Recargas/Transaccionar/
 * Tickets/Cotizaciones en esta app).
 *
 * Mirrors `PurchasesReportPageComponent`'s own filter-panel pattern
 * (draft/applied signal split — editing a filter field only ever touches
 * `draftX`, `applyFilters()`/`clearFilters()` are the only two places the
 * applied signals the table actually reads can change), but this is a
 * management screen, not a report: no summary tiles, no PDF export, no
 * by-product view — just localizar, ver, anular.
 */
@Component({
  selector: 'app-purchases-admin-page',
  standalone: true,
  imports: [
    FormsModule,
    DatePipe,
    PageHeaderComponent,
    ButtonComponent,
    IconComponent,
    BadgeComponent,
    ReportPaginationComponent,
    PurchaseDetailModalComponent,
    VoidPurchaseConfirmModalComponent,
  ],
  templateUrl: './purchases-admin-page.component.html',
  styleUrl: './purchases-admin-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PurchasesAdminPageComponent {
  private readonly purchasesService = inject(PurchasesService);
  private readonly supplierService = inject(SupplierService);
  private readonly notificationService = inject(NotificationService);

  readonly suppliers = signal<Supplier[]>([]);

  readonly draftSearch = signal(DEFAULT_FILTERS.search);
  readonly draftStartDate = signal(DEFAULT_FILTERS.startDate);
  readonly draftEndDate = signal(DEFAULT_FILTERS.endDate);
  readonly draftSupplierId = signal(DEFAULT_FILTERS.supplierId);
  readonly draftStatus = signal<PurchaseStatusFilter | ''>(DEFAULT_FILTERS.status);

  readonly search = signal(DEFAULT_FILTERS.search);
  readonly startDate = signal(DEFAULT_FILTERS.startDate);
  readonly endDate = signal(DEFAULT_FILTERS.endDate);
  readonly supplierId = signal(DEFAULT_FILTERS.supplierId);
  readonly status = signal<PurchaseStatusFilter | ''>(DEFAULT_FILTERS.status);

  readonly hasActiveFilters = computed(
    () =>
      this.search() !== DEFAULT_FILTERS.search ||
      this.startDate() !== DEFAULT_FILTERS.startDate ||
      this.endDate() !== DEFAULT_FILTERS.endDate ||
      this.supplierId() !== DEFAULT_FILTERS.supplierId ||
      this.status() !== DEFAULT_FILTERS.status,
  );

  readonly purchases = signal<Purchase[]>([]);
  readonly total = signal(0);
  readonly page = signal(1);
  readonly loading = signal(false);
  readonly limit = PAGE_LIMIT;

  readonly detailPurchaseId = signal<string | null>(null);
  readonly voidTarget = signal<Purchase | null>(null);
  readonly isVoiding = signal(false);

  formatCurrency = formatCurrency;

  constructor() {
    this.supplierService.getSuppliers().subscribe({
      next: (suppliers) => this.suppliers.set(suppliers),
      error: () => this.suppliers.set([]),
    });
    this.fetch();
  }

  private currentFilters(): ListPurchasesFilters {
    return {
      search: this.search() || undefined,
      startDate: this.startDate() || undefined,
      endDate: this.endDate() || undefined,
      supplierId: this.supplierId() || undefined,
      status: this.status() || undefined,
      page: this.page(),
      limit: this.limit,
    };
  }

  fetch(): void {
    this.loading.set(true);
    this.purchasesService.getPurchases(this.currentFilters()).subscribe({
      next: (result) => {
        this.purchases.set(result.items);
        this.total.set(result.total);
        this.loading.set(false);
      },
      error: (error: HttpErrorResponse) => {
        this.loading.set(false);
        this.notificationService.error(extractErrorMessage(error, 'No se pudieron cargar las facturas de compras.'));
      },
    });
  }

  applyFilters(): void {
    this.search.set(this.draftSearch().trim());
    this.startDate.set(this.draftStartDate());
    this.endDate.set(this.draftEndDate());
    this.supplierId.set(this.draftSupplierId());
    this.status.set(this.draftStatus());
    this.page.set(1);
    this.fetch();
  }

  clearFilters(): void {
    this.draftSearch.set(DEFAULT_FILTERS.search);
    this.draftStartDate.set(DEFAULT_FILTERS.startDate);
    this.draftEndDate.set(DEFAULT_FILTERS.endDate);
    this.draftSupplierId.set(DEFAULT_FILTERS.supplierId);
    this.draftStatus.set(DEFAULT_FILTERS.status);
    this.search.set(DEFAULT_FILTERS.search);
    this.startDate.set(DEFAULT_FILTERS.startDate);
    this.endDate.set(DEFAULT_FILTERS.endDate);
    this.supplierId.set(DEFAULT_FILTERS.supplierId);
    this.status.set(DEFAULT_FILTERS.status);
    this.page.set(1);
    this.fetch();
  }

  onPageChange(page: number): void {
    this.page.set(page);
    this.fetch();
  }

  viewDetail(purchase: Purchase): void {
    this.detailPurchaseId.set(purchase.id);
  }

  closeDetail(): void {
    this.detailPurchaseId.set(null);
  }

  requestVoid(purchase: Purchase): void {
    this.voidTarget.set(purchase);
  }

  cancelVoid(): void {
    if (this.isVoiding()) {
      return;
    }
    this.voidTarget.set(null);
  }

  confirmVoid(reason: string): void {
    const target = this.voidTarget();
    if (!target) {
      return;
    }
    this.isVoiding.set(true);
    this.purchasesService.voidPurchase(target.id, reason).subscribe({
      next: () => {
        this.isVoiding.set(false);
        this.voidTarget.set(null);
        this.notificationService.success(
          `Factura ${target.invoiceNumber || target.id.slice(0, 8).toUpperCase()} anulada correctamente.`,
        );
        this.fetch();
      },
      error: (error: HttpErrorResponse) => {
        this.isVoiding.set(false);
        this.notificationService.error(extractErrorMessage(error, 'No se pudo anular la factura.'));
      },
    });
  }
}
