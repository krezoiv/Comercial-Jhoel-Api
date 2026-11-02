import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, computed, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { GuayacanCashCount, formatCurrency } from '../../../../../core/models';
import { ConfirmDialogService } from '../../../../../core/services/confirm-dialog.service';
import { GuayacanCashBoxService } from '../../../../../core/services/guayacan-cash-box.service';
import { NotificationService } from '../../../../../core/services/notification.service';
import { extractErrorMessage } from '../../../../../core/utils/extract-error-message';
import { ButtonComponent, CardComponent, IconComponent } from '../../../../../shared/ui';
import { CashBreakdownTableComponent } from '../../../transaccionar/components/cash-breakdown-table/cash-breakdown-table.component';
import {
  cashCountsToDetails,
  cashCountsTotal,
  cashStatus,
  emptyCashCounts,
  formatGuatemalaDateTime,
  round2,
} from '../../guayacan-cash.util';

/**
 * "Conteo de efectivo en caja" (arqueo). Muestra el último conteo registrado
 * (billetes y monedas por denominación) y permite registrar uno nuevo,
 * comparado en vivo contra el saldo del Kardex. Guardar un arqueo NUNCA
 * cambia el saldo: si hay diferencia, un admin la corrige con un ajuste
 * autorizado (`adjustRequested`).
 */
@Component({
  selector: 'app-guayacan-cash-count-panel',
  standalone: true,
  imports: [FormsModule, ButtonComponent, CardComponent, IconComponent, CashBreakdownTableComponent],
  templateUrl: './cash-count-panel.component.html',
  styleUrl: './cash-count-panel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GuayacanCashCountPanelComponent implements OnChanges {
  /** Saldo actual del Kardex (backend). */
  @Input({ required: true }) balance = 0;
  @Input() isAdmin = false;

  /** Diferencia con signo (contado − Kardex) para prellenar un ajuste. */
  @Output() adjustRequested = new EventEmitter<number>();

  private readonly service = inject(GuayacanCashBoxService);
  private readonly confirmDialog = inject(ConfirmDialogService);
  private readonly notifications = inject(NotificationService);

  formatCurrency = formatCurrency;
  formatDateTime = formatGuatemalaDateTime;

  readonly latest = signal<GuayacanCashCount | null>(null);
  readonly loading = signal(true);
  readonly cashCounts = signal<Record<string, number>>(emptyCashCounts());
  readonly notes = signal('');
  readonly isSaving = signal(false);
  private requestId = crypto.randomUUID();
  private readonly balanceSignal = signal(0);

  readonly totalCounted = computed(() => cashCountsTotal(this.cashCounts()));
  readonly difference = computed(() => round2(this.totalCounted() - this.balanceSignal()));
  readonly status = computed(() => cashStatus(this.totalCounted(), this.balanceSignal()));

  constructor() {
    this.loadLatest();
  }

  ngOnChanges(): void {
    this.balanceSignal.set(this.balance);
  }

  loadLatest(): void {
    this.loading.set(true);
    this.service.getLatestCount().subscribe({
      next: (count) => {
        this.latest.set(count);
        this.loading.set(false);
        const counts = emptyCashCounts();
        for (const row of count?.details ?? []) {
          counts[String(row.denomination)] = row.quantity;
        }
        this.cashCounts.set(counts);
      },
      error: () => this.loading.set(false),
    });
  }

  onQuantityChange(event: { denomination: number; quantity: number }): void {
    this.cashCounts.update((counts) => ({ ...counts, [String(event.denomination)]: event.quantity }));
  }

  clear(): void {
    this.cashCounts.set(emptyCashCounts());
  }

  async save(): Promise<void> {
    if (this.isSaving()) {
      return;
    }
    const difference = this.difference();
    const confirmed = await this.confirmDialog.confirm({
      type: 'SAVE',
      title: 'Registrar arqueo de caja',
      message:
        `Contado ${formatCurrency(this.totalCounted())} contra ${formatCurrency(this.balanceSignal())} del Kardex` +
        (difference === 0 ? ' — cuadra.' : ` — diferencia ${formatCurrency(difference)}.`) +
        ' El arqueo no modifica el saldo.',
      confirmText: 'Sí, registrar',
    });
    if (!confirmed) {
      return;
    }
    this.isSaving.set(true);
    this.service
      .registerCount({
        details: cashCountsToDetails(this.cashCounts(), { keepZero: true }),
        notes: this.notes().trim() || undefined,
        clientRequestId: this.requestId,
      })
      .subscribe({
        next: (count) => {
          this.isSaving.set(false);
          this.latest.set(count);
          this.notes.set('');
          this.requestId = crypto.randomUUID();
          this.notifications.success('Arqueo registrado.');
        },
        error: (error: HttpErrorResponse) => {
          this.isSaving.set(false);
          this.notifications.error(extractErrorMessage(error, 'No se pudo registrar el arqueo.'));
        },
      });
  }
}
