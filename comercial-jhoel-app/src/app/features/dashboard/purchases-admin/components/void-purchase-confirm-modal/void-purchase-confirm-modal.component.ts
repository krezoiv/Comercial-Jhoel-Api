import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Purchase, formatCurrency } from '../../../../../core/models';
import { ButtonComponent, IconComponent } from '../../../../../shared/ui';

const MIN_REASON_LENGTH = 5;

/**
 * "Anular factura" — dumb, same pattern as every other void confirm modal
 * in this app (`VoidPurchaseConfirmModalComponent` in Recargas, tickets'
 * own `VoidReasonModalComponent`): the parent owns the actual
 * `PurchasesService.voidPurchase` call. Never closes on a backdrop click —
 * same as every confirm modal in this codebase (none wire a close handler
 * onto `.modal-backdrop`).
 */
@Component({
  selector: 'app-void-purchase-confirm-modal',
  standalone: true,
  imports: [FormsModule, ButtonComponent, IconComponent],
  templateUrl: './void-purchase-confirm-modal.component.html',
  styleUrl: './void-purchase-confirm-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VoidPurchaseConfirmModalComponent implements OnChanges {
  @Input() open = false;
  @Input() purchase: Purchase | null = null;
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
