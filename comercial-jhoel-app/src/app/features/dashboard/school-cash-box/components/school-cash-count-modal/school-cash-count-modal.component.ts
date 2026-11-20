import { ChangeDetectionStrategy, Component, EventEmitter, HostListener, Input, Output, computed, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { SchoolCashCount, formatCurrency } from '../../../../../core/models';
import { CuadreStatus } from '../../../../../core/services/bank-deposit-draft.store';
import { SchoolCashBoxService } from '../../../../../core/services/school-cash-box.service';
import { NotificationService } from '../../../../../core/services/notification.service';
import { extractErrorMessage } from '../../../../../core/utils/extract-error-message';
import { FocusTrapDirective } from '../../../../../shared/directives/focus-trap.directive';
import { ButtonComponent, IconComponent } from '../../../../../shared/ui';
import { CashBreakdownTableComponent } from '../../../transaccionar/components/cash-breakdown-table/cash-breakdown-table.component';
import { cashCountsToDetails, cashCountsTotal, emptyCashCounts, round2 } from '../../school-cash.util';

/**
 * Arqueo de la Caja de Listas: bills and coins counted (Q200 … Q0.01, the
 * existing breakdown table), the theoretical balance of the Kardex and the
 * difference (counted − theoretical). Saving NEVER adjusts the balance: the
 * difference is stored and stays visible; the backend re-reads the
 * theoretical balance under the caja lock.
 */
@Component({
  selector: 'app-school-cash-count-modal',
  standalone: true,
  imports: [FormsModule, FocusTrapDirective, ButtonComponent, IconComponent, CashBreakdownTableComponent],
  templateUrl: './school-cash-count-modal.component.html',
  styleUrl: './school-cash-count-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SchoolCashCountModalComponent {
  /** Balance shown while counting (the saved count uses the one under lock). */
  @Input() theoretical = 0;
  @Output() saved = new EventEmitter<SchoolCashCount>();
  @Output() closed = new EventEmitter<void>();

  private readonly service = inject(SchoolCashBoxService);
  private readonly notifications = inject(NotificationService);
  private readonly requestId = crypto.randomUUID();

  readonly formatCurrency = formatCurrency;
  readonly counts = signal<Record<string, number>>(emptyCashCounts());
  readonly observations = signal('');
  readonly busy = signal(false);
  readonly error = signal<string | null>(null);

  readonly counted = computed(() => cashCountsTotal(this.counts()));
  readonly difference = computed(() => round2(this.counted() - this.theoretical));
  readonly status = computed<CuadreStatus>(() => (this.difference() === 0 ? 'green' : this.difference() > 0 ? 'yellow' : 'red'));
  readonly resultLabel = computed(() =>
    this.difference() === 0 ? 'Cuadrado' : this.difference() < 0 ? 'Faltante' : 'Sobrante',
  );

  onQuantity(change: { denomination: number; quantity: number }): void {
    const quantity = Math.max(0, Math.trunc(Number(change.quantity) || 0));
    this.counts.update((counts) => ({ ...counts, [String(change.denomination)]: quantity }));
  }

  save(): void {
    if (this.busy()) {
      return;
    }
    this.busy.set(true);
    this.error.set(null);
    this.service
      .registerCount({
        details: cashCountsToDetails(this.counts(), { keepZero: false }),
        observations: this.observations().trim() || undefined,
        clientRequestId: this.requestId,
      })
      .subscribe({
        next: (count) => {
          this.busy.set(false);
          this.notifications.success(
            count.difference === 0
              ? `Arqueo ${count.countNumber}: la caja cuadra.`
              : `Arqueo ${count.countNumber} registrado con diferencia de ${formatCurrency(count.difference)}.`,
          );
          this.saved.emit(count);
        },
        error: (err: HttpErrorResponse) => {
          this.busy.set(false);
          this.error.set(extractErrorMessage(err, 'No se pudo registrar el arqueo.'));
        },
      });
  }

  @HostListener('document:keydown.escape', ['$event'])
  onEscape(event: Event): void {
    if (!event.defaultPrevented && !this.busy()) {
      event.preventDefault();
      this.closed.emit();
    }
  }
}
