import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, computed, signal } from '@angular/core';

import {
  CashStatementLocation,
  CashStatementRow,
  formatCurrency,
  statementOriginRoute,
} from '../../../../../core/models';
import { ButtonComponent, IconComponent } from '../../../../../shared/ui';
import { BankDepositDetailModalComponent } from '../../../reports/bank-deposits/components/bank-deposit-detail-modal/bank-deposit-detail-modal.component';
import { formatGuatemalaDateTime } from '../../cash-control.util';
import { statementTypeLabel } from '../../cash-statement.util';

/** Module that produced a Kardex row, from its reference. */
const ORIGIN_LABEL: Record<string, string> = {
  BANK_DEPOSIT: 'Transaccionar',
  ACCOUNT_RECEIVABLE: 'Cuentas por cobrar',
  ASSET: 'Activos',
  BANK_MOVEMENT: 'Bancos',
  WAREHOUSE_TRANSFER: 'Control de Efectivo · traslado Caja → Bodega',
  WAREHOUSE_WITHDRAWAL: 'Control de Efectivo · retiro de Bodega',
};

/**
 * Detail and traceability of one statement movement: type, origin module,
 * date and time, description, beneficiary, reference, amount, balance before
 * and after (Kardex), user, cut, status and the link to the original
 * operation when the app has a screen for it (a Transaccionar operation opens
 * its own detail right here).
 */
@Component({
  selector: 'app-cash-statement-detail-modal',
  standalone: true,
  imports: [ButtonComponent, IconComponent, BankDepositDetailModalComponent],
  templateUrl: './cash-statement-detail-modal.component.html',
  styleUrl: './cash-statement-detail-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CashStatementDetailModalComponent {
  private readonly current = signal<CashStatementRow | null>(null);
  @Input({ required: true }) set row(value: CashStatementRow | null) {
    this.current.set(value);
    this.depositOpen.set(false);
  }
  @Input() location: CashStatementLocation = 'CAJA';
  @Output() closed = new EventEmitter<void>();

  readonly formatCurrency = formatCurrency;
  readonly formatDateTime = formatGuatemalaDateTime;
  readonly r = this.current.asReadonly();
  readonly depositOpen = signal(false);

  readonly typeLabel = computed(() => {
    const row = this.current();
    return row ? statementTypeLabel(row, this.location) : '';
  });
  readonly origin = computed(() => {
    const row = this.current();
    if (!row) return '';
    return row.referenceType ? (ORIGIN_LABEL[row.referenceType] ?? row.referenceType) : 'Control de Efectivo · registro manual';
  });
  readonly originRoute = computed(() => {
    const row = this.current();
    return row ? statementOriginRoute(row) : null;
  });
  readonly isTransaccionar = computed(() => this.current()?.referenceType === 'BANK_DEPOSIT' && !!this.current()?.referenceId);
}
