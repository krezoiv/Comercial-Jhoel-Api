import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';

import {
  CASH_DIRECTION_LABEL,
  CASH_MOVEMENT_TYPE_LABEL,
  CashMovement,
  formatCurrency,
} from '../../../../../core/models';
import { CardComponent, IconComponent } from '../../../../../shared/ui';

const GUATEMALA_TIME_ZONE = 'America/Guatemala';

/** Numeric parts in Guatemala time — `es-GT` ignores `2-digit` for the day ("2/11"), so padding is done by hand. */
const GUATEMALA_PARTS = new Intl.DateTimeFormat('en-US', {
  timeZone: GUATEMALA_TIME_ZONE,
  day: 'numeric',
  month: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  hourCycle: 'h23',
});

function guatemalaPart(date: Date, type: Intl.DateTimeFormatPartTypes): string {
  const value = GUATEMALA_PARTS.formatToParts(date).find((part) => part.type === type)?.value ?? '';
  return value.padStart(2, '0');
}

const FULL_DATE_TIME = new Intl.DateTimeFormat('es-GT', {
  timeZone: GUATEMALA_TIME_ZONE,
  dateStyle: 'long',
  timeStyle: 'short',
});

/**
 * "Últimas transacciones" — Transaccionar's recent-activity card, now fed by
 * the official physical-cash Kardex (`GET /cash-control/movements/recent`)
 * instead of only Transaccionar operations. It therefore also lists gastos
 * por cobrar, activos, retiros bancarios hacia caja, manual movements and
 * voids, newest first. The right-most "Efectivo disponible" column is each
 * row's `newBalance` exactly as the backend recorded it — never computed
 * here. Green = cash in, red = cash out, grey = no physical cash effect.
 * Presentational: the parent fetches and refreshes.
 */
@Component({
  selector: 'app-recent-transactions-card',
  standalone: true,
  imports: [CardComponent, IconComponent, RouterLink],
  templateUrl: './recent-transactions-card.component.html',
  styleUrl: './recent-transactions-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecentTransactionsCardComponent {
  @Input({ required: true }) movements: CashMovement[] = [];
  /** Current official balance (`GET /cash-control/position`), shown in the header. */
  @Input() currentBalance: number | null = null;
  @Input() loading = false;
  @Input() failed = false;

  @Output() retry = new EventEmitter<void>();

  readonly formatCurrency = formatCurrency;
  readonly directionLabel = CASH_DIRECTION_LABEL;

  /** `dd/MM` in Guatemala time. */
  shortDate(iso: string): string {
    const date = new Date(iso);
    return `${guatemalaPart(date, 'day')}/${guatemalaPart(date, 'month')}`;
  }

  /** `HH:mm` (24 h) in Guatemala time. */
  shortTime(iso: string): string {
    const date = new Date(iso);
    return `${guatemalaPart(date, 'hour')}:${guatemalaPart(date, 'minute')}`;
  }

  /** Operation label; a void names what it reverses ("Anulación · Depósito"). */
  typeLabel(movement: CashMovement): string {
    if (movement.movementType === 'ANULACION' && movement.originalMovementType) {
      return `Anulación · ${CASH_MOVEMENT_TYPE_LABEL[movement.originalMovementType]}`;
    }
    return CASH_MOVEMENT_TYPE_LABEL[movement.movementType];
  }

  /** CSS modifier for the cash indicator: in (green), out (red), none (grey). */
  tone(movement: CashMovement): 'in' | 'out' | 'none' {
    return movement.direction === 'IN' ? 'in' : movement.direction === 'OUT' ? 'out' : 'none';
  }

  signedAmount(movement: CashMovement): string {
    const prefix = movement.direction === 'IN' ? '+' : movement.direction === 'OUT' ? '−' : '';
    return `${prefix}${formatCurrency(movement.amount)}`;
  }

  rowTitle(movement: CashMovement): string {
    const parts = [
      `#${movement.sequence}`,
      FULL_DATE_TIME.format(new Date(movement.createdAt)),
      movement.description,
      `Saldo anterior: ${formatCurrency(movement.previousBalance)}`,
      `Registró: ${movement.createdByUsername}`,
    ];
    if (movement.status === 'ANULADO') {
      parts.push(`ANULADO${movement.voidReason ? ` — ${movement.voidReason}` : ''}`);
    }
    return parts.join(' · ');
  }
}
