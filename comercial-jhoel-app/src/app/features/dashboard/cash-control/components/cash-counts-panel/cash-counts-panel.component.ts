import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { CASH_COUNT_RESULT_LABEL, CashCountRecord, CashCountFilters, CashCountResult, formatCurrency } from '../../../../../core/models';
import { CashControlService } from '../../../../../core/services/cash-control.service';
import { CashCustodyService } from '../../../../../core/services/cash-custody.service';
import { ButtonComponent, IconComponent } from '../../../../../shared/ui';
import { ReportPaginationComponent } from '../../../reports/components/report-pagination/report-pagination.component';
import { formatGuatemalaDateTime, formatIsoDate } from '../../cash-control.util';

/**
 * "Historial de arqueos": every count exactly as recorded (theoretical
 * photograph, counted total, difference, result, denominations). Filters by
 * date, bank day, user and result. Read only; administrators can start an
 * audited correction of a current count (the original stays).
 */
@Component({
  selector: 'app-cash-counts-panel',
  standalone: true,
  imports: [FormsModule, ButtonComponent, IconComponent, ReportPaginationComponent],
  templateUrl: './cash-counts-panel.component.html',
  styleUrl: '../warehouse-panel/warehouse-panel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CashCountsPanelComponent implements OnChanges {
  /** Bumped by the page after a new count, to reload. */
  @Input() refreshKey = 0;
  @Input() canCorrect = false;
  @Output() correct = new EventEmitter<CashCountRecord>();

  private readonly service = inject(CashCustodyService);
  private readonly cashService = inject(CashControlService);

  readonly formatCurrency = formatCurrency;
  readonly formatDateTime = formatGuatemalaDateTime;
  readonly formatIsoDate = formatIsoDate;
  readonly resultLabel = CASH_COUNT_RESULT_LABEL;
  readonly results: CashCountResult[] = ['CUADRADO', 'FALTANTE', 'SOBRANTE'];
  readonly pageSize = 20;

  readonly filters = signal<CashCountFilters>({ dateFrom: '', dateTo: '', businessDate: '', userId: '', result: '' });
  readonly counts = signal<CashCountRecord[]>([]);
  readonly total = signal(0);
  readonly page = signal(1);
  readonly loading = signal(false);
  readonly failed = signal(false);
  readonly expanded = signal<string | null>(null);
  readonly users = signal<{ id: string; username: string }[]>([]);

  constructor() {
    this.cashService.getUsers().subscribe({ next: (users) => this.users.set(users), error: () => this.users.set([]) });
  }

  ngOnChanges(): void {
    this.load();
  }

  setFilter(patch: Partial<CashCountFilters>): void {
    this.filters.update((filters) => ({ ...filters, ...patch }));
    this.page.set(1);
    this.load();
  }

  onPageChange(page: number): void {
    this.page.set(page);
    this.load();
  }

  toggle(id: string): void {
    this.expanded.update((current) => (current === id ? null : id));
  }

  load(): void {
    this.loading.set(true);
    this.failed.set(false);
    this.service.getCounts({ ...this.filters(), page: this.page(), limit: this.pageSize }).subscribe({
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
}
