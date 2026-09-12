import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ListSimSaleRegistrationsFilters, SimSaleRegistration, SimType, formatCurrency } from '../../../core/models';
import { NotificationService } from '../../../core/services/notification.service';
import { RechargeSimsService } from '../../../core/services/recharge-sims.service';
import { extractErrorMessage } from '../../../core/utils/extract-error-message';
import { BadgeComponent, ButtonComponent, IconComponent, PageHeaderComponent } from '../../../shared/ui';
import { ReportPaginationComponent } from '../reports/components/report-pagination/report-pagination.component';
import { SimSaleRegistrationDetailModalComponent } from './components/sim-sale-registration-detail-modal/sim-sale-registration-detail-modal.component';
import { VoidSimSaleRegistrationConfirmModalComponent } from './components/void-sim-sale-registration-confirm-modal/void-sim-sale-registration-confirm-modal.component';

const PAGE_LIMIT = 20;

const DEFAULT_FILTERS: {
  startDate: string;
  endDate: string;
  simTypeId: string;
  status: '' | 'ACTIVE' | 'VOIDED';
} = {
  startDate: '',
  endDate: '',
  simTypeId: '',
  status: '',
};

/**
 * "Administrar Ventas de SIM" — Sistema, admin-only (route-guarded).
 * Localiza una venta de SIM ya registrada, ve su detalle completo
 * (incluida la imagen del DPI), y la anula (nunca la edita ni la elimina
 * físicamente — mismo patrón que "Administrar Facturas de Compras": la
 * corrección siempre es anular + registrar una venta nueva y correcta).
 * Mirrors `PurchasesAdminPageComponent`'s own draft/applied filter-signal
 * split exactly.
 */
@Component({
  selector: 'app-recharges-sim-sales-admin-page',
  standalone: true,
  imports: [
    FormsModule,
    DatePipe,
    PageHeaderComponent,
    ButtonComponent,
    IconComponent,
    BadgeComponent,
    ReportPaginationComponent,
    SimSaleRegistrationDetailModalComponent,
    VoidSimSaleRegistrationConfirmModalComponent,
  ],
  templateUrl: './recharges-sim-sales-admin-page.component.html',
  styleUrl: './recharges-sim-sales-admin-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RechargesSimSalesAdminPageComponent {
  private readonly simsService = inject(RechargeSimsService);
  private readonly notificationService = inject(NotificationService);

  readonly simTypes = signal<SimType[]>([]);

  readonly draftStartDate = signal(DEFAULT_FILTERS.startDate);
  readonly draftEndDate = signal(DEFAULT_FILTERS.endDate);
  readonly draftSimTypeId = signal(DEFAULT_FILTERS.simTypeId);
  readonly draftStatus = signal<'' | 'ACTIVE' | 'VOIDED'>(DEFAULT_FILTERS.status);

  readonly startDate = signal(DEFAULT_FILTERS.startDate);
  readonly endDate = signal(DEFAULT_FILTERS.endDate);
  readonly simTypeId = signal(DEFAULT_FILTERS.simTypeId);
  readonly status = signal<'' | 'ACTIVE' | 'VOIDED'>(DEFAULT_FILTERS.status);

  readonly hasActiveFilters = computed(
    () =>
      this.startDate() !== DEFAULT_FILTERS.startDate ||
      this.endDate() !== DEFAULT_FILTERS.endDate ||
      this.simTypeId() !== DEFAULT_FILTERS.simTypeId ||
      this.status() !== DEFAULT_FILTERS.status,
  );

  readonly registrations = signal<SimSaleRegistration[]>([]);
  readonly total = signal(0);
  readonly page = signal(1);
  readonly loading = signal(false);
  readonly limit = PAGE_LIMIT;

  readonly detailRegistrationId = signal<string | null>(null);
  readonly voidTarget = signal<SimSaleRegistration | null>(null);
  readonly isVoiding = signal(false);

  formatCurrency = formatCurrency;

  constructor() {
    this.simsService.getTypes().subscribe({
      next: (types) => this.simTypes.set(types),
      error: () => this.simTypes.set([]),
    });
    this.fetch();
  }

  private currentFilters(): ListSimSaleRegistrationsFilters {
    return {
      startDate: this.startDate() || undefined,
      endDate: this.endDate() || undefined,
      simTypeId: this.simTypeId() || undefined,
      isVoided: this.status() === '' ? undefined : this.status() === 'VOIDED',
      page: this.page(),
      limit: this.limit,
    };
  }

  fetch(): void {
    this.loading.set(true);
    this.simsService.getSaleRegistrations(this.currentFilters()).subscribe({
      next: (result) => {
        this.registrations.set(result.items);
        this.total.set(result.total);
        this.loading.set(false);
      },
      error: (error: HttpErrorResponse) => {
        this.loading.set(false);
        this.notificationService.error(extractErrorMessage(error, 'No se pudieron cargar las ventas de SIM.'));
      },
    });
  }

  applyFilters(): void {
    this.startDate.set(this.draftStartDate());
    this.endDate.set(this.draftEndDate());
    this.simTypeId.set(this.draftSimTypeId());
    this.status.set(this.draftStatus());
    this.page.set(1);
    this.fetch();
  }

  clearFilters(): void {
    this.draftStartDate.set(DEFAULT_FILTERS.startDate);
    this.draftEndDate.set(DEFAULT_FILTERS.endDate);
    this.draftSimTypeId.set(DEFAULT_FILTERS.simTypeId);
    this.draftStatus.set(DEFAULT_FILTERS.status);
    this.startDate.set(DEFAULT_FILTERS.startDate);
    this.endDate.set(DEFAULT_FILTERS.endDate);
    this.simTypeId.set(DEFAULT_FILTERS.simTypeId);
    this.status.set(DEFAULT_FILTERS.status);
    this.page.set(1);
    this.fetch();
  }

  onPageChange(page: number): void {
    this.page.set(page);
    this.fetch();
  }

  viewDetail(registration: SimSaleRegistration): void {
    this.detailRegistrationId.set(registration.id);
  }

  closeDetail(): void {
    this.detailRegistrationId.set(null);
  }

  requestVoid(registration: SimSaleRegistration): void {
    this.voidTarget.set(registration);
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
    this.simsService.voidSaleRegistration(target.id, reason).subscribe({
      next: () => {
        this.isVoiding.set(false);
        this.voidTarget.set(null);
        this.notificationService.success(`Venta de SIM ${target.simNumber} anulada correctamente.`);
        this.fetch();
      },
      error: (error: HttpErrorResponse) => {
        this.isVoiding.set(false);
        this.notificationService.error(extractErrorMessage(error, 'No se pudo anular la venta de SIM.'));
      },
    });
  }
}
