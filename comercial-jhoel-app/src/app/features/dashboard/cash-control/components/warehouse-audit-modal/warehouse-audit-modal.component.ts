import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, computed, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { CASH_STATEMENT_STATUS_LABEL, WarehouseCashAudit, formatCurrency } from '../../../../../core/models';
import { CuadreStatus } from '../../../../../core/services/bank-deposit-draft.store';
import { CashCustodyService } from '../../../../../core/services/cash-custody.service';
import { ConfirmDialogService } from '../../../../../core/services/confirm-dialog.service';
import { NotificationService } from '../../../../../core/services/notification.service';
import { extractErrorMessage } from '../../../../../core/utils/extract-error-message';
import { ButtonComponent, IconComponent } from '../../../../../shared/ui';
import { CashBreakdownTableComponent } from '../../../transaccionar/components/cash-breakdown-table/cash-breakdown-table.component';
import { cashCountsToDetails, cashCountsTotal, emptyCashCounts, formatDifference, round2 } from '../../cash-control.util';

/**
 * Arqueo de Bodega (supervisors and admins, migration 1760009100000): counts
 * the bills and coins in Bodega and records the difference against the Bodega
 * Kardex — cuadrado, faltante or sobrante. A control, never a movement: it
 * does not move cash, does not adjust anything and is independent from the
 * Arqueo de Caja. The live preview uses the balance shown; the backend
 * photographs the real one under the Bodega lock. One `clientRequestId` per
 * opening (idempotent).
 */
@Component({
  selector: 'app-warehouse-audit-modal',
  standalone: true,
  imports: [FormsModule, ButtonComponent, IconComponent, CashBreakdownTableComponent],
  templateUrl: './warehouse-audit-modal.component.html',
  styleUrls: ['../cash-bank-deposit-modal/cash-bank-deposit-modal.component.scss', './warehouse-audit-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WarehouseAuditModalComponent implements OnChanges {
  @Input() open = false;
  /** Bodega theoretical balance (Kardex) shown while counting. */
  @Input() theoretical = 0;

  @Output() closed = new EventEmitter<void>();
  @Output() saved = new EventEmitter<WarehouseCashAudit>();

  private readonly service = inject(CashCustodyService);
  private readonly confirmDialog = inject(ConfirmDialogService);
  private readonly notifications = inject(NotificationService);

  readonly formatCurrency = formatCurrency;
  readonly formatDifference = formatDifference;
  readonly cashCounts = signal<Record<string, number>>(emptyCashCounts());
  readonly observations = signal('');
  readonly isSaving = signal(false);
  readonly errorMessage = signal<string | null>(null);
  private readonly balance = signal(0);
  private requestId = crypto.randomUUID();

  readonly totalCounted = computed(() => cashCountsTotal(this.cashCounts()));
  readonly difference = computed(() => round2(this.totalCounted() - this.balance()));
  readonly result = computed(() => (this.difference() === 0 ? 'CUADRADO' : this.difference() < 0 ? 'FALTANTE' : 'SOBRANTE'));
  readonly resultLabel = computed(() => CASH_STATEMENT_STATUS_LABEL[this.result()]);
  readonly status = computed<CuadreStatus>(() => (this.difference() === 0 ? 'green' : this.difference() > 0 ? 'red' : 'yellow'));
  readonly theoreticalShown = this.balance.asReadonly();

  ngOnChanges(): void {
    this.balance.set(this.theoretical);
    if (!this.open || this.isSaving()) {
      return;
    }
    this.cashCounts.set(emptyCashCounts());
    this.observations.set('');
    this.errorMessage.set(null);
    this.requestId = crypto.randomUUID();
  }

  onQuantityChange(change: { denomination: number; quantity: number }): void {
    const quantity = Math.max(0, Math.trunc(Number(change.quantity) || 0));
    this.cashCounts.update((counts) => ({ ...counts, [String(change.denomination)]: quantity }));
  }

  async save(): Promise<void> {
    if (this.isSaving()) {
      return;
    }
    const confirmed = await this.confirmDialog.confirm({
      type: 'FINANCIAL_OPERATION',
      title: 'Registrar arqueo de Bodega',
      message:
        `Contado ${formatCurrency(this.totalCounted())} contra un saldo de Bodega de ${formatCurrency(this.balance())}: ` +
        `${this.resultLabel().toLowerCase()}${this.difference() === 0 ? '' : ' de ' + formatCurrency(Math.abs(this.difference()))}. ` +
        'Es un control: no mueve efectivo ni ajusta el saldo, y no se puede modificar.',
    });
    if (!confirmed) {
      return;
    }
    this.isSaving.set(true);
    this.errorMessage.set(null);
    this.service
      .registerWarehouseAudit({
        details: cashCountsToDetails(this.cashCounts(), { keepZero: true }),
        observations: this.observations().trim() || undefined,
        clientRequestId: this.requestId,
      })
      .subscribe({
        next: (audit) => {
          this.isSaving.set(false);
          this.notifications.success(
            `Arqueo de Bodega #${audit.number}: ${CASH_STATEMENT_STATUS_LABEL[audit.result].toLowerCase()}` +
              (audit.difference === 0 ? '.' : ` de ${formatCurrency(Math.abs(audit.difference))}.`),
          );
          this.saved.emit(audit);
        },
        error: (error: HttpErrorResponse) => {
          this.isSaving.set(false);
          this.errorMessage.set(extractErrorMessage(error, 'No se pudo registrar el arqueo de Bodega.'));
        },
      });
  }
}
