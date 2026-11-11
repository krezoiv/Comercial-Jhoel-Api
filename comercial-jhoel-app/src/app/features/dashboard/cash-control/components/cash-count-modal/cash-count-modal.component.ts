import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, computed, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { CASH_COUNT_RESULT_LABEL, CashCountRecord, CashCustody, formatCurrency } from '../../../../../core/models';
import { CuadreStatus } from '../../../../../core/services/bank-deposit-draft.store';
import { AuthService } from '../../../../../core/services/auth.service';
import { CashCustodyService } from '../../../../../core/services/cash-custody.service';
import { ConfirmDialogService } from '../../../../../core/services/confirm-dialog.service';
import { extractErrorMessage } from '../../../../../core/utils/extract-error-message';
import { DecimalInputDirective } from '../../../../../shared/directives/decimal-input.directive';
import { ButtonComponent, IconComponent } from '../../../../../shared/ui';
import { CashBreakdownTableComponent } from '../../../transaccionar/components/cash-breakdown-table/cash-breakdown-table.component';
import { cashCountsToDetails, cashCountsTotal, emptyCashCounts, formatGuatemalaDateTime, formatIsoDate, round2 } from '../../cash-control.util';

/**
 * "Arqueo de Caja": count the bills and coins physically in the caja and
 * compare them with the theoretical caja balance. The live difference is a
 * preview; on save the backend reads the theoretical balance under its lock,
 * stores the photograph and returns the official result (cuadrado / faltante
 * / sobrante). It never adjusts the caja nor writes a Kardex movement. Bodega
 * cash is shown separately and is never part of the caja count; it may be
 * counted optionally for the consolidated view.
 *
 * With `correctionOf` it is the audited correction of an earlier count
 * (admin): same photograph (theoretical values of that moment), new
 * quantities and a mandatory reason; the original stays as "reemplazado".
 */
@Component({
  selector: 'app-cash-count-modal',
  standalone: true,
  imports: [FormsModule, ButtonComponent, IconComponent, DecimalInputDirective, CashBreakdownTableComponent],
  templateUrl: './cash-count-modal.component.html',
  styleUrl: './cash-count-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CashCountModalComponent implements OnChanges {
  @Input() open = false;
  /** Official custody balances (backend) at the time the form opens. */
  @Input() custody: CashCustody | null = null;
  /** Earlier count being corrected (admin), or `null` for a new count. */
  @Input() correctionOf: CashCountRecord | null = null;

  @Output() closed = new EventEmitter<void>();
  @Output() saved = new EventEmitter<CashCountRecord>();

  private readonly service = inject(CashCustodyService);
  private readonly confirmDialog = inject(ConfirmDialogService);
  private readonly auth = inject(AuthService);

  readonly formatCurrency = formatCurrency;
  readonly formatDateTime = formatGuatemalaDateTime;
  readonly formatIsoDate = formatIsoDate;
  readonly resultLabel = CASH_COUNT_RESULT_LABEL;

  readonly cashCounts = signal<Record<string, number>>(emptyCashCounts());
  readonly observations = signal('');
  readonly countWarehouse = signal(false);
  readonly warehouseCounted = signal<number | null>(null);
  readonly reason = signal('');
  readonly isSaving = signal(false);
  readonly errorMessage = signal<string | null>(null);
  /** The count as stored by the backend (shown after saving). */
  readonly result = signal<CashCountRecord | null>(null);
  readonly openedAt = signal(new Date().toISOString());
  private readonly theoreticalSignal = signal(0);
  private readonly warehouseSignal = signal(0);
  private requestId = crypto.randomUUID();

  readonly username = computed(() => this.auth.currentUser()?.username ?? '');
  readonly totalCounted = computed(() => cashCountsTotal(this.cashCounts()));
  /** Preview only; the official difference comes back from the backend. */
  readonly previewDifference = computed(() => round2(this.totalCounted() - this.theoreticalSignal()));
  readonly previewStatus = computed<CuadreStatus>(() => {
    const diff = this.previewDifference();
    return diff === 0 ? 'green' : diff > 0 ? 'red' : 'yellow';
  });
  readonly theoretical = computed(() => this.theoreticalSignal());
  readonly warehouseTheoretical = computed(() => this.warehouseSignal());
  readonly canSave = computed(
    () =>
      !this.isSaving() &&
      (!this.correctionOf || this.reason().trim().length >= 5) &&
      (!this.countWarehouse() || (this.warehouseCounted() ?? -1) >= 0),
  );

  ngOnChanges(): void {
    if (!this.open || this.isSaving()) {
      return;
    }
    const original = this.correctionOf;
    this.theoreticalSignal.set(original ? original.systemCash : (this.custody?.cashBalance ?? 0));
    this.warehouseSignal.set(original ? original.warehouseBalance : (this.custody?.warehouseBalance ?? 0));
    this.cashCounts.set(
      original
        ? { ...emptyCashCounts(), ...Object.fromEntries(original.details.map((row) => [String(row.denomination), row.quantity])) }
        : emptyCashCounts(),
    );
    this.observations.set(original?.observations ?? '');
    this.countWarehouse.set(original?.warehouseCounted !== null && original?.warehouseCounted !== undefined);
    this.warehouseCounted.set(original?.warehouseCounted ?? null);
    this.reason.set('');
    this.errorMessage.set(null);
    this.result.set(null);
    this.openedAt.set(original?.countedAt ?? new Date().toISOString());
    this.requestId = crypto.randomUUID();
  }

  onQuantityChange(change: { denomination: number; quantity: number }): void {
    const quantity = Math.max(0, Math.trunc(Number(change.quantity) || 0));
    this.cashCounts.update((counts) => ({ ...counts, [String(change.denomination)]: quantity }));
  }

  async save(): Promise<void> {
    if (!this.canSave()) {
      return;
    }
    const diff = this.previewDifference();
    const confirmed = await this.confirmDialog.confirm({
      type: 'FINANCIAL_OPERATION',
      title: this.correctionOf ? 'Guardar corrección del arqueo' : 'Guardar arqueo de caja',
      message:
        `Contado ${formatCurrency(this.totalCounted())} frente a un teórico de aprox. ${formatCurrency(this.theoretical())} ` +
        `(${diff === 0 ? 'cuadrado' : diff < 0 ? 'faltante de ' + formatCurrency(-diff) : 'sobrante de ' + formatCurrency(diff)}). ` +
        'El arqueo se guarda como registro histórico y no modifica el efectivo ni el Kardex.',
    });
    if (!confirmed) {
      return;
    }
    const input = {
      details: cashCountsToDetails(this.cashCounts(), { keepZero: true }),
      observations: this.observations().trim() || undefined,
      warehouseCounted: this.countWarehouse() ? (this.warehouseCounted() ?? 0) : undefined,
      clientRequestId: this.requestId,
    };
    this.isSaving.set(true);
    this.errorMessage.set(null);
    const request = this.correctionOf
      ? this.service.correctCount(this.correctionOf.id, { ...input, reason: this.reason().trim() })
      : this.service.registerCount(input);
    request.subscribe({
      next: (count) => {
        this.isSaving.set(false);
        this.result.set(count);
        this.saved.emit(count);
      },
      error: (error: HttpErrorResponse) => {
        this.isSaving.set(false);
        this.errorMessage.set(extractErrorMessage(error, 'No se pudo guardar el arqueo.'));
      },
    });
  }
}
