import { ChangeDetectionStrategy, Component, EventEmitter, HostListener, Input, Output, computed, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { SchoolCashReceipt, SchoolCashTransfer, formatCurrency } from '../../../../../core/models';
import { SchoolCashBoxService } from '../../../../../core/services/school-cash-box.service';
import { NotificationService } from '../../../../../core/services/notification.service';
import { extractErrorMessage } from '../../../../../core/utils/extract-error-message';
import { FocusTrapDirective } from '../../../../../shared/directives/focus-trap.directive';
import { ButtonComponent, IconComponent } from '../../../../../shared/ui';

export interface TransferLine {
  receipt: SchoolCashReceipt;
  amount: number;
}

/**
 * "Transferir a Caja de Listas": confirms the selected bank payments and the
 * amount of each one. One `clientRequestId` per opening, so a double click or
 * a retry never transfers twice; the backend re-checks the pending amount of
 * every payment and the bank balance under their locks.
 */
@Component({
  selector: 'app-school-cash-transfer-modal',
  standalone: true,
  imports: [FormsModule, FocusTrapDirective, ButtonComponent, IconComponent],
  templateUrl: './school-cash-transfer-modal.component.html',
  styleUrl: './school-cash-transfer-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SchoolCashTransferModalComponent {
  @Input({ required: true }) bankId!: string;
  @Input({ required: true }) bankName!: string;
  @Input({ required: true }) lines: TransferLine[] = [];
  @Output() saved = new EventEmitter<SchoolCashTransfer>();
  @Output() closed = new EventEmitter<void>();

  private readonly service = inject(SchoolCashBoxService);
  private readonly notifications = inject(NotificationService);
  private readonly requestId = crypto.randomUUID();

  readonly formatCurrency = formatCurrency;
  readonly reference = signal('');
  readonly observations = signal('');
  readonly busy = signal(false);
  readonly error = signal<string | null>(null);

  readonly total = computed(() => Math.round(this.lines.reduce((sum, line) => sum + line.amount * 100, 0)) / 100);

  save(): void {
    if (this.busy()) {
      return;
    }
    this.busy.set(true);
    this.error.set(null);
    this.service
      .registerTransfer({
        bankId: this.bankId,
        items: this.lines.map((line) => ({ movementId: line.receipt.id, amount: line.amount })),
        reference: this.reference().trim() || undefined,
        observations: this.observations().trim() || undefined,
        clientRequestId: this.requestId,
      })
      .subscribe({
        next: (transfer) => {
          this.busy.set(false);
          this.notifications.success(`Traslado ${transfer.transferNumber} registrado: ${formatCurrency(transfer.amount)} a la Caja de Listas.`);
          this.saved.emit(transfer);
        },
        error: (err: HttpErrorResponse) => {
          this.busy.set(false);
          this.error.set(extractErrorMessage(err, 'No se pudo registrar el traslado.'));
        },
      });
  }

  @HostListener('document:keydown.escape', ['$event'])
  onEscape(event: Event): void {
    if (!event.defaultPrevented && !this.busy()) {
      event.preventDefault();
      this.closed.emit();
    }
  }
}
