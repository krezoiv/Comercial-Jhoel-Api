import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  computed,
  inject,
  signal,
} from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';

import { GuayacanCashMovementDetail, formatCurrency } from '../../../../../core/models';
import { ConfirmDialogService } from '../../../../../core/services/confirm-dialog.service';
import { GuayacanCashBoxService } from '../../../../../core/services/guayacan-cash-box.service';
import { extractErrorMessage } from '../../../../../core/utils/extract-error-message';
import { DecimalInputDirective } from '../../../../../shared/directives/decimal-input.directive';
import { ButtonComponent, IconComponent } from '../../../../../shared/ui';
import { CashBreakdownTableComponent } from '../../../transaccionar/components/cash-breakdown-table/cash-breakdown-table.component';
import {
  cashCountsToDetails,
  cashCountsTotal,
  cashStatus,
  emptyCashCounts,
  guatemalaToday,
  round2,
} from '../../guayacan-cash.util';

export type GuayacanMovementFormMode = 'INGRESO' | 'EGRESO' | 'AJUSTE';

const TITLES: Record<GuayacanMovementFormMode, string> = {
  INGRESO: 'Ingreso a caja',
  EGRESO: 'Egreso de caja',
  AJUSTE: 'Ajuste de caja',
};

/**
 * "+ Ingreso a caja" / "− Egreso de caja" / "Ajuste" (admin). Autocontenido
 * (llama al servicio y emite el movimiento guardado). La vista previa
 * "saldo anterior → saldo nuevo" es solo UX: el backend recalcula bajo lock
 * y rechaza un egreso mayor al efectivo. `requestId` se genera al abrir el
 * modal y se reenvía en cada reintento: un doble clic o un error de red
 * nunca registran dos movimientos. No se cierra al hacer clic fuera.
 */
@Component({
  selector: 'app-guayacan-movement-form-modal',
  standalone: true,
  imports: [FormsModule, DecimalInputDirective, ButtonComponent, IconComponent, CashBreakdownTableComponent],
  templateUrl: './movement-form-modal.component.html',
  styleUrl: './movement-form-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GuayacanMovementFormModalComponent implements OnChanges {
  @Input() open = false;
  @Input() mode: GuayacanMovementFormMode = 'INGRESO';
  /** Saldo del Kardex al abrir (del backend) — solo para la vista previa. */
  @Input() currentBalance = 0;
  /** Ajuste sugerido desde un arqueo (con signo). */
  @Input() suggestedAmount: number | null = null;

  @Output() closed = new EventEmitter<void>();
  @Output() saved = new EventEmitter<GuayacanCashMovementDetail>();

  private readonly service = inject(GuayacanCashBoxService);
  private readonly confirmDialog = inject(ConfirmDialogService);

  formatCurrency = formatCurrency;
  readonly Math = Math;
  readonly today = guatemalaToday();

  readonly amount = signal(0);
  /** Solo AJUSTE: sobrante suma, faltante resta. */
  readonly adjustmentSign = signal<1 | -1>(1);
  readonly businessDate = signal(this.today);
  readonly concept = signal('');
  readonly reason = signal('');
  readonly notes = signal('');
  readonly useBreakdown = signal(false);
  readonly cashCounts = signal<Record<string, number>>(emptyCashCounts());
  readonly isSaving = signal(false);
  readonly errorMessage = signal<string | null>(null);
  private readonly balance = signal(0);
  private readonly modeSignal = signal<GuayacanMovementFormMode>('INGRESO');
  private requestId = crypto.randomUUID();

  readonly title = computed(() => TITLES[this.modeSignal()]);
  readonly isAdjustment = computed(() => this.modeSignal() === 'AJUSTE');
  readonly signedAmount = computed(() => {
    const amount = round2(this.amount());
    switch (this.modeSignal()) {
      case 'EGRESO':
        return -amount;
      case 'AJUSTE':
        return amount * this.adjustmentSign();
      default:
        return amount;
    }
  });
  readonly balanceAfter = computed(() => round2(this.balance() + this.signedAmount()));
  readonly breakdownTotal = computed(() => cashCountsTotal(this.cashCounts()));
  readonly breakdownStatus = computed(() => cashStatus(this.breakdownTotal(), round2(this.amount())));

  /** Primer problema que impide guardar (o `null`) — mismo criterio que el backend. */
  readonly validationError = computed<string | null>(() => {
    if (!(this.amount() > 0)) {
      return 'Ingresa un monto mayor que cero.';
    }
    if (this.concept().trim().length < 3) {
      return 'Indica el concepto (mínimo 3 caracteres).';
    }
    if (this.isAdjustment() && this.reason().trim().length < 5) {
      return 'El motivo del ajuste es obligatorio (mínimo 5 caracteres).';
    }
    if (this.signedAmount() < 0 && this.balanceAfter() < 0) {
      return `El monto supera el efectivo disponible (${formatCurrency(this.balance())}).`;
    }
    if (!this.isAdjustment() && this.useBreakdown() && this.breakdownStatus() !== 'green') {
      return 'El desglose de efectivo no coincide con el monto.';
    }
    if (this.businessDate() > this.today) {
      return 'La fecha no puede ser futura.';
    }
    return null;
  });

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['mode']) {
      this.modeSignal.set(this.mode);
    }
    if (changes['currentBalance']) {
      this.balance.set(this.currentBalance);
    }
    if (changes['open'] && this.open) {
      this.reset();
    }
  }

  private reset(): void {
    this.requestId = crypto.randomUUID();
    const suggested = this.suggestedAmount;
    this.amount.set(suggested ? Math.abs(round2(suggested)) : 0);
    this.adjustmentSign.set(suggested !== null && suggested < 0 ? -1 : 1);
    this.businessDate.set(this.today);
    this.concept.set(this.mode === 'AJUSTE' && suggested !== null ? 'Ajuste por arqueo de caja' : '');
    this.reason.set('');
    this.notes.set('');
    this.useBreakdown.set(false);
    this.cashCounts.set(emptyCashCounts());
    this.errorMessage.set(null);
    this.isSaving.set(false);
  }

  onAmountChange(value: number | null): void {
    this.amount.set(value === null || Number.isNaN(value) ? 0 : Math.max(value, 0));
  }

  onQuantityChange(event: { denomination: number; quantity: number }): void {
    this.cashCounts.update((counts) => ({ ...counts, [String(event.denomination)]: event.quantity }));
  }

  toggleBreakdown(): void {
    this.useBreakdown.update((value) => !value);
    if (!this.useBreakdown()) {
      this.cashCounts.set(emptyCashCounts());
    }
  }

  async submit(): Promise<void> {
    if (this.isSaving() || this.validationError()) {
      return;
    }
    const verb = this.modeSignal() === 'EGRESO' ? 'retirar' : 'registrar';
    const confirmed = await this.confirmDialog.confirm({
      type: 'FINANCIAL_OPERATION',
      title: `Confirmar ${this.title().toLowerCase()}`,
      message:
        `Se va a ${verb} ${formatCurrency(Math.abs(this.signedAmount()))} — ` +
        `saldo anterior ${formatCurrency(this.balance())}, saldo nuevo ${formatCurrency(this.balanceAfter())}.`,
      confirmText: 'Sí, guardar',
    });
    if (!confirmed) {
      return;
    }

    this.isSaving.set(true);
    this.errorMessage.set(null);
    const common = {
      businessDate: this.businessDate(),
      concept: this.concept().trim(),
      notes: this.notes().trim() || undefined,
      clientRequestId: this.requestId,
    };
    const request$: Observable<GuayacanCashMovementDetail> =
      this.modeSignal() === 'AJUSTE'
        ? this.service.registerAdjustment({ ...common, amount: this.signedAmount(), reason: this.reason().trim() })
        : this.service.registerMovement({
            ...common,
            movementType: this.modeSignal() as 'INGRESO' | 'EGRESO',
            amount: round2(this.amount()),
            reason: this.reason().trim() || undefined,
            cashDetails: this.useBreakdown() ? cashCountsToDetails(this.cashCounts(), { keepZero: false }) : [],
          });

    request$.subscribe({
      next: (movement) => {
        this.isSaving.set(false);
        this.saved.emit(movement);
      },
      error: (error: HttpErrorResponse) => {
        this.isSaving.set(false);
        this.errorMessage.set(extractErrorMessage(error, 'No se pudo registrar el movimiento.'));
      },
    });
  }

  async close(): Promise<void> {
    if (this.isSaving()) {
      return;
    }
    const dirty = this.amount() > 0 || this.concept().trim() !== '' || this.breakdownTotal() > 0;
    if (dirty) {
      const discard = await this.confirmDialog.confirm({ type: 'CANCEL' });
      if (!discard) {
        return;
      }
    }
    this.closed.emit();
  }
}
