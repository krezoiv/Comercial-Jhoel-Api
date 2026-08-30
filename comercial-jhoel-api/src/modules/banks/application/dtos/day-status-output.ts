/**
 * Estado conceptual del "ciclo de trabajo" de una fecha — cinco valores,
 * derivados siempre desde los mismos tres hechos independientes
 * (`isOpened`/`bankBalancesSaved`/`isClosed`), nunca almacenados aparte:
 * - `NOT_OPENED`: no existe fila en `day_openings` para esta fecha.
 * - `OPENED`: aperturado, pero no todos los bancos activos tienen saldo
 *   guardado para esta fecha todavía.
 * - `BANK_BALANCES_SAVED`: todos los saldos guardados, cuadre aún no
 *   realizado — Cuadre Agentes ya está habilitado.
 * - `RECONCILIATION_COMPLETED`: existe un cuadre guardado para esta
 *   fecha pero el día no quedó formalmente cerrado — solo puede darse en
 *   datos anteriores a "Cierre del Día" (desde este ticket, guardar un
 *   cuadre siempre cierra el día en la misma operación atómica, así que
 *   este estado nunca se produce para un cuadre nuevo).
 * - `CLOSED`: el ciclo de esta fecha terminó — bloqueado para nuevas
 *   operaciones por el flujo normal.
 */
export type DayWorkStatus =
  | 'NOT_OPENED'
  | 'OPENED'
  | 'BANK_BALANCES_SAVED'
  | 'RECONCILIATION_COMPLETED'
  | 'CLOSED';

export interface DayStatusOutput {
  date: string;
  status: DayWorkStatus;
  isOpened: boolean;
  bankBalancesSaved: boolean;
  canAccessReconciliation: boolean;
  reconciliationCompleted: boolean;
  isClosed: boolean;
}
