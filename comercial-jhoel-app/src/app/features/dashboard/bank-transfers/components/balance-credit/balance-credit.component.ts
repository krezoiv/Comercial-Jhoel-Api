import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed, inject, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Bank, BankMovement, bankAccountLabel } from '../../../../../core/models';
import { BankService } from '../../../../../core/services/bank.service';
import { BankTransferService } from '../../../../../core/services/bank-transfer.service';
import { NotificationService } from '../../../../../core/services/notification.service';
import {
  balanceEffect,
  creditLineMovementError,
  formatSignedBankBalance,
  isCreditLineAccount,
} from '../../../../../core/utils/bank-balance.util';
import { extractErrorMessage } from '../../../../../core/utils/extract-error-message';
import { DecimalInputDirective } from '../../../../../shared/directives/decimal-input.directive';
import { BankBalanceAmountComponent, ButtonComponent, IconComponent } from '../../../../../shared/ui';
import { VoidConfirmModalComponent } from '../../../reports/bank-deposits/components/void-confirm-modal/void-confirm-modal.component';

function round2(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

const GENERIC_ERROR = 'No fue posible acreditar el saldo. Intenta nuevamente.';

/**
 * Finanzas → Transferencias Bancarias → "Acreditar saldo" (solo admin; el
 * backend lo exige con `@Roles`). Suma un monto al saldo de UNA cuenta, sin
 * contrapartida — distinto del Depósito de Transaccionar y de una
 * transferencia.
 *
 * - El saldo actual se consulta al backend (`GET /banks/:id`) al elegir la
 *   cuenta, nunca se toma del listado en memoria.
 * - "Nuevo saldo" = saldo actual + monto, con signo real (una cuenta en
 *   negativo se acerca a cero; nunca `Math.abs`). Es solo una vista previa:
 *   el backend recalcula bajo lock y devuelve el saldo definitivo.
 * - Confirmación obligatoria; el modal solo se cierra con Cancelar, la X o
 *   Confirmar, y el botón se bloquea mientras guarda (sin doble envío).
 */
@Component({
  selector: 'app-balance-credit',
  standalone: true,
  imports: [
    DatePipe,
    FormsModule,
    DecimalInputDirective,
    ButtonComponent,
    IconComponent,
    BankBalanceAmountComponent,
    VoidConfirmModalComponent,
  ],
  templateUrl: './balance-credit.component.html',
  styleUrl: './balance-credit.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BalanceCreditComponent {
  /** Cuentas activas del catálogo existente (las carga la página). */
  readonly accounts = input.required<Bank[]>();
  readonly loadingAccounts = input(false);
  /** Tras una acreditación o anulación exitosa — la página recarga sus saldos. */
  readonly balanceChanged = output<void>();

  private readonly bankService = inject(BankService);
  private readonly bankTransferService = inject(BankTransferService);
  private readonly notificationService = inject(NotificationService);

  readonly accountLabel = bankAccountLabel;
  readonly formatSigned = formatSignedBankBalance;

  readonly bankId = signal('');
  /** La cuenta tal como la devolvió el backend al seleccionarla (saldo real). */
  readonly account = signal<Bank | null>(null);
  readonly loadingBalance = signal(false);
  readonly amount = signal<number | null>(null);
  readonly referenceText = signal('');
  readonly observation = signal('');

  readonly isConfirmOpen = signal(false);
  readonly isSaving = signal(false);

  readonly credits = signal<BankMovement[]>([]);
  readonly loadingCredits = signal(true);
  readonly voidingOperationId = signal<string | null>(null);
  readonly isVoiding = signal(false);

  readonly preview = computed(() => {
    const account = this.account();
    const amount = this.amount();
    if (!account || amount === null || amount <= 0) return null;
    const rounded = round2(amount);
    // BI Club (saldo = −disponible): acreditar repone disponible, su saldo baja.
    return {
      amount: rounded,
      before: account.finalBalance,
      after: round2(account.finalBalance + balanceEffect(account.specialAccount, rounded)),
    };
  });

  readonly validationError = computed<string | null>(() => {
    const amount = this.amount();
    if (amount === null) return null;
    if (amount <= 0) return 'El monto a acreditar debe ser mayor que cero.';
    const account = this.account();
    const preview = this.preview();
    if (account && preview && isCreditLineAccount(account.specialAccount)) {
      return creditLineMovementError(preview.before, round2(preview.after - preview.before), account.maxBalance);
    }
    if (account && preview && account.maxBalance !== null && preview.after > account.maxBalance) {
      return `El saldo de ${account.name} no puede superar el límite configurado de ${formatSignedBankBalance(account.maxBalance)}.`;
    }
    return null;
  });

  readonly canSubmit = computed(
    () => this.preview() !== null && this.validationError() === null && !this.loadingBalance() && !this.isSaving(),
  );

  constructor() {
    this.loadCredits();
  }

  onAccountChange(id: string): void {
    this.bankId.set(id);
    this.account.set(null);
    if (!id) return;
    this.fetchLiveBalance(id);
  }

  onAmountChange(value: number | null): void {
    this.amount.set(value === null || Number.isNaN(value) ? null : value);
  }

  clearForm(): void {
    this.bankId.set('');
    this.account.set(null);
    this.amount.set(null);
    this.referenceText.set('');
    this.observation.set('');
  }

  requestConfirm(): void {
    if (!this.canSubmit()) return;
    this.isConfirmOpen.set(true);
  }

  cancelConfirm(): void {
    if (this.isSaving()) return;
    this.isConfirmOpen.set(false);
  }

  confirmCredit(): void {
    const preview = this.preview();
    const account = this.account();
    if (!preview || !account || this.isSaving()) return;
    this.isSaving.set(true);
    this.bankTransferService
      .registerBalanceCredit({
        bankId: account.id,
        amount: preview.amount,
        ...(this.referenceText().trim() ? { referenceText: this.referenceText().trim() } : {}),
        ...(this.observation().trim() ? { observation: this.observation().trim() } : {}),
      })
      .subscribe({
        next: (movement) => {
          this.isSaving.set(false);
          this.isConfirmOpen.set(false);
          this.notificationService.success(
            `Saldo acreditado correctamente. ${formatSignedBankBalance(movement.amount)} acreditados a ${movement.bankName} · ${movement.accountNumber}. Nuevo saldo: ${formatSignedBankBalance(movement.balanceAfter)}.`,
          );
          this.amount.set(null);
          this.referenceText.set('');
          this.observation.set('');
          // El saldo definitivo es el que devolvió el backend; se vuelve a leer por si hubo otras operaciones.
          this.account.update((current) => (current ? { ...current, finalBalance: movement.balanceAfter } : current));
          this.fetchLiveBalance(movement.bankId);
          this.loadCredits();
          this.balanceChanged.emit();
        },
        error: (error: HttpErrorResponse) => {
          this.isSaving.set(false);
          this.isConfirmOpen.set(false);
          this.notificationService.error(this.friendlyError(error));
          this.fetchLiveBalance(account.id);
        },
      });
  }

  openVoid(credit: BankMovement): void {
    if (credit.status === 'ANULADO' || !credit.referenceId) return;
    this.voidingOperationId.set(credit.referenceId);
  }

  cancelVoid(): void {
    if (this.isVoiding()) return;
    this.voidingOperationId.set(null);
  }

  confirmVoid(reason: string): void {
    const operationId = this.voidingOperationId();
    if (!operationId || this.isVoiding()) return;
    this.isVoiding.set(true);
    this.bankTransferService.voidBalanceCredit(operationId, reason).subscribe({
      next: (credit) => {
        this.isVoiding.set(false);
        this.voidingOperationId.set(null);
        this.notificationService.success(
          `Acreditación anulada: se registró el movimiento inverso de ${formatSignedBankBalance(-credit.amount)} en ${credit.bankName}.`,
        );
        if (this.bankId() === credit.bankId) {
          this.fetchLiveBalance(credit.bankId);
        }
        this.loadCredits();
        this.balanceChanged.emit();
      },
      error: (error: HttpErrorResponse) => {
        this.isVoiding.set(false);
        this.notificationService.error(
          error.status >= 500 || error.status === 0
            ? 'No fue posible anular la acreditación. Intenta nuevamente.'
            : extractErrorMessage(error, 'No fue posible anular la acreditación. Intenta nuevamente.'),
        );
      },
    });
  }

  /** Mensajes de negocio del backend tal cual (ya son amigables); un error técnico nunca se muestra. */
  private friendlyError(error: HttpErrorResponse): string {
    if (error.status >= 500 || error.status === 0) {
      console.error('[Acreditar saldo]', error);
      return GENERIC_ERROR;
    }
    return extractErrorMessage(error, GENERIC_ERROR);
  }

  /** Saldo REAL desde el backend. Si el usuario cambió de cuenta mientras cargaba, la respuesta vieja se descarta. */
  private fetchLiveBalance(id: string): void {
    this.loadingBalance.set(true);
    this.bankService.getBankById(id).subscribe({
      next: (bank) => {
        if (this.bankId() !== id) return;
        this.account.set(bank);
        this.loadingBalance.set(false);
      },
      error: () => {
        if (this.bankId() !== id) return;
        this.loadingBalance.set(false);
        this.notificationService.error('No se pudo consultar el saldo actual de la cuenta.');
      },
    });
  }

  private loadCredits(): void {
    this.loadingCredits.set(true);
    this.bankTransferService.getBalanceCredits({ limit: 10 }).subscribe({
      next: (page) => {
        this.credits.set(page.items);
        this.loadingCredits.set(false);
      },
      error: () => {
        this.loadingCredits.set(false);
        this.notificationService.error('No se pudieron cargar las acreditaciones recientes.');
      },
    });
  }
}
