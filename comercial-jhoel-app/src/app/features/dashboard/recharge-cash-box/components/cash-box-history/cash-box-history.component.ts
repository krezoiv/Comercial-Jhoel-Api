import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';

import {
  CASH_BOX_MOVEMENT_TYPE_LABEL,
  CashBoxMovement,
  CashBoxMovementType,
  formatCurrency,
} from '../../../../../core/models';
import { NotificationService } from '../../../../../core/services/notification.service';
import { RechargeCashBoxService } from '../../../../../core/services/recharge-cash-box.service';
import { extractErrorMessage } from '../../../../../core/utils/extract-error-message';
import { refetchOnTabVisible } from '../../../../../core/utils/refetch-on-tab-visible';
import { CardComponent, EmptyStateComponent, IconComponent } from '../../../../../shared/ui';
import { ReportPaginationComponent } from '../../../reports/components/report-pagination/report-pagination.component';

const MOVEMENT_TYPES: CashBoxMovementType[] = [
  'RECHARGE_SALE',
  'SIM_SALE',
  'RECHARGE_PURCHASE',
  'SIM_PURCHASE',
  'CONTRIBUTION',
  'PROFIT_WITHDRAWAL',
];

const DEFAULT_LIMIT = 20;

/**
 * "Historial de Movimientos" — reuses `ReportPaginationComponent` (already
 * fully generic, confirmed before importing it here, same reuse already
 * established for Reportería/Recargas' own report pages) rather than
 * building a fourth pagination control. Filters apply immediately on
 * change (no separate "Aplicar"/draft-vs-applied split) — unlike
 * Reportería's own filter panels, there's no PDF export here whose
 * consistency-with-what's-shown guarantee that split exists to protect.
 */
@Component({
  selector: 'app-recharge-cash-box-history',
  standalone: true,
  imports: [FormsModule, DatePipe, CardComponent, IconComponent, EmptyStateComponent, ReportPaginationComponent],
  templateUrl: './cash-box-history.component.html',
  styleUrl: './cash-box-history.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CashBoxHistoryComponent implements OnChanges {
  // Also refetches via `refetchOnTabVisible()` — same reasoning as
  // `CashBoxCardComponent`'s own doc comment: a recarga sale/purchase
  // registered on a different route never reaches this component through
  // `refreshTrigger` (that `@Input()` only ever gets bumped by an
  // aporte/salida registered elsewhere ON this same page), so without this
  // a tab left open here can show a stale history list indefinitely.
  /** `yyyy-MM-dd` — the page's operation-date picker's max selectable value, so the range filters can't reach into the future either. */
  @Input() maxSelectableDate = '';
  /** Bumped by the parent after a withdrawal is registered elsewhere on the page — triggers a refetch of whichever page is currently shown. */
  @Input() refreshTrigger = 0;

  private readonly cashBoxService = inject(RechargeCashBoxService);
  private readonly notificationService = inject(NotificationService);

  readonly movementTypes = MOVEMENT_TYPES;
  readonly typeLabel = CASH_BOX_MOVEMENT_TYPE_LABEL;

  readonly startDate = signal('');
  readonly endDate = signal('');
  readonly type = signal<CashBoxMovementType | ''>('');

  readonly items = signal<CashBoxMovement[]>([]);
  readonly total = signal(0);
  readonly page = signal(1);
  readonly limit = DEFAULT_LIMIT;
  readonly loading = signal(true);

  formatCurrency = formatCurrency;

  constructor() {
    refetchOnTabVisible(() => this.fetch());
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['refreshTrigger'] && !changes['refreshTrigger'].firstChange) {
      this.fetch();
      return;
    }
    if (changes['maxSelectableDate'] && changes['maxSelectableDate'].firstChange) {
      this.fetch();
    }
  }

  applyFilters(): void {
    this.page.set(1);
    this.fetch();
  }

  clearFilters(): void {
    this.startDate.set('');
    this.endDate.set('');
    this.type.set('');
    this.page.set(1);
    this.fetch();
  }

  onPageChange(page: number): void {
    this.page.set(page);
    this.fetch();
  }

  private fetch(): void {
    this.loading.set(true);
    this.cashBoxService
      .getMovements({
        startDate: this.startDate() || undefined,
        endDate: this.endDate() || undefined,
        type: this.type() || undefined,
        page: this.page(),
        limit: this.limit,
      })
      .subscribe({
        next: (result) => {
          this.items.set(result.items);
          this.total.set(result.total);
          this.loading.set(false);
        },
        error: (error: HttpErrorResponse) => {
          this.loading.set(false);
          this.notificationService.error(extractErrorMessage(error, 'No se pudo cargar el historial de la Caja Contable.'));
        },
      });
  }
}
