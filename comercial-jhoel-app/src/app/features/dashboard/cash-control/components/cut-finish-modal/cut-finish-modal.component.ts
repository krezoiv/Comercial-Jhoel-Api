import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, computed, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { CASH_CUT_NAME, CashBankBalance, CashCutPeriod, CashPosition, formatCurrency } from '../../../../../core/models';
import { CuadreStatus } from '../../../../../core/services/bank-deposit-draft.store';
import { CashControlService } from '../../../../../core/services/cash-control.service';
import { ConfirmDialogService } from '../../../../../core/services/confirm-dialog.service';
import { NotificationService } from '../../../../../core/services/notification.service';
import { extractErrorMessage } from '../../../../../core/utils/extract-error-message';
import { DecimalInputDirective } from '../../../../../shared/directives/decimal-input.directive';
import { ButtonComponent, IconComponent } from '../../../../../shared/ui';
import { CashBreakdownTableComponent } from '../../../transaccionar/components/cash-breakdown-table/cash-breakdown-table.component';
import {
  cashCountsToDetails,
  cashCountsTotal,
  emptyCashCounts,
  formatDifference,
  formatGuatemalaTime,
  round2,
} from '../../cash-control.util';

interface BankRow extends CashBankBalance {
  verified: number | null;
  observations: string;
}

/**
 * "Finalizar corte": arqueo by denomination (Q200 … Q0.05) compared live
 * against the system cash of the Kardex, plus verification of every active
 * bank account. Difference = counted − system. All previews here are UX
 * only: the backend recomputes the system cash and every difference under
 * its lock and stores the permanent snapshot; nothing is "adjusted" to hide
 * a difference.
 */
@Component({
  selector: 'app-cash-cut-finish-modal',
  standalone: true,
  imports: [FormsModule, ButtonComponent, IconComponent, DecimalInputDirective, CashBreakdownTableComponent],
  templateUrl: './cut-finish-modal.component.html',
  styleUrl: './cut-finish-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CashCutFinishModalComponent implements OnChanges {
  @Input() open = false;
  @Input() period: CashCutPeriod | null = null;

  @Output() closed = new EventEmitter<void>();
  @Output() saved = new EventEmitter<CashPosition>();

  private readonly service = inject(CashControlService);
  private readonly confirmDialog = inject(ConfirmDialogService);
  private readonly notifications = inject(NotificationService);

  readonly cutName = CASH_CUT_NAME;
  readonly formatCurrency = formatCurrency;
  readonly formatDifference = formatDifference;
  readonly formatTime = formatGuatemalaTime;

  readonly cashCounts = signal<Record<string, number>>(emptyCashCounts());
  readonly cashObservations = signal('');
  readonly observations = signal('');
  readonly banks = signal<BankRow[]>([]);
  readonly loadingBanks = signal(false);
  readonly banksFailed = signal(false);
  readonly isSaving = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly now = signal(new Date().toISOString());
  private readonly systemCash = signal(0);
  private readonly periodSignal = signal<CashCutPeriod | null>(null);

  /** Counted cash at the cut's start plus its Kardex movements — differs from the system cash by the inherited difference. */
  readonly expectedPhysical = computed(() => {
    const period = this.periodSignal();
    if (!period) {
      return 0;
    }
    return round2((period.openingPhysicalCash ?? 0) + (period.liveTotalIn ?? 0) - (period.liveTotalOut ?? 0));
  });
  readonly totalCounted = computed(() => cashCountsTotal(this.cashCounts()));
  readonly difference = computed(() => round2(this.totalCounted() - this.systemCash()));
  /** Same colour code as the Guayacán arqueo: green = cuadra, yellow = sobrante, red = faltante. */
  readonly status = computed<CuadreStatus>(() => {
    const difference = this.difference();
    return difference === 0 ? 'green' : difference > 0 ? 'yellow' : 'red';
  });
  readonly bankDifferenceTotal = computed(() =>
    round2(this.banks().reduce((sum, bank) => sum + ((bank.verified ?? bank.balance) - bank.balance), 0)),
  );
  readonly canSave = computed(
    () => !this.isSaving() && !this.loadingBanks() && !this.banksFailed() && this.banks().every((bank) => bank.verified !== null),
  );

  ngOnChanges(): void {
    if (!this.open || !this.period || this.isSaving()) {
      return;
    }
    this.systemCash.set(this.period.liveSystemCash ?? 0);
    this.periodSignal.set(this.period);
    this.cashCounts.set(emptyCashCounts());
    this.cashObservations.set('');
    this.observations.set('');
    this.errorMessage.set(null);
    this.now.set(new Date().toISOString());
    this.loadBanks();
  }

  loadBanks(): void {
    this.loadingBanks.set(true);
    this.banksFailed.set(false);
    this.service.getBankBalances().subscribe({
      next: (banks) => {
        // Pre-filled with the system balance; the user corrects any account that does not match.
        this.banks.set(banks.map((bank) => ({ ...bank, verified: bank.balance, observations: '' })));
        this.loadingBanks.set(false);
      },
      error: () => {
        this.loadingBanks.set(false);
        this.banksFailed.set(true);
      },
    });
  }

  onQuantityChange(change: { denomination: number; quantity: number }): void {
    this.cashCounts.update((counts) => ({ ...counts, [String(change.denomination)]: change.quantity }));
  }

  updateBank(bankId: string, patch: Partial<Pick<BankRow, 'verified' | 'observations'>>): void {
    this.banks.update((rows) => rows.map((row) => (row.bankId === bankId ? { ...row, ...patch } : row)));
  }

  bankDifference(bank: BankRow): number {
    return round2((bank.verified ?? bank.balance) - bank.balance);
  }

  async save(): Promise<void> {
    if (!this.period || !this.canSave()) {
      return;
    }
    const difference = this.difference();
    const confirmed = await this.confirmDialog.confirm({
      type: 'CLOSE',
      title: `Finalizar ${this.cutName[this.period.periodNumber].toLowerCase()}`,
      message:
        `Contado ${formatCurrency(this.totalCounted())} · sistema ${formatCurrency(this.systemCash())} · ` +
        `diferencia ${formatDifference(difference)}. El corte quedará FINALIZADO y no podrá modificarse.`,
    });
    if (!confirmed) {
      return;
    }
    this.isSaving.set(true);
    this.errorMessage.set(null);
    this.service
      .finishCut(this.period.id, {
        details: cashCountsToDetails(this.cashCounts(), { keepZero: false }),
        banks: this.banks().map((bank) => ({
          bankId: bank.bankId,
          verifiedBalance: bank.verified ?? bank.balance,
          observations: bank.observations.trim() || undefined,
        })),
        cashObservations: this.cashObservations().trim() || undefined,
        observations: this.observations().trim() || undefined,
      })
      .subscribe({
        next: (position) => {
          this.isSaving.set(false);
          this.notifications.success('Corte finalizado y guardado.');
          this.saved.emit(position);
        },
        error: (error: HttpErrorResponse) => {
          this.isSaving.set(false);
          this.errorMessage.set(extractErrorMessage(error, 'No se pudo finalizar el corte.'));
        },
      });
  }
}
