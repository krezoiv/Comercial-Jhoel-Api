import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { PHONE_OPERATOR_LABEL, Phone, formatCurrency } from '../../../../../../core/models';
import { ButtonComponent, IconComponent } from '../../../../../../shared/ui';

/**
 * Structured pre-submit summary the user explicitly asked for — dumb, same
 * "parent computes/passes data, shows a summary, emits confirmed/cancelled"
 * pattern as `FinalBalanceConfirmModalComponent`, rather than the generic
 * `ConfirmDialogService` text dialog SIM sale uses for its own equivalent
 * step (a deliberate deviation, see the plan's own "Modal de confirmación de
 * venta dedicado" decision).
 */
@Component({
  selector: 'app-phone-sale-confirm-modal',
  standalone: true,
  imports: [ButtonComponent, IconComponent],
  templateUrl: './phone-sale-confirm-modal.component.html',
  styleUrl: './phone-sale-confirm-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhoneSaleConfirmModalComponent {
  @Input() open = false;
  @Input() phone: Phone | null = null;
  @Input() clientName: string | null = null;
  @Input() salePrice = 0;
  @Input() saleDate = '';
  @Input() hasDpiImage = false;
  @Input() isSaving = false;

  @Output() confirmed = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  formatCurrency = formatCurrency;
  operatorLabel = PHONE_OPERATOR_LABEL;

  onCancel(): void {
    if (this.isSaving) {
      return;
    }
    this.cancelled.emit();
  }

  onConfirm(): void {
    if (this.isSaving) {
      return;
    }
    this.confirmed.emit();
  }
}
