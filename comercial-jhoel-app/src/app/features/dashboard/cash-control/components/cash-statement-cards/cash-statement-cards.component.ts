import { ChangeDetectionStrategy, Component, Input, computed, signal } from '@angular/core';

import {
  CASH_STATEMENT_STATUS_LABEL,
  CASH_STATEMENT_STATUS_TONE,
  CashStatement,
  formatCurrency,
} from '../../../../../core/models';
import { IconComponent } from '../../../../../shared/ui';
import { formatDifference, formatGuatemalaDateTime } from '../../cash-control.util';
import { statementTypeLabel } from '../../cash-statement.util';

interface StatementCard {
  key: string;
  label: string;
  value: string;
  hint: string;
  icon: string;
  tone: 'neutral' | 'in' | 'out' | 'main' | 'ok' | 'short' | 'over' | 'none';
}

/**
 * Summary cards of the Estado de Cuenta de Efectivo: opening, entries, exits,
 * theoretical balance, physical cash (last count), difference, movements and
 * last movement — plus the backend warnings and, for custody viewers, Caja /
 * Bodega / total under custody kept apart. Presentational: every figure comes
 * from the backend statement.
 */
@Component({
  selector: 'app-cash-statement-cards',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './cash-statement-cards.component.html',
  styleUrl: './cash-statement-cards.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CashStatementCardsComponent {
  private readonly data = signal<CashStatement | null>(null);
  @Input({ required: true }) set statement(value: CashStatement | null) {
    this.data.set(value);
  }

  readonly formatCurrency = formatCurrency;
  readonly s = this.data.asReadonly();
  readonly place = computed(() => (this.data()?.location === 'BODEGA' ? 'Bodega' : 'Caja'));

  readonly cards = computed<StatementCard[]>(() => {
    const st = this.data();
    if (!st) {
      return [];
    }
    const sum = st.summary;
    const cards: StatementCard[] = [
      {
        key: 'opening',
        label: 'Saldo inicial',
        value: formatCurrency(sum.openingBalance),
        hint: st.period.kind === 'BANK_DAY' ? 'Cierre del día anterior (Kardex)' : 'Saldo al inicio del período',
        icon: 'calendar',
        tone: 'neutral',
      },
      {
        key: 'in',
        label: 'Total de entradas',
        value: formatCurrency(sum.totalIn),
        hint: `Ingresó físicamente a ${this.place()}`,
        icon: 'arrow-down-circle',
        tone: 'in',
      },
      {
        key: 'out',
        label: 'Total de salidas',
        value: formatCurrency(sum.totalOut),
        hint: `Salió físicamente de ${this.place()}`,
        icon: 'arrow-up-circle',
        tone: 'out',
      },
      {
        key: 'theoretical',
        label: st.period.isCurrent ? 'Saldo teórico actual' : 'Saldo teórico final',
        value: formatCurrency(sum.theoreticalBalance),
        hint: 'Saldo inicial + entradas − salidas',
        icon: 'wallet',
        tone: 'main',
      },
    ];
    const physical = sum.physical;
    if (physical) {
      const count = physical.count;
      const tone = CASH_STATEMENT_STATUS_TONE[physical.status];
      cards.push(
        {
          key: 'physical',
          label: 'Efectivo físico',
          value: count ? formatCurrency(count.counted) : '—',
          hint: count ? `${count.number} · ${formatGuatemalaDateTime(count.countedAt)}` : 'Sin arqueo en el período',
          icon: 'check-check',
          tone: count ? 'neutral' : 'none',
        },
        {
          key: 'difference',
          label: 'Diferencia',
          value: count ? formatDifference(count.difference) : '—',
          hint:
            physical.status === 'SIN_ARQUEO'
              ? 'Haga un arqueo para comparar'
              : `${CASH_STATEMENT_STATUS_LABEL[physical.status]} · físico − teórico ${count ? formatCurrency(count.theoretical) : ''}`,
          icon: physical.status === 'CUADRADO' ? 'check-circle' : physical.status === 'SIN_ARQUEO' ? 'clock' : 'alert-triangle',
          tone,
        },
      );
    }
    cards.push(
      {
        key: 'count',
        label: 'Movimientos',
        value: String(sum.movementCount),
        hint: 'Entradas y salidas físicas del período',
        icon: 'layers',
        tone: 'neutral',
      },
      {
        key: 'last',
        label: 'Último movimiento',
        value: sum.lastMovement ? formatGuatemalaDateTime(sum.lastMovement.createdAt) : '—',
        hint: sum.lastMovement
          ? `${statementTypeLabel({ movementType: sum.lastMovement.movementType, originalMovementType: null }, st.location)} · ${formatCurrency(sum.lastMovement.amount)}`
          : 'Sin movimientos en el período',
        icon: 'clock',
        tone: 'neutral',
      },
    );
    return cards;
  });
}
