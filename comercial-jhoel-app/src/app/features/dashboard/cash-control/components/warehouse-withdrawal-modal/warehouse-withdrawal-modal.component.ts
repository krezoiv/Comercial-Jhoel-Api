import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, computed, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import {
  CashBankBalance,
  CashCustody,
  WarehouseWithdrawal,
  WarehouseWithdrawalDestination,
  formatCurrency,
} from '../../../../../core/models';
import { CuadreStatus } from '../../../../../core/services/bank-deposit-draft.store';
import { AuthService } from '../../../../../core/services/auth.service';
import { CashControlService } from '../../../../../core/services/cash-control.service';
import { CashCustodyService } from '../../../../../core/services/cash-custody.service';
import { ConfirmDialogService } from '../../../../../core/services/confirm-dialog.service';
import { NotificationService } from '../../../../../core/services/notification.service';
import { extractErrorMessage } from '../../../../../core/utils/extract-error-message';
import { DecimalInputDirective } from '../../../../../shared/directives/decimal-input.directive';
import { ButtonComponent, IconComponent } from '../../../../../shared/ui';
import { CashBreakdownTableComponent } from '../../../transaccionar/components/cash-breakdown-table/cash-breakdown-table.component';
import { cashCountsToDetails, cashCountsTotal, emptyCashCounts, round2 } from '../../cash-control.util';

/**
 * "Retiro de Bodega": cash leaves Bodega and either goes back to the caja
 * (internal transfer, total custody unchanged) or is deposited into a
 * registered bank account (Bodega down, bank up). Breakdown by default;
 * without it only administrators (business policy). Previews only — the
 * backend checks the Bodega balance under its lock and applies both sides in
 * one transaction. One `clientRequestId` per opening (idempotent).
 */
@Component({
  selector: 'app-warehouse-withdrawal-modal',
  standalone: true,
  imports: [FormsModule, ButtonComponent, IconComponent, DecimalInputDirective, CashBreakdownTableComponent],
  templateUrl: './warehouse-withdrawal-modal.component.html',
  styleUrl: '../cash-bank-deposit-modal/cash-bank-deposit-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WarehouseWithdrawalModalComponent implements OnChanges {
  @Input() open = false;
  @Input() custody: CashCustody | null = null;
  /** Administrators may register a total without breakdown. */
  @Input() canSkipBreakdown = false;

  @Output() closed = new EventEmitter<void>();
  @Output() saved = new EventEmitter<{ withdrawal: WarehouseWithdrawal; custody: CashCustody }>();

  private readonly service = inject(CashCustodyService);
  private readonly cashService = inject(CashControlService);
  private readonly confirmDialog = inject(ConfirmDialogService);
  private readonly notifications = inject(NotificationService);
  private readonly auth = inject(AuthService);

  readonly formatCurrency = formatCurrency;

  readonly destination = signal<WarehouseWithdrawalDestination>('CAJA');
  readonly banks = signal<CashBankBalance[]>([]);
  readonly bankId = signal('');
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

  readonly selectedBank = computed(() => this.banks().find((bank) => bank.bankId === this.bankId()) ?? null);
  readonly totalCounted = computed(() => cashCountsTotal(this.cashCounts()));
  readonly breakdownStatus = computed<CuadreStatus>(() => {
    const total = this.totalCounted();
    const amount = round2(this.amount() ?? 0);
    if (amount > 0 && total === amount) return 'green';
    return total > amount ? 'red' : 'yellow';
  });
  readonly warehouseBalance = computed(() => this.custody?.warehouseBalance ?? 0);
  readonly warehouseAfter = computed(() => round2(this.warehouseBalance() - (this.amount() ?? 0)));
  readonly targetBefore = computed(() =>
    this.destination() === 'CAJA' ? (this.custody?.cashBalance ?? 0) : (this.selectedBank()?.balance ?? 0),
  );
  readonly targetAfter = computed(() => round2(this.targetBefore() + (this.amount() ?? 0)));
  readonly insufficient = computed(() => (this.amount() ?? 0) > this.warehouseBalance());
  readonly dayOpen = computed(() => !!this.custody?.currentDay?.isOpen);
  readonly canSave = computed(
    () =>
      !this.isSaving() &&
      this.dayOpen() &&
      (this.amount() ?? 0) > 0 &&
      !this.insufficient() &&
      this.deliveredBy().trim().length >= 3 &&
      this.receivedBy().trim().length >= 3 &&
      (this.destination() === 'CAJA' || !!this.selectedBank()) &&
      (this.withBreakdown() ? this.breakdownStatus() === 'green' : this.canSkipBreakdown),
  );

  ngOnChanges(): void {
    if (this.open && !this.isSaving()) {
      this.destination.set('CAJA');
      this.bankId.set('');
      this.amount.set(null);
      this.withBreakdown.set(true);
      this.cashCounts.set(emptyCashCounts());
      this.deliveredBy.set('');
      this.receivedBy.set(this.auth.currentUser()?.username ?? '');
      this.voucher.set('');
      this.observations.set('');
      this.errorMessage.set(null);
      this.requestId = crypto.randomUUID();
      this.cashService.getBankBalances().subscribe({
        next: (banks) => this.banks.set(banks.filter((bank) => bank.specialAccount !== 'GUAYACAN')),
        error: () => this.banks.set([]),
      });
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
    const toCash = this.destination() === 'CAJA';
    const confirmed = await this.confirmDialog.confirm({
      type: 'FINANCIAL_OPERATION',
      title: toCash ? 'Confirmar retiro de Bodega a caja' : 'Confirmar depósito desde Bodega',
      message: toCash
        ? `Transferencia interna de ${formatCurrency(amount)}: Bodega después aprox. ${formatCurrency(this.warehouseAfter())}, caja después aprox. ${formatCurrency(this.targetAfter())}. El total bajo custodia no cambia.`
        : `Salen ${formatCurrency(amount)} de Bodega y se depositan en ${this.selectedBank()?.bankName}. Bodega después aprox. ${formatCurrency(this.warehouseAfter())}; saldo de la cuenta después aprox. ${formatCurrency(this.targetAfter())}.`,
    });
    if (!confirmed) {
      return;
    }
    this.isSaving.set(true);
    this.errorMessage.set(null);
    this.service
      .registerWithdrawal({
        destination: this.destination(),
        amount,
        details: this.withBreakdown() ? cashCountsToDetails(this.cashCounts(), { keepZero: false }) : undefined,
        bankId: toCash ? undefined : this.bankId(),
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
            `Retiro ${result.withdrawal.referenceNumber} registrado. Bodega: ${formatCurrency(result.custody.warehouseBalance)} · Caja: ${formatCurrency(result.custody.cashBalance)}.`,
          );
          this.saved.emit(result);
        },
        error: (error: HttpErrorResponse) => {
          this.isSaving.set(false);
          this.errorMessage.set(extractErrorMessage(error, 'No se pudo registrar el retiro de Bodega.'));
        },
      });
  }
}
