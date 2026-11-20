import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import {
  Bank,
  SCHOOL_BANK_METHODS,
  SCHOOL_PAYMENT_METHOD_LABEL,
  SCHOOL_PAYMENT_METHODS,
  SchoolPaymentMethod,
  formatCurrency,
  isSchoolCashBank,
} from '../../../../../core/models';
import { BankService } from '../../../../../core/services/bank.service';
import { ButtonComponent, IconComponent } from '../../../../../shared/ui';

export interface SchoolReasonResult {
  reason: string;
  refundMethod?: SchoolPaymentMethod;
  /** Account the refund leaves from (transfer/deposit refunds, Caja de Listas). */
  bankId?: string | null;
  reference?: string | null;
}

/**
 * Mandatory reason (≥ 5 characters) for an audited correction: voiding a
 * payment or cancelling a quotation. When money has to go back to the
 * customer (`refundAmount` > 0) it also asks how it is returned. Dumb: the
 * parent performs the request and keeps `busy`/`error`.
 *
 * Caja de Listas Escolares: a cash refund leaves the Caja de Listas; a refund
 * by transfer/deposit needs the account it leaves from.
 */
@Component({
  selector: 'app-school-reason-modal',
  standalone: true,
  imports: [FormsModule, ButtonComponent, IconComponent],
  templateUrl: './school-reason-modal.component.html',
  styleUrl: './school-reason-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SchoolReasonModalComponent implements OnChanges {
  @Input() open = false;
  @Input() title = '';
  @Input() message = '';
  @Input() confirmText = 'Confirmar';
  @Input() refundAmount = 0;
  @Input() busy = false;
  @Input() error: string | null = null;
  @Output() closed = new EventEmitter<void>();
  @Output() confirmed = new EventEmitter<SchoolReasonResult>();

  private readonly bankService = inject(BankService);

  readonly formatCurrency = formatCurrency;
  readonly methods = SCHOOL_PAYMENT_METHODS;
  readonly methodLabel = SCHOOL_PAYMENT_METHOD_LABEL;

  readonly reason = signal('');
  readonly refundMethod = signal<SchoolPaymentMethod>('EFECTIVO');
  readonly reference = signal('');
  readonly bankId = signal('');
  readonly banks = signal<Bank[]>([]);
  readonly refundByBank = computed(() => SCHOOL_BANK_METHODS.includes(this.refundMethod()));
  readonly refundNote = computed(() => {
    if (this.refundMethod() === 'EFECTIVO') {
      return 'El efectivo sale de la Caja de Listas (debe tenerlo).';
    }
    if (this.refundByBank()) {
      const bank = this.banks().find((b) => b.id === this.bankId())?.name;
      return bank ? `Sale de ${bank}; primero se usa lo pendiente de esta lista en esa cuenta.` : 'Seleccione la cuenta de la que sale la devolución.';
    }
    return 'Fuera de la Caja de Listas (otros medios).';
  });
  readonly valid = computed(
    () => this.reason().trim().length >= 5 && !(this.refundAmount > 0 && this.refundByBank() && !this.bankId()),
  );

  ngOnChanges(): void {
    if (this.open && !this.busy && !this.error) {
      this.reason.set('');
      this.refundMethod.set('EFECTIVO');
      this.reference.set('');
      this.bankId.set('');
      if (this.refundAmount > 0 && !this.banks().length) {
        this.bankService.getBanks().subscribe({
          next: (list) => this.banks.set(list.filter(isSchoolCashBank)),
          error: () => this.banks.set([]),
        });
      }
    }
  }

  submit(): void {
    if (!this.valid() || this.busy) {
      return;
    }
    this.confirmed.emit({
      reason: this.reason().trim(),
      ...(this.refundAmount > 0
        ? {
            refundMethod: this.refundMethod(),
            bankId: this.refundByBank() ? this.bankId() : null,
            reference: this.reference().trim() || null,
          }
        : {}),
    });
  }
}
