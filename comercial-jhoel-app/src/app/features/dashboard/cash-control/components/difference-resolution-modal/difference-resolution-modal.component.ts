import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, computed, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import {
  INTEGRITY_CLASSIFICATION_LABEL,
  IntegrityClassification,
  IntegrityFinding,
  formatCurrency,
} from '../../../../../core/models';
import { CashControlService } from '../../../../../core/services/cash-control.service';
import { ConfirmDialogService } from '../../../../../core/services/confirm-dialog.service';
import { NotificationService } from '../../../../../core/services/notification.service';
import { extractErrorMessage } from '../../../../../core/utils/extract-error-message';
import { ButtonComponent, IconComponent } from '../../../../../shared/ui';

/**
 * Closes an arqueo difference with a documented cause and explanation
 * (administrators, owner decision). For Caja it can also register — in the
 * same step — the authorized adjustment to the Kardex for exactly the counted
 * difference. The count keeps its original difference; it is shown as
 * "resuelta" from then on. One `clientRequestId` per opening (idempotent).
 */
@Component({
  selector: 'app-difference-resolution-modal',
  standalone: true,
  imports: [FormsModule, ButtonComponent, IconComponent],
  templateUrl: './difference-resolution-modal.component.html',
  styleUrl: '../cash-bank-deposit-modal/cash-bank-deposit-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DifferenceResolutionModalComponent implements OnChanges {
  /** The DIFFERENCE_CHANGE finding of the count to resolve (null = closed). */
  @Input() finding: IntegrityFinding | null = null;
  @Output() closed = new EventEmitter<void>();
  @Output() saved = new EventEmitter<void>();

  private readonly service = inject(CashControlService);
  private readonly confirmDialog = inject(ConfirmDialogService);
  private readonly notifications = inject(NotificationService);

  readonly formatCurrency = formatCurrency;
  readonly causes = Object.entries(INTEGRITY_CLASSIFICATION_LABEL) as [IntegrityClassification, string][];
  readonly cause = signal<IntegrityClassification>('DIFERENCIA_ARQUEO');
  readonly explanation = signal('');
  readonly withAdjustment = signal(false);
  readonly isSaving = signal(false);
  readonly errorMessage = signal<string | null>(null);
  private readonly current = signal<IntegrityFinding | null>(null);
  private requestId = crypto.randomUUID();

  readonly f = this.current.asReadonly();
  readonly difference = computed(() => this.current()?.count?.difference ?? 0);
  readonly canAdjust = computed(() => this.current()?.count?.source !== 'ARQUEO_BODEGA');
  readonly canSave = computed(() => !this.isSaving() && this.explanation().trim().length >= 10);

  ngOnChanges(): void {
    this.current.set(this.finding);
    if (!this.finding || this.isSaving()) {
      return;
    }
    this.cause.set(this.finding.relatedKeys.length ? 'ERROR_REGISTRO' : 'DIFERENCIA_ARQUEO');
    this.explanation.set('');
    this.withAdjustment.set(false);
    this.errorMessage.set(null);
    this.requestId = crypto.randomUUID();
  }

  async save(): Promise<void> {
    const finding = this.current();
    if (!finding?.count || !this.canSave()) {
      return;
    }
    const diff = this.difference();
    const confirmed = await this.confirmDialog.confirm({
      type: 'FINANCIAL_OPERATION',
      title: 'Resolver diferencia',
      message:
        `${finding.count.label}: ${diff < 0 ? 'faltante' : 'sobrante'} de ${formatCurrency(Math.abs(diff))} — ${INTEGRITY_CLASSIFICATION_LABEL[this.cause()]}.` +
        (this.withAdjustment()
          ? ` Se registrará un ajuste autorizado al Kardex: ${diff < 0 ? 'salida' : 'entrada'} de ${formatCurrency(Math.abs(diff))}.`
          : ' No se registra ningún ajuste: solo queda documentada.') +
        ' La diferencia original del arqueo no se modifica.',
    });
    if (!confirmed) {
      return;
    }
    this.isSaving.set(true);
    this.errorMessage.set(null);
    this.service
      .resolveDifference({
        source: finding.count.source,
        countId: finding.count.id,
        cause: this.cause(),
        explanation: this.explanation().trim(),
        withAdjustment: this.canAdjust() && this.withAdjustment(),
        clientRequestId: this.requestId,
      })
      .subscribe({
        next: () => {
          this.isSaving.set(false);
          this.notifications.success('Diferencia resuelta y documentada.');
          this.saved.emit();
        },
        error: (error: HttpErrorResponse) => {
          this.isSaving.set(false);
          this.errorMessage.set(extractErrorMessage(error, 'No se pudo registrar la resolución.'));
        },
      });
  }
}
