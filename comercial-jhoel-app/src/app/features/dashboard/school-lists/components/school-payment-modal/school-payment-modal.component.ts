import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import {
  Bank,
  SCHOOL_BANK_METHODS,
  SCHOOL_PAYMENT_METHOD_LABEL,
  SCHOOL_PAYMENT_METHODS,
  SchoolPaymentMethod,
  SchoolQuotation,
  SchoolQuotationSummary,
  formatCurrency,
  isSchoolCashBank,
  roundMoney,
  schoolPaymentDestination,
} from '../../../../../core/models';
import { BankService } from '../../../../../core/services/bank.service';
import { ConfirmDialogService } from '../../../../../core/services/confirm-dialog.service';
import { NotificationService } from '../../../../../core/services/notification.service';
import { SchoolListService } from '../../../../../core/services/school-list.service';
import { extractErrorMessage } from '../../../../../core/utils/extract-error-message';
import { ButtonComponent, IconComponent } from '../../../../../shared/ui';

/**
 * "Registrar abono": amount, method, optional bank/reference and notes, with a
 * live "saldo actual → saldo después" preview. One `clientRequestId` per
 * opening, so a double click or a retry never registers the payment twice
 * (the backend returns the same payment). The backend validates the amount
 * against the real balance under a lock.
 */
@Component({
  selector: 'app-school-payment-modal',
  standalone: true,
  imports: [FormsModule, ButtonComponent, IconComponent],
  templateUrl: './school-payment-modal.component.html',
  styleUrl: './school-payment-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SchoolPaymentModalComponent implements OnChanges {
  /** Quotation receiving the payment; null keeps the modal closed (signal-backed). */
  @Input() set quotation(value: SchoolQuotationSummary | null) {
    this.current.set(value);
  }
  get quotation(): SchoolQuotationSummary | null {
    return this.current();
  }
  private readonly current = signal<SchoolQuotationSummary | null>(null);
  @Output() closed = new EventEmitter<void>();
  @Output() paid = new EventEmitter<{ paymentId: string; quotation: SchoolQuotation }>();

  private readonly service = inject(SchoolListService);
  private readonly banks = inject(BankService);
  private readonly confirm = inject(ConfirmDialogService);
  private readonly notifications = inject(NotificationService);

  readonly formatCurrency = formatCurrency;
  readonly methods = SCHOOL_PAYMENT_METHODS;
  readonly methodLabel = SCHOOL_PAYMENT_METHOD_LABEL;

  readonly amount = signal<number | null>(null);
  readonly method = signal<SchoolPaymentMethod>('EFECTIVO');
  readonly bankId = signal('');
  readonly reference = signal('');
  readonly observations = signal('');
  readonly saving = signal(false);
  readonly error = signal<string | null>(null);
  readonly bankList = signal<Bank[]>([]);
  private requestId = crypto.randomUUID();

  readonly balance = computed(() => this.quotation?.balance ?? 0);
  readonly usesBank = computed(() => SCHOOL_BANK_METHODS.includes(this.method()));
  /** Where the money goes (Caja de Listas, bank pending transfer, or outside). */
  readonly destination = computed(() =>
    schoolPaymentDestination(this.method(), this.bankList().find((b) => b.id === this.bankId())?.name),
  );
  /** Transfers and deposits must name the receiving account (Caja de Listas). */
  readonly bankMissing = computed(() => this.usesBank() && !this.bankId());
  readonly after = computed(() => roundMoney(this.balance() - (this.amount() ?? 0)));
  readonly amountError = computed(() => {
    const amount = this.amount();
    if (amount === null) {
      return null;
    }
    if (!(amount > 0) || roundMoney(amount) !== amount) {
      return 'El monto debe ser mayor que cero, con dos decimales como máximo.';
    }
    if (amount > this.balance()) {
      return `El abono no puede superar el saldo pendiente (${formatCurrency(this.balance())}).`;
    }
    return null;
  });
  readonly canSave = computed(
    () => !this.saving() && this.amount() !== null && !this.amountError() && !this.bankMissing(),
  );

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['quotation'] && this.quotation) {
      this.amount.set(null);
      this.method.set('EFECTIVO');
      this.bankId.set('');
      this.reference.set('');
      this.observations.set('');
      this.error.set(null);
      this.requestId = crypto.randomUUID();
      if (!this.bankList().length) {
        this.banks.getBanks().subscribe({
          next: (list) => this.bankList.set(list.filter(isSchoolCashBank)),
          error: () => this.bankList.set([]),
        });
      }
    }
  }

  payAll(): void {
    this.amount.set(this.balance());
  }

  async save(): Promise<void> {
    const quotation = this.quotation;
    const amount = this.amount();
    if (!quotation || amount === null || !this.canSave()) {
      return;
    }
    const ok = await this.confirm.confirm({
      type: 'FINANCIAL_OPERATION',
      title: 'Registrar abono',
      message: `Se registrará un pago de ${formatCurrency(amount)} (${this.methodLabel[this.method()]}) en ${quotation.quotationNumber}. Saldo después: ${formatCurrency(this.after())}.`,
      confirmText: 'Registrar pago',
    });
    if (!ok) {
      return;
    }
    this.saving.set(true);
    this.error.set(null);
    this.service
      .registerPayment(
        quotation.id,
        {
          amount,
          paymentMethod: this.method(),
          bankId: this.usesBank() ? this.bankId() : null,
          reference: this.reference().trim() || null,
          observations: this.observations().trim() || null,
        },
        this.requestId,
      )
      .subscribe({
        next: (result) => {
          this.saving.set(false);
          this.notifications.success('Pago registrado correctamente.');
          this.paid.emit(result);
        },
        error: (error: HttpErrorResponse) => {
          this.saving.set(false);
          this.error.set(extractErrorMessage(error, 'No se pudo registrar el pago.'));
        },
      });
  }
}
