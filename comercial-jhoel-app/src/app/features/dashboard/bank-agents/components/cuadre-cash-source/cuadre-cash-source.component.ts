import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { CASH_CUT_NAME, CashBreakdownOrigin, formatCurrency } from '../../../../../core/models';
import { ButtonComponent, IconComponent } from '../../../../../shared/ui';

/**
 * Cuadre Agentes → Conteo de Efectivo: the "Cargar último arqueo de Caja" /
 * "Limpiar" actions and the origin banner of the breakdown being edited —
 * "Conteo manual", "Último arqueo de Caja" (number, date/time, bank day,
 * user, counted total) or "Modificado manualmente después de cargar
 * arqueo". An arqueo from an earlier bank day is always flagged as such,
 * never shown as today's count. Presentational only: the page owns the
 * state and the confirmation before replacing quantities.
 */
@Component({
  selector: 'app-cuadre-cash-source',
  standalone: true,
  imports: [DatePipe, ButtonComponent, IconComponent],
  templateUrl: './cuadre-cash-source.component.html',
  styleUrl: './cuadre-cash-source.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CuadreCashSourceComponent {
  @Input({ required: true }) origin!: CashBreakdownOrigin;
  @Input() hasQuantities = false;
  @Input() loading = false;
  @Input() disabled = false;

  @Output() loadLatest = new EventEmitter<void>();
  @Output() clear = new EventEmitter<void>();

  formatCurrency = formatCurrency;

  /** "Primer corte · mediodía" / "Segundo corte · final del día" (same labels as Control de Efectivo). */
  cutName(cutNumber: 1 | 2 | null): string {
    return cutNumber ? CASH_CUT_NAME[cutNumber] : '—';
  }

  /** `yyyy-MM-dd` → `dd/MM/yyyy` without a Date round-trip (a plain date must not shift by time zone). */
  formatDay(value: string): string {
    const [year, month, day] = value.split('-');
    return `${day}/${month}/${year}`;
  }
}
