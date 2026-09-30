import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { BankBalanceView } from '../../../../../core/models';
import {
  CREDIT_LINE_LIMIT_MESSAGE,
  formatSignedBankBalance,
  isCreditLineAccount,
} from '../../../../../core/utils/bank-balance.util';
import { DecimalInputDirective } from '../../../../../shared/directives/decimal-input.directive';
import { BankBalanceAmountComponent, ButtonComponent, IconComponent } from '../../../../../shared/ui';

export interface AdjustBalanceSubmission {
  newBalance: number;
  reason: string;
  observation: string;
}

const MIN_REASON_LENGTH = 3;

function round2(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

/**
 * "Ajustar saldo" — solo se muestra a admin/super_admin (y el backend lo
 * vuelve a exigir). Nunca sobrescribe: el padre llama al endpoint de ajuste,
 * que registra un movimiento AJUSTE_MANUAL con saldo anterior, nuevo saldo,
 * motivo, observación, usuario y fecha. No se cierra al hacer clic fuera:
 * solo X, Cancelar o Confirmar.
 */
@Component({
  selector: 'app-adjust-balance-modal',
  standalone: true,
  imports: [FormsModule, ButtonComponent, IconComponent, DecimalInputDirective, BankBalanceAmountComponent],
  templateUrl: './adjust-balance-modal.component.html',
  styleUrl: './adjust-balance-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdjustBalanceModalComponent implements OnChanges {
  @Input() open = false;
  @Input() row: BankBalanceView | null = null;
  @Input() isSaving = false;

  @Output() confirmed = new EventEmitter<AdjustBalanceSubmission>();
  @Output() cancelled = new EventEmitter<void>();

  readonly newBalance = signal<number | null>(null);
  readonly reason = signal('');
  readonly observation = signal('');

  // Getters, no `computed()`: `row` es un @Input plano (no una señal), así que
  // un computed conservaría la cuenta de la primera apertura del modal.
  /** BI Club Empresarial = línea de crédito: su saldo va de -límite a Q0.00. */
  isCreditLine(): boolean {
    return isCreditLineAccount(this.row?.specialAccount);
  }

  allowsNegative(): boolean {
    return this.row?.specialAccount === 'GENESIS' || this.isCreditLine();
  }

  readonly difference = computed(() => {
    const target = this.newBalance();
    return target === null || !this.row ? null : round2(target - this.row.currentBalance);
  });

  readonly validationMessage = computed(() => {
    const target = this.newBalance();
    if (target === null) return null;
    if (target < 0 && !this.allowsNegative()) {
      return 'Una cuenta bancaria normal no puede quedar con saldo negativo.';
    }
    if (this.isCreditLine()) {
      if (target > 0) return 'El saldo de la línea de crédito de BI Club Empresarial no puede ser positivo (Q0.00 = nada utilizado).';
      if (target < -(this.row?.maxBalance ?? 0)) return CREDIT_LINE_LIMIT_MESSAGE;
    }
    if (this.difference() === 0) {
      return 'El nuevo saldo es igual al saldo actual.';
    }
    return null;
  });

  readonly canConfirm = computed(
    () =>
      this.newBalance() !== null &&
      this.validationMessage() === null &&
      this.reason().trim().length >= MIN_REASON_LENGTH &&
      !this.isSaving,
  );

  formatSigned = formatSignedBankBalance;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['open'] && this.open) {
      this.newBalance.set(null);
      this.reason.set('');
      this.observation.set('');
    }
  }

  onNewBalanceChange(value: number | null): void {
    this.newBalance.set(value === null || Number.isNaN(value) ? null : round2(value));
  }

  onCancel(): void {
    if (this.isSaving) return;
    this.cancelled.emit();
  }

  onConfirm(): void {
    const target = this.newBalance();
    if (!this.canConfirm() || target === null) return;
    this.confirmed.emit({
      newBalance: target,
      reason: this.reason().trim(),
      observation: this.observation().trim(),
    });
  }
}
