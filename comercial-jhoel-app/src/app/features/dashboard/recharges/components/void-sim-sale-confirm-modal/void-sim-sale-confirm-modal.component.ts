import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { SimSale, formatCurrency } from '../../../../../core/models';
import { ButtonComponent, IconComponent } from '../../../../../shared/ui';

const MIN_REASON_LENGTH = 5;

/**
 * "Revertir venta" for the by-quantity "Vender SIM" flow — dumb, exact
 * structural clone of `VoidPurchaseConfirmModalComponent`: the parent
 * (`RechargesPageComponent`) owns the actual `RechargeSimsService.voidSale`
 * call. Never closes on a backdrop click, same as every other confirm
 * modal in this app.
 */
@Component({
  selector: 'app-void-sim-sale-confirm-modal',
  standalone: true,
  imports: [FormsModule, DatePipe, ButtonComponent, IconComponent],
  templateUrl: './void-sim-sale-confirm-modal.component.html',
  styleUrl: './void-sim-sale-confirm-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VoidSimSaleConfirmModalComponent implements OnChanges {
  @Input() open = false;
  @Input() sale: SimSale | null = null;
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
