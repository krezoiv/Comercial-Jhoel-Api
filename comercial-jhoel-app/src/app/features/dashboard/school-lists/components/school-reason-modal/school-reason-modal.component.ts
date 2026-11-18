import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { SCHOOL_PAYMENT_METHOD_LABEL, SCHOOL_PAYMENT_METHODS, SchoolPaymentMethod, formatCurrency } from '../../../../../core/models';
import { ButtonComponent, IconComponent } from '../../../../../shared/ui';

export interface SchoolReasonResult {
  reason: string;
  refundMethod?: SchoolPaymentMethod;
  reference?: string | null;
}

/**
 * Mandatory reason (≥ 5 characters) for an audited correction: voiding a
 * payment or cancelling a quotation. When money has to go back to the
 * customer (`refundAmount` > 0) it also asks how it is returned. Dumb: the
 * parent performs the request and keeps `busy`/`error`.
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

  readonly formatCurrency = formatCurrency;
  readonly methods = SCHOOL_PAYMENT_METHODS;
  readonly methodLabel = SCHOOL_PAYMENT_METHOD_LABEL;

  readonly reason = signal('');
  readonly refundMethod = signal<SchoolPaymentMethod>('EFECTIVO');
  readonly reference = signal('');
  readonly valid = computed(() => this.reason().trim().length >= 5);

  ngOnChanges(): void {
    if (this.open && !this.busy && !this.error) {
      this.reason.set('');
      this.refundMethod.set('EFECTIVO');
      this.reference.set('');
    }
  }

  submit(): void {
    if (!this.valid() || this.busy) {
      return;
    }
    this.confirmed.emit({
      reason: this.reason().trim(),
      ...(this.refundAmount > 0 ? { refundMethod: this.refundMethod(), reference: this.reference().trim() || null } : {}),
    });
  }
}
