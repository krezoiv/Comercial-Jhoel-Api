import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, SimpleChanges, OnChanges, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { CashBoxMovementRecord, formatCurrency } from '../../../../../core/models';
import { ConfirmDialogService } from '../../../../../core/services/confirm-dialog.service';
import { NotificationService } from '../../../../../core/services/notification.service';
import { RechargeCashBoxService } from '../../../../../core/services/recharge-cash-box.service';
import { extractErrorMessage } from '../../../../../core/utils/extract-error-message';
import { ButtonComponent, IconComponent } from '../../../../../shared/ui';
import { DecimalInputDirective } from '../../../../../shared/directives/decimal-input.directive';

/**
 * "Salida de Ganancia" — self-contained, like `RechargeSaleFormModalComponent`.
 * The over-limit check ("no puede ser mayor al saldo disponible") is never
 * duplicated here as a hard client-side block — only the backend, inside
 * `register_recharge_cash_box_withdrawal`'s own advisory lock, is the real
 * guarantee (see that function's own doc comment); a stale `currentBalance`
 * snapshot here is just what the confirmation dialog previews, and a
 * genuinely stale attempt still gets rejected server-side with the exact
 * same message the ticket requires.
 */
@Component({
  selector: 'app-cash-box-withdrawal-modal',
  standalone: true,
  imports: [ReactiveFormsModule, ButtonComponent, IconComponent, DecimalInputDirective],
  templateUrl: './cash-box-withdrawal-modal.component.html',
  styleUrl: './cash-box-withdrawal-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CashBoxWithdrawalModalComponent implements OnChanges {
  @Input() open = false;
  /** `yyyy-MM-dd` — the page's operation-date picker value; the withdrawal is credited to this date. */
  @Input() businessDate = '';
  /** The Caja's current accumulated balance — shown in the confirmation dialog only, never trusted for the real validation. */
  @Input() currentBalance = 0;

  @Output() closed = new EventEmitter<void>();
  @Output() saved = new EventEmitter<CashBoxMovementRecord>();

  private readonly fb = inject(FormBuilder);
  private readonly cashBoxService = inject(RechargeCashBoxService);
  private readonly notificationService = inject(NotificationService);
  private readonly confirmDialogService = inject(ConfirmDialogService);

  readonly isSubmitting = signal(false);
  readonly errorMessage = signal<string | null>(null);

  readonly form = this.fb.nonNullable.group({
    amount: this.fb.control<number | null>(null, [Validators.required, Validators.min(0.01)]),
    concept: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(255)]],
  });

  formatCurrency = formatCurrency;

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['open'] || !this.open) {
      return;
    }
    this.errorMessage.set(null);
    this.isSubmitting.set(false);
    this.form.reset({ amount: null, concept: '' });
  }

  async submit(): Promise<void> {
    this.errorMessage.set(null);

    if (this.form.invalid || this.isSubmitting()) {
      this.form.markAllAsTouched();
      return;
    }

    const { amount, concept } = this.form.getRawValue();

    const confirmed = await this.confirmDialogService.confirm({
      type: 'FINANCIAL_OPERATION',
      title: 'Salida de ganancia',
      message: `¿Confirmas retirar ${formatCurrency(amount!)} como salida de ganancia? Saldo disponible: ${formatCurrency(this.currentBalance)}.`,
      confirmText: 'Confirmar salida',
    });
    if (!confirmed) {
      return;
    }

    this.isSubmitting.set(true);
    this.cashBoxService
      .registerWithdrawal({ amount: amount!, concept: concept.trim(), businessDate: this.businessDate })
      .subscribe({
        next: (withdrawal) => {
          this.isSubmitting.set(false);
          this.notificationService.success(`Salida de ganancia de ${formatCurrency(withdrawal.amount)} registrada correctamente.`);
          this.saved.emit(withdrawal);
        },
        error: (error: HttpErrorResponse) => {
          this.isSubmitting.set(false);
          this.errorMessage.set(extractErrorMessage(error, 'No se pudo registrar la salida de ganancia.'));
        },
      });
  }

  close(): void {
    if (this.isSubmitting()) {
      return;
    }
    this.closed.emit();
  }
}
