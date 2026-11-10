import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  CHARGE_STATUS_LABEL,
  ChargePaymentHistory,
  ChargePaymentStatus,
  SETTLEMENT_METHOD_LABEL,
  SettlementWithDetails,
  formatCurrency,
} from '../../../../../core/models';
import { AccountReceivablePaymentService } from '../../../../../core/services/account-receivable-payment.service';
import { NotificationService } from '../../../../../core/services/notification.service';
import { extractErrorMessage } from '../../../../../core/utils/extract-error-message';
import { BadgeComponent, BadgeTone, ButtonComponent, IconComponent } from '../../../../../shared/ui';
import { accountCode } from '../settlement-modal/settlement-modal.component';

export const CHARGE_STATUS_TONE: Record<ChargePaymentStatus, BadgeTone> = {
  PENDIENTE: 'gold',
  PARCIAL: 'brand',
  CANCELADA: 'success',
};

/**
 * Payment history of one account (each payment it received, voided ones
 * included) and, on demand, the detail of the consolidated operation a
 * payment belongs to — every account it covered. Admins can void an operation
 * from here (mandatory reason): the backend reverses the cash or bank side
 * and the accounts become pending again; nothing is deleted.
 */
@Component({
  selector: 'app-payment-history-modal',
  standalone: true,
  imports: [DatePipe, FormsModule, BadgeComponent, ButtonComponent, IconComponent],
  templateUrl: './payment-history-modal.component.html',
  styleUrl: './payment-history-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentHistoryModalComponent implements OnChanges {
  @Input() open = false;
  @Input() chargeId: string | null = null;
  @Input() clientName = '';
  /** ADMIN/SUPER_ADMIN: shows "Anular" (the backend re-checks the role). */
  @Input() canManage = false;

  @Output() closed = new EventEmitter<void>();
  /** A collection was voided — the list must be re-read. */
  @Output() changed = new EventEmitter<void>();

  private readonly service = inject(AccountReceivablePaymentService);
  private readonly notifications = inject(NotificationService);

  readonly formatCurrency = formatCurrency;
  readonly accountCode = accountCode;
  readonly methodLabel = SETTLEMENT_METHOD_LABEL;
  readonly statusLabel = CHARGE_STATUS_LABEL;
  readonly statusTone = CHARGE_STATUS_TONE;

  readonly history = signal<ChargePaymentHistory | null>(null);
  readonly loading = signal(false);
  readonly errorMessage = signal<string | null>(null);

  readonly operation = signal<SettlementWithDetails | null>(null);
  readonly loadingOperation = signal(false);
  readonly voiding = signal(false);
  readonly showVoidForm = signal(false);
  readonly voidReason = signal('');
  readonly isVoidSaving = signal(false);
  readonly voidError = signal<string | null>(null);

  ngOnChanges(): void {
    if (this.open && this.chargeId) {
      this.operation.set(null);
      this.showVoidForm.set(false);
      this.load();
    }
  }

  load(): void {
    if (!this.chargeId) {
      return;
    }
    this.loading.set(true);
    this.errorMessage.set(null);
    this.service.getChargeHistory(this.chargeId).subscribe({
      next: (history) => {
        this.history.set(history);
        this.loading.set(false);
      },
      error: (error: HttpErrorResponse) => {
        this.loading.set(false);
        this.errorMessage.set(extractErrorMessage(error, 'No se pudo cargar el historial de pagos.'));
      },
    });
  }

  openOperation(id: string): void {
    this.loadingOperation.set(true);
    this.showVoidForm.set(false);
    this.voidError.set(null);
    this.service.getSettlement(id).subscribe({
      next: (operation) => {
        this.operation.set(operation);
        this.loadingOperation.set(false);
      },
      error: (error: HttpErrorResponse) => {
        this.loadingOperation.set(false);
        this.notifications.error(extractErrorMessage(error, 'No se pudo cargar la operación.'));
      },
    });
  }

  backToHistory(): void {
    if (!this.isVoidSaving()) {
      this.operation.set(null);
      this.showVoidForm.set(false);
    }
  }

  startVoid(): void {
    this.voidReason.set('');
    this.voidError.set(null);
    this.showVoidForm.set(true);
  }

  confirmVoid(): void {
    const operation = this.operation();
    const reason = this.voidReason().trim();
    if (!operation || reason.length < 5 || this.isVoidSaving()) {
      return;
    }
    this.isVoidSaving.set(true);
    this.voidError.set(null);
    this.service.voidSettlement(operation.id, reason).subscribe({
      next: (result) => {
        this.isVoidSaving.set(false);
        this.showVoidForm.set(false);
        this.operation.set(result.operation);
        this.notifications.success(
          result.operation.paymentMethod === 'EFECTIVO'
            ? `Cobro anulado. Efectivo disponible: ${formatCurrency(result.cashBalance)}.`
            : `Cobro anulado; se revirtió el depósito en ${result.operation.bankName}.`,
        );
        this.load();
        this.changed.emit();
      },
      error: (error: HttpErrorResponse) => {
        this.isVoidSaving.set(false);
        this.voidError.set(extractErrorMessage(error, 'No se pudo anular el cobro.'));
      },
    });
  }

  close(): void {
    if (!this.isVoidSaving()) {
      this.closed.emit();
    }
  }
}
