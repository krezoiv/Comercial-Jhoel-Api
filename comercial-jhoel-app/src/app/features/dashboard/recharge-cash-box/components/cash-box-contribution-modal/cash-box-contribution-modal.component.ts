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
 * "Aporte a Caja" — self-contained, mirrors `CashBoxWithdrawalModalComponent`
 * exactly, minus the "no puede exceder el saldo" constraint: a contribution
 * is never rejected for exceeding anything, it only ever adds to the Caja
 * (see `register_recharge_cash_box_movement`'s own doc comment).
 */
@Component({
  selector: 'app-cash-box-contribution-modal',
  standalone: true,
  imports: [ReactiveFormsModule, ButtonComponent, IconComponent, DecimalInputDirective],
  templateUrl: './cash-box-contribution-modal.component.html',
  styleUrl: './cash-box-contribution-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CashBoxContributionModalComponent implements OnChanges {
  @Input() open = false;
  /** `yyyy-MM-dd` — the page's operation-date picker value; the contribution is credited to this date. */
  @Input() businessDate = '';
  /** The Caja's current accumulated balance — shown in the confirmation dialog only, purely informational (a contribution has no balance constraint). */
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
      title: 'Aporte a caja',
      message: `¿Confirmas aportar ${formatCurrency(amount!)} a la caja? Saldo actual: ${formatCurrency(this.currentBalance)}.`,
      confirmText: 'Confirmar aporte',
    });
    if (!confirmed) {
      return;
    }

    this.isSubmitting.set(true);
    this.cashBoxService
      .registerContribution({ amount: amount!, concept: concept.trim(), businessDate: this.businessDate })
      .subscribe({
        next: (movement) => {
          this.isSubmitting.set(false);
          this.notificationService.success(`Aporte de ${formatCurrency(movement.amount)} registrado correctamente.`);
          this.saved.emit(movement);
        },
        error: (error: HttpErrorResponse) => {
          this.isSubmitting.set(false);
          this.errorMessage.set(extractErrorMessage(error, 'No se pudo registrar el aporte.'));
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
