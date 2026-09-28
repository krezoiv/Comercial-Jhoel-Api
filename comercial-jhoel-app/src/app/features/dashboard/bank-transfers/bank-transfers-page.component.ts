import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Bank, BankTransfer, bankAccountLabel } from '../../../core/models';
import { AuthService } from '../../../core/services/auth.service';
import { BankService } from '../../../core/services/bank.service';
import { BankTransferService } from '../../../core/services/bank-transfer.service';
import { NotificationService } from '../../../core/services/notification.service';
import { formatSignedBankBalance } from '../../../core/utils/bank-balance.util';
import { extractErrorMessage } from '../../../core/utils/extract-error-message';
import { DecimalInputDirective } from '../../../shared/directives/decimal-input.directive';
import { BankBalanceAmountComponent, ButtonComponent, IconComponent, PageHeaderComponent } from '../../../shared/ui';
import { VoidConfirmModalComponent } from '../reports/bank-deposits/components/void-confirm-modal/void-confirm-modal.component';
import { BalanceCreditComponent } from './components/balance-credit/balance-credit.component';

/** Apartados de la página: A. transferencias entre cuentas (existente) · B. acreditar saldo (solo admin). */
export type BankTransfersTab = 'transfers' | 'credit';

function round2(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

/** Valor del selector "Cuenta destino" para el retiro de efectivo en banco (no es una cuenta). */
export const CASH_WITHDRAWAL_VALUE = '__retiro_efectivo__';

const BI_CLUB_SOURCE_RULE = 'BI Club Empresarial solo puede transferir a Banco Industrial.';

/**
 * Reglas de las cuentas especiales — espejo (solo UX) de
 * `register_bank_transfer`: BI Club solo recibe de Banco Industrial y, como
 * origen, solo traslada a Banco Industrial; Districol solo recibe de Banco
 * Agromercantil. El backend lo vuelve a validar.
 */
function destinationRuleError(source: Bank | null, destination: Bank | null): string | null {
  if (!source || !destination) return null;
  if (source.specialAccount === 'BI_CLUB' && destination.specialAccount !== 'BANCO_INDUSTRIAL') {
    return BI_CLUB_SOURCE_RULE;
  }
  if (destination.specialAccount === 'BI_CLUB' && source.specialAccount !== 'BANCO_INDUSTRIAL') {
    return 'Solo Banco Industrial puede transferir a BI Club Empresarial.';
  }
  if (destination.specialAccount === 'DISTRICOL' && source.specialAccount !== 'BANCO_AGROMERCANTIL') {
    return 'Solo Banco Agromercantil puede transferir a Districol.';
  }
  return null;
}

/** El retiro de efectivo en banco no se permite desde BI Club (solo traslada a Banco Industrial). */
function cashWithdrawalRuleError(source: Bank | null): string | null {
  return source?.specialAccount === 'BI_CLUB' ? BI_CLUB_SOURCE_RULE : null;
}

/**
 * Finanzas → Transferencias Bancarias. Traslada saldo entre dos cuentas
 * propias. La vista previa (saldos antes/después) y las validaciones son
 * solo UX: el backend vuelve a leer ambos saldos bajo lock y es quien
 * acepta o rechaza. Confirmación obligatoria antes de enviar; el modal no
 * se cierra al hacer clic fuera y el botón se bloquea mientras guarda
 * (sin doble envío).
 */
@Component({
  selector: 'app-bank-transfers-page',
  standalone: true,
  imports: [
    DatePipe,
    FormsModule,
    DecimalInputDirective,
    PageHeaderComponent,
    ButtonComponent,
    IconComponent,
    BankBalanceAmountComponent,
    VoidConfirmModalComponent,
    BalanceCreditComponent,
  ],
  templateUrl: './bank-transfers-page.component.html',
  styleUrl: './bank-transfers-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BankTransfersPageComponent {
  private readonly bankService = inject(BankService);
  private readonly bankTransferService = inject(BankTransferService);
  private readonly notificationService = inject(NotificationService);
  readonly isAdmin = inject(AuthService).isAdmin;

  readonly activeTab = signal<BankTransfersTab>('transfers');

  readonly accountLabel = bankAccountLabel;
  readonly formatSigned = formatSignedBankBalance;

  readonly accounts = signal<Bank[]>([]);
  readonly loadingAccounts = signal(true);
  readonly transfers = signal<BankTransfer[]>([]);
  readonly loadingTransfers = signal(true);

  readonly sourceId = signal('');
  readonly destinationId = signal('');
  readonly amount = signal<number | null>(null);
  readonly referenceText = signal('');
  readonly concept = signal('');

  readonly isConfirmOpen = signal(false);
  readonly isSaving = signal(false);
  readonly voidingTransferId = signal<string | null>(null);
  readonly isVoiding = signal(false);

  readonly source = computed(() => this.accounts().find((bank) => bank.id === this.sourceId()) ?? null);
  readonly cashWithdrawalValue = CASH_WITHDRAWAL_VALUE;
  /** "Retiro de efectivo en banco": solo disminuye el origen, no acredita a ninguna cuenta. */
  readonly isCashWithdrawal = computed(() => this.destinationId() === CASH_WITHDRAWAL_VALUE);
  readonly cashWithdrawalBlockedReason = computed(() => cashWithdrawalRuleError(this.source()));
  readonly destination = computed(() => this.accounts().find((bank) => bank.id === this.destinationId()) ?? null);

  /** Destinos posibles: cualquier otra cuenta; los especiales bloqueados por la regla de origen se muestran deshabilitados con el motivo. */
  readonly destinationOptions = computed(() =>
    this.accounts()
      .filter((bank) => bank.id !== this.sourceId())
      .map((bank) => ({ bank, blockedReason: destinationRuleError(this.source(), bank) })),
  );

  /** `destinationBefore/After` son `null` en un retiro de efectivo (no hay cuenta que reciba). */
  readonly preview = computed(() => {
    const source = this.source();
    const destination = this.destination();
    const cash = this.isCashWithdrawal();
    const amount = round2(this.amount() ?? 0);
    if (!source || (!destination && !cash) || amount <= 0) return null;
    return {
      amount,
      sourceBefore: source.finalBalance,
      sourceAfter: round2(source.finalBalance - amount),
      destinationBefore: destination ? destination.finalBalance : null,
      destinationAfter: destination ? round2(destination.finalBalance + amount) : null,
    };
  });

  readonly validationError = computed<string | null>(() => {
    const source = this.source();
    const destination = this.destination();
    const cash = this.isCashWithdrawal();
    const amount = this.amount();
    if (!source || (!destination && !cash)) return null;
    const ruleError = cash ? cashWithdrawalRuleError(source) : destinationRuleError(source, destination);
    if (ruleError) return ruleError;
    if (amount === null) return null;
    if (amount <= 0) return 'El monto debe ser mayor que cero.';
    if (round2(amount) > source.finalBalance) {
      return cash
        ? 'Saldo insuficiente para realizar el retiro de efectivo.'
        : 'Saldo insuficiente para realizar la transferencia.';
    }
    const preview = this.preview();
    if (
      destination &&
      preview?.destinationAfter != null &&
      destination.maxBalance !== null &&
      preview.destinationAfter > destination.maxBalance
    ) {
      return destination.specialAccount === 'BI_CLUB'
        ? `El saldo de BI Club Empresarial no puede superar el límite configurado de ${formatSignedBankBalance(destination.maxBalance)}.`
        : `El saldo de ${destination.name} no puede superar el límite configurado de ${formatSignedBankBalance(destination.maxBalance)}.`;
    }
    return null;
  });

  readonly canSubmit = computed(
    () => this.preview() !== null && this.validationError() === null && !this.isSaving(),
  );

  constructor() {
    this.loadAccounts();
    this.loadTransfers();
  }

  selectTab(tab: BankTransfersTab): void {
    if (tab === 'credit' && !this.isAdmin()) return;
    this.activeTab.set(tab);
  }

  /** "Acreditar saldo" cambió un saldo: se recargan las cuentas para que el formulario de transferencias no quede con saldos viejos. */
  onBalanceCredited(): void {
    this.loadAccounts();
  }

  onSourceChange(id: string): void {
    this.sourceId.set(id);
    const invalidCash = this.isCashWithdrawal() && cashWithdrawalRuleError(this.source()) !== null;
    if (this.destinationId() === id || invalidCash || destinationRuleError(this.source(), this.destination())) {
      this.destinationId.set('');
    }
  }

  onAmountChange(value: number | null): void {
    this.amount.set(value === null || Number.isNaN(value) ? null : value);
  }

  requestConfirm(): void {
    if (!this.canSubmit()) return;
    this.isConfirmOpen.set(true);
  }

  cancelConfirm(): void {
    if (this.isSaving()) return;
    this.isConfirmOpen.set(false);
  }

  confirmTransfer(): void {
    const preview = this.preview();
    if (!preview || this.isSaving()) return;
    this.isSaving.set(true);
    this.bankTransferService
      .registerTransfer({
        sourceBankId: this.sourceId(),
        ...(this.isCashWithdrawal() ? { cashWithdrawal: true } : { destinationBankId: this.destinationId() }),
        amount: preview.amount,
        ...(this.referenceText().trim() ? { referenceText: this.referenceText().trim() } : {}),
        ...(this.concept().trim() ? { concept: this.concept().trim() } : {}),
      })
      .subscribe({
        next: (transfer) => {
          this.isSaving.set(false);
          this.isConfirmOpen.set(false);
          this.notificationService.success(
            transfer.destination
              ? `Transferencia registrada. ${transfer.source.bankName}: ${formatSignedBankBalance(transfer.source.balanceAfter)} · ${transfer.destination.bankName}: ${formatSignedBankBalance(transfer.destination.balanceAfter)}.`
              : `Retiro de efectivo registrado. Nuevo saldo de ${transfer.source.bankName}: ${formatSignedBankBalance(transfer.source.balanceAfter)}.`,
          );
          this.resetForm();
          this.loadAccounts();
          this.loadTransfers();
        },
        error: (error: HttpErrorResponse) => {
          this.isSaving.set(false);
          this.isConfirmOpen.set(false);
          this.notificationService.error(extractErrorMessage(error, 'No se pudo registrar la transferencia.'));
          this.loadAccounts();
        },
      });
  }

  openVoid(transfer: BankTransfer): void {
    if (!this.isAdmin() || transfer.status === 'ANULADO') return;
    this.voidingTransferId.set(transfer.id);
  }

  cancelVoid(): void {
    if (this.isVoiding()) return;
    this.voidingTransferId.set(null);
  }

  confirmVoid(reason: string): void {
    const id = this.voidingTransferId();
    if (!id || this.isVoiding()) return;
    this.isVoiding.set(true);
    this.bankTransferService.voidTransfer(id, reason).subscribe({
      next: () => {
        this.isVoiding.set(false);
        this.voidingTransferId.set(null);
        this.notificationService.success('La transferencia fue anulada; los saldos se revirtieron con movimientos inversos.');
        this.loadAccounts();
        this.loadTransfers();
      },
      error: (error: HttpErrorResponse) => {
        this.isVoiding.set(false);
        this.notificationService.error(extractErrorMessage(error, 'No se pudo anular la transferencia.'));
      },
    });
  }

  private resetForm(): void {
    this.sourceId.set('');
    this.destinationId.set('');
    this.amount.set(null);
    this.referenceText.set('');
    this.concept.set('');
  }

  loadAccounts(): void {
    this.bankService.getBanks().subscribe({
      next: (banks) => {
        this.accounts.set(banks.filter((bank) => bank.isActive));
        this.loadingAccounts.set(false);
      },
      error: () => {
        this.loadingAccounts.set(false);
        this.notificationService.error('No se pudieron cargar las cuentas bancarias.');
      },
    });
  }

  private loadTransfers(): void {
    this.loadingTransfers.set(true);
    this.bankTransferService.getTransfers({ limit: 30 }).subscribe({
      next: (transfers) => {
        this.transfers.set(transfers);
        this.loadingTransfers.set(false);
      },
      error: () => {
        this.loadingTransfers.set(false);
        this.notificationService.error('No se pudieron cargar las transferencias recientes.');
      },
    });
  }
}
