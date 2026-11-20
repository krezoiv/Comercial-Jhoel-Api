import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, computed, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SCHOOL_CASH_EXIT_LABEL, SchoolCashExit, SchoolCashMovement, formatCurrency } from '../../../../../core/models';
import { SchoolCashBoxService } from '../../../../../core/services/school-cash-box.service';
import { SchoolListService } from '../../../../../core/services/school-list.service';
import { NotificationService } from '../../../../../core/services/notification.service';
import { extractErrorMessage } from '../../../../../core/utils/extract-error-message';
import { ButtonComponent, IconComponent } from '../../../../../shared/ui';
import { formatGuatemalaDateTime } from '../../school-cash.util';
import { SchoolCashReasonModalComponent } from '../school-cash-reason-modal/school-cash-reason-modal.component';
import type { ExitModalMode } from '../school-cash-exit-modal/school-cash-exit-modal.component';

type Pending = { kind: 'exit'; exit: SchoolCashExit } | { kind: 'adjustment'; movement: SchoolCashMovement };

/**
 * Authorized exits (destination, recipient, reason, who authorized) and
 * adjustments of the Caja de Listas, each with its audited void. Registering
 * them happens in the shared modal of the page (`create` output).
 */
@Component({
  selector: 'app-school-cash-exits',
  standalone: true,
  imports: [ButtonComponent, IconComponent, SchoolCashReasonModalComponent],
  templateUrl: './school-cash-exits.component.html',
  styleUrl: './school-cash-exits.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SchoolCashExitsComponent implements OnChanges {
  @Input() refresh = 0;
  @Output() changed = new EventEmitter<void>();
  @Output() create = new EventEmitter<ExitModalMode>();

  readonly lists = inject(SchoolListService);
  private readonly service = inject(SchoolCashBoxService);
  private readonly notifications = inject(NotificationService);

  readonly formatCurrency = formatCurrency;
  readonly formatDateTime = formatGuatemalaDateTime;
  readonly destination = SCHOOL_CASH_EXIT_LABEL;
  readonly exits = signal<SchoolCashExit[]>([]);
  readonly adjustments = signal<SchoolCashMovement[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly pending = signal<Pending | null>(null);
  readonly busy = signal(false);
  readonly voidError = signal<string | null>(null);

  readonly canVoid = computed(() => this.lists.can('school_lists.cash.authorize'));

  ngOnChanges(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.service.getExits({ limit: 50 }).subscribe({
      next: (page) => {
        this.exits.set(page.items);
        this.loading.set(false);
        this.error.set(null);
      },
      error: (err: HttpErrorResponse) => {
        this.loading.set(false);
        this.error.set(extractErrorMessage(err, 'No se pudieron cargar las salidas.'));
      },
    });
    this.service.getMovements({ movementType: 'AJUSTE', limit: 50 }).subscribe({
      next: (page) => this.adjustments.set(page.items),
      error: () => this.adjustments.set([]),
    });
  }

  ask(pending: Pending): void {
    this.voidError.set(null);
    this.pending.set(pending);
  }

  confirm(reason: string): void {
    const pending = this.pending();
    if (!pending) {
      return;
    }
    this.busy.set(true);
    const request: Observable<unknown> =
      pending.kind === 'exit'
        ? this.service.voidExit(pending.exit.id, reason)
        : this.service.voidAdjustment(pending.movement.id, reason);
    request.subscribe({
      next: () => {
        this.busy.set(false);
        this.pending.set(null);
        this.notifications.success(pending.kind === 'exit' ? `Salida ${pending.exit.exitNumber} anulada.` : 'Ajuste revertido.');
        this.changed.emit();
      },
      error: (err: HttpErrorResponse) => {
        this.busy.set(false);
        this.voidError.set(extractErrorMessage(err, 'No se pudo anular.'));
      },
    });
  }
}
