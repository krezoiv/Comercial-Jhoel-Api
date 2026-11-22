import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

import { CashStatementRow, IntegrityFinding, formatCurrency } from '../../../../../core/models';
import { CashControlService } from '../../../../../core/services/cash-control.service';
import { extractErrorMessage } from '../../../../../core/utils/extract-error-message';
import { ButtonComponent, IconComponent } from '../../../../../shared/ui';
import { formatGuatemalaDateTime } from '../../cash-control.util';
import { statementTypeLabel } from '../../cash-statement.util';

/**
 * "Investigar": the Kardex movements of the stretch where a count difference
 * appeared (between the previous count and this one), in order, with who
 * registered each one and the balance after it. Rows flagged by other findings
 * are highlighted as possible explanations — to verify, never a conclusion.
 */
@Component({
  selector: 'app-integrity-window-modal',
  standalone: true,
  imports: [ButtonComponent, IconComponent],
  templateUrl: './integrity-window-modal.component.html',
  styleUrls: ['../cash-bank-deposit-modal/cash-bank-deposit-modal.component.scss', './integrity-window-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IntegrityWindowModalComponent implements OnChanges {
  @Input() finding: IntegrityFinding | null = null;
  /** Movement ids flagged by other findings (highlighted). */
  @Input() flagged: string[] = [];
  @Output() closed = new EventEmitter<void>();

  private readonly service = inject(CashControlService);
  readonly formatCurrency = formatCurrency;
  readonly formatDateTime = formatGuatemalaDateTime;
  readonly rows = signal<CashStatementRow[]>([]);
  readonly total = signal(0);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  ngOnChanges(): void {
    const window = this.finding?.window;
    this.rows.set([]);
    this.error.set(null);
    if (!window) {
      return;
    }
    this.loading.set(true);
    this.service.getIntegrityMovements(window).subscribe({
      next: (page) => {
        this.rows.set(page.items);
        this.total.set(page.total);
        this.loading.set(false);
      },
      error: (error: HttpErrorResponse) => {
        this.loading.set(false);
        this.error.set(extractErrorMessage(error, 'No se pudieron cargar los movimientos.'));
      },
    });
  }

  typeLabel(row: CashStatementRow): string {
    return statementTypeLabel(row, this.finding?.window?.location ?? 'CAJA');
  }
}
