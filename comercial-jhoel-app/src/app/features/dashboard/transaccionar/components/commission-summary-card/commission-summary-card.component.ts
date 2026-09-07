import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { formatCurrency, formatQuantity } from '../../../../../core/models';
import { CardComponent } from '../../../../../shared/ui';

/** Q1.50 per subtransacción — a reference/estimation rate only, never registered as a real financial transaction or persisted anywhere; purely a client-side display transformation over an already-fetched count. */
export const COMMISSION_RATE_PER_TRANSACTION = 1.5;

/**
 * "Comisión Estimada" — sits alongside "Resumen Diario"/"Resumen Mes en
 * Curso" on Transaccionar's own type-picker dashboard. Computes no totals
 * of its own: `dailyTransactions`/`monthlyTransactions` are exactly the
 * same `daily.totalTransactions`/`monthly.totalTransactions` the sibling
 * cards already read from `GET /bank-deposits/summary` (see
 * `BankDepositService.getTransactionSummary()`) — this component's only
 * job is the one multiplication the ticket asks for, applied to a count
 * that already excludes anuladas and is already scoped to the correct
 * business day/calendar month server-side (`America/Guatemala`). No new
 * request, no new backend logic.
 */
@Component({
  selector: 'app-commission-summary-card',
  standalone: true,
  imports: [CardComponent],
  templateUrl: './commission-summary-card.component.html',
  styleUrl: './commission-summary-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommissionSummaryCardComponent {
  @Input({ required: true }) dailyTransactions = 0;
  @Input({ required: true }) monthlyTransactions = 0;
  @Input() loading = false;

  formatCurrency = formatCurrency;
  formatQuantity = formatQuantity;
  readonly rate = COMMISSION_RATE_PER_TRANSACTION;

  get dailyCommission(): number {
    return this.dailyTransactions * COMMISSION_RATE_PER_TRANSACTION;
  }

  get monthlyCommission(): number {
    return this.monthlyTransactions * COMMISSION_RATE_PER_TRANSACTION;
  }
}
