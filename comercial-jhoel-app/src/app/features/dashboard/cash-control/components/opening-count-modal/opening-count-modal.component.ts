import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, computed, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { OpeningStatus, formatCurrency } from '../../../../../core/models';
import { CuadreStatus } from '../../../../../core/services/bank-deposit-draft.store';
import { CashControlService } from '../../../../../core/services/cash-control.service';
import { ConfirmDialogService } from '../../../../../core/services/confirm-dialog.service';
import { NotificationService } from '../../../../../core/services/notification.service';
import { extractErrorMessage } from '../../../../../core/utils/extract-error-message';
import { ButtonComponent, IconComponent } from '../../../../../shared/ui';
import { CashBreakdownTableComponent } from '../../../transaccionar/components/cash-breakdown-table/cash-breakdown-table.component';
import {
  cashCountsToDetails,
  cashCountsTotal,
  emptyCashCounts,
  formatDifference,
  formatGuatemalaDateTime,
  round2,
} from '../../cash-control.util';

/**
 * Arqueo de apertura (supervisors and admins): count the cash at the start of
 * the bank day and reconcile it with the official closing of the previous day.
 * When the count differs from the system, reason and responsible are
 * mandatory (the backend re-checks it under the caja lock). It is evidence:
 * it never moves cash, never changes the previous day and never blocks the
 * day. One `clientRequestId` per opening of the modal (idempotent).
 */
@Component({
  selector: 'app-opening-count-modal',
  standalone: true,
  imports: [FormsModule, ButtonComponent, IconComponent, CashBreakdownTableComponent],
  templateUrl: './opening-count-modal.component.html',
  styleUrls: ['../cash-bank-deposit-modal/cash-bank-deposit-modal.component.scss', './opening-count-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OpeningCountModalComponent implements OnChanges {
  @Input() open = false;
  /** Current opening status (previous closing, last count, live theoretical). */
  @Input() status: OpeningStatus | null = null;

  @Output() closed = new EventEmitter<void>();
  @Output() saved = new EventEmitter<OpeningStatus | null>();

  private readonly service = inject(CashControlService);
  private readonly confirmDialog = inject(ConfirmDialogService);
  private readonly notifications = inject(NotificationService);

  readonly formatCurrency = formatCurrency;
  readonly formatDifference = formatDifference;
  readonly formatDateTime = formatGuatemalaDateTime;
  readonly cashCounts = signal<Record<string, number>>(emptyCashCounts());
  readonly observations = signal('');
  readonly reason = signal('');
  readonly responsible = signal('');
  readonly isSaving = signal(false);
  readonly errorMessage = signal<string | null>(null);
  private readonly current = signal<OpeningStatus | null>(null);
  private requestId = crypto.randomUUID();

  readonly st = this.current.asReadonly();
  /** What the system says must be in Caja right now (preview; the backend photographs it again). */
  readonly theoretical = computed(() => this.current()?.currentTheoretical ?? 0);
  readonly totalCounted = computed(() => cashCountsTotal(this.cashCounts()));
  readonly difference = computed(() => round2(this.totalCounted() - this.theoretical()));
  readonly cuadreStatus = computed<CuadreStatus>(() => (this.difference() === 0 ? 'green' : this.difference() > 0 ? 'red' : 'yellow'));
  readonly needsReason = computed(() => this.difference() !== 0);
  readonly canSave = computed(
    () =>
      !this.isSaving() &&
      (!this.needsReason() || (this.reason().trim().length >= 5 && this.responsible().trim().length >= 3)),
  );

  ngOnChanges(): void {
    this.current.set(this.status);
    if (!this.open || this.isSaving()) {
      return;
    }
    this.cashCounts.set(emptyCashCounts());
    this.observations.set('');
    this.reason.set('');
    this.responsible.set('');
    this.errorMessage.set(null);
    this.requestId = crypto.randomUUID();
  }

  onQuantityChange(change: { denomination: number; quantity: number }): void {
    const quantity = Math.max(0, Math.trunc(Number(change.quantity) || 0));
    this.cashCounts.update((counts) => ({ ...counts, [String(change.denomination)]: quantity }));
  }

  async save(): Promise<void> {
    if (!this.canSave()) {
      return;
    }
    const diff = this.difference();
    const confirmed = await this.confirmDialog.confirm({
      type: 'FINANCIAL_OPERATION',
      title: 'Registrar arqueo de apertura',
      message:
        `Contado ${formatCurrency(this.totalCounted())} contra ${formatCurrency(this.theoretical())} del sistema` +
        (diff === 0 ? ': cuadrado.' : `: ${diff < 0 ? 'faltante' : 'sobrante'} de ${formatCurrency(Math.abs(diff))}.`) +
        ' Queda como evidencia del inicio del día; no mueve efectivo ni modifica el cierre de ayer.',
    });
    if (!confirmed) {
      return;
    }
    this.isSaving.set(true);
    this.errorMessage.set(null);
    this.service
      .registerOpeningCount({
        details: cashCountsToDetails(this.cashCounts(), { keepZero: true }),
        observations: this.observations().trim() || undefined,
        reason: this.reason().trim() || undefined,
        responsible: this.responsible().trim() || undefined,
        clientRequestId: this.requestId,
      })
      .subscribe({
        next: (status) => {
          this.isSaving.set(false);
          this.notifications.success('Arqueo de apertura registrado.');
          this.saved.emit(status);
        },
        error: (error: HttpErrorResponse) => {
          this.isSaving.set(false);
          this.errorMessage.set(extractErrorMessage(error, 'No se pudo registrar el arqueo de apertura.'));
        },
      });
  }
}
