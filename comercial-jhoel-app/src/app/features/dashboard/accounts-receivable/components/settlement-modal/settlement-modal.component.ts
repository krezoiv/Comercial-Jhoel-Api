import { HttpErrorResponse } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  computed,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, debounceTime, of, switchMap, catchError, map } from 'rxjs';

import {
  CashBankBalance,
  SETTLEMENT_METHOD_LABEL,
  SettlementPaymentMethod,
  SettlementPreview,
  SettlementPreviewInput,
  SettlementResult,
  formatCurrency,
} from '../../../../../core/models';
import { AccountReceivablePaymentService } from '../../../../../core/services/account-receivable-payment.service';
import { CashControlService } from '../../../../../core/services/cash-control.service';
import { NotificationService } from '../../../../../core/services/notification.service';
import { extractErrorMessage } from '../../../../../core/utils/extract-error-message';
import { DecimalInputDirective } from '../../../../../shared/directives/decimal-input.directive';
import { ButtonComponent, IconComponent } from '../../../../../shared/ui';

type Step = 'form' | 'confirm';

/** Short, stable identifier of an account for the summary ("A1B2C3D4"). */
export function accountCode(id: string): string {
  return id.slice(0, 8).toUpperCase();
}

/**
 * "Cancelar cuenta(s) por cobrar": one modal for a single account (partial
 * amount allowed) or several accounts of the SAME client (each one for its
 * full pending). Step 1 shows every account with its pending and asks how the
 * money was received (cash or bank deposit + account, reference, notes);
 * step 2 is the explicit final confirmation. Every figure — pendings, total,
 * resulting cash / bank balance — comes from the backend preview; nothing is
 * recomputed here. The backdrop never closes it, the confirm button is
 * disabled while saving, and one `clientRequestId` per opening makes a double
 * click or a retry return the same operation.
 */
@Component({
  selector: 'app-settlement-modal',
  standalone: true,
  imports: [DatePipe, FormsModule, ButtonComponent, IconComponent, DecimalInputDirective],
  templateUrl: './settlement-modal.component.html',
  styleUrl: './settlement-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettlementModalComponent implements OnChanges {
  @Input() open = false;
  @Input() clientId: string | null = null;
  @Input() clientName = '';
  /** Selected accounts (CARGO ids) — all of `clientId`. */
  @Input() accountIds: string[] = [];

  @Output() closed = new EventEmitter<void>();
  @Output() saved = new EventEmitter<SettlementResult>();

  private readonly service = inject(AccountReceivablePaymentService);
  private readonly cashService = inject(CashControlService);
  private readonly notifications = inject(NotificationService);

  readonly formatCurrency = formatCurrency;
  readonly accountCode = accountCode;
  readonly methodLabel = SETTLEMENT_METHOD_LABEL;

  readonly step = signal<Step>('form');
  readonly method = signal<SettlementPaymentMethod | null>(null);
  readonly banks = signal<CashBankBalance[]>([]);
  readonly banksFailed = signal(false);
  readonly bankId = signal('');
  readonly referenceNumber = signal('');
  readonly observations = signal('');
  /** Single account only: amount received (null = full pending). */
  readonly partialAmount = signal<number | null>(null);

  readonly preview = signal<SettlementPreview | null>(null);
  readonly loadingPreview = signal(false);
  readonly previewError = signal<string | null>(null);
  readonly isSaving = signal(false);
  readonly errorMessage = signal<string | null>(null);

  private requestId = crypto.randomUUID();
  private readonly previewRequests = new Subject<SettlementPreviewInput | null>();

  /** Snapshot of `accountIds` taken when the modal opens (inputs are not signals). */
  private readonly accountIdsSignal = signal<string[]>([]);
  readonly isSingle = computed(() => this.accountIdsSignal().length === 1);
  readonly selectedBank = computed(() => this.banks().find((bank) => bank.bankId === this.bankId()) ?? null);
  readonly singlePending = computed(() => this.preview()?.lines[0]?.pendingAmount ?? 0);
  readonly partialInvalid = computed(() => {
    const amount = this.partialAmount();
    return amount !== null && (amount <= 0 || amount > this.singlePending());
  });
  readonly canContinue = computed(
    () =>
      !this.loadingPreview() &&
      !!this.preview() &&
      !this.previewError() &&
      this.method() !== null &&
      (this.method() === 'EFECTIVO' || !!this.selectedBank()) &&
      !this.partialInvalid(),
  );

  constructor() {
    this.previewRequests
      .pipe(
        debounceTime(250),
        switchMap((input) => {
          if (!input) {
            return of(null);
          }
          this.loadingPreview.set(true);
          return this.service.preview(input).pipe(
            map((preview) => ({ preview, error: null as string | null })),
            catchError((error: HttpErrorResponse) =>
              of({ preview: null, error: extractErrorMessage(error, 'No se pudo calcular el resumen.') }),
            ),
          );
        }),
        takeUntilDestroyed(inject(DestroyRef)),
      )
      .subscribe((result) => {
        this.loadingPreview.set(false);
        if (!result) {
          return;
        }
        this.preview.set(result.preview);
        this.previewError.set(result.error);
      });
  }

  ngOnChanges(): void {
    if (this.open && !this.isSaving()) {
      this.accountIdsSignal.set([...this.accountIds]);
      this.step.set('form');
      this.method.set(null);
      this.bankId.set('');
      this.referenceNumber.set('');
      this.observations.set('');
      this.partialAmount.set(null);
      this.preview.set(null);
      this.previewError.set(null);
      this.errorMessage.set(null);
      this.requestId = crypto.randomUUID();
      this.loadBanks();
      this.refreshPreview();
    }
  }

  loadBanks(): void {
    this.banksFailed.set(false);
    this.cashService.getBankBalances().subscribe({
      next: (banks) => this.banks.set(banks.filter((bank) => bank.specialAccount !== 'GUAYACAN')),
      error: () => this.banksFailed.set(true),
    });
  }

  selectMethod(method: SettlementPaymentMethod): void {
    this.method.set(method);
    this.refreshPreview();
  }

  onBankChange(bankId: string): void {
    this.bankId.set(bankId);
    this.refreshPreview();
  }

  onPartialChange(value: number | null): void {
    this.partialAmount.set(value || null);
    if (!this.partialInvalid()) {
      this.refreshPreview();
    }
  }

  /** Re-reads pendings / total / resulting balance from the backend. */
  refreshPreview(): void {
    if (!this.clientId || this.accountIdsSignal().length === 0) {
      this.previewRequests.next(null);
      return;
    }
    const method = this.method() ?? 'EFECTIVO';
    if (method === 'DEPOSITO_BANCARIO' && !this.bankId()) {
      // Keep the lines visible; the bank side appears once an account is chosen.
      this.previewRequests.next({ clientId: this.clientId, items: this.items(), paymentMethod: 'EFECTIVO' });
      return;
    }
    this.previewRequests.next({
      clientId: this.clientId,
      items: this.items(),
      paymentMethod: method,
      bankId: method === 'DEPOSITO_BANCARIO' ? this.bankId() : undefined,
    });
  }

  private items() {
    const ids = this.accountIdsSignal();
    const partial = this.partialAmount();
    return ids.map((accountReceivableId) =>
      ids.length === 1 && partial !== null ? { accountReceivableId, amount: partial } : { accountReceivableId },
    );
  }

  /** The preview matches the chosen method (a bank deposit needs its bank side). */
  readonly previewReady = computed(() => {
    const preview = this.preview();
    if (!preview || this.method() === null) {
      return false;
    }
    return this.method() === 'EFECTIVO' ? preview.cash !== null : preview.bank !== null;
  });

  goToConfirm(): void {
    if (this.canContinue() && this.previewReady()) {
      this.errorMessage.set(null);
      this.step.set('confirm');
    }
  }

  back(): void {
    if (!this.isSaving()) {
      this.step.set('form');
    }
  }

  cancel(): void {
    if (!this.isSaving()) {
      this.closed.emit();
    }
  }

  confirm(): void {
    const preview = this.preview();
    const method = this.method();
    if (!preview || !method || !this.clientId || this.isSaving()) {
      return;
    }
    this.isSaving.set(true);
    this.errorMessage.set(null);
    this.service
      .settle({
        clientId: this.clientId,
        items: this.items(),
        paymentMethod: method,
        bankId: method === 'DEPOSITO_BANCARIO' ? this.bankId() : undefined,
        referenceNumber: method === 'DEPOSITO_BANCARIO' ? this.referenceNumber().trim() || undefined : undefined,
        observations: this.observations().trim() || undefined,
        expectedTotal: preview.total,
        clientRequestId: this.requestId,
      })
      .subscribe({
        next: (result) => {
          this.isSaving.set(false);
          const op = result.operation;
          this.notifications.success(
            op.paymentMethod === 'EFECTIVO'
              ? `Cobro registrado (${formatCurrency(op.totalAmount)}). Efectivo disponible: ${formatCurrency(result.cashBalance)}.`
              : `Cobro registrado en ${op.bankName}. Nuevo saldo: ${formatCurrency(op.bankBalanceAfter ?? 0)}.`,
          );
          this.saved.emit(result);
        },
        error: (error: HttpErrorResponse) => {
          this.isSaving.set(false);
          this.errorMessage.set(extractErrorMessage(error, 'No se pudo registrar el cobro.'));
          if (error.status === 409) {
            // Pendings changed meanwhile: show the fresh numbers before trying again.
            this.step.set('form');
            this.refreshPreview();
          }
        },
      });
  }
}
