import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { catchError, of } from 'rxjs';

import {
  CASH_CUT_STATUS_LABEL,
  CashCutPeriod,
  CashDayFilters,
  CashDayHistoryRow,
  formatCurrency,
} from '../../../../../core/models';
import { CashControlService } from '../../../../../core/services/cash-control.service';
import { ButtonComponent, CardComponent, IconComponent } from '../../../../../shared/ui';
import { ReportPaginationComponent } from '../../../reports/components/report-pagination/report-pagination.component';
import { formatDifference, formatGuatemalaTime, formatIsoDate } from '../../cash-control.util';
import { CashCutDetailModalComponent } from '../cut-detail-modal/cut-detail-modal.component';

/**
 * Historial de Cortes — one block per operational day with its two cuts
 * (scheduled/actual times, responsible users, status, opening/closing cash,
 * difference of each cut, bank reconciliation). Stored snapshots only:
 * values are never recomputed. Filters use the draft/applied pattern of
 * Reportería (nothing is fetched until "Aplicar").
 */
@Component({
  selector: 'app-cash-cut-history',
  standalone: true,
  imports: [FormsModule, ButtonComponent, CardComponent, IconComponent, ReportPaginationComponent, CashCutDetailModalComponent],
  templateUrl: './cut-history.component.html',
  styleUrl: './cut-history.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CashCutHistoryComponent {
  private readonly service = inject(CashControlService);

  readonly statusLabel = CASH_CUT_STATUS_LABEL;
  readonly formatCurrency = formatCurrency;
  readonly formatDifference = formatDifference;
  readonly formatTime = formatGuatemalaTime;
  readonly formatIsoDate = formatIsoDate;
  readonly pageSize = 10;

  readonly users = signal<{ id: string; username: string }[]>([]);
  readonly rows = signal<CashDayHistoryRow[]>([]);
  readonly total = signal(0);
  readonly page = signal(1);
  readonly loading = signal(true);
  readonly failed = signal(false);
  readonly detailPeriodId = signal<string | null>(null);

  readonly draft = signal<CashDayFilters>({ dateFrom: '', dateTo: '', periodNumber: '', status: '', userId: '' });
  private applied: CashDayFilters = {};

  constructor() {
    this.service
      .getUsers()
      .pipe(catchError(() => of([])))
      .subscribe((users) => this.users.set(users));
    this.load();
  }

  setDraft(patch: Partial<CashDayFilters>): void {
    this.draft.update((draft) => ({ ...draft, ...patch }));
  }

  applyFilters(): void {
    this.applied = { ...this.draft() };
    this.page.set(1);
    this.load();
  }

  clearFilters(): void {
    this.draft.set({ dateFrom: '', dateTo: '', periodNumber: '', status: '', userId: '' });
    this.applyFilters();
  }

  onPageChange(page: number): void {
    this.page.set(page);
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.failed.set(false);
    this.service.getDays({ ...this.applied, page: this.page(), limit: this.pageSize }).subscribe({
      next: (result) => {
        this.rows.set(result.items);
        this.total.set(result.total);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.failed.set(true);
      },
    });
  }

  cut(row: CashDayHistoryRow, number: 1 | 2): CashCutPeriod | undefined {
    return row.periods.find((period) => period.periodNumber === number);
  }
}
