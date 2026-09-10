import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { PageHeaderComponent } from '../../../shared/ui';
import { CashBoxCardComponent } from './components/cash-box-card/cash-box-card.component';
import { CashBoxHistoryComponent } from './components/cash-box-history/cash-box-history.component';

/** Local-time `yyyy-MM-dd`, no UTC-offset dance — same technique as Recargas' own `todayIsoDate()` and every other date-driven page in this app. */
function todayIsoDate(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * "Gestión Caja Recargas" — a standalone Sistema-level page, moved out of
 * the Recargas Electrónicas page per an explicit follow-up request (it used
 * to be a section embedded there). No day-open/close lifecycle here —
 * unlike Recargas' own page, a Caja Contable withdrawal is never gated by
 * whether the Recargas day is open or closed (see the backend's own doc
 * comment on `register_recharge_cash_box_withdrawal`), so this page is
 * intentionally simpler: just a business-date picker driving the balance
 * card and the movement history below it.
 */
@Component({
  selector: 'app-recharge-cash-box-page',
  standalone: true,
  imports: [PageHeaderComponent, CashBoxCardComponent, CashBoxHistoryComponent],
  templateUrl: './recharge-cash-box-page.component.html',
  styleUrl: './recharge-cash-box-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RechargeCashBoxPageComponent {
  /** `yyyy-MM-dd` — defaults to today; drives the balance card. The history table has its own independent date-range filters. */
  readonly operationDate = signal(todayIsoDate());
  readonly maxSelectableDate = todayIsoDate();

  /** Bumped after a manual movement (aporte or salida) is registered so the (independently paginated/filtered) history table below refetches its current page too. */
  readonly historyRefreshTrigger = signal(0);

  onDateChange(value: string): void {
    if (value) {
      this.operationDate.set(value);
    }
  }

  onMovementRegistered(): void {
    this.historyRefreshTrigger.update((value) => value + 1);
  }
}
