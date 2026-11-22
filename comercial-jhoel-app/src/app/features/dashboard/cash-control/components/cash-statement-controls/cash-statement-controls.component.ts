import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import {
  CASH_STATEMENT_STATUS_LABEL,
  CASH_STATEMENT_STATUS_TONE,
  CashStatement,
  CashStatementDay,
  formatCurrency,
} from '../../../../../core/models';
import { IconComponent } from '../../../../../shared/ui';
import { formatDifference, formatGuatemalaDateTime, formatGuatemalaTime, formatIsoDate } from '../../cash-control.util';

/**
 * Physical controls of the statement period — arqueos (with their difference
 * as recorded, never adjusted) and cash cuts — and the day history: one line
 * per bank day with opening, entries, exits, closing and its last count.
 * Clicking a day opens its statement. Presentational.
 */
@Component({
  selector: 'app-cash-statement-controls',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './cash-statement-controls.component.html',
  styleUrl: './cash-statement-controls.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CashStatementControlsComponent {
  @Input() statement: CashStatement | null = null;
  @Input() days: CashStatementDay[] = [];
  /** Bank day currently shown ('' = the current one). */
  @Input() selectedDay = '';
  @Output() selectDay = new EventEmitter<string>();

  readonly formatCurrency = formatCurrency;
  readonly formatDifference = formatDifference;
  readonly formatDateTime = formatGuatemalaDateTime;
  readonly formatTime = formatGuatemalaTime;
  readonly formatIsoDate = formatIsoDate;
  readonly statusLabel = CASH_STATEMENT_STATUS_LABEL;
  readonly statusTone = CASH_STATEMENT_STATUS_TONE;
}
