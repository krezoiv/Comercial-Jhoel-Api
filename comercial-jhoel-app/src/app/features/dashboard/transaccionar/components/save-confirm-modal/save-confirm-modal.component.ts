import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { BANK_DEPOSIT_CASH_DENOMINATIONS, formatCurrency, formatQuantity } from '../../../../../core/models';
import { BankBalanceAmountComponent, ButtonComponent, IconComponent } from '../../../../../shared/ui';

interface CashSummaryRow {
  denomination: number;
  quantity: number;
  subtotal: number;
}

/** Rich summary-before-save — a bespoke modal (not the generic `ConfirmDialogService`) because it needs to render the full cash breakdown and per-transaction list, which that service's plain string API can't express. */
@Component({
  selector: 'app-bank-deposit-save-confirm-modal',
  standalone: true,
  imports: [ButtonComponent, IconComponent, BankBalanceAmountComponent],
  templateUrl: './save-confirm-modal.component.html',
  styleUrl: './save-confirm-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SaveConfirmModalComponent {
  @Input() open = false;
  @Input() transactionTypeName = '';
  @Input() transactionBankName = '';
  @Input() clientName = '';
  /** The registered client's own name (distinct from the free-text `clientName` above) — only ever set for a "Depósito" with a registered client picked. */
  @Input() registeredClientName: string | null = null;
  @Input() sendToAccountsReceivable = false;
  @Input() totalAmount = 0;
  @Input() cashCounts: Record<string, number> = {};
  @Input() transactionAmounts: number[] = [];
  /** "Vuelto" confirmado — `0` cuando la operación no lo necesitó. */
  @Input() changeGiven = 0;
  /** Cuenta cuyo saldo se moverá — `null` si el tipo no mueve saldo. Vista previa; el backend recalcula siempre bajo lock. */
  @Input() affectedAccountLabel: string | null = null;
  @Input() affectedAccountSpecial: string | null = null;
  @Input() balanceBefore: number | null = null;
  @Input() balanceAfter: number | null = null;
  /** Reintegro Génesis: la línea de crédito también baja por el mismo monto. */
  @Input() genesisAccountLabel: string | null = null;
  @Input() genesisBalanceBefore: number | null = null;
  @Input() genesisBalanceAfter: number | null = null;
  @Input() isSaving = false;

  @Output() confirmed = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  formatCurrency = formatCurrency;
  formatQuantity = formatQuantity;

  get totalCashReceived(): number {
    return this.cashRows.reduce((sum, row) => sum + row.subtotal, 0);
  }

  get cashRows(): CashSummaryRow[] {
    return BANK_DEPOSIT_CASH_DENOMINATIONS.map((denomination) => ({
      denomination,
      quantity: this.cashCounts[String(denomination)] || 0,
      subtotal: denomination * (this.cashCounts[String(denomination)] || 0),
    })).filter((row) => row.quantity > 0);
  }

  formatDenomination(denomination: number): string {
    return `Q${denomination.toLocaleString('es-GT', { minimumFractionDigits: denomination < 1 ? 2 : 0 })}`;
  }
}
