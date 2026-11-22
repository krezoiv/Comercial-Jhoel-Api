import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, computed, signal } from '@angular/core';

import { CashStatement, CashStatementRow, formatCurrency } from '../../../../../core/models';
import { formatGuatemalaTime } from '../../cash-control.util';
import { guatemalaDate, statementTypeLabel } from '../../cash-statement.util';

/**
 * Chronological movements of the Estado de Cuenta like a bank statement: date,
 * time, operation number, type, description / beneficiary, reference, user,
 * entry (green), exit (red) and the running balance after each movement (the
 * Kardex `new_balance`, never recomputed here). The first page opens with the
 * opening balance; the footer shows the period totals.
 */
@Component({
  selector: 'app-cash-statement-table',
  standalone: true,
  imports: [],
  templateUrl: './cash-statement-table.component.html',
  styleUrl: './cash-statement-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CashStatementTableComponent {
  private readonly data = signal<CashStatement | null>(null);
  @Input({ required: true }) set statement(value: CashStatement | null) {
    this.data.set(value);
  }
  /** Any table filter applied (the opening row and totals then describe the whole period). */
  @Input() filtered = false;
  @Output() open = new EventEmitter<CashStatementRow>();

  readonly s = this.data.asReadonly();
  readonly formatCurrency = formatCurrency;
  readonly formatTime = formatGuatemalaTime;
  readonly formatDate = guatemalaDate;
  readonly rows = computed(() => this.data()?.movements.items ?? []);
  readonly firstPage = computed(() => (this.data()?.movements.page ?? 1) === 1);

  typeLabel(row: CashStatementRow): string {
    return statementTypeLabel(row, this.data()?.location ?? 'CAJA');
  }
}
