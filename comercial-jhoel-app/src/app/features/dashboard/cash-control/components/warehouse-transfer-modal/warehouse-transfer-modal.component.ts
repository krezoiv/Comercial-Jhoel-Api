import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, computed, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { CashCustody, WarehouseTransfer, formatCurrency } from '../../../../../core/models';
import { CuadreStatus } from '../../../../../core/services/bank-deposit-draft.store';
import { AuthService } from '../../../../../core/services/auth.service';
import { CashCustodyService } from '../../../../../core/services/cash-custody.service';
import { ConfirmDialogService } from '../../../../../core/services/confirm-dialog.service';
import { NotificationService } from '../../../../../core/services/notification.service';
import { extractErrorMessage } from '../../../../../core/utils/extract-error-message';
import { DecimalInputDirective } from '../../../../../shared/directives/decimal-input.directive';
import { ButtonComponent, IconComponent } from '../../../../../shared/ui';
import { CashBreakdownTableComponent } from '../../../transaccionar/components/cash-breakdown-table/cash-breakdown-table.component';
import { cashCountsToDetails, cashCountsTotal, emptyCashCounts, formatIsoDate, round2 } from '../../cash-control.util';

/**
 * "Entrega de Efectivo a Bodega": an internal transfer — caja goes down,
 * Bodega goes up by the same amount, total custody unchanged; never an
 * expense. The breakdown is the default; registering only a total is
 * allowed to administrators (business policy) and is flagged as such. The
 * "después" figures are a preview: the backend checks the caja balance
 * under its lock and applies both Kardex in one transaction. One
 * `clientRequestId` per opening makes a double click harmless.
 */
@Component({
  selector: 'app-warehouse-transfer-modal',
  standalone: true,
  imports: [FormsModule, ButtonComponent, IconComponent, DecimalInputDirective, CashBreakdownTableComponent],
  templateUrl: './warehouse-transfer-modal.component.html',
  styleUrl: '../cash-bank-deposit-modal/cash-bank-deposit-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WarehouseTransferModalComponent implements OnChanges {
  @Input() open = false;
  @Input() custody: CashCustody | null = null;
  /** Administrators may register a total without breakdown. */
  @Input() canSkipBreakdown = false;

  @Output() closed = new EventEmitter<void>();
  @Output() saved = new EventEmitter<{ transfer: WarehouseTransfer; custody: CashCustody }>();

  private readonly service = inject(CashCustodyService);
  private readonly confirmDialog = inject(ConfirmDialogService);
  private readonly notifications = inject(NotificationService);
  private readonly auth = inject(AuthService);

  readonly formatCurrency = formatCurrency;
  readonly formatIsoDate = formatIsoDate;

  readonly amount = signal<number | null>(null);
  readonly withBreakdown = signal(true);
  readonly cashCounts = signal<Record<string, number>>(emptyCashCounts());
  readonly deliveredBy = signal('');
  readonly receivedBy = signal('');
  readonly voucher = signal('');
  readonly observations = signal('');
  readonly isSaving = signal(false);
  readonly errorMessage = signal<string | null>(null);
  private requestId = crypto.randomUUID();

  readonly totalCounted = computed(() => cashCountsTotal(this.cashCounts()));
  readonly breakdownStatus = computed<CuadreStatus>(() => {
    const total = this.totalCounted();
    const amount = round2(this.amount() ?? 0);
    if (amount > 0 && total === amount) return 'green';
    return total > amount ? 'red' : 'yellow';
  });
  readonly cashBalance = computed(() => this.custody?.cashBalance ?? 0);
  readonly cashAfter = computed(() => round2(this.cashBalance() - (this.amount() ?? 0)));
  readonly warehouseAfter = computed(() => round2((this.custody?.warehouseBalance ?? 0) + (this.amount() ?? 0)));
  readonly insufficientCash = computed(() => (this.amount() ?? 0) > this.cashBalance());
  readonly dayOpen = computed(() => !!this.custody?.currentDay?.isOpen);
  readonly peopleValid = computed(() => this.deliveredBy().trim().length >= 3 && this.receivedBy().trim().length >= 3);
  readonly canSave = computed(
    () =>
      !this.isSaving() &&
      this.dayOpen() &&
      (this.amount() ?? 0) > 0 &&
      !this.insufficientCash() &&
      this.peopleValid() &&
      (this.withBreakdown() ? this.breakdownStatus() === 'green' : this.canSkipBreakdown),
  );

  ngOnChanges(): void {
    if (this.open && !this.isSaving()) {
      this.amount.set(null);
      this.withBreakdown.set(true);
      this.cashCounts.set(emptyCashCounts());
      this.deliveredBy.set(this.auth.currentUser()?.username ?? '');
      this.receivedBy.set('');
      this.voucher.set('');
      this.observations.set('');
      this.errorMessage.set(null);
      this.requestId = crypto.randomUUID();
    }
  }

  onQuantityChange(change: { denomination: number; quantity: number }): void {
    this.cashCounts.update((counts) => ({ ...counts, [String(change.denomination)]: change.quantity }));
  }

  useCountedAsAmount(): void {
    this.amount.set(this.totalCounted() || null);
  }

  async save(): Promise<void> {
    if (!this.canSave()) {
      return;
    }
    const amount = this.amount() ?? 0;
    const confirmed = await this.confirmDialog.confirm({
      type: 'FINANCIAL_OPERATION',
      title: 'Confirmar entrega a Bodega',
      message:
        `Transferencia interna de ${formatCurrency(amount)}: entrega ${this.deliveredBy().trim()}, recibe ${this.receivedBy().trim()}` +
        `${this.withBreakdown() ? '' : ' (sin desglose de denominaciones)'}. ` +
        `Caja después: aprox. ${formatCurrency(this.cashAfter())}; Bodega después: aprox. ${formatCurrency(this.warehouseAfter())}. ` +
        'El total bajo custodia no cambia. No es un gasto ni un ingreso.',
    });
    if (!confirmed) {
      return;
    }
    this.isSaving.set(true);
    this.errorMessage.set(null);
    this.service
      .registerTransfer({
        amount,
        details: this.withBreakdown() ? cashCountsToDetails(this.cashCounts(), { keepZero: false }) : undefined,
        deliveredBy: this.deliveredBy().trim(),
        receivedBy: this.receivedBy().trim(),
        voucherReference: this.voucher().trim() || undefined,
        observations: this.observations().trim() || undefined,
        clientRequestId: this.requestId,
      })
      .subscribe({
        next: (result) => {
          this.isSaving.set(false);
          this.notifications.success(
            `Entrega ${result.transfer.referenceNumber} registrada. Caja: ${formatCurrency(result.custody.cashBalance)} · Bodega: ${formatCurrency(result.custody.warehouseBalance)}.`,
          );
          this.saved.emit(result);
        },
        error: (error: HttpErrorResponse) => {
          this.isSaving.set(false);
          this.errorMessage.set(extractErrorMessage(error, 'No se pudo registrar la entrega a Bodega.'));
        },
      });
  }
}
