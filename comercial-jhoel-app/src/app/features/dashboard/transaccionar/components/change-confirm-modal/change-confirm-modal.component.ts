import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  signal,
} from '@angular/core';

import { formatCurrency } from '../../../../../core/models';
import { ButtonComponent, IconComponent } from '../../../../../shared/ui';

/**
 * "Confirmar Vuelto" — deliberately does NOT close on a backdrop click (per
 * the ticket's own explicit requirement: giving change to a client is a
 * real-money action, not something to lose by an accidental outside click).
 * Dumb, like `SaveConfirmModalComponent` — the parent
 * (`TransaccionarPageComponent`) owns the actual
 * `BankDepositDraftStore.confirmChange()` call; this only emits `confirmed`
 * once, guarded by its own local `confirming` flag so a rapid double-click
 * can never fire it twice.
 */
@Component({
  selector: 'app-change-confirm-modal',
  standalone: true,
  imports: [ButtonComponent, IconComponent],
  templateUrl: './change-confirm-modal.component.html',
  styleUrl: './change-confirm-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChangeConfirmModalComponent implements OnChanges {
  @Input() open = false;
  @Input({ required: true }) amount = 0;

  @Output() confirmed = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  readonly confirming = signal(false);

  formatCurrency = formatCurrency;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['open'] && this.open) {
      this.confirming.set(false);
    }
  }

  confirm(): void {
    if (this.confirming()) {
      return;
    }
    this.confirming.set(true);
    this.confirmed.emit();
  }

  cancel(): void {
    if (this.confirming()) {
      return;
    }
    this.cancelled.emit();
  }
}
