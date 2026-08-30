import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';

import {
  CASH_DENOMINATIONS,
  CashDenomination,
  CuadreAgentesSummary,
  CuadreResultStatus,
  calculateCuadreResult,
  calculateTotalCash,
  decimalPlacesFor,
  formatCurrency,
  formatQuantity,
  getCuadreResultStatus,
} from '../../../core/models';
import { CuadreAgentesService } from '../../../core/services/cuadre-agentes.service';
import { CuadreAgentesStateService } from '../../../core/services/cuadre-agentes-state.service';
import { NotificationService } from '../../../core/services/notification.service';
import { extractErrorMessage } from '../../../core/utils/extract-error-message';
import { ButtonComponent, CardComponent, IconComponent } from '../../../shared/ui';
import { DecimalInputDirective } from '../../../shared/directives/decimal-input.directive';
import { AgentReconciliationConfirmModalComponent } from './components/agent-reconciliation-confirm-modal/agent-reconciliation-confirm-modal.component';

const STATUS_ICON: Record<CuadreResultStatus, string> = {
  negative: 'x-circle',
  zero: 'check-circle',
  positive: 'alert-circle',
};

const STATUS_TEXT: Record<CuadreResultStatus, string> = {
  negative: 'Resultado negativo',
  zero: 'Cuadre exacto',
  positive: 'Resultado positivo',
};

/**
 * "Cuadre Agentes" — segunda etapa: añade el Resumen del Cuadre (con el
 * resultado en vivo, coloreado según su signo) y "Guardar Cuadre", que
 * persiste un registro histórico en `agent_reconciliations` vía
 * `POST /agent-reconciliations`. El backend recalcula
 * `totalBanks`/`totalAssets`/`totalAccountsReceivable`/`result` de forma
 * independiente al guardar — solo `totalCash` viaja realmente como
 * decisión de este frontend (ver `CreateAgentReconciliationUseCase`); el
 * valor mostrado aquí antes de guardar es solo una vista previa en vivo,
 * igual que el patrón ya establecido en `SalesSummaryCardComponent`.
 *
 * El conteo de efectivo se guarda en `CuadreAgentesStateService` (un
 * singleton `providedIn: 'root'`, el mismo patrón que `PurchaseDraftStore`/
 * los servicios de estado de Reportería) para que sobreviva la navegación
 * dentro del dashboard sin necesitar `sessionStorage` todavía — ver el
 * propio comentario de ese servicio.
 */
@Component({
  selector: 'app-cuadre-agentes-page',
  standalone: true,
  imports: [
    CardComponent,
    IconComponent,
    ButtonComponent,
    DecimalInputDirective,
    AgentReconciliationConfirmModalComponent,
  ],
  templateUrl: './cuadre-agentes-page.component.html',
  styleUrl: './cuadre-agentes-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CuadreAgentesPageComponent {
  private readonly cuadreAgentesService = inject(CuadreAgentesService);
  private readonly state = inject(CuadreAgentesStateService);
  private readonly notificationService = inject(NotificationService);

  readonly denominations = CASH_DENOMINATIONS;
  readonly cashCounts = this.state.cashCounts;
  readonly decimalPlacesFor = decimalPlacesFor;

  readonly summary = signal<CuadreAgentesSummary | null>(null);
  readonly loading = signal(true);

  readonly isConfirmModalOpen = signal(false);
  readonly isSaving = signal(false);
  readonly isRefreshingBanks = signal(false);

  /** `denominación × cantidad`, sumado en todas las filas — se recalcula solo, sin botón, cada vez que `cashCounts` cambia. */
  readonly totalCash = computed(() => calculateTotalCash(this.cashCounts()));

  /** Efectivo + Bancos + CuentasPorCobrar − Activos — en vivo, sin necesidad de un botón, igual que el previo de Recargas. */
  readonly resultCuadre = computed(() => {
    const summary = this.summary();
    if (!summary) {
      return 0;
    }
    return calculateCuadreResult(
      this.totalCash(),
      summary.totalBanks,
      summary.totalAccountsReceivable,
      summary.totalAssets,
    );
  });

  readonly resultStatus = computed<CuadreResultStatus>(() => getCuadreResultStatus(this.resultCuadre()));
  readonly resultIcon = computed(() => STATUS_ICON[this.resultStatus()]);
  readonly resultText = computed(() => STATUS_TEXT[this.resultStatus()]);

  formatCurrency = formatCurrency;
  formatQuantity = formatQuantity;

  constructor() {
    this.fetchSummary();
  }

  private fetchSummary(): void {
    this.loading.set(true);
    this.cuadreAgentesService.getSummary().subscribe({
      next: (summary) => {
        this.summary.set(summary);
        this.loading.set(false);
      },
      error: (error: HttpErrorResponse) => {
        this.loading.set(false);
        this.notificationService.error(
          extractErrorMessage(error, 'No se pudo cargar el resumen de Cuadre Agentes.')
        );
      },
    });
  }

  /**
   * "Actualizar Saldos" — vuelve a leer el mismo endpoint de solo lectura
   * (`GET /banks/cuadre-agentes-summary`) que ya usa `fetchSummary`, sin
   * tocar el signal `loading` que controla el esqueleto de carga inicial:
   * los bancos/totales previamente mostrados permanecen visibles mientras
   * la solicitud está en curso, y se mantienen intactos si falla. Nunca
   * lee ni escribe `CuadreAgentesStateService` — el conteo de efectivo es
   * un estado completamente aparte que este refresco no tiene motivo para
   * tocar.
   *
   * También se bloquea mientras `isSaving()` está en curso — sin esto, un
   * refresco disparado justo antes o durante "Guardar Cuadre" podía
   * responder *después* del propio refetch de `confirmSaveCuadre()` y
   * dejar en pantalla el resumen anterior, dando la falsa impresión de
   * que el guardado no surtió efecto.
   */
  refreshBankSummary(): void {
    if (this.isRefreshingBanks() || this.isSaving()) {
      return;
    }
    this.isRefreshingBanks.set(true);
    this.cuadreAgentesService.getSummary().subscribe({
      next: (summary) => {
        this.summary.set(summary);
        this.isRefreshingBanks.set(false);
      },
      error: (error: HttpErrorResponse) => {
        this.isRefreshingBanks.set(false);
        this.notificationService.error(
          extractErrorMessage(error, 'No fue posible actualizar los saldos. Intente nuevamente.')
        );
      },
    });
  }

  rowTotal(denomination: CashDenomination): number {
    return denomination * (this.cashCounts()[denomination] || 0);
  }

  /**
   * El directive `appDecimalInput` ya rechaza a nivel de tecla lo que no
   * corresponda a la cantidad de decimales de cada fila (0 para Q200–Q5,
   * 2 para Q1) — esto solo da forma al string final al mismo número de
   * decimales antes de guardarlo, para que un valor pegado (paste) no se
   * cuele con más precisión de la permitida.
   */
  onQuantityInput(denomination: CashDenomination, value: string): void {
    const trimmed = value.trim();
    if (trimmed === '') {
      this.state.setCount(denomination, 0);
      return;
    }
    const parsed = Number(trimmed);
    if (!Number.isFinite(parsed) || parsed < 0) {
      this.state.setCount(denomination, 0);
      return;
    }
    const decimals = decimalPlacesFor(denomination);
    const rounded = decimals === 0 ? Math.trunc(parsed) : Math.round(parsed * 100) / 100;
    this.state.setCount(denomination, rounded);
  }

  openConfirmModal(): void {
    if (!this.summary() || this.isSaving() || this.isRefreshingBanks()) {
      return;
    }
    this.isConfirmModalOpen.set(true);
  }

  cancelConfirm(): void {
    if (this.isSaving()) {
      return;
    }
    this.isConfirmModalOpen.set(false);
  }

  confirmSaveCuadre(): void {
    if (this.isSaving()) {
      return;
    }
    this.isSaving.set(true);
    this.cuadreAgentesService.registerReconciliation({ totalCash: this.totalCash() }).subscribe({
      next: () => {
        this.isSaving.set(false);
        this.isConfirmModalOpen.set(false);
        // Solo se limpia el conteo de efectivo temporal en memoria — el
        // registro histórico ya quedó guardado en `agent_reconciliations`.
        this.state.reset();
        this.notificationService.success('Cuadre Agentes guardado correctamente.');
        this.fetchSummary();
      },
      error: (error: HttpErrorResponse) => {
        this.isSaving.set(false);
        this.notificationService.error(extractErrorMessage(error, 'No se pudo guardar el Cuadre Agentes.'));
      },
    });
  }
}
