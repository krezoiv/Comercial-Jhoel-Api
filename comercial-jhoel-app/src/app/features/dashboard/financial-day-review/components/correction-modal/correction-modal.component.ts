import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  computed,
  signal,
} from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ButtonComponent, IconComponent } from '../../../../../shared/ui';
import {
  CorrectionRequest,
  REVIEW_MODULE_LABEL,
} from '../../../../../core/models';
import { formatCurrency } from '../../../../../core/utils/number-format.util';

const MIN_REASON_LENGTH = 5;

/** What the page sends to the backend once the administrator confirms. */
export interface CorrectionSubmission {
  request: CorrectionRequest;
  newValue: number;
  reason: string;
  observations: string;
  requestId: string;
}

/**
 * Correction of one value of the reviewed day, in two steps: (1) original
 * value, corrected value, mandatory reason, observations; (2) a visual
 * original → corrected comparison that must be confirmed. Never silent.
 * One `requestId` per opening: a retry after a network error reuses it, so
 * the backend can never store the same correction twice.
 */
@Component({
  selector: 'app-correction-modal',
  standalone: true,
  imports: [FormsModule, DatePipe, ButtonComponent, IconComponent],
  templateUrl: './correction-modal.component.html',
  styleUrl: '../review-modal.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CorrectionModalComponent implements OnChanges {
  @Input() open = false;
  @Input() request: CorrectionRequest | null = null;
  @Input() reviewDate: string | null = null;
  @Input() username = '';
  @Input() isSaving = false;
  @Input() error: string | null = null;

  @Output() confirmed = new EventEmitter<CorrectionSubmission>();
  @Output() cancelled = new EventEmitter<void>();

  readonly step = signal<'form' | 'confirm'>('form');
  readonly newValue = signal<number | null>(null);
  readonly reason = signal('');
  readonly observations = signal('');
  private requestId = '';

  readonly formatCurrency = formatCurrency;
  readonly moduleLabel = REVIEW_MODULE_LABEL;

  readonly difference = computed(() => {
    const value = this.newValue();
    return value === null || !this.request
      ? null
      : Math.round((value - this.request.originalValue) * 100) / 100;
  });

  ngOnChanges(changes: SimpleChanges): void {
    if ((changes['open'] || changes['request']) && this.open && this.request) {
      this.step.set('form');
      this.newValue.set(null);
      this.reason.set('');
      this.observations.set('');
      this.requestId = crypto.randomUUID();
    }
    // A backend rejection sends the administrator back to the form, values kept.
    if (changes['error'] && this.error) {
      this.step.set('form');
    }
  }

  onValueChange(raw: string | number | null): void {
    const value = raw === null || raw === '' ? null : Number(raw);
    this.newValue.set(
      value === null || Number.isNaN(value)
        ? null
        : Math.round(value * 100) / 100,
    );
  }

  get valueInvalid(): boolean {
    const value = this.newValue();
    if (value === null || !this.request) {
      return true;
    }
    return (
      (!this.request.allowNegative && value < 0) ||
      value === this.request.originalValue
    );
  }

  get canContinue(): boolean {
    return (
      !this.valueInvalid &&
      this.reason().trim().length >= MIN_REASON_LENGTH &&
      !this.isSaving
    );
  }

  goToConfirm(): void {
    if (this.canContinue) {
      this.step.set('confirm');
    }
  }

  back(): void {
    if (!this.isSaving) {
      this.step.set('form');
    }
  }

  onCancel(): void {
    if (!this.isSaving) {
      this.cancelled.emit();
    }
  }

  confirm(): void {
    const value = this.newValue();
    if (
      !this.request ||
      value === null ||
      this.isSaving ||
      this.step() !== 'confirm'
    ) {
      return;
    }
    this.confirmed.emit({
      request: this.request,
      newValue: value,
      reason: this.reason().trim(),
      observations: this.observations().trim(),
      requestId: this.requestId,
    });
  }
}
