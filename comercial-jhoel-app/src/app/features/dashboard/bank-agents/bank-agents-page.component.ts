import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { BankBalanceView, formatBankCurrency } from '../../../core/models';
import { BankBalanceDraftStore } from '../../../core/services/bank-balance-draft.store';
import { BankBalanceService } from '../../../core/services/bank-balance.service';
import { NotificationService } from '../../../core/services/notification.service';
import { extractErrorMessage } from '../../../core/utils/extract-error-message';
import { ButtonComponent, IconComponent } from '../../../shared/ui';
import { DecimalInputDirective } from '../../../shared/directives/decimal-input.directive';
import { ZeroBalancesConfirmModalComponent } from './components/zero-balances-confirm-modal/zero-balances-confirm-modal.component';

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
 */
@Component({
  selector: 'app-bank-agents-page',
  standalone: true,
  imports: [FormsModule, ButtonComponent, IconComponent, DecimalInputDirective, ZeroBalancesConfirmModalComponent],
  templateUrl: './bank-agents-page.component.html',
  styleUrl: './bank-agents-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BankAgentsPageComponent {
  private readonly bankBalanceService = inject(BankBalanceService);
  private readonly notificationService = inject(NotificationService);
  protected readonly draft = inject(BankBalanceDraftStore);

  readonly maxSelectableDate = todayIsoDate();

  readonly rows = signal<BankBalanceView[]>([]);
  readonly loading = signal(true);
  readonly isSaving = signal(false);
  readonly isRefreshingBalances = signal(false);
  readonly isZeroConfirmModalOpen = signal(false);

  formatCurrency = formatBankCurrency;

  constructor() {
    this.fetchBalances();
  }

  /** Picking another date must never mix its data with the previously viewed one — no local merge, just a full refetch scoped to the new date (same rule Recargas' own date picker follows). */
  onDateChange(date: string): void {
    if (date === this.draft.operationDate()) {
      return;
    }
    this.draft.setOperationDate(date);
    this.fetchBalances();
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
    return this.draft.hasActiveDraft() && !this.isSaving() && !this.isRefreshingBalances();
  }

  /**
   * "Guardar Cambios": sends exactly what was typed as one atomic batch,
   * then — same reset-after-save rule already used for Recargas
   * Electrónicas — clears the temporary draft and re-fetches the real
   * saldo anterior/saldo final straight from the database instead of
   * trusting any client-side computation.
   */
  saveChanges(): void {
    if (!this.canSave) {
      return;
    }

    const entries = Object.entries(this.draft.draftFinalBalances()).map(([bankId, finalBalance]) => ({
      bankId,
      finalBalance,
    }));

    this.isSaving.set(true);
    this.bankBalanceService.saveBalances({ operationDate: this.draft.operationDate(), entries }).subscribe({
      next: () => {
        this.isSaving.set(false);
        this.draft.reset();
        this.notificationService.success('Los saldos bancarios fueron actualizados correctamente.');
        this.fetchBalances();
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
   * "Poner Saldos en Cero" — solo se abre si hay bancos cargados; nunca
   * toca la base de datos por sí sola (ver `ZeroBalancesConfirmModalComponent`
   * y `BankBalanceDraftStore.zeroAll`). El usuario sigue necesitando
   * presionar "Guardar Cambios" para que los ceros se persistan.
   */
  openZeroConfirmModal(): void {
    if (this.loading() || this.rows().length === 0) {
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
   * responder *después* del propio refetch de `saveChanges()` y dejar en
   * pantalla el saldo anterior (aunque el guardado sí se hubiera
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
