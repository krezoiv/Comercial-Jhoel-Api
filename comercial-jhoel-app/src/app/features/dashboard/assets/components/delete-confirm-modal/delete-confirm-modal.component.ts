import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  computed,
  inject,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Asset, PortfolioRecordTrace, formatCurrency, voidCashNote } from '../../../../../core/models';
import { AssetService } from '../../../../../core/services/asset.service';
import { ButtonComponent, IconComponent } from '../../../../../shared/ui';

/**
 * Void (soft delete) with a mandatory reason. Before confirming it says what
 * will happen to Caja, from the backend's trace of the record: the reversal of
 * its Kardex movement, or nothing (paid by bank / registered before Control de
 * Efectivo). The row is never removed: it stays in the history and in the
 * client statement.
 */
@Component({
  selector: 'app-asset-delete-confirm-modal',
  standalone: true,
  imports: [FormsModule, ButtonComponent, IconComponent],
  templateUrl: './delete-confirm-modal.component.html',
  styleUrl: './delete-confirm-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeleteConfirmModalComponent implements OnChanges {
  @Input() open = false;
  @Input() record: Asset | null = null;
  @Input() isDeleting = false;

  /** Emits the trimmed reason. */
  @Output() confirmed = new EventEmitter<string>();
  @Output() cancelled = new EventEmitter<void>();

  private readonly service = inject(AssetService);

  readonly formatCurrency = formatCurrency;
  readonly reason = signal('');
  readonly trace = signal<PortfolioRecordTrace | null>(null);
  readonly traceFailed = signal(false);
  readonly cashNote = computed(() => {
    const trace = this.trace();
    return trace ? voidCashNote(trace) : null;
  });
  /** True when voiding writes a reversal in Caja. */
  readonly movesCash = computed(() => {
    const trace = this.trace();
    return !!trace && trace.cashTracked && trace.kardexNet !== 0;
  });
  readonly canConfirm = computed(() => this.reason().trim().length >= 5);

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['open'] || !this.open || !this.record) {
      return;
    }
    this.reason.set('');
    this.trace.set(null);
    this.traceFailed.set(false);
    this.service.getTrace(this.record.id).subscribe({
      next: (trace) => this.trace.set(trace),
      error: () => this.traceFailed.set(true),
    });
  }

  confirm(): void {
    if (this.canConfirm() && !this.isDeleting) {
      this.confirmed.emit(this.reason().trim().replace(/\s+/g, ' '));
    }
  }
}
