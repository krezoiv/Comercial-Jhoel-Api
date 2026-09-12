export interface RechargeSalesSummaryOutput {
  date: string;
  totalClaro: number;
  totalTigo: number;
  /** Recargas electrónicas only — unchanged shape, kept for whatever already reads just this figure. */
  totalSales: number;
  /** Real `SUM(sale_price)` of `recharge_sim_sale_registrations` for this date, excluding anuladas — see that repository's own `getTotalByDate` doc comment. */
  totalSimSales: number;
  /** `totalSales + totalSimSales` — the single number "Total Recaudado" displays, and the same one `register_recharge_sales_closure` compares `totalCollected` against. The frontend never computes this itself. */
  totalRecaudado: number;
  /** `null` until a closure has been saved for this date. */
  totalCollected: number | null;
  /** `null` until a closure has been saved for this date — `totalRecaudado - totalCollected` as of the saved closure (recargas + ventas de SIM combined, per the cuadre's own recomputation inside `register_recharge_sales_closure`). */
  difference: number | null;
  savedClosure: boolean;
}
