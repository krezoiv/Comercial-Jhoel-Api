import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { AccountReceivable, CHARGE_STATUS_LABEL, formatAccountReceivableCurrency } from '../../../../../core/models';
import { CHARGE_STATUS_TONE } from '../payment-history-modal/payment-history-modal.component';
import { BadgeComponent, ButtonComponent, EmptyStateComponent, IconComponent } from '../../../../../shared/ui';

/** Rows to render while `loading` is true — just enough to fill the fold without looking sparse. */
const SKELETON_ROWS = 4;

@Component({
  selector: 'app-account-receivable-table',
  standalone: true,
  imports: [DatePipe, BadgeComponent, ButtonComponent, IconComponent, EmptyStateComponent],
  templateUrl: './account-receivable-table.component.html',
  styleUrl: './account-receivable-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountReceivableTableComponent {
  @Input() records: AccountReceivable[] = [];
  @Input() loading = false;
  @Input() hasActiveFilters = false;
  /** Other roles are read-only — hides the Acciones column and edit/delete buttons. The backend still enforces this. */
  @Input() canManage = true;

  @Output() edit = new EventEmitter<AccountReceivable>();
  @Output() delete = new EventEmitter<AccountReceivable>();
  @Output() clearFilters = new EventEmitter<void>();
  @Output() addRecord = new EventEmitter<void>();
  /** Open to any authenticated role, unlike edit/delete — reading a statement isn't a mutation. */
  @Output() viewStatement = new EventEmitter<AccountReceivable>();
  /** Accounts currently selected for "Cancelar cuentas seleccionadas" (owned by the page). */
  @Input() selectedIds: ReadonlySet<string> = new Set();
  /** Checkbox toggled — the page enforces the "same client" rule. */
  @Output() toggleSelect = new EventEmitter<AccountReceivable>();
  /** "Cobrar" a single account (cash or bank deposit). */
  @Output() settle = new EventEmitter<AccountReceivable>();
  /** Payment history of one account — open to any authenticated role. */
  @Output() viewPayments = new EventEmitter<AccountReceivable>();

  readonly statusLabel = CHARGE_STATUS_LABEL;
  readonly statusTone = CHARGE_STATUS_TONE;

  readonly skeletonRows = Array.from({ length: SKELETON_ROWS });

  /** Active CARGO with something left to collect (pending computed by the backend). */
  isPayable(record: AccountReceivable): boolean {
    return record.movementType === 'CARGO' && record.isActive && (record.pendingAmount ?? 0) > 0;
  }

  /** A CARGO that has (or had) a collection state to show. */
  hasPaymentState(record: AccountReceivable): boolean {
    return record.movementType === 'CARGO' && !!record.paymentStatus;
  }

  formatCurrency(amount: number): string {
    return formatAccountReceivableCurrency(amount);
  }
}
