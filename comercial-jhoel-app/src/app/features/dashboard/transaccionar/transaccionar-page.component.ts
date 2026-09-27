import { DatePipe, TitleCasePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { catchError, of } from 'rxjs';

import {
  Bank,
  BankDepositTransactionSummary,
  Client,
  TransactionBank,
  TransactionType,
  balanceEffectDirection,
  bankAccountLabel,
} from '../../../core/models';
import { BankService } from '../../../core/services/bank.service';
import { formatSignedBankBalance } from '../../../core/utils/bank-balance.util';
import { AuthService } from '../../../core/services/auth.service';
import { BankDepositDraftStore } from '../../../core/services/bank-deposit-draft.store';
import { BankDepositService } from '../../../core/services/bank-deposit.service';
import { ConfirmDialogService } from '../../../core/services/confirm-dialog.service';
import { NotificationService } from '../../../core/services/notification.service';
import { TransactionBankService } from '../../../core/services/transaction-bank.service';
import { TransactionTypeService } from '../../../core/services/transaction-type.service';
import { extractErrorMessage } from '../../../core/utils/extract-error-message';
import { DecimalInputDirective } from '../../../shared/directives/decimal-input.directive';
import {
  BankBalanceAmountComponent,
  BankBalanceStripComponent,
  ButtonComponent,
  IconComponent,
  PageHeaderComponent,
  TransactionMonthlyChartComponent,
} from '../../../shared/ui';
import { ClientSearchSelectComponent } from '../accounts-receivable/components/client-search-select/client-search-select.component';
import { CashBreakdownTableComponent } from './components/cash-breakdown-table/cash-breakdown-table.component';
import { SaveConfirmModalComponent } from './components/save-confirm-modal/save-confirm-modal.component';
import { StatusIndicatorComponent } from './components/status-indicator/status-indicator.component';
import { TransactionDistributionComponent } from './components/transaction-distribution/transaction-distribution.component';
import { TransactionSummaryCardComponent } from './components/transaction-summary-card/transaction-summary-card.component';
import { CommissionSummaryCardComponent } from './components/commission-summary-card/commission-summary-card.component';
import { CuadreResultCardComponent } from './components/cuadre-result-card/cuadre-result-card.component';
import { ChangeConfirmModalComponent } from './components/change-confirm-modal/change-confirm-modal.component';

type TransaccionarView = 'dashboard' | 'form';

function round2(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

/** Normaliza para comparar nombres de banco agente vs. cuenta (sin acentos/mayúsculas). */
function normalizeName(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

const INSUFFICIENT_MESSAGES: Record<string, string> = {
  DEPOSITO: 'Saldo insuficiente para realizar el depósito.',
  REINTEGRO: 'Saldo insuficiente para realizar el reintegro.',
};

/** Same accepted-hardcoded-name pattern this app already uses for a handful of business rules tied to one specific catalog row (e.g. Recargas' `KNOWN_RECHARGE_TYPE_NAMES`) — the backend independently re-validates this exact rule (`RegisterBankDepositOperationUseCase`'s own `DEPOSIT_TRANSACTION_TYPE_NAME`), this is only a proactive UX echo so the checkbox never renders for the wrong type. */
const DEPOSIT_TRANSACTION_TYPE_NAME = 'Depósito';

/**
 * "Transaccionar" — a two-step flow. Step one is a dashboard of cards, one
 * per active "Tipo de Transacción" (Depósito, Retiro, Desembolso Préstamo,
 * Pago Cheque, ...), managed under Sistema. Picking one moves to step two:
 * the actual registration form (banco agente, monto, desglose de efectivo,
 * distribución de transacciones — unchanged from before this ticket, just
 * now tagged with the chosen type). Saving successfully — or explicitly
 * changing the type mid-form — resets the module straight back to the
 * dashboard, never leaving the just-used form sitting on screen.
 *
 * The draft (`BankDepositDraftStore`) survives navigation the same way
 * `PurchaseDraftStore` does for Compras — nothing is sent to the backend
 * until "Confirmar y Guardar", and the currently selected type is itself
 * part of that same persisted draft, so a reload mid-form resumes on the
 * form (not the dashboard) with everything intact.
 */
@Component({
  selector: 'app-transaccionar-page',
  standalone: true,
  imports: [
    DatePipe,
    TitleCasePipe,
    FormsModule,
    DecimalInputDirective,
    ButtonComponent,
    IconComponent,
    PageHeaderComponent,
    TransactionMonthlyChartComponent,
    CashBreakdownTableComponent,
    TransactionDistributionComponent,
    StatusIndicatorComponent,
    SaveConfirmModalComponent,
    TransactionSummaryCardComponent,
    CommissionSummaryCardComponent,
    CuadreResultCardComponent,
    ChangeConfirmModalComponent,
    ClientSearchSelectComponent,
    BankBalanceAmountComponent,
    BankBalanceStripComponent,
  ],
  templateUrl: './transaccionar-page.component.html',
  styleUrl: './transaccionar-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransaccionarPageComponent {
  private readonly transactionBankService = inject(TransactionBankService);
  private readonly transactionTypeService = inject(TransactionTypeService);
  private readonly bankDepositService = inject(BankDepositService);
  private readonly confirmDialogService = inject(ConfirmDialogService);
  private readonly notificationService = inject(NotificationService);
  private readonly authService = inject(AuthService);
  private readonly bankService = inject(BankService);

  readonly draft = inject(BankDepositDraftStore);
  readonly isAdmin = this.authService.isAdmin;

  readonly transactionBanks = signal<TransactionBank[]>([]);
  readonly loadingBanks = signal(true);

  readonly transactionTypes = signal<TransactionType[]>([]);
  readonly loadingTypes = signal(true);

  /** Cuentas bancarias activas con su SALDO ACTUAL (backend) — para elegir la cuenta afectada y la vista previa del saldo. */
  readonly bankAccounts = signal<Bank[]>([]);
  readonly loadingAccounts = signal(true);

  readonly accountLabel = bankAccountLabel;
  readonly formatSigned = formatSignedBankBalance;

  /**
   * Solo las cuentas marcadas "En Transaccionar" en Sistema → Bancos (el
   * backend rechaza cualquier otra), primero las cuyo nombre coincide con el
   * banco agente elegido.
   */
  readonly selectableAccounts = computed(() => {
    const agentName = normalizeName(this.selectedBankName());
    const matches = (bank: Bank) =>
      agentName !== '' && (normalizeName(bank.name).includes(agentName) || agentName.includes(normalizeName(bank.name)));
    return this.bankAccounts()
      .filter((bank) => bank.availableInTransaccionar)
      .sort((a, b) => Number(matches(b)) - Number(matches(a)) || a.name.localeCompare(b.name));
  });

  readonly genesisAccount = computed(() => this.bankAccounts().find((bank) => bank.specialAccount === 'GENESIS') ?? null);

  /** La cuenta cuyo saldo moverá la operación: Génesis (automática) o la elegida. */
  readonly affectedAccount = computed<Bank | null>(() => {
    if (this.draft.isGenesisType()) {
      return this.genesisAccount();
    }
    if (!this.draft.needsBankAccount()) {
      return null;
    }
    return this.selectableAccounts().find((bank) => bank.id === this.draft.bankAccountId()) ?? null;
  });

  /** Vista previa: saldo actual → saldo después, por el MONTO APLICADO (no el efectivo recibido). Informativa — el backend recalcula bajo lock. */
  readonly balancePreview = computed(() => {
    const account = this.affectedAccount();
    const direction = balanceEffectDirection(this.draft.transactionTypeBalanceEffect());
    if (!account || direction === 0) {
      return null;
    }
    const amount = round2(this.draft.totalAmount());
    return { before: account.finalBalance, after: round2(account.finalBalance + direction * amount), amount };
  });

  /** Validación de UX — espejo de las reglas del backend (que es quien realmente las hace cumplir). */
  readonly balanceError = computed<string | null>(() => {
    const effect = this.draft.transactionTypeBalanceEffect();
    if (this.draft.isGenesisType() && !this.loadingAccounts() && !this.genesisAccount()) {
      return 'No hay una cuenta configurada como línea de crédito de Fundación Génesis Empresarial (Sistema → Bancos).';
    }
    const account = this.affectedAccount();
    const preview = this.balancePreview();
    if (!account || !preview || preview.amount <= 0) {
      return null;
    }
    if (preview.after < 0 && preview.after < preview.before && account.specialAccount !== 'GENESIS') {
      return INSUFFICIENT_MESSAGES[effect ?? ''] ?? 'Saldo insuficiente para realizar la operación.';
    }
    if (preview.after > preview.before && account.maxBalance !== null && preview.after > account.maxBalance) {
      return effect === 'PAGO_GENESIS'
        ? `El pago excede el límite máximo permitido de ${formatSignedBankBalance(account.maxBalance)} para la línea de crédito de Fundación Génesis Empresarial.`
        : `El saldo de ${account.name} no puede superar el límite configurado de ${formatSignedBankBalance(account.maxBalance)}.`;
    }
    return null;
  });

  readonly canSubmit = computed(() => this.draft.canSave() && this.balanceError() === null);

  readonly formSubtitle = computed(() => {
    if (this.draft.isGenesisType()) {
      return 'Línea de crédito de Fundación Génesis Empresarial — la cuenta se selecciona automáticamente.';
    }
    return 'Registra la operación: banco agente, cuenta afectada, monto, desglose de efectivo y las transacciones en que se reparte.';
  });

  /** `GET /bank-deposits/summary` — the same call the Resumen dashboard's own "Resumen Diario de Transacciones" section reads, see `BankDepositService.getTransactionSummary()`'s own doc comment. Fetched once when the dashboard view mounts; a transient failure just leaves both cards showing zero rather than breaking this screen. */
  readonly transactionSummary = signal<BankDepositTransactionSummary | null>(null);
  readonly loadingSummary = signal(true);
  /** Purely a display label ("Septiembre 2026") — never used for any filtering, that's entirely server-side. */
  readonly currentMonthDate = new Date();

  /** Resumes straight on the form if a type was already selected (e.g. after a reload mid-draft) — never re-shows the dashboard out from under an in-progress operation. */
  readonly view = signal<TransaccionarView>(this.draft.transactionTypeId() ? 'form' : 'dashboard');

  readonly isSaving = signal(false);
  readonly isConfirmOpen = signal(false);

  /** State for "Confirmar Vuelto" — `pendingChangeAmount` is captured at the moment "Confirmar vuelto" is clicked (the card's own `excessAmount` at that instant), never re-read from the store inside the modal, so what the modal displays and what gets confirmed can never drift apart even if the draft changes in the background. */
  readonly isChangeConfirmOpen = signal(false);
  readonly pendingChangeAmount = signal(0);

  readonly selectedBankName = computed(
    () => this.transactionBanks().find((b) => b.id === this.draft.transactionBankId())?.name ?? '',
  );

  readonly selectedTypeIcon = computed(
    () => this.transactionTypes().find((t) => t.id === this.draft.transactionTypeId())?.icon ?? 'arrow-left-right',
  );

  /** Gates both the "Cliente registrado" picker and the "Enviar a cuentas por cobrar" checkbox — neither renders for any other tipo de transacción. */
  readonly isDepositType = computed(() => this.draft.transactionTypeName() === DEPOSIT_TRANSACTION_TYPE_NAME);

  /** The checkbox is only ever offered enabled once both conditions hold — a non-admin sees it hidden entirely (the backend rejects the operation outright otherwise, see `BankDepositAccountsReceivableForbiddenError`), and no registered client means there's nothing to charge. */
  readonly canSendToAccountsReceivable = computed(() => this.isAdmin() && this.draft.clientId() !== null);

  readonly overallStatusText = computed(() => {
    switch (this.draft.overallStatus()) {
      case 'green':
        return 'Cuadre correcto — listo para guardar';
      case 'red':
        return 'El cuadre excede el monto total';
      default:
        return 'El cuadre aún no coincide';
    }
  });

  constructor() {
    this.transactionBankService.getTransactionBanks().subscribe({
      next: (banks) => {
        this.transactionBanks.set(banks);
        this.loadingBanks.set(false);
      },
      error: () => {
        this.loadingBanks.set(false);
        this.notificationService.error('No se pudieron cargar los bancos agente.');
      },
    });

    this.transactionTypeService.getTransactionTypes().subscribe({
      next: (types) => {
        this.transactionTypes.set(types);
        this.loadingTypes.set(false);
        // Un borrador restaurado toma el efecto vigente del catálogo, nunca uno guardado viejo.
        const current = types.find((type) => type.id === this.draft.transactionTypeId());
        if (current) {
          this.draft.syncBalanceEffect(current.balanceEffect ?? null);
        }
      },
      error: () => {
        this.loadingTypes.set(false);
        this.notificationService.error('No se pudieron cargar los tipos de transacción.');
      },
    });

    this.loadBankAccounts();

    this.bankDepositService
      .getTransactionSummary()
      .pipe(catchError(() => of(null)))
      .subscribe((summary) => {
        this.transactionSummary.set(summary);
        this.loadingSummary.set(false);
      });
  }

  selectType(type: TransactionType): void {
    this.draft.setTransactionType(type.id, type.name, type.balanceEffect ?? null);
    this.view.set('form');
    this.loadBankAccounts();
  }

  onBankAccountChange(id: string): void {
    this.draft.setBankAccount(id);
  }

  /** Refresca los saldos actuales desde el backend (fuente de verdad) — al entrar al formulario y después de guardar. */
  private loadBankAccounts(): void {
    this.bankService.getBanks().subscribe({
      next: (banks) => {
        this.bankAccounts.set(banks.filter((bank) => bank.isActive));
        this.loadingAccounts.set(false);
      },
      error: () => {
        this.loadingAccounts.set(false);
        this.notificationService.error('No se pudieron cargar las cuentas bancarias.');
      },
    });
  }

  /** Going back to the dashboard always starts a fresh operation — changing the tipo mid-flight discards whatever was already entered for the previous one, after confirming if there's anything meaningful to lose. */
  async changeType(): Promise<void> {
    if (this.draft.hasMeaningfulProgress()) {
      const discard = await this.confirmDialogService.confirm({
        type: 'CANCEL',
        title: 'Cambiar tipo de transacción',
        message: 'Se perderá la información ingresada en este formulario. ¿Deseas continuar?',
        confirmText: 'Sí, cambiar tipo',
      });
      if (!discard) {
        return;
      }
    }
    this.draft.reset();
    this.view.set('dashboard');
  }

  onBankChange(id: string): void {
    this.draft.setTransactionBank(id);
  }

  onClientNameInput(value: string): void {
    this.draft.setClientName(value);
  }

  onRegisteredClientChange(client: Client | null): void {
    this.draft.setRegisteredClient(client);
  }

  onSendToAccountsReceivableChange(checked: boolean): void {
    this.draft.setSendToAccountsReceivable(checked);
  }

  /** Se llama en cada tecla (el directive ya entrega el número limpio, sin comas) — así "Saldo después" se actualiza en vivo. */
  onTotalAmountChange(value: number | null): void {
    this.draft.setTotalAmount(value === null || Number.isNaN(value) ? 0 : Math.max(value, 0));
  }

  onCashQuantityChange(event: { denomination: number; quantity: number }): void {
    this.draft.setCashQuantity(event.denomination, event.quantity);
  }

  async onTransactionCountRequested(count: number): Promise<void> {
    const current = this.draft.transactionAmounts();
    const wouldDiscard = count < current.length && current.slice(count).some((amount) => amount > 0);

    if (wouldDiscard) {
      const confirmed = await this.confirmDialogService.confirm({
        type: 'FINANCIAL_OPERATION',
        title: 'Reducir transacciones',
        message: 'Ya ingresaste montos en algunas de las transacciones que se eliminarían. ¿Deseas continuar?',
        confirmText: 'Sí, continuar',
      });
      if (!confirmed) {
        return;
      }
    }

    this.draft.setTransactionCount(count);
  }

  onTransactionAmountChange(event: { index: number; amount: number }): void {
    this.draft.setTransactionAmount(event.index, event.amount);
  }

  onConfirmChangeRequested(amount: number): void {
    this.pendingChangeAmount.set(amount);
    this.isChangeConfirmOpen.set(true);
  }

  /** The vuelto is NOT applied here — only once the modal's own "Confirmar vuelto" fires this. Cancelling the modal (or the draft changing while it's open) leaves the operation exactly as unconfirmed/uncuadrado as before, per the ticket's own "no debe considerarse confirmado hasta confirmar" rule. */
  onChangeConfirmed(): void {
    this.draft.confirmChange(this.pendingChangeAmount());
    this.isChangeConfirmOpen.set(false);
  }

  onChangeCancelled(): void {
    this.isChangeConfirmOpen.set(false);
  }

  requestSave(): void {
    if (!this.canSubmit() || this.isSaving()) {
      return;
    }
    this.isConfirmOpen.set(true);
  }

  dismissConfirm(): void {
    if (this.isSaving()) {
      return;
    }
    this.isConfirmOpen.set(false);
  }

  confirmSave(): void {
    if (this.isSaving()) {
      return;
    }

    this.isSaving.set(true);
    this.bankDepositService
      .registerOperation({
        transactionBankId: this.draft.isGenesisType() ? null : this.draft.transactionBankId(),
        bankAccountId: this.draft.needsBankAccount() ? this.draft.bankAccountId() : null,
        transactionTypeId: this.draft.transactionTypeId(),
        totalAmount: this.draft.totalAmount(),
        cashDetails: Object.entries(this.draft.cashCounts())
          .map(([denomination, quantity]) => ({ denomination: Number(denomination), quantity }))
          .filter((row) => row.quantity > 0),
        transactionAmounts: this.draft.transactionAmounts(),
        clientName: this.draft.clientName().trim() || null,
        clientId: this.draft.clientId(),
        sendToAccountsReceivable: this.draft.sendToAccountsReceivable(),
        changeGiven: this.draft.changeConfirmed() ? this.draft.changeGiven() : 0,
      })
      .subscribe({
        next: (operation) => {
          this.isSaving.set(false);
          this.isConfirmOpen.set(false);
          this.draft.reset();
          this.view.set('dashboard');
          const movement = operation.balanceMovement;
          this.notificationService.success(
            movement
              ? `Transacción registrada. Nuevo saldo de ${movement.bankName}: ${formatSignedBankBalance(movement.balanceAfter)}.`
              : 'Transacción registrada correctamente.',
          );
          this.loadBankAccounts();
          this.bankDepositService
            .getTransactionSummary()
            .pipe(catchError(() => of(null)))
            .subscribe((summary) => summary && this.transactionSummary.set(summary));
        },
        error: (error: HttpErrorResponse) => {
          this.isSaving.set(false);
          this.isConfirmOpen.set(false);
          this.notificationService.error(extractErrorMessage(error, 'No se pudo registrar la transacción.'));
          // El saldo pudo cambiar por otra operación concurrente — se re-lee del backend.
          this.loadBankAccounts();
        },
      });
  }
}
