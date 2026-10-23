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
import { transactionBankImageUrl } from '../../../../../core/services/transaction-bank.service';
import { BankBalanceAmountComponent, ButtonComponent, IconComponent } from '../../../../../shared/ui';
import { BankFlyEffectComponent, FlyingMark } from '../bank-fly-effect/bank-fly-effect.component';

export interface BankPickerSelection {
  transactionBank: TransactionBank;
  account: Bank;
}

interface BankPickerOption {
  bank: TransactionBank;
  monogram: string;
  /** Logo subido en Sistema → Banco Agente; sin logo se muestran las iniciales. */
  imageUrl: string | null;
  /** Saldo actual de la cuenta que se afectará (suma si el banco tiene varias) — solo informativo. */
  balance: { value: number; specialAccount: Bank['specialAccount']; accountCount: number } | null;
  resolution: TransactionBankResolution;
}

const TITLES: Partial<Record<TransactionTypeBalanceEffect, string>> = {
  DEPOSITO: 'Selecciona el banco para depositar',
  RETIRO: 'Selecciona el banco para retirar',
  REINTEGRO: 'Selecciona el banco para el reintegro',
};

/** Duración de la animación de salida — debe coincidir con `bank-picker-out` en el SCSS. */
const CLOSE_ANIMATION_MS = 140;
/** Efecto de selección: el icono sale de la tarjeta, crece y "atraviesa" la pantalla — debe coincidir con `fly-through` en el SCSS. */
const SELECT_ANIMATION_MS = 950;


function round2(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

function prefersReducedMotion(): boolean {
  return typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
}

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
  imports: [BankBalanceAmountComponent, BankFlyEffectComponent, ButtonComponent, IconComponent],
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
  /** Mostrando el efecto de selección (antes de `closing`). */
  readonly picking = signal(false);
  /** Ningún clic/tecla cuenta mientras se ve el efecto o se cierra — evita selecciones o cierres dobles. */
  readonly busy = computed(() => this.closing() || this.picking());
  /** Banco/cuenta recién elegidos — dispara el efecto de selección mientras el modal se cierra. */
  readonly selectedBankId = signal<string | null>(null);
  readonly selectedAccountId = signal<string | null>(null);
  readonly flyingMark = signal<FlyingMark | null>(null);

  private closeTimer: ReturnType<typeof setTimeout> | null = null;
  private loggedProblems = false;

  readonly accountLabel = bankAccountLabel;
  readonly formatSigned = formatSignedBankBalance;

  readonly title = computed(() => TITLES[this.inputs().effect ?? 'DEPOSITO'] ?? 'Selecciona el banco');

  readonly options = computed<BankPickerOption[]>(() => {
    const { effect, banks, accounts } = this.inputs();
    return banks.map((bank) => {
      const resolution = resolveTransactionBankAccount(bank, accounts, effect);
      const resolved = resolution.status === 'ok' ? resolution.accounts : [];
      return {
        bank,
        monogram: transactionBankMonogram(bank),
        imageUrl: transactionBankImageUrl(bank),
        resolution,
        balance:
          resolved.length === 0
            ? null
            : {
                value: round2(resolved.reduce((sum, account) => sum + account.finalBalance, 0)),
                specialAccount: resolved.length === 1 ? resolved[0].specialAccount : null,
                accountCount: resolved.length,
              },
      };
    });
  });

  ngOnChanges(changes: SimpleChanges): void {
    this.inputs.set({ effect: this.effect, banks: this.transactionBanks, accounts: this.bankAccounts });

    if (changes['open'] && this.open) {
      this.closing.set(false);
      this.picking.set(false);
      this.pendingOption.set(null);
      this.selectedBankId.set(null);
      this.selectedAccountId.set(null);
      this.flyingMark.set(null);
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
    if (!this.open || this.busy()) {
      return;
    }
    if (this.pendingOption()) {
      this.pendingOption.set(null);
      return;
    }
    this.cancel();
  }

  choose(option: BankPickerOption, event?: Event): void {
    if (this.busy() || option.resolution.status !== 'ok') {
      return;
    }
    const accounts = option.resolution.accounts;
    if (accounts.length === 1) {
      this.selectedBankId.set(option.bank.id);
      this.launchMark(option, event);
      this.finish(option.bank, accounts[0]);
      return;
    }
    this.pendingOption.set(option);
  }

  chooseAccount(account: Bank, event?: Event): void {
    const option = this.pendingOption();
    if (option && !this.busy()) {
      this.selectedBankId.set(option.bank.id);
      this.selectedAccountId.set(account.id);
      this.launchMark(option, event);
      this.finish(option.bank, account);
    }
  }

  backToBanks(): void {
    this.pendingOption.set(null);
  }

  cancel(): void {
    if (this.busy()) {
      return;
    }
    this.closeThen(() => this.cancelled.emit());
  }

  pendingAccounts(): Bank[] {
    const resolution = this.pendingOption()?.resolution;
    return resolution?.status === 'ok' ? resolution.accounts : [];
  }

  /** Toma la posición real del icono pulsado y crea su copia voladora, que parte exactamente de ahí. */
  private launchMark(option: BankPickerOption, event?: Event): void {
    if (prefersReducedMotion() || typeof window === 'undefined') {
      return;
    }
    const mark = (event?.currentTarget as HTMLElement | null)?.querySelector<HTMLElement>('.bank-mark');
    if (!mark) {
      return;
    }
    const rect = mark.getBoundingClientRect();
    const size = rect.width;
    if (size <= 0) {
      return;
    }
    this.flyingMark.set({
      left: rect.left,
      top: rect.top,
      size,
      dx: window.innerWidth / 2 - (rect.left + size / 2),
      dy: window.innerHeight / 2 - (rect.top + size / 2),
      scale: (Math.hypot(window.innerWidth, window.innerHeight) / size) * 1.4,
      imageUrl: option.imageUrl,
      monogram: option.monogram,
    });
  }

  private finish(transactionBank: TransactionBank, account: Bank): void {
    if (this.busy()) {
      return;
    }
    // Deja ver el efecto de selección y luego cierra con la animación normal.
    this.closeThen(() => this.picked.emit({ transactionBank, account }), prefersReducedMotion() ? 0 : SELECT_ANIMATION_MS);
  }

  private closeThen(callback: () => void, holdMs = 0): void {
    if (holdMs > 0) {
      // `picking` bloquea nuevos clics mientras se ve el efecto; `closing` arranca la animación de salida después.
      this.picking.set(true);
      this.closeTimer = setTimeout(() => {
        this.picking.set(false);
        this.closeThen(callback);
      }, holdMs);
      return;
    }
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
