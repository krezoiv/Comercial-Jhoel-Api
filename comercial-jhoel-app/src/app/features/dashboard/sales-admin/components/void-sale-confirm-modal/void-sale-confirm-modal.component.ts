import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Sale, formatCurrency } from '../../../../../core/models';
import { ButtonComponent, IconComponent } from '../../../../../shared/ui';

const MIN_REASON_LENGTH = 5;

/**
 * "Anular venta" — dumb, exact mirror of Compras' own
 * `VoidPurchaseConfirmModalComponent`: the parent owns the actual
 * `SalesService.voidSale` call. Never closes on a backdrop click — same as
 * every confirm modal in this codebase.
 */
@Component({
  selector: 'app-void-sale-confirm-modal',
  standalone: true,
  imports: [FormsModule, ButtonComponent, IconComponent],
  templateUrl: './void-sale-confirm-modal.component.html',
  styleUrl: './void-sale-confirm-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VoidSaleConfirmModalComponent implements OnChanges {
  @Input() open = false;
  @Input() sale: Sale | null = null;
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
