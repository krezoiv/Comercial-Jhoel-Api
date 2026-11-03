import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import {
  GUAYACAN_COUNT_STATUS_LABEL,
  GuayacanCashCountSummary,
  formatCurrency,
} from '../../../core/models';
import { GuayacanCashBoxService } from '../../../core/services/guayacan-cash-box.service';
import { NotificationService } from '../../../core/services/notification.service';
import { ButtonComponent, CardComponent, IconComponent, PageHeaderComponent } from '../../../shared/ui';
import { ReportPaginationComponent } from '../reports/components/report-pagination/report-pagination.component';
import { GuayacanCountDetailModalComponent } from '../guayacan-cash-box/components/count-detail-modal/count-detail-modal.component';
import { formatDifference, formatGuatemalaDateTime } from '../guayacan-cash-box/guayacan-cash.util';

const PAGE_SIZE = 20;

interface CountFilters {
  startDate: string;
  endDate: string;
  userId: string;
  number: string;
}

const EMPTY_FILTERS: CountFilters = { startDate: '', endDate: '', userId: '', number: '' };

/**
 * Cajas y Cierres → "Arqueos — Guayacán": historial de solo lectura de los
 * arqueos guardados desde Cuadre de Caja Guayacán (más reciente primero,
 * paginado y filtrado en el backend). Cada arqueo es una foto inmutable;
 * su detalle muestra las 11 denominaciones tal como se contaron. Mismo patrón
 * borrador/aplicado de filtros que los reportes de Reportería.
 */
@Component({
  selector: 'app-guayacan-cash-counts-page',
  standalone: true,
  imports: [
    FormsModule,
    ButtonComponent,
    CardComponent,
    IconComponent,
    PageHeaderComponent,
    ReportPaginationComponent,
    GuayacanCountDetailModalComponent,
  ],
  templateUrl: './guayacan-cash-counts-page.component.html',
  styleUrl: './guayacan-cash-counts-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GuayacanCashCountsPageComponent {
  private readonly service = inject(GuayacanCashBoxService);
  private readonly notifications = inject(NotificationService);

  formatCurrency = formatCurrency;
  formatDateTime = formatGuatemalaDateTime;
  formatDifference = formatDifference;
  statusLabel = GUAYACAN_COUNT_STATUS_LABEL;
  readonly pageSize = PAGE_SIZE;

  readonly counts = signal<GuayacanCashCountSummary[]>([]);
  readonly total = signal(0);
  readonly page = signal(1);
  readonly loading = signal(true);
  readonly failed = signal(false);
  readonly users = signal<{ id: string; username: string }[]>([]);
  readonly detailId = signal<string | null>(null);

  readonly draft = signal<CountFilters>({ ...EMPTY_FILTERS });
  private readonly applied = signal<CountFilters>({ ...EMPTY_FILTERS });
  readonly hasFilters = computed(() => Object.values(this.applied()).some((value) => value !== ''));

  constructor() {
    this.load();
    this.service.getCountUsers().subscribe({
      next: (users) => this.users.set(users),
      error: () => this.users.set([]),
    });
  }

  setDraft(key: keyof CountFilters, value: string): void {
    this.draft.update((filters) => ({ ...filters, [key]: value ?? '' }));
  }

  load(): void {
    const filters = this.applied();
    this.failed.set(false);
    if (this.counts().length === 0) {
      this.loading.set(true);
    }
    this.service
      .getCounts({
        startDate: filters.startDate || undefined,
        endDate: filters.endDate || undefined,
        userId: filters.userId || undefined,
        number: filters.number.trim() || undefined,
        page: this.page(),
        limit: PAGE_SIZE,
      })
      .subscribe({
        next: (result) => {
          this.counts.set(result.items);
          this.total.set(result.total);
          this.loading.set(false);
        },
        error: () => {
          this.loading.set(false);
          this.failed.set(true);
        },
      });
  }

  applyFilters(): void {
    const draft = this.draft();
    if (draft.startDate && draft.endDate && draft.startDate > draft.endDate) {
      this.notifications.error('La fecha inicial no puede ser mayor que la final.');
      return;
    }
    this.applied.set({ ...draft });
    this.page.set(1);
    this.load();
  }

  clearFilters(): void {
    this.draft.set({ ...EMPTY_FILTERS });
    this.applyFilters();
  }

  onPageChange(page: number): void {
    this.page.set(page);
    this.load();
  }
}
