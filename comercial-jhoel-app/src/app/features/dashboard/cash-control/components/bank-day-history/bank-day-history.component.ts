import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { CashBankDaySummary, formatCurrency } from '../../../../../core/models';
import { CardComponent } from '../../../../../shared/ui';
import { bucketAmount, formatIsoDate } from '../../cash-control.util';

/**
 * "Historial por día operativo": the original indicators of each bank day
 * (read only). Clicking a row consults that day.
 */
@Component({
  selector: 'app-cash-bank-day-history',
  standalone: true,
  imports: [CardComponent],
  templateUrl: './bank-day-history.component.html',
  styleUrl: './bank-day-history.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CashBankDayHistoryComponent {
  @Input() bankDays: CashBankDaySummary[] = [];
  /** Business date currently shown above (highlighted row). */
  @Input() activeDate: string | null = null;

  /** '' = current day; a date = that past day. */
  @Output() select = new EventEmitter<string>();

  readonly formatCurrency = formatCurrency;
  readonly formatIsoDate = formatIsoDate;
  readonly bucketAmount = bucketAmount;
}
