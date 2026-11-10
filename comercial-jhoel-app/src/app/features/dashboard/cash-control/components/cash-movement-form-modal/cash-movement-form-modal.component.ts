import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, computed, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { CASH_MOVEMENT_TYPE_LABEL, CashMovementResult, ManualCashMovementType, formatCurrency } from '../../../../../core/models';
import { CashControlService } from '../../../../../core/services/cash-control.service';
import { ConfirmDialogService } from '../../../../../core/services/confirm-dialog.service';
import { NotificationService } from '../../../../../core/services/notification.service';
import { extractErrorMessage } from '../../../../../core/utils/extract-error-message';
import { DecimalInputDirective } from '../../../../../shared/directives/decimal-input.directive';
import { ButtonComponent, IconComponent } from '../../../../../shared/ui';
import { round2 } from '../../cash-control.util';

/**
 * Manual cash movement registered in Control de Efectivo: Entrada/Salida
 * (cut managers) or Ajuste/Saldo inicial (admin). Reason is mandatory. The
 * "saldo después" line is a preview only — the backend computes the real
 * balance under its lock and returns it. One `clientRequestId` per opening
 * makes a double click/retry return the same movement (idempotency).
 */
@Component({
  selector: 'app-cash-movement-form-modal',
  standalone: true,
  imports: [FormsModule, ButtonComponent, IconComponent, DecimalInputDirective],
  templateUrl: './cash-movement-form-modal.component.html',
  styleUrl: './cash-movement-form-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CashMovementFormModalComponent implements OnChanges {
  @Input() open = false;
  @Input() mode: ManualCashMovementType = 'ENTRADA_MANUAL';
  /** Official current balance (backend), for the preview only. */
  @Input() currentBalance = 0;

  @Output() closed = new EventEmitter<void>();
  @Output() saved = new EventEmitter<CashMovementResult>();

  private readonly service = inject(CashControlService);
  private readonly confirmDialog = inject(ConfirmDialogService);
  private readonly notifications = inject(NotificationService);

  readonly typeLabel = CASH_MOVEMENT_TYPE_LABEL;
  readonly formatCurrency = formatCurrency;

  readonly amount = signal<number | null>(null);
  /** AJUSTE only: `IN` adds, `OUT` subtracts. */
  readonly adjustmentDirection = signal<'IN' | 'OUT'>('IN');
  readonly description = signal('');
  readonly reason = signal('');
  readonly isSaving = signal(false);
  readonly errorMessage = signal<string | null>(null);
  private readonly modeSignal = signal<ManualCashMovementType>('ENTRADA_MANUAL');
  private readonly balanceSignal = signal(0);
  private requestId = crypto.randomUUID();

  readonly isOutflow = computed(
    () => this.modeSignal() === 'SALIDA_MANUAL' || (this.modeSignal() === 'AJUSTE' && this.adjustmentDirection() === 'OUT'),
  );
  readonly previewBalance = computed(() => {
    const amount = this.amount() ?? 0;
    return round2(this.balanceSignal() + (this.isOutflow() ? -amount : amount));
  });
  readonly canSave = computed(() => (this.amount() ?? 0) > 0 && this.reason().trim().length >= 5 && !this.isSaving());

  ngOnChanges(): void {
    this.modeSignal.set(this.mode);
    this.balanceSignal.set(this.currentBalance);
    if (this.open && !this.isSaving()) {
      this.amount.set(null);
      this.adjustmentDirection.set('IN');
      this.description.set('');
      this.reason.set('');
      this.errorMessage.set(null);
      this.requestId = crypto.randomUUID();
    }
  }

  async save(): Promise<void> {
    if (!this.canSave()) {
      return;
    }
    const amount = this.amount() ?? 0;
    const confirmed = await this.confirmDialog.confirm({
      type: 'FINANCIAL_OPERATION',
      title: `Registrar ${this.typeLabel[this.mode].toLowerCase()}`,
      message: `${this.isOutflow() ? 'Salida' : 'Entrada'} de ${formatCurrency(amount)}. El efectivo disponible quedará en aproximadamente ${formatCurrency(this.previewBalance())} (lo calcula el sistema).`,
    });
    if (!confirmed) {
      return;
    }
    this.isSaving.set(true);
    this.errorMessage.set(null);
    this.service
      .registerMovement({
        movementType: this.mode,
        amount: this.mode === 'AJUSTE' && this.adjustmentDirection() === 'OUT' ? -amount : amount,
        description: this.description().trim() || undefined,
        reason: this.reason().trim(),
        clientRequestId: this.requestId,
      })
      .subscribe({
        next: (result) => {
          this.isSaving.set(false);
          this.notifications.success(`Movimiento registrado. Efectivo disponible: ${formatCurrency(result.balance)}.`);
          this.saved.emit(result);
        },
        error: (error: HttpErrorResponse) => {
          this.isSaving.set(false);
          this.errorMessage.set(extractErrorMessage(error, 'No se pudo registrar el movimiento.'));
        },
      });
  }
}
