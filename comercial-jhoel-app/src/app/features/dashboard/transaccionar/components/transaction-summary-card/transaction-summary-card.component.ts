import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { BankDepositPeriodSummary, formatQuantity } from '../../../../../core/models';
import { CardComponent } from '../../../../../shared/ui';

/**
 * One "Resumen Diario"/"Resumen del Mes en Curso" card — purely
 * presentational over whatever `GET /bank-deposits/summary` already
 * computed server-side (see `BankDepositService.getTransactionSummary()`);
 * this component performs no aggregation of its own; "transacciones" here
 * is `transactions` (already `SUM(transaction_count)` from the backend),
 * never a client-side count/reduce over raw rows.
 */
@Component({
  selector: 'app-transaction-summary-card',
  standalone: true,
  imports: [CardComponent],
  templateUrl: './transaction-summary-card.component.html',
  styleUrl: './transaction-summary-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransactionSummaryCardComponent {
  @Input({ required: true }) title = '';
  /** Optional secondary line under the title — e.g. the current month's name for the monthly card. */
  @Input() subtitle: string | null = null;
  @Input({ required: true }) summary!: BankDepositPeriodSummary;
  @Input() loading = false;

  formatQuantity = formatQuantity;
}
