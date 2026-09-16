import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { PhoneSale, formatCurrency } from '../../../../../../core/models';
import { ButtonComponent, IconComponent } from '../../../../../../shared/ui';

const MIN_REASON_LENGTH = 5;

/**
 * "Anular" — dumb, exact structural copy of `VoidSimSaleRegistrationConfirmModalComponent`:
 * the parent owns the actual `PhonesService.voidSale` call. Never closes on
 * a backdrop click.
 */
@Component({
  selector: 'app-phone-sale-void-confirm-modal',
  standalone: true,
  imports: [FormsModule, ButtonComponent, IconComponent],
  templateUrl: './phone-sale-void-confirm-modal.component.html',
  styleUrl: './phone-sale-void-confirm-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhoneSaleVoidConfirmModalComponent implements OnChanges {
  @Input() open = false;
  @Input() sale: PhoneSale | null = null;
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
