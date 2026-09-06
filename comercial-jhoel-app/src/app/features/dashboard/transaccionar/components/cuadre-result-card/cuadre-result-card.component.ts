import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { formatCurrency } from '../../../../../core/models';
import { CuadreStatus } from '../../../../../core/services/bank-deposit-draft.store';
import { ButtonComponent, CardComponent } from '../../../../../shared/ui';
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
  imports: [ButtonComponent, CardComponent, StatusIndicatorComponent],
  templateUrl: './cuadre-result-card.component.html',
  styleUrl: './cuadre-result-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CuadreResultCardComponent {
  @Input({ required: true }) totalAmount = 0;
  @Input({ required: true }) totalCash = 0;
  /** `totalCash` minus a *confirmed* vuelto — identical to `totalCash` whenever there's no vuelto. Drives "Diferencia"/"Estado" here so both always agree with `BankDepositDraftStore.cashStatus`, which is computed off this exact same value. */
  @Input({ required: true }) netCash = 0;
  @Input({ required: true }) status!: CuadreStatus;
  /** True only while there's a real, not-yet-confirmed excess — drives the "Vuelto al cliente" panel below. */
  @Input() hasPendingChange = false;
  @Input() excessAmount = 0;
  @Input() changeGiven = 0;
  @Input() changeConfirmed = false;

  /** Emits the exact amount to confirm — the parent opens `ChangeConfirmModalComponent` with it, never trusting a value re-read later (avoids any drift between what was shown and what gets confirmed). */
  @Output() confirmChangeRequested = new EventEmitter<number>();

  formatCurrency = formatCurrency;

  get hasConfirmedChange(): boolean {
    return this.changeConfirmed && this.changeGiven > 0;
  }

  get difference(): number {
    return this.netCash - this.totalAmount;
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

  requestConfirmChange(): void {
    this.confirmChangeRequested.emit(this.excessAmount);
  }
}
