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
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ButtonComponent, IconComponent } from '../../../../../shared/ui';

const MIN_REASON_LENGTH = 5;

/**
 * "ABRIR DÍA PARA REVISIÓN" confirmation. Dumb: the page performs the call.
 * Requires a reason (≥ 5 chars, same as the backend) and an explicit
 * acknowledgement; the backdrop never closes it and it cannot be submitted
 * twice while saving.
 */
@Component({
  selector: 'app-open-review-modal',
  standalone: true,
  imports: [FormsModule, DatePipe, ButtonComponent, IconComponent],
  templateUrl: './open-review-modal.component.html',
  styleUrl: '../review-modal.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OpenReviewModalComponent implements OnChanges {
  @Input() open = false;
  @Input() date: string | null = null;
  @Input() username = '';
  @Input() isSaving = false;
  @Input() error: string | null = null;

  @Output() confirmed = new EventEmitter<string>();
  @Output() cancelled = new EventEmitter<void>();

  readonly reason = signal('');
  readonly acknowledged = signal(false);

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['open'] && this.open) {
      this.reason.set('');
      this.acknowledged.set(false);
    }
  }

  get canConfirm(): boolean {
    return (
      this.reason().trim().length >= MIN_REASON_LENGTH &&
      this.acknowledged() &&
      !this.isSaving
    );
  }

  onCancel(): void {
    if (!this.isSaving) {
      this.cancelled.emit();
    }
  }

  onConfirm(): void {
    if (this.canConfirm) {
      this.confirmed.emit(this.reason().trim());
    }
  }
}
