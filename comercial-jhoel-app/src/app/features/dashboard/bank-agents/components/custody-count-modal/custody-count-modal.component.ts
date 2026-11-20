import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

import {
  CASH_DENOMINATIONS,
  CashBreakdownOrigin,
  CashCount,
  CashDenomination,
  calculateTotalCash,
  cashDifference,
  denominationSubtotal,
  formatCurrency,
} from '../../../../../core/models';
import { DecimalInputDirective } from '../../../../../shared/directives/decimal-input.directive';
import { ButtonComponent, IconComponent } from '../../../../../shared/ui';
import { CuadreCashSourceComponent } from '../cuadre-cash-source/cuadre-cash-source.component';

export type CustodyLocation = 'CAJA' | 'BODEGA';

export interface CustodyQuantityChange {
  denomination: CashDenomination;
  quantity: number;
}

/** One location's row of the consolidated table. */
interface LocationRow {
  label: string;
  tone: 'caja' | 'bodega' | 'total';
  theoretical: number | null;
  counted: number;
  difference: number | null;
}

/** "+Q 100.00" / "-Q 100.00" / "Q 0.00" — the sign is never hidden. */
export function formatSignedDifference(value: number | null): string {
  if (value === null) {
    return '—';
  }
  if (value === 0) {
    return formatCurrency(0);
  }
  return `${value > 0 ? '+' : '−'}${formatCurrency(Math.abs(value))}`;
}

/** Whole quantity ≥ 0 from what was typed (empty, negative or invalid → 0). */
export function parseQuantity(value: string): number {
  const trimmed = value.trim();
  const parsed = Number(trimmed);
  return trimmed === '' || !Number.isFinite(parsed) || parsed < 0 ? 0 : Math.trunc(parsed);
}

/**
 * Cuadre de Agentes → "Arqueo de Caja": the general cash count of the end of
 * the day, with two INDEPENDENT physical counts — the cash in the caja and
 * the cash kept in Bodega — each compared with its own theoretical balance.
 * Individual differences are always shown next to the consolidated one, so
 * a caja shortage offset by a Bodega surplus never looks like "cuadrado".
 *
 * Presentational: the counts live in `CuadreAgentesStateService` and every
 * edit is emitted to the page. The previews here are UX only — the backend
 * reads both theoretical balances again, recomputes every difference and
 * stores the photograph when the cuadre is saved.
 */
@Component({
  selector: 'app-custody-count-modal',
  standalone: true,
  imports: [NgTemplateOutlet, ButtonComponent, IconComponent, DecimalInputDirective, CuadreCashSourceComponent],
  templateUrl: './custody-count-modal.component.html',
  styleUrl: './custody-count-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustodyCountModalComponent {
  readonly open = input(false);
  readonly cashCounts = input.required<CashCount>();
  readonly warehouseCounts = input.required<CashCount>();
  readonly origin = input.required<CashBreakdownOrigin>();
  readonly hasCashQuantities = input(false);
  readonly loadingCount = input(false);
  /** Official balances (`null` while they load). */
  readonly cashTheoretical = input<number | null>(null);
  readonly warehouseTheoretical = input<number | null>(null);
  readonly observations = input('');

  readonly cashQuantity = output<CustodyQuantityChange>();
  readonly warehouseQuantity = output<CustodyQuantityChange>();
  readonly loadLatest = output<void>();
  readonly clearCash = output<void>();
  readonly clearWarehouse = output<void>();
  readonly observationsChange = output<string>();
  readonly cancelled = output<void>();
  readonly confirmed = output<void>();

  readonly denominations = CASH_DENOMINATIONS;
  readonly formatCurrency = formatCurrency;
  readonly formatDifference = formatSignedDifference;

  readonly cashTotal = computed(() => calculateTotalCash(this.cashCounts()));
  readonly warehouseTotal = computed(() => calculateTotalCash(this.warehouseCounts()));
  readonly countedTotal = computed(() => cashDifference(this.cashTotal() + this.warehouseTotal(), 0));
  readonly theoreticalTotal = computed(() => {
    const cash = this.cashTheoretical();
    const warehouse = this.warehouseTheoretical();
    return cash === null || warehouse === null ? null : cashDifference(cash + warehouse, 0);
  });
  readonly cashDiff = computed(() => {
    const theoretical = this.cashTheoretical();
    return theoretical === null ? null : cashDifference(this.cashTotal(), theoretical);
  });
  readonly warehouseDiff = computed(() => {
    const theoretical = this.warehouseTheoretical();
    return theoretical === null ? null : cashDifference(this.warehouseTotal(), theoretical);
  });
  readonly consolidatedDiff = computed(() => {
    const theoretical = this.theoreticalTotal();
    return theoretical === null ? null : cashDifference(this.countedTotal(), theoretical);
  });

  readonly rows = computed<LocationRow[]>(() => [
    {
      label: 'Caja',
      tone: 'caja',
      theoretical: this.cashTheoretical(),
      counted: this.cashTotal(),
      difference: this.cashDiff(),
    },
    {
      label: 'Bodega',
      tone: 'bodega',
      theoretical: this.warehouseTheoretical(),
      counted: this.warehouseTotal(),
      difference: this.warehouseDiff(),
    },
    {
      label: 'Consolidado',
      tone: 'total',
      theoretical: this.theoreticalTotal(),
      counted: this.countedTotal(),
      difference: this.consolidatedDiff(),
    },
  ]);

  /** The consolidated figure hides opposite individual differences: say so explicitly. */
  readonly offsetWarning = computed(() => {
    const cash = this.cashDiff();
    const warehouse = this.warehouseDiff();
    if (cash === null || warehouse === null || cash === 0 || warehouse === 0 || Math.sign(cash) === Math.sign(warehouse)) {
      return null;
    }
    const describe = (place: string, value: number) =>
      `${place} tiene un ${value < 0 ? 'faltante' : 'sobrante'} de ${formatCurrency(Math.abs(value))}`;
    return `${describe('Caja', cash)} y ${describe('Bodega', warehouse)}. El consolidado no compensa esas diferencias: cada una queda registrada.`;
  });

  tone(value: number | null): 'ok' | 'short' | 'over' | 'none' {
    if (value === null) {
      return 'none';
    }
    return value === 0 ? 'ok' : value < 0 ? 'short' : 'over';
  }

  toneLabel(value: number | null): string {
    const tone = this.tone(value);
    return tone === 'ok' ? 'Cuadra' : tone === 'short' ? 'Faltante' : tone === 'over' ? 'Sobrante' : 'Sin teórico';
  }

  subtotal(counts: CashCount, denomination: CashDenomination): number {
    return denominationSubtotal(denomination, counts[denomination]);
  }

  onQuantity(location: CustodyLocation, denomination: CashDenomination, value: string): void {
    const change = { denomination, quantity: parseQuantity(value) };
    if (location === 'CAJA') {
      this.cashQuantity.emit(change);
    } else {
      this.warehouseQuantity.emit(change);
    }
  }

  onObservations(value: string): void {
    this.observationsChange.emit(value.slice(0, 500));
  }
}
