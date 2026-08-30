import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import {
  BankBalancesValidation,
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
import { DayStatusService } from '../../../core/services/day-status.service';
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
    RouterLink,
  ],
  templateUrl: './cuadre-agentes-page.component.html',
  styleUrl: './cuadre-agentes-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CuadreAgentesPageComponent {
  private readonly cuadreAgentesService = inject(CuadreAgentesService);
  private readonly state = inject(CuadreAgentesStateService);
  protected readonly dayStatusService = inject(DayStatusService);
  private readonly notificationService = inject(NotificationService);

  readonly denominations = CASH_DENOMINATIONS;
  readonly cashCounts = this.state.cashCounts;
  readonly decimalPlacesFor = decimalPlacesFor;

  readonly summary = signal<CuadreAgentesSummary | null>(null);
  readonly loading = signal(true);

  readonly isConfirmModalOpen = signal(false);
  readonly isSaving = signal(false);
  readonly isRefreshingBanks = signal(false);

  /**
   * "¿Se guardaron los saldos bancarios de esta fecha?" — la regla que
   * bloquea "Guardar Cuadre" hasta que exista un cuadre diario en
   * Agentes Bancarios → Bancos para la misma fecha (siempre "hoy" en
   * este módulo, que no tiene selector de fecha propio). `null` mientras
   * no se conoce la respuesta todavía (carga inicial); en ese estado el
   * botón de guardar también permanece deshabilitado — nunca se asume
   * "sí se puede" por defecto.
   */
  readonly bankBalancesValidation = signal<BankBalancesValidation | null>(null);
  readonly isValidatingBankBalances = signal(true);

  /** "Apertura del Día" — `DayStatusService` es el singleton compartido con Bancos/Sidebar; refleja si HOY ya está aperturado. */
  readonly dayOpened = computed(() => this.dayStatusService.status()?.isOpened === true);

  /** "Cierre del Día" — una vez guardado el cuadre, HOY queda cerrado y bloqueado para un nuevo ciclo hasta que cambie la fecha. */
  readonly dayClosed = computed(() => this.dayStatusService.status()?.isClosed === true);

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
    this.validateBankBalances();
  }

  /**
   * Corre automáticamente al entrar al módulo (constructor) — Angular
   * destruye y vuelve a crear este componente en cada navegación a esta
   * ruta, así que un "Ir a registrar saldos" → guardar en Bancos → volver
   * aquí ya dispara esta misma llamada de nuevo sin ningún código extra
   * ("no requerir recarga manual del navegador").
   */
  private validateBankBalances(): void {
    this.isValidatingBankBalances.set(true);
    this.cuadreAgentesService.validateBankBalances().subscribe({
      next: (validation) => {
        this.bankBalancesValidation.set(validation);
        this.isValidatingBankBalances.set(false);
      },
      error: (error: HttpErrorResponse) => {
        this.isValidatingBankBalances.set(false);
        this.notificationService.error(
          extractErrorMessage(error, 'No se pudo verificar si los saldos bancarios ya fueron registrados.')
        );
      },
    });
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

  /** Nunca abre el modal de confirmación si el pre-chequeo del backend aún no confirma que la fecha puede cuadrarse — ver `canSaveCuadre`. */
  openConfirmModal(): void {
    if (!this.canSaveCuadre()) {
      return;
    }
    this.isConfirmModalOpen.set(true);
  }

  /**
   * Reúne todas las razones por las que "Guardar Cuadre" debe permanecer
   * deshabilitado, incluyendo la nueva regla obligatoria: no se puede
   * cuadrar sin saldos bancarios guardados para esta fecha. El backend
   * (`CreateAgentReconciliationUseCase`) vuelve a exigir exactamente esto
   * de forma independiente — este computed es solo la mejora de
   * experiencia de usuario, nunca la barrera real.
   */
  readonly canSaveCuadre = computed(
    () =>
      !!this.summary() &&
      !this.isSaving() &&
      !this.isRefreshingBanks() &&
      !this.isValidatingBankBalances() &&
      !this.dayStatusService.loading() &&
      this.dayOpened() &&
      !this.dayClosed() &&
      this.bankBalancesValidation()?.canReconcile === true,
  );

  /** Página completa habilitada — mismas condiciones que `canSaveCuadre` salvo `isSaving`/`isRefreshingBanks`, que no impiden VER el contenido, solo guardarlo. */
  readonly canAccessReconciliation = computed(
    () =>
      !this.loading() &&
      !this.isValidatingBankBalances() &&
      !this.dayStatusService.loading() &&
      this.dayOpened() &&
      !this.dayClosed() &&
      this.bankBalancesValidation()?.canReconcile === true,
  );

  readonly isCheckingAccess = computed(
    () => this.loading() || this.isValidatingBankBalances() || this.dayStatusService.loading(),
  );

  cancelConfirm(): void {
    if (this.isSaving()) {
      return;
    }
    this.isConfirmModalOpen.set(false);
  }

  /**
   * "Guardar Cuadre" ahora también cierra el día — una sola llamada
   * atómica en el backend (`CloseAgentDayUseCase`/`close_agent_day`).
   * `dayStatusService.refresh()` es lo que hace que el Sidebar y esta
   * misma página reaccionen de inmediato: el próximo `computed` de
   * `dayClosed()` pasa a `true` sin recargar el navegador, y la página
   * cae sola en la rama "Día Cerrado" del template.
   */
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
        this.notificationService.success(
          'El cuadre fue guardado y el día fue cerrado exitosamente. El sistema está listo para iniciar el siguiente ciclo de cuadre.',
        );
        this.dayStatusService.refresh();
        this.fetchSummary();
      },
      error: (error: HttpErrorResponse) => {
        this.isSaving.set(false);
        this.notificationService.error(extractErrorMessage(error, 'No se pudo guardar el Cuadre Agentes.'));
      },
    });
  }
}
