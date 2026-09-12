import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { SimSaleRegistration, formatCurrency } from '../../../../../core/models';
import { ButtonComponent, IconComponent } from '../../../../../shared/ui';

const MIN_REASON_LENGTH = 5;

/**
 * "Anular" — dumb, same pattern as `VoidPurchaseConfirmModalComponent`: the
 * parent owns the actual `RechargeSimsService.voidSaleRegistration` call.
 * Never closes on a backdrop click.
 */
@Component({
  selector: 'app-void-sim-sale-registration-confirm-modal',
  standalone: true,
  imports: [FormsModule, ButtonComponent, IconComponent],
  templateUrl: './void-sim-sale-registration-confirm-modal.component.html',
  styleUrl: './void-sim-sale-registration-confirm-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VoidSimSaleRegistrationConfirmModalComponent implements OnChanges {
  @Input() open = false;
  @Input() registration: SimSaleRegistration | null = null;
  @Input() isSaving = false;

  @Output() confirmed = new EventEmitter<string>();
  @Output() cancelled = new EventEmitter<void>();

  readonly reason = signal('');

  formatCurrency = formatCurrency;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['open'] && this.open) {
      this.reason.set('');
    }
  }

  get canConfirm(): boolean {
    return this.reason().trim().length >= MIN_REASON_LENGTH;
  }

  onCancel(): void {
    if (this.isSaving) {
      return;
    }
    this.reason.set('');
    this.cancelled.emit();
  }

  onConfirm(): void {
    if (!this.canConfirm || this.isSaving) {
      return;
    }
    this.confirmed.emit(this.reason().trim());
  }
}
