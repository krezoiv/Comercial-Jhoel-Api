import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { BankBalanceView, DayStatus, formatBankCurrency } from '../../../core/models';
import { BankBalanceDraftStore } from '../../../core/services/bank-balance-draft.store';
import { BankBalanceService } from '../../../core/services/bank-balance.service';
import { CuadreAgentesService } from '../../../core/services/cuadre-agentes.service';
import { DayStatusService } from '../../../core/services/day-status.service';
import { NotificationService } from '../../../core/services/notification.service';
import { extractErrorMessage } from '../../../core/utils/extract-error-message';
import { ButtonComponent, IconComponent } from '../../../shared/ui';
import { DecimalInputDirective } from '../../../shared/directives/decimal-input.directive';
import { ZeroBalancesConfirmModalComponent } from './components/zero-balances-confirm-modal/zero-balances-confirm-modal.component';
import { EntryConfirmModalComponent } from './components/entry-confirm-modal/entry-confirm-modal.component';
import { SaveBalancesConfirmModalComponent } from './components/save-balances-confirm-modal/save-balances-confirm-modal.component';

/** Local-time `yyyy-MM-dd`, no UTC-offset dance — same technique every other date-driven page in this app already uses (Recargas, Reports). */
function todayIsoDate(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * All draft state (operation date + entered saldo final values) lives in
 * `BankBalanceDraftStore`, a root-provided singleton persisted to
 * `sessionStorage` — same pattern as `PurchaseDraftStore`/
 * `IceCreamPurchaseDraftStore`, see that store's own doc comment. Bank
 * name/account number/tipo/saldo anterior are never persisted client-side:
 * they're always re-fetched from the backend, so this screen can never
 * show stale configuration.
 *
 * "Apertura del Día" (`DayStatusService`, un singleton compartido con el
 * Sidebar y con Cuadre Agentes) gatea la edición SOLO cuando la fecha
 * activa es la de hoy — editar una fecha pasada (corrección histórica ya
 * existente) nunca requiere aperturar nada, exactamente como funcionaba
 * antes de este ticket.
 */
@Component({
  selector: 'app-bank-agents-page',
  standalone: true,
  imports: [
    FormsModule,
    ButtonComponent,
    IconComponent,
    DecimalInputDirective,
    ZeroBalancesConfirmModalComponent,
    EntryConfirmModalComponent,
    SaveBalancesConfirmModalComponent,
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
  protected readonly draft = inject(BankBalanceDraftStore);

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
   * "Cierre del Día" — a diferencia de "aperturado", este chequeo aplica a
   * CUALQUIER fecha, no solo a hoy: una corrección histórica sobre una
   * fecha que ya fue cerrada (porque en su momento se guardó su propio
   * Cuadre Agentes) debe bloquearse igual que hoy. Para la fecha de hoy
   * se reutiliza el singleton `DayStatusService` (mismo estado que el
   * Sidebar); para una fecha pasada se hace una consulta aparte, propia de
   * esta página, porque el singleton solo representa "hoy".
   */
  readonly pastDateStatus = signal<DayStatus | null>(null);

  readonly effectiveDayClosed = computed(() =>
    this.isTodayOperationDate()
      ? this.dayStatusService.status()?.isClosed === true
      : this.pastDateStatus()?.isClosed === true,
  );

  /**
   * Gate real: para hoy, solo hasta que `DayStatusService` confirme que
   * el día ya está aperturado; para cualquier fecha (hoy o pasada), nunca
   * si esa fecha ya fue cerrada — un día cerrado no admite corrección por
   * el flujo normal, ni siquiera como "corrección histórica".
   */
  readonly isEditingUnlocked = computed(
    () =>
      (!this.isTodayOperationDate() || this.dayStatusService.status()?.isOpened === true) &&
      !this.effectiveDayClosed(),
  );

  private hasEvaluatedEntryGate = false;

  /**
   * Refleja si la fecha actualmente seleccionada ya tiene algún saldo
   * guardado — impulsa el mensaje informativo ("No existen
   * registros..."/"Ya existen saldos...") y el mensaje de éxito al
   * guardar ("fueron registrados"/"fueron actualizados").
   */
  readonly hasExistingRecordsForDate = computed(() => this.rows().some((row) => row.finalBalance !== null));

  formatCurrency = formatBankCurrency;

  constructor() {
    this.fetchBalances();
    this.fetchPastDateStatusIfNeeded();

    // Abre el modal de "Apertura del Día" la primera vez que se confirma
    // (una vez que `DayStatusService` deja de estar cargando) que hoy
    // todavía no está aperturado. Solo actúa una vez por instancia de
    // este componente — cancelar el modal no debe hacer que se reabra
    // solo; el usuario decide cuándo reintentar vía "Habilitar edición".
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

  /** Único punto de reingreso tras cancelar el modal de apertura — vuelve a mostrarlo, sin navegar ni recargar nada. */
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

  /** Solo consulta para una fecha pasada — hoy ya está cubierto por el singleton `DayStatusService`. */
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
    if (Number.isNaN(parsed) || parsed < 0) {
      return;
    }
    this.draft.setFinalBalance(bankId, parsed);
  }

  get canSave(): boolean {
    return (
      this.isEditingUnlocked() &&
      this.draft.hasActiveDraft() &&
      !this.isSaving() &&
      !this.isRefreshingBalances()
    );
  }

  /** "Guardar Cambios" ahora abre la confirmación (Paso 3) en vez de guardar directamente — el guardado real ocurre en `confirmSaveChanges()`. */
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
   * trusting any client-side computation. Si la fecha guardada es hoy,
   * también refresca `DayStatusService` — esto es lo que habilita el
   * enlace de Cuadre Agentes en el Sidebar de inmediato, sin recargar
   * nada manualmente.
   */
  confirmSaveChanges(): void {
    if (!this.canSave) {
      return;
    }

    const isFirstRecordForDate = !this.hasExistingRecordsForDate();
    const entries = Object.entries(this.draft.draftFinalBalances()).map(([bankId, finalBalance]) => ({
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
   * "Poner Saldos en Cero" — solo se abre si hay bancos cargados y la
   * edición está desbloqueada; nunca toca la base de datos por sí sola
   * (ver `ZeroBalancesConfirmModalComponent` y `BankBalanceDraftStore.zeroAll`).
   * El usuario sigue necesitando presionar "Guardar Cambios" y confirmar
   * para que los ceros se persistan.
   */
  openZeroConfirmModal(): void {
    if (this.loading() || this.rows().length === 0 || !this.isEditingUnlocked()) {
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
   * "Actualizar Saldos" — vuelve a leer `GET /banks/balances` para la
   * fecha seleccionada sin recargar la página, igual que el mismo botón
   * en Cuadre Agentes. No toca `loading` (eso ocultaría toda la tabla
   * detrás del esqueleto de carga inicial) ni el draft de
   * `BankBalanceDraftStore`: `displayFinalBalance()` ya prioriza el draft
   * sin guardar sobre `row.finalBalance`, así que refrescar `rows` nunca
   * pisa un saldo que el usuario todavía no ha guardado — "Guardar
   * Cambios" sigue funcionando exactamente igual después de actualizar.
   *
   * También se bloquea mientras `isSaving()` está en curso — sin esto,
   * un refresco disparado justo antes o durante un guardado podía
   * responder *después* del propio refetch de `confirmSaveChanges()` y
   * dejar en pantalla el saldo anterior (aunque el guardado sí se hubiera
   * persistido correctamente en la base de datos), dando la falsa
   * impresión de que "no se guardó".
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
