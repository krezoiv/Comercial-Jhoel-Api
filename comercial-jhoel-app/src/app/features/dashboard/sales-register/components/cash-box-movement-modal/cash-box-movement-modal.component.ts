import { HttpErrorResponse } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  inject,
  signal,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { SalesCashBoxMovement, SalesCashBoxMovementType, formatCurrency } from '../../../../../core/models';
import { ConfirmDialogService } from '../../../../../core/services/confirm-dialog.service';
import { NotificationService } from '../../../../../core/services/notification.service';
import { SalesCashBoxService } from '../../../../../core/services/sales-cash-box.service';
import { extractErrorMessage } from '../../../../../core/utils/extract-error-message';
import { ButtonComponent, IconComponent } from '../../../../../shared/ui';
import { DecimalInputDirective } from '../../../../../shared/directives/decimal-input.directive';

/**
 * "Aportar" / "Retirar" efectivo de la caja de UN negocio — un solo modal
 * parametrizado por `mode`, en vez de dos copias casi idénticas
 * (`CashBoxContributionModalComponent`/`CashBoxWithdrawalModalComponent` de
 * Recargas): ambos flujos son literalmente el mismo formulario (monto +
 * concepto) con solo el título/copy/validación de saldo distintos, así que
 * duplicarlo aquí habría sido copiar por copiar, no una divergencia real.
 * El backend (`register_sales_cash_box_movement`) es la única fuente de
 * verdad sobre si un retiro excede el saldo — este modal nunca duplica ese
 * chequeo, solo lo refleja en el mensaje de confirmación.
 */
@Component({
  selector: 'app-cash-box-movement-modal',
  standalone: true,
  imports: [ReactiveFormsModule, ButtonComponent, IconComponent, DecimalInputDirective],
  templateUrl: './cash-box-movement-modal.component.html',
  styleUrl: './cash-box-movement-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CashBoxMovementModalComponent implements OnChanges {
  @Input() open = false;
  @Input() mode: SalesCashBoxMovementType = 'CONTRIBUTION';
  @Input() businessId = '';
  @Input() businessName = '';
  @Input() currentBalance = 0;

  @Output() closed = new EventEmitter<void>();
  @Output() saved = new EventEmitter<SalesCashBoxMovement>();

  private readonly fb = inject(FormBuilder);
  private readonly cashBoxService = inject(SalesCashBoxService);
  private readonly notificationService = inject(NotificationService);
  private readonly confirmDialogService = inject(ConfirmDialogService);

  readonly isSubmitting = signal(false);
  readonly errorMessage = signal<string | null>(null);

  readonly form = this.fb.nonNullable.group({
    amount: this.fb.control<number | null>(null, [Validators.required, Validators.min(0.01)]),
    concept: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(255)]],
  });

  formatCurrency = formatCurrency;

  get isWithdrawal(): boolean {
    return this.mode === 'WITHDRAWAL';
  }

  get title(): string {
    return this.isWithdrawal ? 'Retirar efectivo' : 'Aportar efectivo';
  }

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
      title: this.title,
      message: this.isWithdrawal
        ? `¿Confirmas retirar ${formatCurrency(amount!)} de la caja de ${this.businessName}? Saldo disponible: ${formatCurrency(this.currentBalance)}.`
        : `¿Confirmas aportar ${formatCurrency(amount!)} a la caja de ${this.businessName}? Saldo actual: ${formatCurrency(this.currentBalance)}.`,
      confirmText: this.isWithdrawal ? 'Confirmar retiro' : 'Confirmar aporte',
    });
    if (!confirmed) {
      return;
    }

    const input = { businessId: this.businessId, amount: amount!, concept: concept.trim() };
    const request$ = this.isWithdrawal
      ? this.cashBoxService.registerWithdrawal(input)
      : this.cashBoxService.registerContribution(input);

    this.isSubmitting.set(true);
    request$.subscribe({
      next: (movement) => {
        this.isSubmitting.set(false);
        this.notificationService.success(
          `${this.isWithdrawal ? 'Retiro' : 'Aporte'} de ${formatCurrency(movement.amount)} registrado correctamente.`,
        );
        this.saved.emit(movement);
      },
      error: (error: HttpErrorResponse) => {
        this.isSubmitting.set(false);
        this.errorMessage.set(
          extractErrorMessage(error, `No se pudo registrar el ${this.isWithdrawal ? 'retiro' : 'aporte'}.`),
        );
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
