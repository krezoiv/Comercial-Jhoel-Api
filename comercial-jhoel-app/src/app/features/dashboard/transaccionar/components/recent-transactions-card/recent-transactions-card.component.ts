import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { BankDepositOperationSummary, formatCurrency } from '../../../../../core/models';
import { CardComponent, IconComponent } from '../../../../../shared/ui';

const GUATEMALA_TIME_ZONE = 'America/Guatemala';

/** Partes numéricas en hora de Guatemala — `es-GT` ignora `2-digit` en el día ("2/11"), así que el relleno a dos dígitos se hace a mano. */
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
 * "Últimas transacciones" — cuarta tarjeta del resumen de Transaccionar.
 * Presentacional, igual que las otras tres: el padre pide
 * `GET /bank-deposits/recent` (10 filas, ya ordenadas y limitadas por el
 * backend) y la vuelve a pedir después de cada guardado. Una fila = una
 * operación con su `totalAmount`; la cantidad de transacciones distribuidas
 * solo se muestra como dato, nunca multiplica el monto. Las anuladas se
 * muestran marcadas (convención del listado de Reportería). Fechas siempre en
 * `America/Guatemala`, independientemente de la zona del navegador.
 */
@Component({
  selector: 'app-recent-transactions-card',
  standalone: true,
  imports: [CardComponent, IconComponent],
  templateUrl: './recent-transactions-card.component.html',
  styleUrl: './recent-transactions-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecentTransactionsCardComponent {
  @Input({ required: true }) operations: BankDepositOperationSummary[] = [];
  @Input() loading = false;
  @Input() failed = false;

  @Output() retry = new EventEmitter<void>();

  formatCurrency = formatCurrency;

  /** `dd/MM` en hora de Guatemala. */
  shortDate(iso: string): string {
    const date = new Date(iso);
    return `${guatemalaPart(date, 'day')}/${guatemalaPart(date, 'month')}`;
  }

  /** `HH:mm` (24 h) en hora de Guatemala. */
  shortTime(iso: string): string {
    const date = new Date(iso);
    return `${guatemalaPart(date, 'hour')}:${guatemalaPart(date, 'minute')}`;
  }

  fullDateTime(iso: string): string {
    return FULL_DATE_TIME.format(new Date(iso));
  }

  /** La cuenta cuyo saldo movió la operación; si el tipo no mueve saldo, el banco agente. */
  accountName(operation: BankDepositOperationSummary): string {
    return operation.bankAccountName ?? operation.transactionBankName;
  }

  /** Folio corto, mismo criterio que Reportería (primeros 8 del id). */
  reference(operation: BankDepositOperationSummary): string {
    return operation.id.slice(0, 8).toUpperCase();
  }

  rowTitle(operation: BankDepositOperationSummary): string {
    const parts = [
      `Ref. ${this.reference(operation)}`,
      this.fullDateTime(operation.createdAt),
      `${operation.transactionCount} ${operation.transactionCount === 1 ? 'transacción' : 'transacciones'}`,
      `Registró: ${operation.username}`,
    ];
    if (operation.clientName) {
      parts.push(`Cliente: ${operation.clientName}`);
    }
    if (operation.isVoided) {
      parts.push('ANULADA');
    }
    return parts.join(' · ');
  }
}
