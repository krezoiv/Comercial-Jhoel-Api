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

/** Everything the "Arqueo de Caja" modal edits — kept to restore it on "Cancelar". */
export interface CuadreArqueoSnapshot {
  cashCounts: CashCount;
  origin: CashBreakdownOrigin;
  warehouseCounts: CashCount;
  observations: string;
  confirmed: boolean;
}

/**
 * Holds the Cuadre Agentes page's cash-count quantities in a root-provided
 * singleton — the same `providedIn: 'root'` + signals technique the draft
 * stores use for surviving component destruction on route navigation.
 * In-memory only: losing an unsaved count on a hard reload is acceptable.
 *
 * Also tracks the breakdown's origin: a manual count, or the latest Arqueo
 * de Caja loaded as a starting point (and whether it was edited afterwards).
 * The arqueo is only copied into this local state — never modified.
 *
 * "Arqueo de Caja" (migration 1760008800000): the caja count and the
 * independent physical Bodega count, plus observations. `confirmed` turns
 * true on "Confirmar Arqueo"; "Guardar Cuadre" needs it. The modal edits
 * these signals live and restores the snapshot taken on opening when it is
 * cancelled.
 */
@Injectable({ providedIn: 'root' })
export class CuadreAgentesStateService {
  readonly cashCounts = signal<CashCount>(createEmptyCashCount());
  readonly origin = signal<CashBreakdownOrigin>(MANUAL_ORIGIN);
  /** Physical Bodega count — never copied from the caja count. */
  readonly warehouseCounts = signal<CashCount>(createEmptyCashCount());
  readonly observations = signal('');
  readonly confirmed = signal(false);

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

  /** "Limpiar" (caja): empty caja count, origin back to "Conteo manual". Bodega is untouched. */
  clear(): void {
    this.cashCounts.set(createEmptyCashCount());
    this.origin.set(MANUAL_ORIGIN);
  }

  /** Edit of one Bodega row (independent from the caja count). */
  setWarehouseCount(denomination: CashDenomination, quantity: number): void {
    if (this.warehouseCounts()[denomination] === quantity) {
      return;
    }
    this.warehouseCounts.update((counts) => ({ ...counts, [denomination]: quantity }));
  }

  /** "Limpiar" (Bodega): empty Bodega count. The caja count is untouched. */
  clearWarehouse(): void {
    this.warehouseCounts.set(createEmptyCashCount());
  }

  snapshot(): CuadreArqueoSnapshot {
    return {
      cashCounts: { ...this.cashCounts() },
      origin: { ...this.origin() },
      warehouseCounts: { ...this.warehouseCounts() },
      observations: this.observations(),
      confirmed: this.confirmed(),
    };
  }

  /** "Cancelar" in the modal: back to exactly what there was before opening it. */
  restore(snapshot: CuadreArqueoSnapshot): void {
    this.cashCounts.set({ ...snapshot.cashCounts });
    this.origin.set({ ...snapshot.origin });
    this.warehouseCounts.set({ ...snapshot.warehouseCounts });
    this.observations.set(snapshot.observations);
    this.confirmed.set(snapshot.confirmed);
  }

  /** Bodega count, every denomination — sent with the cuadre. */
  warehouseDetails(): Array<{ denomination: number; quantity: number }> {
    const counts = this.warehouseCounts();
    return CASH_DENOMINATIONS.map((denomination) => ({ denomination, quantity: counts[denomination] || 0 }));
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
    this.clearWarehouse();
    this.observations.set('');
    this.confirmed.set(false);
  }
}
