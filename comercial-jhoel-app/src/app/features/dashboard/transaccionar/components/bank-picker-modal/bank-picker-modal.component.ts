import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
  computed,
  signal,
  viewChild,
} from '@angular/core';

import { Bank, TransactionBank, TransactionTypeBalanceEffect, bankAccountLabel } from '../../../../../core/models';
import {
  TransactionBankResolution,
  resolveTransactionBankAccount,
  transactionBankMonogram,
} from '../../../../../core/utils/transaction-bank-account.util';
import { formatSignedBankBalance } from '../../../../../core/utils/bank-balance.util';
import { ButtonComponent, IconComponent } from '../../../../../shared/ui';

export interface BankPickerSelection {
  transactionBank: TransactionBank;
  account: Bank;
}

interface BankPickerOption {
  bank: TransactionBank;
  monogram: string;
  resolution: TransactionBankResolution;
}

const TITLES: Partial<Record<TransactionTypeBalanceEffect, string>> = {
  DEPOSITO: 'Selecciona el banco para depositar',
  RETIRO: 'Selecciona el banco para retirar',
  REINTEGRO: 'Selecciona el banco para el reintegro',
};

/** Duración de la animación de salida — debe coincidir con `bank-picker-out` en el SCSS. */
const CLOSE_ANIMATION_MS = 140;

/**
 * Paso previo de Depósito / Retiro / Reintegro: elegir el banco por su icono.
 * La cuenta afectada la resuelve `resolveTransactionBankAccount()` (mapeo
 * único) — si un banco tiene varias cuentas habilitadas (p. ej. GTC) se elige
 * cuál aquí mismo, nunca se toma una por defecto. Dumb: solo emite la
 * selección; el padre arranca el formulario. Cerrar/cancelar no inicia nada.
 */
@Component({
  selector: 'app-bank-picker-modal',
  standalone: true,
  imports: [ButtonComponent, IconComponent],
  templateUrl: './bank-picker-modal.component.html',
  styleUrl: './bank-picker-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BankPickerModalComponent implements OnChanges, OnDestroy {
  @Input() open = false;
  @Input() effect: TransactionTypeBalanceEffect | null = null;
  @Input() operationName = '';
  @Input() transactionBanks: TransactionBank[] = [];
  @Input() bankAccounts: Bank[] = [];
  @Input() loading = false;
  /** Banco agente ya elegido (al usar "Cambiar banco" desde el formulario) — solo para resaltarlo. */
  @Input() currentBankId: string | null = null;

  @Output() picked = new EventEmitter<BankPickerSelection>();
  @Output() cancelled = new EventEmitter<void>();

  private readonly dialog = viewChild<ElementRef<HTMLElement>>('dialog');

  private readonly inputs = signal<{
    effect: TransactionTypeBalanceEffect | null;
    banks: TransactionBank[];
    accounts: Bank[];
  }>({ effect: null, banks: [], accounts: [] });

  /** Banco con varias cuentas a la espera de que se elija una. */
  readonly pendingOption = signal<BankPickerOption | null>(null);
  readonly closing = signal(false);

  private closeTimer: ReturnType<typeof setTimeout> | null = null;
  private loggedProblems = false;

  readonly accountLabel = bankAccountLabel;
  readonly formatSigned = formatSignedBankBalance;

  readonly title = computed(() => TITLES[this.inputs().effect ?? 'DEPOSITO'] ?? 'Selecciona el banco');

  readonly options = computed<BankPickerOption[]>(() => {
    const { effect, banks, accounts } = this.inputs();
    return banks.map((bank) => ({
      bank,
      monogram: transactionBankMonogram(bank),
      resolution: resolveTransactionBankAccount(bank, accounts, effect),
    }));
  });

  ngOnChanges(changes: SimpleChanges): void {
    this.inputs.set({ effect: this.effect, banks: this.transactionBanks, accounts: this.bankAccounts });

    if (changes['open'] && this.open) {
      this.closing.set(false);
      this.pendingOption.set(null);
      this.loggedProblems = false;
      queueMicrotask(() => this.dialog()?.nativeElement.focus());
    }

    if (this.open && !this.loading && !this.loggedProblems && this.transactionBanks.length > 0) {
      this.logProblems();
    }
  }

  ngOnDestroy(): void {
    if (this.closeTimer) {
      clearTimeout(this.closeTimer);
    }
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (!this.open || this.closing()) {
      return;
    }
    if (this.pendingOption()) {
      this.pendingOption.set(null);
      return;
    }
    this.cancel();
  }

  choose(option: BankPickerOption): void {
    if (this.closing() || option.resolution.status !== 'ok') {
      return;
    }
    const accounts = option.resolution.accounts;
    if (accounts.length === 1) {
      this.finish(option.bank, accounts[0]);
      return;
    }
    this.pendingOption.set(option);
  }

  chooseAccount(account: Bank): void {
    const option = this.pendingOption();
    if (option) {
      this.finish(option.bank, account);
    }
  }

  backToBanks(): void {
    this.pendingOption.set(null);
  }

  cancel(): void {
    if (this.closing()) {
      return;
    }
    this.closeThen(() => this.cancelled.emit());
  }

  pendingAccounts(): Bank[] {
    const resolution = this.pendingOption()?.resolution;
    return resolution?.status === 'ok' ? resolution.accounts : [];
  }

  private finish(transactionBank: TransactionBank, account: Bank): void {
    if (this.closing()) {
      return;
    }
    this.closeThen(() => this.picked.emit({ transactionBank, account }));
  }

  private closeThen(callback: () => void): void {
    this.closing.set(true);
    this.closeTimer = setTimeout(() => {
      this.closeTimer = null;
      callback();
    }, CLOSE_ANIMATION_MS);
  }

  /** Diagnóstico: un banco sin cuenta correspondiente queda deshabilitado en pantalla y se reporta aquí. */
  private logProblems(): void {
    this.loggedProblems = true;
    const problems = this.options().filter((option) => option.resolution.status !== 'ok');
    if (problems.length > 0) {
      console.warn(
        '[Transaccionar] Bancos sin cuenta afectada válida:',
        problems.map((option) => ({
          bancoAgente: option.bank.name,
          bancoAgenteId: option.bank.id,
          operacion: this.effect,
          estado: option.resolution.status,
          detalle: 'message' in option.resolution ? option.resolution.message : '',
        })),
      );
    }
  }
}
