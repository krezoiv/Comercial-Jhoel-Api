import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Client, ListSalesFilters, Sale, SaleStatusFilter, formatCurrency } from '../../../core/models';
import { ClientService } from '../../../core/services/client.service';
import { NotificationService } from '../../../core/services/notification.service';
import { SalesService } from '../../../core/services/sales.service';
import { extractErrorMessage } from '../../../core/utils/extract-error-message';
import { BadgeComponent, ButtonComponent, IconComponent, PageHeaderComponent } from '../../../shared/ui';
import { ReportPaginationComponent } from '../reports/components/report-pagination/report-pagination.component';
import { SaleDetailModalComponent } from './components/sale-detail-modal/sale-detail-modal.component';
import { VoidSaleConfirmModalComponent } from './components/void-sale-confirm-modal/void-sale-confirm-modal.component';

const PAGE_LIMIT = 20;

const DEFAULT_FILTERS: {
  search: string;
  startDate: string;
  endDate: string;
  clientId: string;
  status: SaleStatusFilter | '';
} = {
  search: '',
  startDate: '',
  endDate: '',
  clientId: '',
  status: '',
};

/**
 * "Administrar Facturas de Ventas" — Sistema, admin-only (route-guarded).
 * Exact structural mirror of `PurchasesAdminPageComponent`: localiza una
 * venta ya registrada, ve su detalle completo, y la anula (nunca la edita
 * ni la elimina físicamente — ver `VoidSaleConfirmModalComponent`'s own doc
 * comment). Same draft/applied filter-signal split as the Reportería pages
 * and its own Compras counterpart.
 */
@Component({
  selector: 'app-sales-admin-page',
  standalone: true,
  imports: [
    FormsModule,
    DatePipe,
    PageHeaderComponent,
    ButtonComponent,
    IconComponent,
    BadgeComponent,
    ReportPaginationComponent,
    SaleDetailModalComponent,
    VoidSaleConfirmModalComponent,
  ],
  templateUrl: './sales-admin-page.component.html',
  styleUrl: './sales-admin-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SalesAdminPageComponent {
  private readonly salesService = inject(SalesService);
  private readonly clientService = inject(ClientService);
  private readonly notificationService = inject(NotificationService);

  readonly clients = signal<Client[]>([]);

  readonly draftSearch = signal(DEFAULT_FILTERS.search);
  readonly draftStartDate = signal(DEFAULT_FILTERS.startDate);
  readonly draftEndDate = signal(DEFAULT_FILTERS.endDate);
  readonly draftClientId = signal(DEFAULT_FILTERS.clientId);
  readonly draftStatus = signal<SaleStatusFilter | ''>(DEFAULT_FILTERS.status);

  readonly search = signal(DEFAULT_FILTERS.search);
  readonly startDate = signal(DEFAULT_FILTERS.startDate);
  readonly endDate = signal(DEFAULT_FILTERS.endDate);
  readonly clientId = signal(DEFAULT_FILTERS.clientId);
  readonly status = signal<SaleStatusFilter | ''>(DEFAULT_FILTERS.status);

  readonly hasActiveFilters = computed(
    () =>
      this.search() !== DEFAULT_FILTERS.search ||
      this.startDate() !== DEFAULT_FILTERS.startDate ||
      this.endDate() !== DEFAULT_FILTERS.endDate ||
      this.clientId() !== DEFAULT_FILTERS.clientId ||
      this.status() !== DEFAULT_FILTERS.status,
  );

  readonly sales = signal<Sale[]>([]);
  readonly total = signal(0);
  readonly page = signal(1);
  readonly loading = signal(false);
  readonly limit = PAGE_LIMIT;

  readonly detailSaleId = signal<string | null>(null);
  readonly voidTarget = signal<Sale | null>(null);
  readonly isVoiding = signal(false);

  formatCurrency = formatCurrency;

  constructor() {
    this.clientService.getClients().subscribe({
      next: (clients) => this.clients.set(clients),
      error: () => this.clients.set([]),
    });
    this.fetch();
  }

  private currentFilters(): ListSalesFilters {
    return {
      search: this.search() || undefined,
      startDate: this.startDate() || undefined,
      endDate: this.endDate() || undefined,
      clientId: this.clientId() || undefined,
      status: this.status() || undefined,
      page: this.page(),
      limit: this.limit,
    };
  }

  fetch(): void {
    this.loading.set(true);
    this.salesService.getSales(this.currentFilters()).subscribe({
      next: (result) => {
        this.sales.set(result.items);
        this.total.set(result.total);
        this.loading.set(false);
      },
      error: (error: HttpErrorResponse) => {
        this.loading.set(false);
        this.notificationService.error(extractErrorMessage(error, 'No se pudieron cargar las facturas de ventas.'));
      },
    });
  }

  applyFilters(): void {
    this.search.set(this.draftSearch().trim());
    this.startDate.set(this.draftStartDate());
    this.endDate.set(this.draftEndDate());
    this.clientId.set(this.draftClientId());
    this.status.set(this.draftStatus());
    this.page.set(1);
    this.fetch();
  }

  clearFilters(): void {
    this.draftSearch.set(DEFAULT_FILTERS.search);
    this.draftStartDate.set(DEFAULT_FILTERS.startDate);
    this.draftEndDate.set(DEFAULT_FILTERS.endDate);
    this.draftClientId.set(DEFAULT_FILTERS.clientId);
    this.draftStatus.set(DEFAULT_FILTERS.status);
    this.search.set(DEFAULT_FILTERS.search);
    this.startDate.set(DEFAULT_FILTERS.startDate);
    this.endDate.set(DEFAULT_FILTERS.endDate);
    this.clientId.set(DEFAULT_FILTERS.clientId);
    this.status.set(DEFAULT_FILTERS.status);
    this.page.set(1);
    this.fetch();
  }

  onPageChange(page: number): void {
    this.page.set(page);
    this.fetch();
  }

  viewDetail(sale: Sale): void {
    this.detailSaleId.set(sale.id);
  }

  closeDetail(): void {
    this.detailSaleId.set(null);
  }

  requestVoid(sale: Sale): void {
    this.voidTarget.set(sale);
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
    this.salesService.voidSale(target.id, reason).subscribe({
      next: () => {
        this.isVoiding.set(false);
        this.voidTarget.set(null);
        this.notificationService.success(
          `Venta ${target.invoiceNumber || target.id.slice(0, 8).toUpperCase()} anulada correctamente.`,
        );
        this.fetch();
      },
      error: (error: HttpErrorResponse) => {
        this.isVoiding.set(false);
        this.notificationService.error(extractErrorMessage(error, 'No se pudo anular la venta.'));
      },
    });
  }
}
