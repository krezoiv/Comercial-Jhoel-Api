import { ChangeDetectionStrategy, Component, EventEmitter, HostListener, Input, Output, computed, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { RouterLink } from '@angular/router';

import {
  SCHOOL_CASH_MOVEMENT_ICON,
  SCHOOL_CASH_MOVEMENT_LABEL,
  SCHOOL_PAYMENT_METHOD_LABEL,
  SchoolCashMovement,
  SchoolPaymentMethod,
  formatCurrency,
} from '../../../../../core/models';
import { SchoolCashBoxService } from '../../../../../core/services/school-cash-box.service';
import { SchoolListService } from '../../../../../core/services/school-list.service';
import { NotificationService } from '../../../../../core/services/notification.service';
import { extractErrorMessage } from '../../../../../core/utils/extract-error-message';
import { FocusTrapDirective } from '../../../../../shared/directives/focus-trap.directive';
import { ButtonComponent, IconComponent } from '../../../../../shared/ui';
import { formatGuatemalaDateTime, formatIsoDate, signedMoney } from '../../school-cash.util';
import { SchoolCashReasonModalComponent } from '../school-cash-reason-modal/school-cash-reason-modal.component';

/**
 * Detail of one Kardex movement: amounts, balance before/after, origin
 * (list, payment, bank, transfer, exit) and its reversal history. An
 * authorized adjustment can be reverted here; payments are voided from their
 * list, transfers and exits from their own records.
 */
@Component({
  selector: 'app-school-cash-movement-detail',
  standalone: true,
  imports: [RouterLink, FocusTrapDirective, ButtonComponent, IconComponent, SchoolCashReasonModalComponent],
  templateUrl: './school-cash-movement-detail.component.html',
  styleUrl: './school-cash-movement-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SchoolCashMovementDetailComponent {
  @Input({ required: true }) movement!: SchoolCashMovement;
  @Output() closed = new EventEmitter<void>();
  @Output() reverted = new EventEmitter<void>();

  private readonly lists = inject(SchoolListService);
  private readonly service = inject(SchoolCashBoxService);
  private readonly notifications = inject(NotificationService);

  readonly formatCurrency = formatCurrency;
  readonly formatDateTime = formatGuatemalaDateTime;
  readonly formatDay = formatIsoDate;
  readonly label = SCHOOL_CASH_MOVEMENT_LABEL;
  readonly icon = SCHOOL_CASH_MOVEMENT_ICON;
  readonly signed = (value: number) => signedMoney(value, formatCurrency);

  readonly asking = signal(false);
  readonly busy = signal(false);
  readonly error = signal<string | null>(null);

  readonly canRevert = computed(
    () =>
      this.lists.can('school_lists.cash.authorize') &&
      this.movement.movementType === 'AJUSTE' &&
      this.movement.status === 'APLICADO',
  );

  method(value: string | null): string {
    return value ? (SCHOOL_PAYMENT_METHOD_LABEL[value as SchoolPaymentMethod] ?? value) : '—';
  }

  revert(reason: string): void {
    this.busy.set(true);
    this.error.set(null);
    this.service.voidAdjustment(this.movement.id, reason).subscribe({
      next: () => {
        this.busy.set(false);
        this.asking.set(false);
        this.notifications.success(`Ajuste ${this.movement.movementNumber} revertido.`);
        this.reverted.emit();
      },
      error: (err: HttpErrorResponse) => {
        this.busy.set(false);
        this.error.set(extractErrorMessage(err, 'No se pudo revertir el ajuste.'));
      },
    });
  }

  @HostListener('document:keydown.escape', ['$event'])
  onEscape(event: Event): void {
    if (!event.defaultPrevented && !this.asking()) {
      event.preventDefault();
      this.closed.emit();
    }
  }
}
