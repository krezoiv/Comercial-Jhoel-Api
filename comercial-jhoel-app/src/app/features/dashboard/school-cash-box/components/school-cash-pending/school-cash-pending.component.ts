import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, computed, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import {
  SCHOOL_CASH_RECEIPT_STATUS_LABEL,
  SchoolCashReceipt,
  SchoolCashTransfer,
  daysSince,
  formatCurrency,
} from '../../../../../core/models';
import { SchoolCashBoxService } from '../../../../../core/services/school-cash-box.service';
import { SchoolListService } from '../../../../../core/services/school-list.service';
import { NotificationService } from '../../../../../core/services/notification.service';
import { extractErrorMessage } from '../../../../../core/utils/extract-error-message';
import { DecimalInputDirective } from '../../../../../shared/directives/decimal-input.directive';
import { ButtonComponent, IconComponent } from '../../../../../shared/ui';
import { formatGuatemalaDateTime } from '../../school-cash.util';
import { SchoolCashTransferModalComponent, TransferLine } from '../school-cash-transfer-modal/school-cash-transfer-modal.component';
import { SchoolCashReasonModalComponent } from '../school-cash-reason-modal/school-cash-reason-modal.component';

const RECEIPT_TONE: Record<string, string> = {
  PENDIENTE: 'pending',
  TRASLADO_PARCIAL: 'bank',
  TRASLADADO: 'moved',
  DEVUELTO: 'neutral',
  ANULADO: 'neutral',
};

/**
 * "Dinero pendiente de trasladar": every list payment received by transfer or
 * deposit, still identified one by one. An administrator selects payments of
 * ONE bank (a transfer leaves a single account), may lower the amount of each
 * one (partial transfer) and confirms "Transferir a Caja de Listas". Below,
 * the transfer history with its audited void.
 */
@Component({
  selector: 'app-school-cash-pending',
  standalone: true,
  imports: [FormsModule, DecimalInputDirective, ButtonComponent, IconComponent, SchoolCashTransferModalComponent, SchoolCashReasonModalComponent],
  templateUrl: './school-cash-pending.component.html',
  styleUrl: './school-cash-pending.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SchoolCashPendingComponent implements OnChanges {
  @Input() refresh = 0;
  @Output() changed = new EventEmitter<void>();

  readonly lists = inject(SchoolListService);
  private readonly service = inject(SchoolCashBoxService);
  private readonly notifications = inject(NotificationService);

  readonly formatCurrency = formatCurrency;
  readonly formatDateTime = formatGuatemalaDateTime;
  readonly statusLabel = SCHOOL_CASH_RECEIPT_STATUS_LABEL;
  readonly tone = RECEIPT_TONE;
  readonly daysSince = daysSince;

  readonly receipts = signal<SchoolCashReceipt[]>([]);
  readonly transfers = signal<SchoolCashTransfer[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly bankFilter = signal('');
  readonly search = signal('');
  readonly scope = signal<'OPEN' | 'ALL'>('OPEN');
  /** Selected receipt id → amount to transfer. */
  readonly selected = signal<Record<string, number>>({});
  readonly transferOpen = signal(false);
  readonly voiding = signal<SchoolCashTransfer | null>(null);
  readonly voidBusy = signal(false);
  readonly voidError = signal<string | null>(null);

  readonly canTransfer = computed(() => this.lists.can('school_lists.cash.transfer'));
  readonly canVoid = computed(() => this.lists.can('school_lists.cash.authorize'));

  readonly banks = computed(() => {
    const seen = new Map<string, string>();
    for (const r of this.receipts()) {
      seen.set(r.bankId, r.bankName);
    }
    return [...seen].map(([id, name]) => ({ id, name })).sort((a, b) => a.name.localeCompare(b.name));
  });

  readonly visible = computed(() => {
    const bank = this.bankFilter();
    const term = this.search().trim().toLowerCase();
    return this.receipts().filter(
      (r) =>
        (!bank || r.bankId === bank) &&
        (!term ||
          [r.quotationNumber, r.customerName, r.receiptNumber, r.reference].some((v) => (v ?? '').toLowerCase().includes(term))),
    );
  });

  /** A transfer leaves one account: the bank of the first selected payment. */
  readonly selectionBank = computed(() => {
    const ids = Object.keys(this.selected());
    return ids.length ? (this.receipts().find((r) => r.id === ids[0])?.bankId ?? null) : null;
  });

  readonly lines = computed<TransferLine[]>(() => {
    const chosen = this.selected();
    return this.receipts()
      .filter((r) => chosen[r.id] !== undefined)
      .map((r) => ({ receipt: r, amount: chosen[r.id] }));
  });

  readonly selectionTotal = computed(() => Math.round(this.lines().reduce((sum, l) => sum + l.amount * 100, 0)) / 100);
  readonly selectionValid = computed(
    () => this.lines().length > 0 && this.lines().every((l) => l.amount > 0 && l.amount <= l.receipt.pending),
  );
  readonly pendingTotal = computed(() => this.visible().reduce((sum, r) => sum + r.pending, 0));

  ngOnChanges(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.service.getReceipts({ scope: this.scope() }).subscribe({
      next: (receipts) => {
        this.receipts.set(receipts);
        this.selected.set({});
        this.loading.set(false);
        this.error.set(null);
      },
      error: (err: HttpErrorResponse) => {
        this.loading.set(false);
        this.error.set(extractErrorMessage(err, 'No se pudieron cargar los pagos bancarios.'));
      },
    });
    this.service.getTransfers({ limit: 20 }).subscribe({ next: (page) => this.transfers.set(page.items), error: () => this.transfers.set([]) });
  }

  setScope(scope: 'OPEN' | 'ALL'): void {
    this.scope.set(scope);
    this.load();
  }

  isSelectable(receipt: SchoolCashReceipt): boolean {
    const bank = this.selectionBank();
    return this.canTransfer() && receipt.pending > 0 && (!bank || bank === receipt.bankId);
  }

  toggle(receipt: SchoolCashReceipt): void {
    this.selected.update((current) => {
      const next = { ...current };
      if (next[receipt.id] !== undefined) {
        delete next[receipt.id];
      } else if (this.isSelectable(receipt)) {
        next[receipt.id] = receipt.pending;
      }
      return next;
    });
  }

  /** An empty field while typing keeps the last amount (restored on blur). */
  setAmount(receipt: SchoolCashReceipt, value: number | null | ''): void {
    if (value === null || value === '' || value === undefined) {
      return;
    }
    this.selected.update((current) => ({ ...current, [receipt.id]: Number(value) }));
  }

  settleAmount(input: HTMLInputElement, receipt: SchoolCashReceipt): void {
    const amount = this.selected()[receipt.id];
    if (!input.value.trim() && amount !== undefined) {
      input.value = amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
  }

  /** Selects every visible pending payment of the selection (or filtered) bank. */
  selectAll(): void {
    const bank = this.selectionBank() ?? this.bankFilter() ?? null;
    const target = bank || this.visible().find((r) => r.pending > 0)?.bankId;
    if (!target) {
      return;
    }
    const next: Record<string, number> = {};
    for (const r of this.visible()) {
      if (r.bankId === target && r.pending > 0) {
        next[r.id] = r.pending;
      }
    }
    this.selected.set(next);
  }

  bankName(id: string | null): string {
    return this.receipts().find((r) => r.bankId === id)?.bankName ?? '';
  }

  transferred(): void {
    this.transferOpen.set(false);
    this.changed.emit();
  }

  confirmVoid(reason: string): void {
    const transfer = this.voiding();
    if (!transfer) {
      return;
    }
    this.voidBusy.set(true);
    this.voidError.set(null);
    this.service.voidTransfer(transfer.id, reason).subscribe({
      next: () => {
        this.voidBusy.set(false);
        this.voiding.set(null);
        this.notifications.success(`Traslado ${transfer.transferNumber} anulado: el dinero volvió a ${transfer.bankName}.`);
        this.changed.emit();
      },
      error: (err: HttpErrorResponse) => {
        this.voidBusy.set(false);
        this.voidError.set(extractErrorMessage(err, 'No se pudo anular el traslado.'));
      },
    });
  }
}
