import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { CashBankDayHeader, CashBankDaySummary, CashDateSummary, formatCurrency } from '../../../../../core/models';
import { CardComponent } from '../../../../../shared/ui';
import { formatGuatemalaDateTime, formatGuatemalaTime, formatIsoDate } from '../../cash-control.util';

/** The day shown by the card: the current bank day (live) or a past one (read only). */
export interface ViewedBankDay {
  header: CashBankDayHeader | null;
  summary: CashDateSummary;
  isPast: boolean;
}

/**
 * "Acumulados del día operativo": daily indicators that restart at every
 * Agentes Bancarios opening (the physical balance never does), with the
 * selector to consult a past bank day. Presentational: every value comes
 * from the backend through the page.
 */
@Component({
  selector: 'app-cash-bank-day-card',
  standalone: true,
  imports: [FormsModule, CardComponent],
  templateUrl: './bank-day-card.component.html',
  styleUrl: './bank-day-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CashBankDayCardComponent {
  @Input({ required: true }) view!: ViewedBankDay;
  @Input() bankDays: CashBankDaySummary[] = [];
  /** Business date of the current bank day (for the "Actual" option). */
  @Input() currentBankDate: string | null = null;
  @Input() selectedBankDate: string | null = null;
  /** Official physical cash right now. */
  @Input() balance = 0;
  @Input() lastRefresh: string | null = null;

  /** '' = current day; a date = that past day. */
  @Output() select = new EventEmitter<string>();

  readonly formatCurrency = formatCurrency;
  readonly formatDateTime = formatGuatemalaDateTime;
  readonly formatTime = formatGuatemalaTime;
  readonly formatIsoDate = formatIsoDate;
}
