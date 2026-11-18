import { ChangeDetectionStrategy, Component, Input, OnChanges, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import {
  CUSTODY_TRANSFER_KIND_LABEL,
  CustodyTransfer,
  CustodyTransferFilters,
  CustodyTransferKind,
  formatCurrency,
} from '../../../../../core/models';
import { CashControlService } from '../../../../../core/services/cash-control.service';
import { CashCustodyService } from '../../../../../core/services/cash-custody.service';
import { onCashChanged } from '../../../../../core/services/cash-control-sync.service';
import { ButtonComponent, IconComponent } from '../../../../../shared/ui';
import { ReportPaginationComponent } from '../../../reports/components/report-pagination/report-pagination.component';
import { formatGuatemalaDateTime, formatIsoDate } from '../../cash-control.util';

/**
 * "Historial de traslados": every caja ↔ Bodega movement (retiro de caja →
 * Bodega, envío de Bodega → caja, depósito de Bodega → banco) in one list,
 * with filters by type, user, dates and status, and a detail panel with the
 * exact bills and coins of each movement. Read-only: movements are never
 * edited or deleted; corrections are audited voids in the Bodega panel.
 */
@Component({
  selector: 'app-custody-transfers-panel',
  standalone: true,
  imports: [FormsModule, ButtonComponent, IconComponent, ReportPaginationComponent],
  templateUrl: './custody-transfers-panel.component.html',
  styleUrls: ['../warehouse-panel/warehouse-panel.component.scss', './custody-transfers-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustodyTransfersPanelComponent implements OnChanges {
  @Input() refreshKey = 0;

  private readonly service = inject(CashCustodyService);
  private readonly cashService = inject(CashControlService);

  readonly formatCurrency = formatCurrency;
  readonly formatDateTime = formatGuatemalaDateTime;
  readonly formatIsoDate = formatIsoDate;
  readonly kindLabel = CUSTODY_TRANSFER_KIND_LABEL;
  readonly kinds = Object.keys(CUSTODY_TRANSFER_KIND_LABEL) as CustodyTransferKind[];
  readonly pageSize = 15;

  readonly kind = signal<CustodyTransferKind | ''>('');
  readonly userId = signal('');
  readonly dateFrom = signal('');
  readonly dateTo = signal('');
  readonly status = signal<'APLICADO' | 'ANULADO' | ''>('');
  readonly page = signal(1);
  readonly items = signal<CustodyTransfer[]>([]);
  readonly total = signal(0);
  readonly failed = signal(false);
  readonly users = signal<{ id: string; username: string }[]>([]);
  readonly selected = signal<CustodyTransfer | null>(null);

  constructor() {
    this.cashService.getUsers().subscribe({ next: (users) => this.users.set(users), error: () => this.users.set([]) });
    onCashChanged(() => this.load());
  }

  ngOnChanges(): void {
    this.load();
  }

  applyFilters(): void {
    this.page.set(1);
    this.load();
  }

  clearFilters(): void {
    this.kind.set('');
    this.userId.set('');
    this.dateFrom.set('');
    this.dateTo.set('');
    this.status.set('');
    this.applyFilters();
  }

  onPageChange(page: number): void {
    this.page.set(page);
    this.load();
  }

  load(): void {
    const filters: CustodyTransferFilters = {
      kind: this.kind() || undefined,
      userId: this.userId() || undefined,
      dateFrom: this.dateFrom() || undefined,
      dateTo: this.dateTo() || undefined,
      status: this.status() || undefined,
      page: this.page(),
      limit: this.pageSize,
    };
    this.service.getCustodyTransfers(filters).subscribe({
      next: (result) => {
        this.items.set(result.items);
        this.total.set(result.total);
        this.failed.set(false);
      },
      error: () => this.failed.set(true),
    });
  }

  denominationLabel(value: number): string {
    return `Q${value.toLocaleString('es-GT', { minimumFractionDigits: value < 1 ? 2 : 0 })}`;
  }

  route(t: CustodyTransfer): string {
    const name = (place: string) => (place === 'CAJA' ? 'Caja' : place === 'BODEGA' ? 'Bodega' : t.bankName ?? 'Banco');
    return `${name(t.origin)} → ${name(t.destination)}`;
  }
}
