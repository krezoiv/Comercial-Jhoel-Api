import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, computed, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { PaymentGroupDetail, formatCurrency, groupFlowWords } from '../../../../../core/models';
import { NotificationService } from '../../../../../core/services/notification.service';
import { PaymentGroupService } from '../../../../../core/services/payment-group.service';
import { extractErrorMessage } from '../../../../../core/utils/extract-error-message';
import { ButtonComponent, IconComponent } from '../../../../../shared/ui';

/**
 * Close (conciliation) or void a whole group — admins. The summary comes from
 * the backend detail; closing releases what was not used and keeps every real
 * cash movement and every history entry.
 */
@Component({
  selector: 'app-group-close-modal',
  standalone: true,
  imports: [FormsModule, ButtonComponent, IconComponent],
  templateUrl: './group-close-modal.component.html',
  styleUrls: ['./group-close-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GroupCloseModalComponent implements OnChanges {
  @Input() open = false;
  @Input() mode: 'CLOSE' | 'VOID' = 'CLOSE';
  @Input() detail: PaymentGroupDetail | null = null;

  @Output() closed = new EventEmitter<void>();
  @Output() saved = new EventEmitter<PaymentGroupDetail>();

  private readonly service = inject(PaymentGroupService);
  private readonly notifications = inject(NotificationService);

  readonly formatCurrency = formatCurrency;
  readonly text = signal('');
  readonly isSaving = signal(false);
  readonly errorMessage = signal<string | null>(null);
  private readonly modeState = signal<'CLOSE' | 'VOID'>('CLOSE');
  private readonly detailState = signal<PaymentGroupDetail | null>(null);

  readonly canSave = computed(() => {
    const detail = this.detailState();
    if (!detail || this.isSaving()) {
      return false;
    }
    return this.modeState() === 'CLOSE'
      ? detail.closeCheck.canClose
      : this.text().trim().length >= 5 && detail.group.paidAmount === 0;
  });

  get flow() {
    return groupFlowWords(this.detail?.group.cashDirection ?? 'OUT');
  }

  ngOnChanges(): void {
    this.modeState.set(this.mode);
    this.detailState.set(this.detail);
    if (this.open && !this.isSaving()) {
      this.text.set('');
      this.errorMessage.set(null);
    }
  }

  save(): void {
    const detail = this.detail;
    if (!detail || !this.canSave()) {
      return;
    }
    this.isSaving.set(true);
    this.errorMessage.set(null);
    const request =
      this.mode === 'CLOSE'
        ? this.service.close(detail.group.id, this.text().trim() || undefined)
        : this.service.voidGroup(detail.group.id, this.text().trim());
    request.subscribe({
      next: (updated) => {
        this.isSaving.set(false);
        this.notifications.success(this.mode === 'CLOSE' ? `Grupo ${updated.group.code} cerrado y conciliado.` : `Grupo ${updated.group.code} anulado.`);
        this.saved.emit(updated);
      },
      error: (error: HttpErrorResponse) => {
        this.isSaving.set(false);
        this.errorMessage.set(extractErrorMessage(error, 'No se pudo completar la acción.'));
      },
    });
  }
}
