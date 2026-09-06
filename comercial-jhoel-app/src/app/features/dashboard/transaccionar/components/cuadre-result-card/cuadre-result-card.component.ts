import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { formatCurrency } from '../../../../../core/models';
import { CuadreStatus } from '../../../../../core/services/bank-deposit-draft.store';
import { CardComponent } from '../../../../../shared/ui';
import { StatusIndicatorComponent } from '../status-indicator/status-indicator.component';

/**
 * "Resultado del Cuadre" — Total esperado / Total contado / Diferencia /
 * Estado, all derived from the exact same `totalAmount`/`totalCash`/
 * `cashStatus` signals `CashBreakdownTableComponent` already reads from
 * `BankDepositDraftStore`. This component computes NO financial rule of
 * its own — `status` (red/yellow/green) is passed in already decided by
 * the store, this only formats it alongside the two totals so both are
 * visible together, without scrolling, right next to Desglose de Efectivo.
 */
@Component({
  selector: 'app-cuadre-result-card',
  standalone: true,
  imports: [CardComponent, StatusIndicatorComponent],
  templateUrl: './cuadre-result-card.component.html',
  styleUrl: './cuadre-result-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CuadreResultCardComponent {
  @Input({ required: true }) totalAmount = 0;
  @Input({ required: true }) totalCash = 0;
  @Input({ required: true }) status!: CuadreStatus;

  formatCurrency = formatCurrency;

  get difference(): number {
    return this.totalCash - this.totalAmount;
  }

  get statusText(): string {
    if (this.totalAmount <= 0) {
      return 'Ingresa el monto total a depositar';
    }
    if (this.status === 'green') {
      return 'Cuadra';
    }
    const diff = Math.abs(this.difference);
    return this.status === 'red' ? `Sobra ${formatCurrency(diff)}` : `Falta ${formatCurrency(diff)}`;
  }
}
