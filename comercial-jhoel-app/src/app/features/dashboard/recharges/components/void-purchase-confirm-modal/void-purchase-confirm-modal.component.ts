import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { RechargePurchase, formatCurrency } from '../../../../../core/models';
import { ButtonComponent, IconComponent } from '../../../../../shared/ui';

const MIN_REASON_LENGTH = 5;

/**
 * "Revertir compra" — dumb, same pattern as Transaccionar's own
 * `VoidConfirmModalComponent`: the parent (`RechargesPageComponent`) owns
 * the actual `RechargesService.voidPurchase` call. Never closes on a
 * backdrop click — same as every other confirm modal in this app (none of
 * them wire a close handler onto `.modal-backdrop`), which is exactly the
 * "no debe cerrarse al hacer click afuera" requirement for this one.
 */
@Component({
  selector: 'app-void-purchase-confirm-modal',
  standalone: true,
  imports: [FormsModule, DatePipe, ButtonComponent, IconComponent],
  templateUrl: './void-purchase-confirm-modal.component.html',
  styleUrl: './void-purchase-confirm-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VoidPurchaseConfirmModalComponent implements OnChanges {
  @Input() open = false;
  @Input() purchase: RechargePurchase | null = null;
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
