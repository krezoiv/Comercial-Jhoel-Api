import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, inject, signal } from '@angular/core';

import {
  PAYMENT_GROUP_EVENT_LABEL,
  PAYMENT_GROUP_ITEM_STATUS_LABEL,
  PAYMENT_GROUP_STATUS_LABEL,
  PaymentGroupEvent,
  formatCurrency,
} from '../../../../../core/models';
import { PaymentGroupService } from '../../../../../core/services/payment-group.service';
import { ButtonComponent, IconComponent } from '../../../../../shared/ui';
import { formatGuatemalaDateTime } from '../../../cash-control/cash-control.util';

/** Append-only history of a group, or of one of its transactions: who, when, what, the status at that moment. */
@Component({
  selector: 'app-group-history-modal',
  standalone: true,
  imports: [ButtonComponent, IconComponent],
  templateUrl: './group-history-modal.component.html',
  styleUrls: ['./group-history-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GroupHistoryModalComponent implements OnChanges {
  @Input() open = false;
  @Input() groupId: string | null = null;
  /** Omitted: the whole group's history. */
  @Input() itemId: string | null = null;
  @Input() title = 'Historial';

  @Output() closed = new EventEmitter<void>();

  private readonly service = inject(PaymentGroupService);

  readonly formatCurrency = formatCurrency;
  readonly formatDateTime = formatGuatemalaDateTime;
  readonly eventLabel = PAYMENT_GROUP_EVENT_LABEL;
  readonly itemStatusLabel = PAYMENT_GROUP_ITEM_STATUS_LABEL;
  readonly groupStatusLabel = PAYMENT_GROUP_STATUS_LABEL;
  readonly events = signal<PaymentGroupEvent[]>([]);
  readonly loading = signal(false);
  readonly failed = signal(false);

  ngOnChanges(): void {
    if (!this.open || !this.groupId) {
      return;
    }
    this.loading.set(true);
    this.failed.set(false);
    this.service.history(this.groupId, this.itemId ?? undefined).subscribe({
      next: (events) => {
        this.events.set(events);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.failed.set(true);
      },
    });
  }
}
