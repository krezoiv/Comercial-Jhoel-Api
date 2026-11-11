import { Injectable, computed, signal } from '@angular/core';

import {
  CASH_DENOMINATIONS,
  CashBreakdownOrigin,
  CashCount,
  CashDenomination,
  LoadedCashCountInfo,
  createEmptyCashCount,
  hasAnyQuantity,
} from '../models';

const MANUAL_ORIGIN: CashBreakdownOrigin = { loadedCount: null, modifiedAfterLoad: false };

/**
 * Holds the Cuadre Agentes page's cash-count quantities in a root-provided
 * singleton — the same `providedIn: 'root'` + signals technique the draft
 * stores use for surviving component destruction on route navigation.
 * In-memory only: losing an unsaved count on a hard reload is acceptable.
 *
 * Also tracks the breakdown's origin: a manual count, or the latest Arqueo
 * de Caja loaded as a starting point (and whether it was edited afterwards).
 * The arqueo is only copied into this local state — never modified.
 */
@Injectable({ providedIn: 'root' })
export class CuadreAgentesStateService {
  readonly cashCounts = signal<CashCount>(createEmptyCashCount());
  readonly origin = signal<CashBreakdownOrigin>(MANUAL_ORIGIN);

  /** Whether any quantity is currently entered. */
  readonly hasQuantities = computed(() => hasAnyQuantity(this.cashCounts()));

  /** Manual edit of one row — after loading an arqueo it marks the breakdown as modified. */
  setCount(denomination: CashDenomination, quantity: number): void {
    if (this.cashCounts()[denomination] === quantity) {
      return;
    }
    this.cashCounts.update((counts) => ({ ...counts, [denomination]: quantity }));
    if (this.origin().loadedCount) {
      this.origin.update((origin) => ({ ...origin, modifiedAfterLoad: true }));
    }
  }

  /** Replaces every quantity with an arqueo's breakdown (as an independent copy). */
  loadFromCount(counts: CashCount, info: LoadedCashCountInfo): void {
    this.cashCounts.set({ ...counts });
    this.origin.set({ loadedCount: info, modifiedAfterLoad: false });
  }

  /** "Limpiar": empty form, origin back to "Conteo manual". */
  clear(): void {
    this.cashCounts.set(createEmptyCashCount());
    this.origin.set(MANUAL_ORIGIN);
  }

  /** Every denomination with its quantity — the exact breakdown sent with the cuadre. */
  details(): Array<{ denomination: number; quantity: number }> {
    const counts = this.cashCounts();
    return CASH_DENOMINATIONS.map((denomination) => ({ denomination, quantity: counts[denomination] || 0 }));
  }

  /**
   * Called only after a successful "Guardar Cuadre". Only clears this
   * temporary in-memory state; the historical record (with its breakdown
   * photograph) is already saved before this runs.
   */
  reset(): void {
    this.clear();
  }
}
