import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { catchError, of } from 'rxjs';

import { RechargesService } from '../../../../../core/services/recharges.service';
import { RechargeOperatorStat, calculateBalancePercentage } from '../../../../../core/models';
import { formatCurrency } from '../../../../../core/utils/number-format.util';
import { DonutChartComponent, DonutSegment, GaugeRingComponent } from '../../../../../shared/ui';

/** Same name-matching convention the backend's own `GetRechargeSalesSummaryUseCase` already uses (`KNOWN_RECHARGE_TYPE_NAMES`) — Claro/Tigo stay two fixed cards even though the backend response is a generic per-type array. */
const CLARO_NAME = 'Claro';
const TIGO_NAME = 'Tigo';

function emptyStat(name: string): RechargeOperatorStat {
  return {
    rechargeTypeId: '',
    rechargeTypeName: name,
    salesThisMonth: 0,
    purchasesThisMonth: 0,
    currentBalance: 0,
    balanceLimit: 0,
  };
}

/**
 * "Indicadores de Recargas Electrónicas" — 4 gráficas de anillo en Resumen,
 * justo debajo de `TransactionMonthlyChartComponent` (sin tocarlo). Un solo
 * fetch (`getOperatorsSummary()`) alimenta las 4 tarjetas — nunca 4
 * llamadas separadas al mismo endpoint. Misma fuente de datos que ya usa
 * el módulo de Recargas Electrónicas (saldo, ventas, compras) — nada se
 * recalcula aquí, solo se separa por operadora y se formatea.
 */
@Component({
  selector: 'app-recharge-indicators-section',
  standalone: true,
  imports: [DonutChartComponent, GaugeRingComponent],
  templateUrl: './recharge-indicators-section.component.html',
  styleUrl: './recharge-indicators-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RechargeIndicatorsSectionComponent {
  private readonly rechargesService = inject(RechargesService);

  readonly formatCurrency = formatCurrency;

  readonly loading = signal(true);
  readonly loadError = signal(false);
  private readonly operators = signal<RechargeOperatorStat[]>([]);

  readonly claro = computed(
    () => this.operators().find((op) => op.rechargeTypeName === CLARO_NAME) ?? emptyStat(CLARO_NAME),
  );
  readonly tigo = computed(
    () => this.operators().find((op) => op.rechargeTypeName === TIGO_NAME) ?? emptyStat(TIGO_NAME),
  );

  readonly salesSegments = computed<DonutSegment[]>(() => [
    { label: CLARO_NAME, value: this.claro().salesThisMonth, color: 'var(--color-operator-claro)' },
    { label: TIGO_NAME, value: this.tigo().salesThisMonth, color: 'var(--color-operator-tigo)' },
  ]);

  readonly purchaseSegments = computed<DonutSegment[]>(() => [
    { label: CLARO_NAME, value: this.claro().purchasesThisMonth, color: 'var(--color-operator-claro)' },
    { label: TIGO_NAME, value: this.tigo().purchasesThisMonth, color: 'var(--color-operator-tigo)' },
  ]);

  readonly claroPercentage = computed(() => calculateBalancePercentage(this.claro().currentBalance, this.claro().balanceLimit));
  readonly tigoPercentage = computed(() => calculateBalancePercentage(this.tigo().currentBalance, this.tigo().balanceLimit));

  constructor() {
    this.fetch();
  }

  fetch(): void {
    this.loading.set(true);
    this.loadError.set(false);
    this.rechargesService
      .getOperatorsSummary()
      .pipe(catchError(() => of(null)))
      .subscribe((response) => {
        this.loading.set(false);
        if (!response) {
          this.loadError.set(true);
          return;
        }
        this.operators.set(response.operators);
      });
  }
}
