/**
 * Read-only view of the Bodega cash balance (its own Kardex, owned by
 * Control de Efectivo) for Cuadre de Agentes, which is the consolidated cash
 * cuadre: caja count + Bodega. A port of its own so the banks module does
 * not depend on the cash-control module.
 */
export const WAREHOUSE_CASH_READER = Symbol('WAREHOUSE_CASH_READER');

export interface WarehouseCashReader {
  /** Official Bodega balance right now (`warehouse_cash_balance()`). */
  getBalance(): Promise<number>;
}
