import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, computed, inject, signal } from '@angular/core';

import {
  CASH_CUT_NAME,
  CASH_CUT_STATUS_LABEL,
  CASH_DIRECTION_LABEL,
  CASH_MOVEMENT_TYPE_LABEL,
  CASH_OPENING_POLICY_LABEL,
  CashCutDetail,
  formatCurrency,
} from '../../../../../core/models';
import { CashControlService } from '../../../../../core/services/cash-control.service';
import { IconComponent } from '../../../../../shared/ui';
import { formatDifference, formatGuatemalaDateTime, formatGuatemalaTime, formatIsoDate } from '../../cash-control.util';

/**
 * Read-only detail of one cut (`GET /cash-control/cuts/:id`): the stored
 * snapshot (never recomputed), current and superseded arqueos, bank
 * reconciliation, audit trail (started/finished/reopened), schedule changes
 * and the Kardex movements of its range. Shared by the cut panel and the
 * Historial de Cortes.
 */
@Component({
  selector: 'app-cash-cut-detail-modal',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './cut-detail-modal.component.html',
  styleUrl: './cut-detail-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CashCutDetailModalComponent implements OnChanges {
  @Input() periodId: string | null = null;
  @Output() closed = new EventEmitter<void>();

  private readonly service = inject(CashControlService);

  readonly cutName = CASH_CUT_NAME;
  readonly statusLabel = CASH_CUT_STATUS_LABEL;
  readonly policyLabel = CASH_OPENING_POLICY_LABEL;
  readonly typeLabel = CASH_MOVEMENT_TYPE_LABEL;
  readonly directionLabel = CASH_DIRECTION_LABEL;
  readonly formatCurrency = formatCurrency;
  readonly formatDifference = formatDifference;
  readonly formatDateTime = (iso: string | null) => (iso ? formatGuatemalaDateTime(iso) : '—');
  readonly formatTime = formatGuatemalaTime;
  readonly formatIsoDate = formatIsoDate;

  readonly detail = signal<CashCutDetail | null>(null);
  readonly loading = signal(false);
  readonly failed = signal(false);

  readonly currentCount = computed(() => this.detail()?.counts.find((count) => count.isCurrent) ?? null);
  readonly currentBanks = computed(() => {
    const count = this.currentCount();
    return count ? (this.detail()?.bankReconciliations ?? []).filter((bank) => bank.countId === count.id) : [];
  });
  readonly supersededCounts = computed(() => this.detail()?.counts.filter((count) => !count.isCurrent) ?? []);

  ngOnChanges(): void {
    if (this.periodId) {
      this.load(this.periodId);
    } else {
      this.detail.set(null);
    }
  }

  load(periodId: string): void {
    this.loading.set(true);
    this.failed.set(false);
    this.service.getCutDetail(periodId).subscribe({
      next: (detail) => {
        this.detail.set(detail);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.failed.set(true);
      },
    });
  }
}
