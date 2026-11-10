import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, computed, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { CashBankBalance, CashMovementResult, formatCurrency } from '../../../../../core/models';
import { CuadreStatus } from '../../../../../core/services/bank-deposit-draft.store';
import { CashControlService } from '../../../../../core/services/cash-control.service';
import { ConfirmDialogService } from '../../../../../core/services/confirm-dialog.service';
import { NotificationService } from '../../../../../core/services/notification.service';
import { extractErrorMessage } from '../../../../../core/utils/extract-error-message';
import { DecimalInputDirective } from '../../../../../shared/directives/decimal-input.directive';
import { ButtonComponent, IconComponent } from '../../../../../shared/ui';
import { CashBreakdownTableComponent } from '../../../transaccionar/components/cash-breakdown-table/cash-breakdown-table.component';
import { cashCountsToDetails, cashCountsTotal, emptyCashCounts, round2 } from '../../cash-control.util';

/**
 * "Depósito bancario": cash leaves the caja and is deposited into one of the
 * registered bank accounts. The denomination breakdown is mandatory and must
 * add up exactly to the amount (same colour code as Transaccionar: green =
 * matches, yellow = missing, red = exceeds). The "después" figures are a
 * preview only — the backend applies both sides in one transaction, checks
 * the cash available and the account's own rules, and returns the official
 * balance. One `clientRequestId` per opening makes retries idempotent.
 * Cooperativa Guayacán is not offered: its balance is its own caja.
 */
@Component({
  selector: 'app-cash-bank-deposit-modal',
  standalone: true,
  imports: [FormsModule, ButtonComponent, IconComponent, DecimalInputDirective, CashBreakdownTableComponent],
  templateUrl: './cash-bank-deposit-modal.component.html',
  styleUrl: './cash-bank-deposit-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CashBankDepositModalComponent implements OnChanges {
  @Input() open = false;
  /** Official current cash (backend), preview only. */
  @Input() currentBalance = 0;

  @Output() closed = new EventEmitter<void>();
  @Output() saved = new EventEmitter<CashMovementResult>();

  private readonly service = inject(CashControlService);
  private readonly confirmDialog = inject(ConfirmDialogService);
  private readonly notifications = inject(NotificationService);

  readonly formatCurrency = formatCurrency;

  readonly banks = signal<CashBankBalance[]>([]);
  readonly loadingBanks = signal(false);
  readonly banksFailed = signal(false);
  readonly bankId = signal('');
  readonly amount = signal<number | null>(null);
  readonly cashCounts = signal<Record<string, number>>(emptyCashCounts());
  readonly description = signal('');
  readonly isSaving = signal(false);
  readonly errorMessage = signal<string | null>(null);
  private readonly balanceSignal = signal(0);
  private requestId = crypto.randomUUID();

  readonly selectedBank = computed(() => this.banks().find((bank) => bank.bankId === this.bankId()) ?? null);
  readonly totalCounted = computed(() => cashCountsTotal(this.cashCounts()));
  readonly breakdownStatus = computed<CuadreStatus>(() => {
    const total = this.totalCounted();
    const amount = round2(this.amount() ?? 0);
    if (amount > 0 && total === amount) return 'green';
    return total > amount ? 'red' : 'yellow';
  });
  readonly cashAfter = computed(() => round2(this.balanceSignal() - (this.amount() ?? 0)));
  readonly bankAfter = computed(() => round2((this.selectedBank()?.balance ?? 0) + (this.amount() ?? 0)));
  readonly insufficientCash = computed(() => (this.amount() ?? 0) > this.balanceSignal());
  readonly canSave = computed(
    () =>
      !this.isSaving() &&
      !!this.selectedBank() &&
      (this.amount() ?? 0) > 0 &&
      this.breakdownStatus() === 'green' &&
      !this.insufficientCash(),
  );

  ngOnChanges(): void {
    this.balanceSignal.set(this.currentBalance);
    if (this.open && !this.isSaving()) {
      this.bankId.set('');
      this.amount.set(null);
      this.cashCounts.set(emptyCashCounts());
      this.description.set('');
      this.errorMessage.set(null);
      this.requestId = crypto.randomUUID();
      this.loadBanks();
    }
  }

  loadBanks(): void {
    this.loadingBanks.set(true);
    this.banksFailed.set(false);
    this.service.getBankBalances().subscribe({
      next: (banks) => {
        this.banks.set(banks.filter((bank) => bank.specialAccount !== 'GUAYACAN'));
        this.loadingBanks.set(false);
      },
      error: () => {
        this.loadingBanks.set(false);
        this.banksFailed.set(true);
      },
    });
  }

  onQuantityChange(change: { denomination: number; quantity: number }): void {
    this.cashCounts.update((counts) => ({ ...counts, [String(change.denomination)]: change.quantity }));
  }

  /** Fills the amount with what was counted (common case: count the bills first). */
  useCountedAsAmount(): void {
    this.amount.set(this.totalCounted() || null);
  }

  async save(): Promise<void> {
    const bank = this.selectedBank();
    if (!bank || !this.canSave()) {
      return;
    }
    const amount = this.amount() ?? 0;
    const confirmed = await this.confirmDialog.confirm({
      type: 'FINANCIAL_OPERATION',
      title: 'Registrar depósito bancario',
      message: `Salen ${formatCurrency(amount)} de la caja y se depositan en ${bank.bankName}. Efectivo después: aprox. ${formatCurrency(this.cashAfter())}; saldo de la cuenta después: aprox. ${formatCurrency(this.bankAfter())}.`,
    });
    if (!confirmed) {
      return;
    }
    this.isSaving.set(true);
    this.errorMessage.set(null);
    this.service
      .registerBankDeposit({
        bankId: bank.bankId,
        amount,
        details: cashCountsToDetails(this.cashCounts(), { keepZero: false }),
        description: this.description().trim() || undefined,
        clientRequestId: this.requestId,
      })
      .subscribe({
        next: (result) => {
          this.isSaving.set(false);
          this.notifications.success(
            `Depósito registrado en ${bank.bankName}. Efectivo disponible: ${formatCurrency(result.balance)}.`,
          );
          this.saved.emit(result);
        },
        error: (error: HttpErrorResponse) => {
          this.isSaving.set(false);
          this.errorMessage.set(extractErrorMessage(error, 'No se pudo registrar el depósito bancario.'));
        },
      });
  }
}
