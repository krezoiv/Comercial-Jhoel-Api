import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { CashCustody, WarehouseMovement, WarehouseTransfer, formatCurrency } from '../../../../../core/models';
import { CashCustodyService } from '../../../../../core/services/cash-custody.service';
import { NotificationService } from '../../../../../core/services/notification.service';
import { extractErrorMessage } from '../../../../../core/utils/extract-error-message';
import { DecimalInputDirective } from '../../../../../shared/directives/decimal-input.directive';
import { ButtonComponent, IconComponent } from '../../../../../shared/ui';
import { ReportPaginationComponent } from '../../../reports/components/report-pagination/report-pagination.component';
import { formatGuatemalaDateTime, formatIsoDate } from '../../cash-control.util';
import { CashReasonModalComponent } from '../reason-modal/reason-modal.component';

/**
 * Bodega: its balance (own Kardex), the deliveries received from the caja
 * (each linked to its caja movement: both Kardex sequence numbers are shown)
 * and the Bodega Kardex. Administrators can void a delivery (both sides are
 * reversed together, with a reason) and load Bodega's one-time initial
 * balance. Nothing here computes a balance.
 */
@Component({
  selector: 'app-warehouse-panel',
  standalone: true,
  imports: [FormsModule, ButtonComponent, IconComponent, DecimalInputDirective, ReportPaginationComponent, CashReasonModalComponent],
  templateUrl: './warehouse-panel.component.html',
  styleUrl: './warehouse-panel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WarehousePanelComponent implements OnChanges {
  @Input() custody: CashCustody | null = null;
  @Input() isAdmin = false;
  @Input() canOperate = false;
  /** Bumped by the page after any change, to reload the lists. */
  @Input() refreshKey = 0;

  @Output() deliver = new EventEmitter<void>();
  @Output() changed = new EventEmitter<void>();

  private readonly service = inject(CashCustodyService);
  private readonly notifications = inject(NotificationService);

  readonly formatCurrency = formatCurrency;
  readonly formatDateTime = formatGuatemalaDateTime;
  readonly formatIsoDate = formatIsoDate;
  readonly pageSize = 20;

  readonly transfers = signal<WarehouseTransfer[]>([]);
  readonly transfersTotal = signal(0);
  readonly transfersPage = signal(1);
  readonly movements = signal<WarehouseMovement[]>([]);
  readonly movementsTotal = signal(0);
  readonly movementsPage = signal(1);
  readonly failed = signal(false);
  readonly voidTarget = signal<WarehouseTransfer | null>(null);
  readonly voiding = signal(false);
  readonly initialAmount = signal<number | null>(null);
  readonly initialReason = signal('');
  readonly savingInitial = signal(false);
  private initialRequestId = crypto.randomUUID();

  ngOnChanges(): void {
    this.loadTransfers();
    this.loadMovements();
  }

  loadTransfers(): void {
    this.service.getTransfers({ page: this.transfersPage(), limit: this.pageSize }).subscribe({
      next: (result) => {
        this.transfers.set(result.items);
        this.transfersTotal.set(result.total);
      },
      error: () => this.failed.set(true),
    });
  }

  loadMovements(): void {
    this.service.getWarehouseMovements(this.movementsPage(), this.pageSize).subscribe({
      next: (result) => {
        this.movements.set(result.items);
        this.movementsTotal.set(result.total);
      },
      error: () => this.failed.set(true),
    });
  }

  onTransfersPage(page: number): void {
    this.transfersPage.set(page);
    this.loadTransfers();
  }

  onMovementsPage(page: number): void {
    this.movementsPage.set(page);
    this.loadMovements();
  }

  confirmVoid(reason: string): void {
    const target = this.voidTarget();
    if (!target || this.voiding()) {
      return;
    }
    this.voiding.set(true);
    this.service.voidTransfer(target.id, reason).subscribe({
      next: (result) => {
        this.voiding.set(false);
        this.voidTarget.set(null);
        this.notifications.success(`Entrega ${result.transfer.referenceNumber} anulada: el efectivo volvió a la caja.`);
        this.changed.emit();
      },
      error: (error: HttpErrorResponse) => {
        this.voiding.set(false);
        this.notifications.error(extractErrorMessage(error, 'No se pudo anular la entrega.'));
      },
    });
  }

  saveInitialBalance(): void {
    const amount = this.initialAmount() ?? 0;
    if (amount <= 0 || this.initialReason().trim().length < 5 || this.savingInitial()) {
      return;
    }
    this.savingInitial.set(true);
    this.service.registerWarehouseInitialBalance(amount, this.initialReason().trim(), this.initialRequestId).subscribe({
      next: () => {
        this.savingInitial.set(false);
        this.initialRequestId = crypto.randomUUID();
        this.notifications.success('Saldo inicial de Bodega registrado.');
        this.changed.emit();
      },
      error: (error: HttpErrorResponse) => {
        this.savingInitial.set(false);
        this.notifications.error(extractErrorMessage(error, 'No se pudo registrar el saldo inicial de Bodega.'));
      },
    });
  }
}
