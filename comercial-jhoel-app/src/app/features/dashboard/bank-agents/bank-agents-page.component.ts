import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { BankBalanceView, DayStatus, formatBankCurrency } from '../../../core/models';
import { BankBalanceDraftStore } from '../../../core/services/bank-balance-draft.store';
import { AuthService } from '../../../core/services/auth.service';
import { BankBalanceService } from '../../../core/services/bank-balance.service';
import { BankService } from '../../../core/services/bank.service';
import { CuadreAgentesService } from '../../../core/services/cuadre-agentes.service';
import { DayStatusService } from '../../../core/services/day-status.service';
import { NotificationService } from '../../../core/services/notification.service';
import { extractErrorMessage } from '../../../core/utils/extract-error-message';
import { formatSignedBankBalance, isCreditLineAccount } from '../../../core/utils/bank-balance.util';
import {
  BankBalanceAmountComponent,
  ButtonComponent,
  CreditLineSummaryComponent,
  IconComponent,
  PageHeaderComponent,
} from '../../../shared/ui';
import { DecimalInputDirective } from '../../../shared/directives/decimal-input.directive';
import { ZeroBalancesConfirmModalComponent } from './components/zero-balances-confirm-modal/zero-balances-confirm-modal.component';
import { EntryConfirmModalComponent } from './components/entry-confirm-modal/entry-confirm-modal.component';
import { SaveBalancesConfirmModalComponent } from './components/save-balances-confirm-modal/save-balances-confirm-modal.component';
import {
  AdjustBalanceModalComponent,
  AdjustBalanceSubmission,
} from './components/adjust-balance-modal/adjust-balance-modal.component';

/** Local-time `yyyy-MM-dd`, no UTC-offset dance — same technique every other date-driven page in this app already uses (Recargas, Reports). */
function todayIsoDate(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * **Saldos dinámicos**: la columna "Saldo Actual" es `banks.final_balance`,
 * que solo mueven las operaciones (Transaccionar, transferencias) y los
 * ajustes manuales — el backend es la fuente de verdad, esta pantalla nunca
 * lo calcula. Para HOY, "Registrar saldos del día" guarda la foto diaria
 * (necesaria para el cuadre/cierre) con el saldo actual de cada cuenta — ya
 * no se teclea. Para una fecha pasada se conserva la corrección histórica
 * de la foto tal cual existía (nunca toca el saldo actual). Corregir el
 * saldo actual es "Ajustar saldo": solo admin, con motivo, auditado.
 *
 * All draft state (operation date + entered saldo final values) lives in
 * `BankBalanceDraftStore`, a root-provided singleton persisted to
 * `sessionStorage` — same pattern as `PurchaseDraftStore`/
 * `IceCreamPurchaseDraftStore`, see that store's own doc comment. Bank
 * name/account number/tipo/saldo anterior are never persisted client-side:
 * they're always re-fetched from the backend, so this screen can never
 * show stale configuration.
 *
 * "Apertura del Día" (`DayStatusService`, a singleton shared with the
 * Sidebar and with Cuadre Agentes) gates editing ONLY when the active
 * date is today — editing a past date (pre-existing historical
 * correction) never requires opening anything, exactly as it worked
 * before this ticket.
 */
@Component({
  selector: 'app-bank-agents-page',
  standalone: true,
  imports: [
    FormsModule,
    PageHeaderComponent,
    ButtonComponent,
    IconComponent,
    DecimalInputDirective,
    ZeroBalancesConfirmModalComponent,
    EntryConfirmModalComponent,
    SaveBalancesConfirmModalComponent,
    AdjustBalanceModalComponent,
    BankBalanceAmountComponent,
    CreditLineSummaryComponent,
  ],
  templateUrl: './bank-agents-page.component.html',
  styleUrl: './bank-agents-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BankAgentsPageComponent {
  private readonly bankBalanceService = inject(BankBalanceService);
  private readonly cuadreAgentesService = inject(CuadreAgentesService);
  private readonly notificationService = inject(NotificationService);
  private readonly dayStatusService = inject(DayStatusService);
  private readonly bankService = inject(BankService);
  protected readonly draft = inject(BankBalanceDraftStore);
  readonly isAdmin = inject(AuthService).isAdmin;

  /** Cuenta abierta en "Ajustar saldo" (`null` = modal cerrado). */
  readonly adjustingRow = signal<BankBalanceView | null>(null);
  readonly isAdjusting = signal(false);

  readonly maxSelectableDate = todayIsoDate();

  readonly rows = signal<BankBalanceView[]>([]);
  readonly loading = signal(true);
  readonly isSaving = signal(false);
  readonly isRefreshingBalances = signal(false);
  readonly isZeroConfirmModalOpen = signal(false);
  readonly isSaveConfirmModalOpen = signal(false);
  readonly isEntryConfirmModalOpen = signal(false);
  readonly isOpeningDay = signal(false);

  readonly isTodayOperationDate = computed(() => this.draft.operationDate() === this.maxSelectableDate);

  /**
   * "Cierre del Día" — unlike "opened", this check applies to ANY date,
   * not just today: a historical correction on a date that was already
   * closed (because its own Cuadre Agentes was saved at the time) must be
   * blocked the same as today. For today's date, the `DayStatusService`
   * singleton (the same state the Sidebar reads) is reused; for a past
   * date, this page makes its own separate query, because the singleton
   * only ever represents "today".
   */
  readonly pastDateStatus = signal<DayStatus | null>(null);

  readonly effectiveDayClosed = computed(() =>
    this.isTodayOperationDate()
      ? this.dayStatusService.status()?.isClosed === true
      : this.pastDateStatus()?.isClosed === true,
  );

  /**
   * The actual gate: for today, only once `DayStatusService` confirms the
   * day is already open; for any date (today or past), never if that
   * date was already closed — a closed day doesn't accept correction
   * through the normal flow, not even as a "historical correction".
   */
  readonly isEditingUnlocked = computed(
    () =>
      (!this.isTodayOperationDate() || this.dayStatusService.status()?.isOpened === true) &&
      !this.effectiveDayClosed(),
  );

  private hasEvaluatedEntryGate = false;

  /**
   * Reflects whether the currently selected date already has any balance
   * saved — drives both the informational message ("No existen
   * registros..."/"Ya existen saldos...") and the success message on save
   * ("fueron registrados"/"fueron actualizados").
   */
  readonly hasExistingRecordsForDate = computed(() => this.rows().some((row) => row.finalBalance !== null));

  formatCurrency = formatBankCurrency;
  /** BI Club Empresarial = línea de crédito (saldo ≤ 0, con límite / utilizado / disponible). */
  readonly isCreditLine = isCreditLineAccount;

  constructor() {
    this.fetchBalances();
    this.fetchPastDateStatusIfNeeded();

    // Opens the "Apertura del Día" modal the first time it's confirmed
    // (once `DayStatusService` is done loading) that today still isn't
    // open. Only acts once per instance of this component — cancelling
    // the modal must not make it reopen on its own; the user decides
    // when to retry via "Habilitar edición".
    effect(() => {
      const isToday = this.isTodayOperationDate();
      const loading = this.dayStatusService.loading();
      const status = this.dayStatusService.status();
      if (!isToday || loading || this.hasEvaluatedEntryGate) {
        return;
      }
      this.hasEvaluatedEntryGate = true;
      if (!status?.isOpened) {
        this.isEntryConfirmModalOpen.set(true);
      }
    });
  }

  confirmEntryModal(): void {
    if (this.isOpeningDay()) {
      return;
    }
    this.isOpeningDay.set(true);
    this.dayStatusService.openDay().subscribe({
      next: () => {
        this.isOpeningDay.set(false);
        this.isEntryConfirmModalOpen.set(false);
      },
      error: (error: HttpErrorResponse) => {
        this.isOpeningDay.set(false);
        this.notificationService.error(extractErrorMessage(error, 'No se pudo aperturar el día. Intente nuevamente.'));
      },
    });
  }

  cancelEntryModal(): void {
    if (this.isOpeningDay()) {
      return;
    }
    this.isEntryConfirmModalOpen.set(false);
  }

  /** The one re-entry point after cancelling the opening modal — shows it again, without navigating or reloading anything. */
  reopenEntryModal(): void {
    this.isEntryConfirmModalOpen.set(true);
  }

  /** Picking another date must never mix its data with the previously viewed one — no local merge, just a full refetch scoped to the new date (same rule Recargas' own date picker follows). */
  onDateChange(date: string): void {
    if (date === this.draft.operationDate()) {
      return;
    }
    this.draft.setOperationDate(date);
    this.fetchBalances();
    this.fetchPastDateStatusIfNeeded();
  }

  /** Only queries for a past date — today is already covered by the `DayStatusService` singleton. */
  private fetchPastDateStatusIfNeeded(): void {
    if (this.isTodayOperationDate()) {
      this.pastDateStatus.set(null);
      return;
    }
    this.cuadreAgentesService.getDayStatus(this.draft.operationDate()).subscribe({
      next: (status) => this.pastDateStatus.set(status),
      error: () => this.pastDateStatus.set(null),
    });
  }

  /** The value to show in the saldo final input: an unsaved draft edit takes priority, otherwise whatever is already saved for this date (or blank for a bank with no entry yet). */
  displayFinalBalance(row: BankBalanceView): number | null {
    const draftValue = this.draft.draftFinalBalances()[row.bankId];
    return draftValue !== undefined ? draftValue : row.finalBalance;
  }

  onFinalBalanceInput(bankId: string, value: string): void {
    if (value.trim() === '') {
      this.draft.removeFinalBalance(bankId);
      return;
    }
    const parsed = parseFloat(value);
    // Solo las líneas de crédito (Génesis, BI Club) admiten una foto negativa (lo valida también el backend).
    const specialAccount = this.rows().find((row) => row.bankId === bankId)?.specialAccount;
    const allowsNegative = specialAccount === 'GENESIS' || isCreditLineAccount(specialAccount);
    if (Number.isNaN(parsed) || (parsed < 0 && !allowsNegative)) {
      return;
    }
    this.draft.setFinalBalance(bankId, parsed);
  }

  /** Hoy: la foto se toma del saldo actual (no hay nada que teclear). Fecha pasada: exige una edición pendiente, como siempre. */
  get canSave(): boolean {
    return (
      this.isEditingUnlocked() &&
      (this.isTodayOperationDate() ? this.rows().length > 0 : this.draft.hasActiveDraft()) &&
      !this.isSaving() &&
      !this.isRefreshingBalances()
    );
  }

  openAdjustModal(row: BankBalanceView): void {
    if (!this.isAdmin()) {
      return;
    }
    this.adjustingRow.set(row);
  }

  cancelAdjust(): void {
    if (this.isAdjusting()) {
      return;
    }
    this.adjustingRow.set(null);
  }

  /** El backend valida permisos, saldo negativo y registra el AJUSTE_MANUAL; aquí solo se refresca la tabla con lo que quedó guardado. */
  confirmAdjust(submission: AdjustBalanceSubmission): void {
    const row = this.adjustingRow();
    if (!row || this.isAdjusting()) {
      return;
    }
    this.isAdjusting.set(true);
    this.bankService
      .adjustBalance(row.bankId, {
        newBalance: submission.newBalance,
        reason: submission.reason,
        ...(submission.observation ? { observation: submission.observation } : {}),
      })
      .subscribe({
        next: (movement) => {
          this.isAdjusting.set(false);
          this.adjustingRow.set(null);
          this.notificationService.success(
            `Saldo de ${row.bankName} ajustado a ${formatSignedBankBalance(movement.balanceAfter)}.`,
          );
          this.refreshBalances();
        },
        error: (error: HttpErrorResponse) => {
          this.isAdjusting.set(false);
          this.notificationService.error(extractErrorMessage(error, 'No se pudo ajustar el saldo.'));
        },
      });
  }

  /** "Guardar Cambios" now opens the confirmation (Step 3) instead of saving directly — the actual save happens in `confirmSaveChanges()`. */
  openSaveConfirmModal(): void {
    if (!this.canSave) {
      return;
    }
    this.isSaveConfirmModalOpen.set(true);
  }

  cancelSaveConfirm(): void {
    if (this.isSaving()) {
      return;
    }
    this.isSaveConfirmModalOpen.set(false);
  }

  /**
   * "Confirmar y Guardar": sends exactly what was typed as one atomic batch,
   * then — same reset-after-save rule already used for Recargas
   * Electrónicas — clears the temporary draft and re-fetches the real
   * saldo anterior/saldo final straight from the database instead of
   * trusting any client-side computation. If the saved date is today, it
   * also refreshes `DayStatusService` — this is what enables the Cuadre
   * Agentes link in the Sidebar immediately, without reloading anything
   * manually.
   */
  confirmSaveChanges(): void {
    if (!this.canSave) {
      return;
    }

    const isFirstRecordForDate = !this.hasExistingRecordsForDate();
    // Hoy: foto del saldo actual de TODAS las cuentas (el backend vuelve a
    // tomar el saldo vivo bajo lock; lo enviado aquí es solo informativo).
    const entries = this.isTodayOperationDate()
      ? this.rows().map((row) => ({ bankId: row.bankId, finalBalance: row.currentBalance }))
      : Object.entries(this.draft.draftFinalBalances()).map(([bankId, finalBalance]) => ({
          bankId,
          finalBalance,
        }));

    this.isSaving.set(true);
    this.bankBalanceService.saveBalances({ operationDate: this.draft.operationDate(), entries }).subscribe({
      next: () => {
        this.isSaving.set(false);
        this.isSaveConfirmModalOpen.set(false);
        this.draft.reset();
        this.notificationService.success(
          isFirstRecordForDate
            ? 'Los saldos fueron registrados correctamente.'
            : 'Los saldos fueron actualizados correctamente.'
        );
        this.fetchBalances();
        if (this.isTodayOperationDate()) {
          this.dayStatusService.refresh();
        }
      },
      error: (error: HttpErrorResponse) => {
        this.isSaving.set(false);
        this.notificationService.error(
          extractErrorMessage(error, 'No fue posible guardar los cambios. Intente nuevamente.')
        );
      },
    });
  }

  /**
   * "Poner Saldos en Cero" — only opens if banks are loaded and editing
   * is unlocked; never touches the database on its own (see
   * `ZeroBalancesConfirmModalComponent` and `BankBalanceDraftStore.zeroAll`).
   * The user still needs to press "Guardar Cambios" and confirm for the
   * zeros to be persisted.
   */
  openZeroConfirmModal(): void {
    if (this.loading() || this.rows().length === 0 || !this.isEditingUnlocked() || this.isTodayOperationDate()) {
      return;
    }
    this.isZeroConfirmModalOpen.set(true);
  }

  cancelZeroConfirm(): void {
    this.isZeroConfirmModalOpen.set(false);
  }

  confirmZeroBalances(): void {
    this.draft.zeroAll(this.rows().map((row) => row.bankId));
    this.isZeroConfirmModalOpen.set(false);
  }

  /**
   * "Actualizar Saldos" — re-reads `GET /banks/balances` for the selected
   * date without reloading the page, same as the identical button in
   * Cuadre Agentes. Doesn't touch `loading` (that would hide the whole
   * table behind the initial loading skeleton) or `BankBalanceDraftStore`'s
   * draft: `displayFinalBalance()` already prioritizes the unsaved draft
   * over `row.finalBalance`, so refreshing `rows` never overwrites a
   * balance the user hasn't saved yet — "Guardar Cambios" keeps working
   * exactly the same after refreshing.
   *
   * Also blocked while `isSaving()` is in progress — without this, a
   * refresh triggered right before or during a save could respond *after*
   * `confirmSaveChanges()`'s own refetch and leave the previous balance
   * on screen (even though the save had actually persisted correctly to
   * the database), giving the false impression that "it wasn't saved".
   */
  refreshBalances(): void {
    if (this.isRefreshingBalances() || this.isSaving()) {
      return;
    }
    this.isRefreshingBalances.set(true);
    this.bankBalanceService.getBalancesView(this.draft.operationDate()).subscribe({
      next: (rows) => {
        this.rows.set(rows);
        this.isRefreshingBalances.set(false);
      },
      error: (error: HttpErrorResponse) => {
        this.isRefreshingBalances.set(false);
        this.notificationService.error(
          extractErrorMessage(error, 'No fue posible actualizar los saldos. Intente nuevamente.')
        );
      },
    });
  }

  private fetchBalances(): void {
    this.loading.set(true);
    this.bankBalanceService.getBalancesView(this.draft.operationDate()).subscribe({
      next: (rows) => {
        this.rows.set(rows);
        this.loading.set(false);
      },
      error: (error: HttpErrorResponse) => {
        this.loading.set(false);
        this.notificationService.error(extractErrorMessage(error, 'No se pudo cargar la información de bancos.'));
      },
    });
  }
}
