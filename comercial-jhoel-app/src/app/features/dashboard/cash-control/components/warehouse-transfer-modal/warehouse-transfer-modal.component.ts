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
import { ButtonComponent, IconComponent } from '../../../../../shared/ui';
import { CashBreakdownTableComponent } from '../../../transaccionar/components/cash-breakdown-table/cash-breakdown-table.component';
import { cashCountsToDetails, cashCountsTotal, emptyCashCounts, formatIsoDate, round2 } from '../../cash-control.util';

/** Same copy as the backend (`CASH_WAREHOUSE_TRANSFER_EXCEEDS_CASH`). */
export function exceedsCashMessage(available: number): string {
  return `No puedes trasladar más efectivo del disponible en Caja. Efectivo disponible: ${formatCurrency(available)}.`;
}

/**
 * "Traslado de efectivo de Caja a Bodega": an internal transfer — caja goes
 * down, Bodega goes up by the same amount, total custody unchanged; never an
 * expense nor an income.
 *
 * Independent of the Arqueo de Caja (migration 1760008900000): what can be
 * sent is the OFFICIAL caja balance, re-read from the backend when the form
 * opens — never the last arqueo. The amount is not typed: it IS the total of
 * the breakdown (Q200 … Q0.01), so they can never disagree. The previews here
 * are UX only; the backend re-reads the balance under its lock, validates the
 * breakdown and applies both Kardex rows in one transaction. One
 * `clientRequestId` per opening makes a double click harmless.
 */
@Component({
  selector: 'app-warehouse-transfer-modal',
  standalone: true,
  imports: [FormsModule, ButtonComponent, IconComponent, CashBreakdownTableComponent],
  templateUrl: './warehouse-transfer-modal.component.html',
  styleUrls: ['../cash-bank-deposit-modal/cash-bank-deposit-modal.component.scss', './warehouse-transfer-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WarehouseTransferModalComponent implements OnChanges {
  @Input() open = false;
  @Input() custody: CashCustody | null = null;

  @Output() closed = new EventEmitter<void>();
  @Output() saved = new EventEmitter<{ transfer: WarehouseTransfer; custody: CashCustody }>();

  private readonly service = inject(CashCustodyService);
  private readonly confirmDialog = inject(ConfirmDialogService);
  private readonly notifications = inject(NotificationService);
  private readonly auth = inject(AuthService);

  readonly formatCurrency = formatCurrency;
  readonly formatIsoDate = formatIsoDate;

  /** Balances read from the backend when the form opens (falls back to the page's copy meanwhile). */
  readonly live = signal<CashCustody | null>(null);
  readonly loadingBalance = signal(false);
  readonly cashCounts = signal<Record<string, number>>(emptyCashCounts());
  readonly deliveredBy = signal('');
  readonly receivedBy = signal('');
  readonly voucher = signal('');
  readonly observations = signal('');
  readonly isSaving = signal(false);
  readonly errorMessage = signal<string | null>(null);
  private requestId = crypto.randomUUID();

  readonly current = computed(() => this.live() ?? this.custody);
  readonly cashBalance = computed(() => this.current()?.cashBalance ?? 0);
  readonly warehouseBalance = computed(() => this.current()?.warehouseBalance ?? 0);
  /** The amount sent = the total of the breakdown (never typed separately). */
  readonly amount = computed(() => cashCountsTotal(this.cashCounts()));
  readonly cashAfter = computed(() => round2(this.cashBalance() - this.amount()));
  readonly warehouseAfter = computed(() => round2(this.warehouseBalance() + this.amount()));
  readonly exceedsCash = computed(() => this.amount() > this.cashBalance());
  readonly breakdownStatus = computed<CuadreStatus>(() => {
    if (this.exceedsCash()) return 'red';
    return this.amount() > 0 ? 'green' : 'yellow';
  });
  readonly breakdownMessage = computed(() => {
    const amount = this.amount();
    if (amount <= 0) return 'Ingresa la cantidad de billetes y monedas que envías a Bodega';
    if (this.exceedsCash()) return `Supera el efectivo disponible por ${formatCurrency(round2(amount - this.cashBalance()))}`;
    return `Traslado de ${formatCurrency(amount)} dentro del efectivo disponible`;
  });
  readonly dayOpen = computed(() => !!this.current()?.currentDay?.isOpen);
  readonly peopleValid = computed(() => this.deliveredBy().trim().length >= 3 && this.receivedBy().trim().length >= 3);
  readonly canSave = computed(
    () =>
      !this.isSaving() &&
      !this.loadingBalance() &&
      this.dayOpen() &&
      this.amount() > 0 &&
      !this.exceedsCash() &&
      this.peopleValid(),
  );

  ngOnChanges(): void {
    if (this.open && !this.isSaving()) {
      this.cashCounts.set(emptyCashCounts());
      this.deliveredBy.set(this.auth.currentUser()?.username ?? '');
      this.receivedBy.set('');
      this.voucher.set('');
      this.observations.set('');
      this.errorMessage.set(null);
      this.requestId = crypto.randomUUID();
      this.refreshBalance();
    }
  }

  /** The official caja balance, straight from the backend. */
  refreshBalance(): void {
    this.loadingBalance.set(true);
    this.service.getCustody().subscribe({
      next: (custody) => {
        this.live.set(custody);
        this.loadingBalance.set(false);
      },
      error: () => {
        // Keep the page's copy; the backend validates on save anyway.
        this.live.set(null);
        this.loadingBalance.set(false);
      },
    });
  }

  onQuantityChange(change: { denomination: number; quantity: number }): void {
    const quantity = Math.max(0, Math.trunc(Number(change.quantity) || 0));
    this.cashCounts.update((counts) => ({ ...counts, [String(change.denomination)]: quantity }));
  }

  exceedsMessage(): string {
    return exceedsCashMessage(this.cashBalance());
  }

  async save(): Promise<void> {
    if (!this.canSave()) {
      return;
    }
    const amount = this.amount();
    const confirmed = await this.confirmDialog.confirm({
      type: 'FINANCIAL_OPERATION',
      title: 'Confirmar traslado a Bodega',
      message:
        `Efectivo disponible antes del traslado: ${formatCurrency(this.cashBalance())}. ` +
        `Total trasladado: ${formatCurrency(amount)}. ` +
        `Efectivo restante en Caja: ${formatCurrency(this.cashAfter())}. ` +
        `Total que ingresará a Bodega: ${formatCurrency(amount)}. ` +
        `Entrega ${this.deliveredBy().trim()}, recibe ${this.receivedBy().trim()}. ` +
        'Es un traslado interno: no es gasto ni ingreso y el total bajo resguardo no cambia.',
      confirmText: 'Confirmar traslado a Bodega',
    });
    if (!confirmed) {
      return;
    }
    this.isSaving.set(true);
    this.errorMessage.set(null);
    this.service
      .registerTransfer({
        amount,
        details: cashCountsToDetails(this.cashCounts(), { keepZero: false }),
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
            `Traslado ${result.transfer.referenceNumber} registrado. Caja: ${formatCurrency(result.custody.cashBalance)} · Bodega: ${formatCurrency(result.custody.warehouseBalance)}.`,
          );
          this.saved.emit(result);
        },
        error: (error: HttpErrorResponse) => {
          this.isSaving.set(false);
          this.errorMessage.set(extractErrorMessage(error, 'No se pudo registrar el traslado a Bodega.'));
          // The balance may have changed (another user): show the current one.
          this.refreshBalance();
        },
      });
  }
}
