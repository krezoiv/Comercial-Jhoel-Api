import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ButtonComponent, IconComponent } from '../../../../../shared/ui';

const MIN_REASON_LENGTH = 5;

/**
 * Dumb — mismo patrón que `ReopenConfirmModalComponent`. "Anular" (no
 * "Eliminar"): es información financiera y el backend nunca hace un
 * `DELETE` físico (`cancel_agent_day` solo marca `is_cancelled`, ver el
 * backend) — la copia del modal debe reflejar exactamente eso.
 */
@Component({
  selector: 'app-cancel-confirm-modal',
  standalone: true,
  imports: [FormsModule, ButtonComponent, IconComponent],
  templateUrl: './cancel-confirm-modal.component.html',
  styleUrl: './cancel-confirm-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CancelConfirmModalComponent implements OnChanges {
  @Input() open = false;
  @Input() date: string | null = null;
  @Input() isSaving = false;

  @Output() confirmed = new EventEmitter<string>();
  @Output() cancelled = new EventEmitter<void>();

  readonly reason = signal('');

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
