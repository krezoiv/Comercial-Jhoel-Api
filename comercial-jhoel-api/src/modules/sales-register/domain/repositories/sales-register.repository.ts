export const SALES_REGISTER_REPOSITORY = Symbol('SALES_REGISTER_REPOSITORY');

export interface DateRange {
  start: Date;
  end: Date;
}

export interface BusinessTotalsRow {
  businessId: string;
  businessName: string;
  salesCount: number;
  productsCount: number;
  totalAmount: number;
}

export interface BusinessProductRow {
  businessId: string;
  productId: string;
  productName: string;
  sku: string | null;
  quantitySold: number;
  totalRevenue: number;
}

export interface OverallTotals {
  totalAmount: number;
  salesCount: number;
}

export interface SalesRegisterRawData {
  overall: OverallTotals;
  businessTotals: BusinessTotalsRow[];
  productRows: BusinessProductRow[];
}

export interface SalesRegisterRepository {
  /**
   * Three bounded, parallel queries (never N+1 — one per business, one per
   * product) for a single day range: overall totals straight from `sales`
   * (never derived by summing a join, which would double-count a sale that
   * touches several businesses), per-business totals (its own
   * `COUNT(DISTINCT sale_id)` — a business's own "ventas realizadas" must
   * count each sale once even if that business isn't the only one on it),
   * and per-(business, product) rows for the drill-down breakdown.
   */
  getDailyData(range: DateRange): Promise<SalesRegisterRawData>;
}
