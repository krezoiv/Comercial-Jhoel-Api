export const ICE_CREAM_PURCHASES_REPORT_REPOSITORY = Symbol(
  'ICE_CREAM_PURCHASES_REPORT_REPOSITORY',
);

export interface IceCreamPurchasesReportFilters {
  startDate?: Date;
  endDate?: Date;
  iceCreamId?: string;
  supplierId?: string;
  userId?: string;
}

/** One row per line item across every purchase in range — not one row per purchase — matching the flat table the report screen shows. */
export interface IceCreamPurchasesReportRow {
  id: string;
  purchaseId: string;
  date: Date;
  supplierId: string;
  supplierName: string;
  product: string;
  sku: string;
  quantity: number;
  costPrice: number;
  total: number;
  userId: string;
  username: string;
}

export interface IceCreamPurchasesReportSummary {
  totalPurchased: number;
  totalQuantity: number;
  recordCount: number;
  averageCost: number;
}

export interface PaginatedReportResult<T> {
  items: T[];
  total: number;
}

export interface IceCreamPurchasesReportRepository {
  findAll(
    filters: IceCreamPurchasesReportFilters,
    page: number,
    limit: number,
  ): Promise<PaginatedReportResult<IceCreamPurchasesReportRow>>;
  getSummary(
    filters: IceCreamPurchasesReportFilters,
  ): Promise<IceCreamPurchasesReportSummary>;
}
