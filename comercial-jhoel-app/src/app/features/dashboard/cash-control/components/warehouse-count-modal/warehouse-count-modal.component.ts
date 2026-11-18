import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, computed, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { LocationInventory, WarehouseCashCount, formatCurrency } from '../../../../../core/models';
import { CuadreStatus } from '../../../../../core/services/bank-deposit-draft.store';
import { CashCustodyService } from '../../../../../core/services/cash-custody.service';
import { ConfirmDialogService } from '../../../../../core/services/confirm-dialog.service';
import { NotificationService } from '../../../../../core/services/notification.service';
import { extractErrorMessage } from '../../../../../core/utils/extract-error-message';
import { ButtonComponent, IconComponent } from '../../../../../shared/ui';
import { CashBreakdownTableComponent } from '../../../transaccionar/components/cash-breakdown-table/cash-breakdown-table.component';
import { cashCountsToDetails, cashCountsTotal, emptyCashCounts, round2 } from '../../cash-control.util';

/**
 * "Conteo de Bodega por denominación" (administrators): the audited reference
 * of the Bodega inventory. The bills and coins counted must add up to the
 * Bodega balance (the backend re-checks it under the Bodega lock); it never
 * moves cash. Pre-filled with the current inventory when Bodega already has
 * one. One `clientRequestId` per opening (idempotent).
 */
@Component({
  selector: 'app-warehouse-count-modal',
  standalone: true,
  imports: [FormsModule, ButtonComponent, IconComponent, CashBreakdownTableComponent],
  templateUrl: './warehouse-count-modal.component.html',
  styleUrl: '../cash-bank-deposit-modal/cash-bank-deposit-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WarehouseCountModalComponent implements OnChanges {
  @Input() open = false;
  /** Current Bodega inventory (balance to match, and pre-fill). */
  @Input() inventory: LocationInventory | null = null;

  @Output() closed = new EventEmitter<void>();
  @Output() saved = new EventEmitter<WarehouseCashCount>();

  private readonly service = inject(CashCustodyService);
  private readonly confirmDialog = inject(ConfirmDialogService);
  private readonly notifications = inject(NotificationService);

  readonly formatCurrency = formatCurrency;
  readonly cashCounts = signal<Record<string, number>>(emptyCashCounts());
  readonly observations = signal('');
  readonly isSaving = signal(false);
  readonly errorMessage = signal<string | null>(null);
  private requestId = crypto.randomUUID();

  readonly balance = computed(() => this.inventory?.balance ?? 0);
  readonly totalCounted = computed(() => cashCountsTotal(this.cashCounts()));
  readonly difference = computed(() => round2(this.totalCounted() - this.balance()));
  readonly status = computed<CuadreStatus>(() => (this.difference() === 0 ? 'green' : this.difference() > 0 ? 'red' : 'yellow'));
  readonly canSave = computed(() => !this.isSaving() && this.difference() === 0 && this.totalCounted() >= 0);

  ngOnChanges(): void {
    if (!this.open || this.isSaving()) {
      return;
    }
    const known = this.inventory?.hasAnchor ? this.inventory.lines : [];
    this.cashCounts.set({
      ...emptyCashCounts(),
      ...Object.fromEntries(known.filter((l) => l.quantity > 0).map((l) => [String(l.denomination), l.quantity])),
    });
    this.observations.set('');
    this.errorMessage.set(null);
    this.requestId = crypto.randomUUID();
  }

  onQuantityChange(change: { denomination: number; quantity: number }): void {
    const quantity = Math.max(0, Math.trunc(Number(change.quantity) || 0));
    this.cashCounts.update((counts) => ({ ...counts, [String(change.denomination)]: quantity }));
  }

  async save(): Promise<void> {
    if (!this.canSave()) {
      return;
    }
    const confirmed = await this.confirmDialog.confirm({
      type: 'FINANCIAL_OPERATION',
      title: 'Registrar conteo de Bodega',
      message:
        `Conteo de ${formatCurrency(this.totalCounted())} por denominación (igual al saldo de Bodega). ` +
        'Desde este conteo se calculan los billetes y monedas disponibles en Bodega. No mueve efectivo y no se puede modificar.',
    });
    if (!confirmed) {
      return;
    }
    this.isSaving.set(true);
    this.errorMessage.set(null);
    this.service
      .registerWarehouseCount({
        details: cashCountsToDetails(this.cashCounts(), { keepZero: true }),
        observations: this.observations().trim() || undefined,
        clientRequestId: this.requestId,
      })
      .subscribe({
        next: (result) => {
          this.isSaving.set(false);
          this.notifications.success(`Conteo de Bodega #${result.count.number} registrado.`);
          this.saved.emit(result.count);
        },
        error: (error: HttpErrorResponse) => {
          this.isSaving.set(false);
          this.errorMessage.set(extractErrorMessage(error, 'No se pudo registrar el conteo de Bodega.'));
        },
      });
  }
}
