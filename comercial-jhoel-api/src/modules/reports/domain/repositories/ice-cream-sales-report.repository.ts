export const ICE_CREAM_SALES_REPORT_REPOSITORY = Symbol(
  'ICE_CREAM_SALES_REPORT_REPOSITORY',
);

export interface IceCreamSalesReportFilters {
  startDate?: Date;
  endDate?: Date;
  iceCreamId?: string;
  userId?: string;
  minPrice?: number;
  maxPrice?: number;
  minQuantity?: number;
}

/** One row per line item across every sale in range — not one row per sale — matching the flat table the report screen shows. */
export interface IceCreamSalesReportRow {
  id: string;
  saleId: string;
  date: Date;
  product: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  total: number;
  userId: string;
  username: string;
}

export interface IceCreamSalesReportSummary {
  totalSold: number;
  totalQuantity: number;
  recordCount: number;
  averagePrice: number;
}

export interface PaginatedReportResult<T> {
  items: T[];
  total: number;
}

export interface IceCreamSalesReportRepository {
  findAll(
    filters: IceCreamSalesReportFilters,
    page: number,
    limit: number,
  ): Promise<PaginatedReportResult<IceCreamSalesReportRow>>;
  getSummary(
    filters: IceCreamSalesReportFilters,
  ): Promise<IceCreamSalesReportSummary>;
}
