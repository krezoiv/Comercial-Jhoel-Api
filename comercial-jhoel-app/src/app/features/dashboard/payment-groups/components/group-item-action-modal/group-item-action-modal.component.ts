import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  computed,
  inject,
  signal,
} from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';

import {
  CashReservationSnapshot,
  PAYMENT_GROUP_ITEM_STATUS_LABEL,
  PaymentGroup,
  PaymentGroupDetail,
  PaymentGroupItem,
  PaymentGroupItemStatus,
  formatCurrency,
  groupFlowWords,
} from '../../../../../core/models';
import { NotificationService } from '../../../../../core/services/notification.service';
import { PaymentGroupService } from '../../../../../core/services/payment-group.service';
import { extractErrorMessage } from '../../../../../core/utils/extract-error-message';
import { DecimalInputDirective } from '../../../../../shared/directives/decimal-input.directive';
import { ButtonComponent, IconComponent } from '../../../../../shared/ui';

export type GroupItemAction = 'DELIVER' | 'PARTIAL' | 'NO_PAYMENT' | 'NOTE' | 'RESOLVE' | 'VOID' | 'EDIT';

const cents = (value: number): number => Math.round((Number(value) || 0) * 100);

const DONE: Record<GroupItemAction, string> = {
  DELIVER: 'pago confirmado',
  PARTIAL: 'pago parcial registrado',
  NO_PAYMENT: 'registrada sin pago',
  NOTE: 'observación agregada',
  RESOLVE: 'resolución documentada',
  VOID: 'anulada',
  EDIT: 'actualizada',
};

const TITLES: Record<GroupItemAction, string> = {
  DELIVER: 'Confirmar pago',
  PARTIAL: 'Registrar pago parcial',
  NO_PAYMENT: 'Registrar sin pago',
  NOTE: 'Agregar observación',
  RESOLVE: 'Documentar resolución',
  VOID: 'Anular transacción',
  EDIT: 'Editar transacción',
};

/**
 * One action on one transaction of a group, without leaving the group. For a
 * payment it shows the Caja facts before confirming: physical cash before,
 * the real cash movement and the projected balance (a preview — only the
 * backend's confirmation is final). The modal never closes by clicking outside.
 */
@Component({
  selector: 'app-group-item-action-modal',
  standalone: true,
  imports: [FormsModule, ButtonComponent, IconComponent, DecimalInputDirective],
  templateUrl: './group-item-action-modal.component.html',
  styleUrls: ['./group-item-action-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GroupItemActionModalComponent implements OnChanges {
  @Input() open = false;
  @Input() action: GroupItemAction = 'DELIVER';
  @Input() group: PaymentGroup | null = null;
  @Input() item: PaymentGroupItem | null = null;
  @Input() cash: CashReservationSnapshot | null = null;
  @Input() isAdmin = false;

  @Output() closed = new EventEmitter<void>();
  @Output() saved = new EventEmitter<PaymentGroupDetail>();

  private readonly service = inject(PaymentGroupService);
  private readonly notifications = inject(NotificationService);

  readonly formatCurrency = formatCurrency;
  readonly statusLabel = PAYMENT_GROUP_ITEM_STATUS_LABEL;
  readonly amount = signal(0);
  readonly text = signal('');
  readonly reference = signal('');
  readonly release = signal(false);
  readonly moneyReturned = signal(false);
  readonly isSaving = signal(false);
  readonly errorMessage = signal<string | null>(null);
  private requestId = crypto.randomUUID();

  get title(): string {
    return TITLES[this.action];
  }

  get flow() {
    return groupFlowWords(this.group?.cashDirection ?? 'OUT');
  }

  /** What still has to be paid on this transaction. */
  readonly remaining = computed(() => {
    const item = this.current();
    return item ? (cents(item.expectedAmount) - cents(item.paidAmount)) / 100 : 0;
  });
  readonly difference = computed(() => Math.max((cents(this.remaining()) - cents(this.amount())) / 100, 0));
  /** Preview of the resulting status (the backend derives the real one). */
  readonly resultStatus = computed<PaymentGroupItemStatus>(() => {
    const item = this.current();
    const paid = cents(item?.paidAmount ?? 0) + cents(this.amount());
    return paid >= cents(item?.expectedAmount ?? 0) ? 'PAGADO' : paid > 0 ? 'PARCIAL' : 'PENDIENTE';
  });
  readonly projected = computed(() => {
    const balance = this.cashState()?.balance ?? 0;
    const direction = this.groupState()?.cashDirection ?? 'OUT';
    const delta = direction === 'OUT' ? -cents(this.amount()) : direction === 'IN' ? cents(this.amount()) : 0;
    return (cents(balance) + delta) / 100;
  });
  readonly releasable = computed(() => this.remaining());
  readonly needsMoneyReturned = computed(() => (this.current()?.paidAmount ?? 0) > 0);
  readonly canSave = computed(() => {
    if (this.isSaving()) {
      return false;
    }
    const text = this.text().trim();
    const action = this.mode();
    switch (action) {
      case 'DELIVER':
      case 'PARTIAL':
        return cents(this.amount()) > 0 && cents(this.amount()) <= cents(this.remaining());
      case 'NO_PAYMENT':
      case 'RESOLVE':
      case 'VOID':
        return text.length >= 5 && (action !== 'VOID' || !this.needsMoneyReturned() || this.moneyReturned());
      case 'NOTE':
        return text.length >= 3;
      case 'EDIT':
        return cents(this.amount()) > 0;
    }
  });

  // Inputs mirrored as signals so the computed values above follow them.
  private readonly current = signal<PaymentGroupItem | null>(null);
  private readonly mode = signal<GroupItemAction>('DELIVER');
  private readonly groupState = signal<PaymentGroup | null>(null);
  private readonly cashState = signal<CashReservationSnapshot | null>(null);

  ngOnChanges(): void {
    this.current.set(this.item);
    this.mode.set(this.action);
    this.groupState.set(this.group);
    this.cashState.set(this.cash);
    if (!this.open || this.isSaving()) {
      return;
    }
    const remaining = this.item ? (cents(this.item.expectedAmount) - cents(this.item.paidAmount)) / 100 : 0;
    this.amount.set(this.action === 'DELIVER' ? remaining : this.action === 'EDIT' ? (this.item?.expectedAmount ?? 0) : 0);
    this.reference.set(this.item?.reference ?? '');
    this.text.set('');
    this.release.set(false);
    this.moneyReturned.set(false);
    this.errorMessage.set(null);
    this.requestId = crypto.randomUUID();
  }

  save(): void {
    const group = this.group;
    const item = this.item;
    if (!group || !item || !this.canSave()) {
      return;
    }
    const note = this.text().trim();
    const requests: Record<GroupItemAction, () => Observable<PaymentGroupDetail>> = {
      DELIVER: () => this.service.deliver(group.id, item.id, { amount: this.amount(), note: note || undefined, clientRequestId: this.requestId }),
      PARTIAL: () => this.service.deliver(group.id, item.id, { amount: this.amount(), note: note || undefined, clientRequestId: this.requestId }),
      NO_PAYMENT: () => this.service.noPayment(group.id, item.id, note),
      NOTE: () => this.service.addNote(group.id, note, item.id),
      RESOLVE: () => this.service.resolve(group.id, item.id, { resolution: note, release: this.release() }),
      VOID: () => this.service.voidItem(group.id, item.id, { reason: note, moneyReturned: this.moneyReturned() }),
      EDIT: () =>
        this.service.updateItem(group.id, item.id, {
          expectedAmount: this.amount(),
          reference: this.reference().trim(),
          note: note || undefined,
        }),
    };
    this.isSaving.set(true);
    this.errorMessage.set(null);
    requests[this.action]().subscribe({
      next: (detail) => {
        this.isSaving.set(false);
        this.notifications.success(`Transacción #${item.itemNumber}: ${DONE[this.action]}.`);
        this.saved.emit(detail);
      },
      error: (error: HttpErrorResponse) => {
        this.isSaving.set(false);
        this.errorMessage.set(extractErrorMessage(error, 'No se pudo registrar la acción.'));
      },
    });
  }
}
