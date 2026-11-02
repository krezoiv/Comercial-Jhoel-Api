import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { formatCurrency } from '../../../../../core/models';
import { CuadreStatus } from '../../../../../core/services/bank-deposit-draft.store';
import { DecimalInputDirective } from '../../../../../shared/directives/decimal-input.directive';
import { StatusIndicatorComponent } from '../status-indicator/status-indicator.component';

const MAX_TRANSACTIONS = 50;

/**
 * "Distribución de Transacciones" — an integer "cantidad de transacciones"
 * (starts at 1, minimum 1) that generates that many amount rows. With one
 * row its amount is locked to the total; with more, each is typed manually. Resizing is delegated to the
 * parent via `transactionCountRequested` rather than applied directly here,
 * because shrinking a count that would discard already-typed amounts needs
 * a confirmation the parent owns (`ConfirmDialogService`), not this dumb
 * component.
 */
@Component({
  selector: 'app-transaction-distribution',
  standalone: true,
  imports: [DecimalInputDirective, StatusIndicatorComponent],
  templateUrl: './transaction-distribution.component.html',
  styleUrl: './transaction-distribution.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransactionDistributionComponent {
  @Input({ required: true }) transactionAmounts: number[] = [];
  @Input({ required: true }) totalDistributed = 0;
  @Input({ required: true }) totalAmount = 0;
  @Input({ required: true }) status!: CuadreStatus;
  @Input() disabled = false;

  @Output() transactionCountRequested = new EventEmitter<number>();
  @Output() amountChange = new EventEmitter<{ index: number; amount: number }>();

  formatCurrency = formatCurrency;

  /** Minimum is 1 — an operation always has at least one transaction (which then mirrors the total). An invalid or clamped value is written back so the field never shows a count that isn't real. */
  onCountInput(input: HTMLInputElement): void {
    const parsed = parseInt(input.value, 10);
    const count = Number.isNaN(parsed) ? this.transactionAmounts.length : Math.min(Math.max(parsed, 1), MAX_TRANSACTIONS);
    input.value = String(count);
    if (count !== this.transactionAmounts.length) {
      this.transactionCountRequested.emit(count);
    }
  }

  onAmountInput(index: number, value: string): void {
    const parsed = parseFloat(value);
    this.amountChange.emit({ index, amount: Number.isNaN(parsed) ? 0 : Math.max(parsed, 0) });
  }

  /** Dynamic status copy — tells the user exactly how much is left to distribute or how much they've gone over, not just that it doesn't match yet. */
  get statusText(): string {
    if (this.status === 'green') {
      return 'Transacciones cuadradas';
    }
    if (this.totalAmount <= 0) {
      return 'Ingresa el monto total a depositar';
    }
    const diff = this.totalAmount - this.totalDistributed;
    return diff > 0
      ? `Falta ${formatCurrency(diff)} por distribuir`
      : `Excede por ${formatCurrency(Math.abs(diff))}`;
  }
}
