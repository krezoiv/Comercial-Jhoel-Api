import { Injectable, signal } from '@angular/core';

import { CashCount, CashDenomination, createEmptyCashCount } from '../models';

/**
 * Holds the Cuadre Agentes page's cash-count quantities in a root-provided
 * singleton — the same `providedIn: 'root'` + signals technique
 * `PurchaseDraftStore`/`SalesDraftStore`/the Reportería state services
 * already established for surviving component destruction on route
 * navigation. Deliberately in-memory only, no `sessionStorage`: this is
 * "primera etapa" per the ticket's own explicit instruction — there is no
 * real cuadre being persisted yet, only a scratch count the user is
 * building, so losing it on a hard reload (but not on navigating away and
 * back) is an acceptable, temporary trade-off for this stage.
 */
@Injectable({ providedIn: 'root' })
export class CuadreAgentesStateService {
  readonly cashCounts = signal<CashCount>(createEmptyCashCount());

  setCount(denomination: CashDenomination, quantity: number): void {
    this.cashCounts.update((counts) => ({ ...counts, [denomination]: quantity }));
  }

  /**
   * Segunda etapa — llamado únicamente después de un "Guardar Cuadre" exitoso.
   * Solo limpia este estado temporal en memoria; el registro histórico ya
   * quedó guardado en `agent_reconciliations` antes de que esto se ejecute,
   * así que nunca borra nada persistido.
   */
  reset(): void {
    this.cashCounts.set(createEmptyCashCount());
  }
}
