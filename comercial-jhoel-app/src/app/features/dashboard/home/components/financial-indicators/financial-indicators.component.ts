import { DatePipe, TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, computed, signal } from '@angular/core';

import { DashboardMetrics, formatCurrency, formatQuantity } from '../../../../../core/models';
import { CardComponent, IconComponent } from '../../../../../shared/ui';
import { COMMISSION_RATE_PER_TRANSACTION } from '../../../transaccionar/components/commission-summary-card/commission-summary-card.component';

/**
 * "Indicadores del mes" — Ventas de Recargas / Ventas / Compras /
 * Transacciones Bancarias, all sourced from `GET /dashboard/summary` (see
 * the backend `CLAUDE.md`'s "Dashboard" section). Dumb/presentational: the
 * parent (`DashboardHomeComponent`) owns the fetch, the `AuthService.isAdmin`
 * gate, and loading/error state — this component only ever renders whatever
 * `metrics` it's handed, or a loading/empty placeholder.
 *
 * No client-side date-range logic anywhere in this component — `period`
 * (año/mes/rango) is rendered exactly as the backend computed it, never
 * re-derived from the browser's own clock, so there is nothing here that
 * could disagree with the server about which month "now" is.
 */
@Component({
  selector: 'app-financial-indicators',
  standalone: true,
  imports: [DatePipe, TitleCasePipe, CardComponent, IconComponent],
  templateUrl: './financial-indicators.component.html',
  styleUrl: './financial-indicators.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinancialIndicatorsComponent {
  @Input() set metrics(value: DashboardMetrics | null) {
    this._metrics.set(value);
  }
  get metrics(): DashboardMetrics | null {
    return this._metrics();
  }
  private readonly _metrics = signal<DashboardMetrics | null>(null);

  @Input() loading = false;

  /**
   * Today's `transaction_count` total for "Transacciones Bancarias" — the
   * one figure `DashboardMetrics.bankTransactions` genuinely doesn't carry
   * (it's month-scoped only, see `DashboardBankTransactions`'s own doc
   * comment). Rather than adding a backend field for this, the parent
   * (`DashboardHomeComponent`) already fetches it for its own "Resumen
   * Diario de Transacciones" card via the exact same
   * `BankDepositService.getTransactionSummary()` call Transaccionar itself
   * uses — this is just that same number, passed one level down.
   */
  @Input() dailyBankTransactionCount = 0;

  formatCurrency = formatCurrency;
  formatQuantity = formatQuantity;

  /** `period.year`/`period.month` → a real `Date` purely for the `date` pipe's `'MMMM yyyy'` formatting — never used for any range computation, that's entirely server-side. */
  readonly periodDate = computed(() => {
    const period = this._metrics()?.period;
    return period ? new Date(period.year, period.month - 1, 1) : null;
  });

  /**
   * "Comisión Estimada" — a pure display transformation, never a real
   * financial transaction: `subtransacciones × Q1.50` (see
   * `COMMISSION_RATE_PER_TRANSACTION`'s own doc comment, reused as-is from
   * Transaccionar's identical card rather than re-declaring the rate here).
   * `monthlyCommission` is derived from `metrics.bankTransactions
   * .totalTransactions` — the exact same count already shown as this card's
   * own hero number — never a second query for the same data.
   */
  get dailyCommission(): number {
    return this.dailyBankTransactionCount * COMMISSION_RATE_PER_TRANSACTION;
  }

  get monthlyCommission(): number {
    return (this.metrics?.bankTransactions.totalTransactions ?? 0) * COMMISSION_RATE_PER_TRANSACTION;
  }

  readonly commissionRate = COMMISSION_RATE_PER_TRANSACTION;
}
