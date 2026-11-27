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
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import {
  AccountReceivable,
  Client,
  PortfolioPaymentMethod,
  PortfolioRecordTrace,
  cashEffectPhrase,
} from '../../../../../core/models';
import { AccountReceivableService } from '../../../../../core/services/account-receivable.service';
import { ConfirmDialogService } from '../../../../../core/services/confirm-dialog.service';
import { extractErrorMessage } from '../../../../../core/utils/extract-error-message';
import { ButtonComponent, IconComponent } from '../../../../../shared/ui';
import { ClientSearchSelectComponent } from '../client-search-select/client-search-select.component';
import { DecimalInputDirective } from '../../../../../shared/directives/decimal-input.directive';

function todayIsoDate(): string {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${now.getFullYear()}-${month}-${day}`;
}

@Component({
  selector: 'app-account-receivable-form-modal',
  standalone: true,
  imports: [ReactiveFormsModule, ButtonComponent, IconComponent, ClientSearchSelectComponent, DecimalInputDirective],
  templateUrl: './account-receivable-form-modal.component.html',
  styleUrl: './account-receivable-form-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountReceivableFormModalComponent implements OnChanges {
  @Input() open = false;
  /** null = create mode, an AccountReceivable = edit mode (form is pre-filled from it). */
  @Input() record: AccountReceivable | null = null;

  @Output() closed = new EventEmitter<void>();
  @Output() saved = new EventEmitter<AccountReceivable>();

  private readonly fb = inject(FormBuilder);
  private readonly accountReceivableService = inject(AccountReceivableService);
  private readonly confirmDialogService = inject(ConfirmDialogService);

  readonly isSubmitting = signal(false);
  readonly errorMessage = signal<string | null>(null);
  selectedClientName: string | null = null;

  readonly form = this.fb.nonNullable.group({
    clientId: ['', Validators.required],
    date: [todayIsoDate(), Validators.required],
    amount: [0, [Validators.required, Validators.min(0.01)]],
    description: ['', Validators.maxLength(500)],
    /** EFECTIVO moves Caja; BANCO never does. */
    paymentMethod: ['EFECTIVO' as PortfolioPaymentMethod],
    /** Mandatory (≥5) in edit mode when amount or payment method change. */
    reason: ['', Validators.maxLength(255)],
  });

  /** Backend trace of the record being edited (payment method, Kardex, lock). */
  readonly trace = signal<PortfolioRecordTrace | null>(null);

  get isEditMode(): boolean {
    return this.record !== null;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['open'] || !this.open) {
      return;
    }

    this.errorMessage.set(null);
    this.isSubmitting.set(false);
    this.selectedClientName = this.record?.clientName ?? null;

    this.form.reset({
      clientId: this.record?.clientId ?? '',
      date: this.record?.date ?? todayIsoDate(),
      amount: this.record?.amount ?? 0,
      description: this.record?.description ?? '',
      paymentMethod: this.record?.paymentMethod ?? 'EFECTIVO',
      reason: '',
    });
    this.form.enable();
    this.trace.set(null);
    if (this.record) {
      this.accountReceivableService.getTrace(this.record.id).subscribe({
        next: (trace) => this.applyTrace(trace),
        error: () => this.trace.set(null),
      });
    }
  }

  /** Shows the effective method and locks what only its origin operation can change. */
  private applyTrace(trace: PortfolioRecordTrace): void {
    this.trace.set(trace);
    this.form.controls.paymentMethod.setValue(trace.paymentMethod, { emitEvent: false });
    if (trace.lock) {
      this.form.controls.amount.disable({ emitEvent: false });
      this.form.controls.paymentMethod.disable({ emitEvent: false });
      this.form.controls.clientId.disable({ emitEvent: false });
    }
  }

  /** Edit mode: does the change alter the cash effect (amount or payment method)? Then a reason is mandatory. */
  needsReason(): boolean {
    if (!this.record) {
      return false;
    }
    const { amount, paymentMethod } = this.form.getRawValue();
    const currentMethod = this.trace()?.paymentMethod ?? this.record.paymentMethod ?? 'EFECTIVO';
    return Math.round(amount * 100) !== Math.round(this.record.amount * 100) || paymentMethod !== currentMethod;
  }

  reasonMissing(): boolean {
    return this.needsReason() && this.form.controls.reason.value.trim().length < 5;
  }

  /** What the save will do to Caja, in words (facts from the backend trace; never a recomputation). */
  cashNote(): string | null {
    const method = this.form.controls.paymentMethod.value;
    if (!this.record) {
      return method === 'BANCO' ? 'Banco / transferencia: no mueve Caja.' : 'Efectivo: el monto sale de Caja (gasto por cobrar).';
    }
    const trace = this.trace();
    if (!trace) {
      return null;
    }
    if (trace.lock === 'BANK_DEPOSIT') {
      return 'Nació de una operación de Transaccionar: monto, cliente y medio solo cambian anulando esa operación. Puede corregir la fecha y la descripción.';
    }
    if (trace.lock === 'AR_PAYMENT') {
      return 'Es el abono de un cobro de Cartera: para corregir su monto anule el cobro.';
    }
    if (!trace.cashTracked) {
      return 'Registro anterior al Control de Efectivo: sus cambios no mueven Caja (su efectivo ya estaba en el saldo inicial).';
    }
    if (this.needsReason()) {
      return `Caja registrará la reversa del movimiento vigente (${cashEffectPhrase(trace.kardexNet)}) y el nuevo efecto según el monto y el medio. Queda en el historial con el motivo.`;
    }
    return `En Caja hoy: ${cashEffectPhrase(trace.kardexNet)}. Cambiar fecha, cliente o descripción no mueve Caja.`;
  }

  onClientSelected(client: Client | null): void {
    this.selectedClientName = client?.name ?? null;
    this.form.controls.clientId.setValue(client?.id ?? '');
    // `setValue()` alone doesn't mark a control dirty (it's not routed through the
    // ControlValueAccessor's own onChange) — mark it explicitly so the Cancel/X
    // "descartar cambios" check still catches a client-only change.
    this.form.controls.clientId.markAsDirty();
    this.form.controls.clientId.markAsTouched();
  }

  async submit(): Promise<void> {
    this.errorMessage.set(null);

    if (this.form.invalid || this.isSubmitting() || this.reasonMissing()) {
      this.form.markAllAsTouched();
      return;
    }

    const confirmed = await this.confirmDialogService.confirm({
      type: this.isEditMode ? 'UPDATE' : 'SAVE',
    });
    if (!confirmed) {
      return;
    }

    const { clientId, date, amount, description, paymentMethod, reason } = this.form.getRawValue();
    this.isSubmitting.set(true);

    const input = {
      clientId,
      date,
      amount,
      description: description.trim().replace(/\s+/g, ' ') || undefined,
      paymentMethod,
      reason: reason.trim().replace(/\s+/g, ' ') || undefined,
    };

    const request$ = this.isEditMode
      ? this.accountReceivableService.updateAccountReceivable(this.record!.id, input)
      : this.accountReceivableService.createAccountReceivable(input);

    request$.subscribe({
      next: (record) => {
        this.isSubmitting.set(false);
        this.saved.emit(record);
      },
      error: (error: HttpErrorResponse) => {
        this.isSubmitting.set(false);
        this.errorMessage.set(
          extractErrorMessage(error, 'No se pudo guardar la cuenta por cobrar. Inténtalo de nuevo.'),
        );
      },
    });
  }

  async close(): Promise<void> {
    if (this.isSubmitting()) {
      return;
    }
    if (this.form.dirty) {
      const discard = await this.confirmDialogService.confirm({ type: 'CANCEL' });
      if (!discard) {
        return;
      }
    }
    this.closed.emit();
  }
}
