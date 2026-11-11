import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  computed,
  signal,
} from '@angular/core';
import { DatePipe, NgTemplateOutlet } from '@angular/common';

import { IconComponent } from '../../../../../shared/ui';
import {
  BankDiagnosis,
  CorrectionRequest,
  DIFFERENCE_TYPE_LABEL,
  DayMovement,
  DifferenceItem,
  FinancialDayDetail,
  MATCH_LABEL,
  MovementSource,
  PortfolioRow,
  REVIEW_MODULE_LABEL,
  ReviewModule,
  SnapshotTarget,
} from '../../../../../core/models';
import { formatCurrency } from '../../../../../core/utils/number-format.util';

export type ReviewTab =
  | 'diagnosis'
  | 'banks'
  | 'cash'
  | 'receivables'
  | 'assets'
  | 'movements'
  | 'reconciliation'
  | 'audit';

const MOVEMENT_MODULE: Record<MovementSource, ReviewModule> = {
  CASH_MOVEMENT: 'EFECTIVO',
  BANK_MOVEMENT: 'BANCOS',
  TRANSACTION: 'TRANSACCIONES',
  ACCOUNT_RECEIVABLE: 'CUENTAS_POR_COBRAR',
  ASSET: 'ACTIVOS',
};

const SNAPSHOT_MODULE: Record<SnapshotTarget, ReviewModule> = {
  BANK_BALANCE: 'BANCOS',
  AGENT_RECONCILIATION: 'CUADRE',
  CASH_DAY: 'EFECTIVO',
  CASH_CUT_PERIOD: 'CORTES',
  CASH_CUT_COUNT: 'CORTES',
  CASH_BANK_RECONCILIATION: 'CORTES',
};

/**
 * Read-only rendering of one day's diagnosis (from the backend) in tabs. When
 * `canEdit` is true each correctable value shows a "Corregir" action that
 * emits a `CorrectionRequest`; the page opens the correction modal.
 */
@Component({
  selector: 'app-day-review-panel',
  standalone: true,
  imports: [DatePipe, NgTemplateOutlet, IconComponent],
  templateUrl: './day-review-panel.component.html',
  styleUrl: './day-review-panel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DayReviewPanelComponent {
  @Input({ required: true }) detail!: FinancialDayDetail;
  @Input() canEdit = false;
  @Output() correct = new EventEmitter<CorrectionRequest>();

  readonly tab = signal<ReviewTab>('diagnosis');
  readonly movementFilter = signal<'ALL' | MovementSource>('ALL');
  readonly expanded = signal<string | null>(null);

  readonly tabs: Array<{ id: ReviewTab; label: string; icon: string }> = [
    { id: 'diagnosis', label: 'Diagnóstico', icon: 'alert-triangle' },
    { id: 'banks', label: 'Agentes Bancarios', icon: 'bank' },
    { id: 'cash', label: 'Efectivo y cortes', icon: 'wallet' },
    { id: 'receivables', label: 'Cuentas por cobrar', icon: 'users' },
    { id: 'assets', label: 'Activos', icon: 'briefcase' },
    { id: 'movements', label: 'Movimientos', icon: 'arrow-left-right' },
    { id: 'reconciliation', label: 'Cuadre', icon: 'file-check' },
    { id: 'audit', label: 'Auditoría', icon: 'shield-check' },
  ];

  readonly formatCurrency = formatCurrency;
  readonly typeLabel = DIFFERENCE_TYPE_LABEL;
  readonly matchLabel = MATCH_LABEL;
  readonly moduleLabel = REVIEW_MODULE_LABEL;
  readonly movementSourceLabel: Record<MovementSource, string> = {
    TRANSACTION: 'Transacción',
    BANK_MOVEMENT: 'Banco',
    CASH_MOVEMENT: 'Efectivo',
    ACCOUNT_RECEIVABLE: 'CxC',
    ASSET: 'Activo',
  };

  readonly lateKindLabel: Record<string, string> = {
    CREATED_AFTER_CLOSE: 'Registrado después del cierre',
    DEACTIVATED_AFTER_CLOSE: 'Desactivado después del cierre',
    LATER_DATE_BEFORE_CLOSE: 'Con fecha posterior, registrado antes del cierre',
  };

  readonly filteredMovements = computed(() => {
    const filter = this.movementFilter();
    const all = this.detail?.diagnosis.movements ?? [];
    return filter === 'ALL' ? all : all.filter((m) => m.source === filter);
  });

  selectTab(tab: ReviewTab): void {
    this.tab.set(tab);
  }

  toggle(key: string): void {
    this.expanded.update((current) => (current === key ? null : key));
  }

  /** Shows "—" for a missing figure and the currency otherwise. */
  money(value: number | null | undefined): string {
    return value === null || value === undefined ? '—' : formatCurrency(value);
  }

  tone(value: number | null | undefined): 'positive' | 'negative' | 'zero' {
    if (value === null || value === undefined || Math.abs(value) < 0.005) {
      return 'zero';
    }
    return value > 0 ? 'positive' : 'negative';
  }

  // ── Correction requests ─────────────────────────────────────────────────

  correctSnapshot(
    target: SnapshotTarget,
    targetId: string | null,
    field: string,
    label: string,
    original: number | null,
  ): void {
    if (!this.canEdit || !targetId || original === null) {
      return;
    }
    this.correct.emit({
      kind: 'SNAPSHOT',
      target,
      targetId,
      field,
      module: SNAPSHOT_MODULE[target],
      label,
      originalValue: original,
      allowNegative:
        target === 'AGENT_RECONCILIATION' || target === 'BANK_BALANCE',
    });
  }

  correctDifference(item: DifferenceItem): void {
    const target = item.target;
    if (
      target?.kind !== 'SNAPSHOT' ||
      !target.target ||
      !target.targetId ||
      !target.field
    ) {
      return;
    }
    this.correctSnapshot(
      target.target,
      target.targetId,
      target.field,
      `${item.account} — ${item.label}`,
      item.registered,
    );
  }

  correctBankBalance(
    bank: BankDiagnosis,
    field: 'previous_balance' | 'final_balance',
  ): void {
    const original =
      field === 'previous_balance'
        ? bank.openingRegistered
        : bank.registeredClosing;
    const label = `${bank.name} — ${field === 'previous_balance' ? 'saldo inicial del día' : 'saldo final registrado'}`;
    this.correctSnapshot(
      'BANK_BALANCE',
      bank.balanceRowId,
      field,
      label,
      original,
    );
  }

  correctMovement(movement: DayMovement): void {
    if (!this.canEdit || !movement.adjustable) {
      return;
    }
    this.correct.emit({
      kind: 'MOVEMENT',
      source: movement.source,
      sourceId: movement.id,
      module: MOVEMENT_MODULE[movement.source],
      label: `${movement.type} — ${movement.label}`,
      originalValue: movement.adjustment?.correctedAmount ?? movement.amount,
      allowNegative: false,
    });
  }

  correctPortfolioRow(
    row: PortfolioRow,
    source: 'ACCOUNT_RECEIVABLE' | 'ASSET',
  ): void {
    if (!this.canEdit || !row.isActive) {
      return;
    }
    this.correct.emit({
      kind: 'MOVEMENT',
      source,
      sourceId: row.id,
      module: MOVEMENT_MODULE[source],
      label: `${row.movementType} — ${row.clientName}${row.description ? ' — ' + row.description : ''}`,
      originalValue: row.adjustment?.correctedAmount ?? row.amount,
      allowNegative: false,
    });
  }
}
