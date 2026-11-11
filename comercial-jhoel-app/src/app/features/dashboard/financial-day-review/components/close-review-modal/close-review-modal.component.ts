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
import {
  CloseReviewSummary,
  DIFFERENCE_TYPE_LABEL,
  REVIEW_MODULE_LABEL,
  ReviewModule,
} from '../../../../../core/models';
import { formatCurrency } from '../../../../../core/utils/number-format.util';

/** Close input chosen by the administrator. */
export interface CloseReviewSubmission {
  observations: string;
  acceptPendingDifferences: boolean;
}

/**
 * Close summary (corrections per module, difference before/after) and the
 * final confirmation. If differences remain, closing requires an explicit
 * acknowledgement and the day is NOT marked as squared.
 */
@Component({
  selector: 'app-close-review-modal',
  standalone: true,
  imports: [FormsModule, DatePipe, ButtonComponent, IconComponent],
  templateUrl: './close-review-modal.component.html',
  styleUrl: '../review-modal.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CloseReviewModalComponent implements OnChanges {
  @Input() open = false;
  @Input() summary: CloseReviewSummary | null = null;
  @Input() isSaving = false;
  @Input() error: string | null = null;

  @Output() confirmed = new EventEmitter<CloseReviewSubmission>();
  @Output() cancelled = new EventEmitter<void>();

  readonly observations = signal('');
  readonly acceptPending = signal(false);
  readonly formatCurrency = formatCurrency;
  readonly moduleLabel = REVIEW_MODULE_LABEL;
  readonly typeLabel = DIFFERENCE_TYPE_LABEL;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['open'] && this.open) {
      this.observations.set('');
      this.acceptPending.set(false);
    }
  }

  get canConfirm(): boolean {
    return (
      !!this.summary &&
      !this.isSaving &&
      (!this.summary.hasPendingDifferences || this.acceptPending())
    );
  }

  moduleEntries(): Array<[ReviewModule, number]> {
    return Object.entries(this.summary?.byModule ?? {}) as Array<
      [ReviewModule, number]
    >;
  }

  onCancel(): void {
    if (!this.isSaving) {
      this.cancelled.emit();
    }
  }

  onConfirm(): void {
    if (this.canConfirm) {
      this.confirmed.emit({
        observations: this.observations().trim(),
        acceptPendingDifferences: this.acceptPending(),
      });
    }
  }
}
