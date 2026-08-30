export const SALES_REPORT_REPOSITORY = Symbol('SALES_REPORT_REPOSITORY');

export type ReportSortField = 'date' | 'total';
export type SortDirection = 'asc' | 'desc';

/**
 * Shared shape across every sales-report query — `findAll`, `getSummary`,
 * and `getByProduct` all accept the same filter set so the three numbers on
 * screen (list, KPI tiles, product breakdown) always describe the exact same
 * slice of data. `startDate`/`endDate` are already resolved to real `Date`
 * range boundaries (start of day / end of day) by the use case layer —
 * this repository never re-interprets a raw string.
 */
export interface SalesReportFilters {
  startDate?: Date;
  endDate?: Date;
  categoryId?: string;
  businessId?: string;
  productId?: string;
  userId?: string;
}

/** One row per sale — the "Productos" count is every line in that sale, regardless of whether a category/product filter is active (that filter only decides *which sales appear*, not which of their lines count). */
export interface SalesReportRow {
  id: string;
  /** Stable, display-only folio derived from the id (`V-XXXXXXXX`) — never persisted, never used to sort or look anything up. */
  saleNumber: string;
  saleDate: Date;
  userId: string;
  username: string;
  itemCount: number;
  total: number;
}

/** `unitsSold` DOES respect the category/product filter (unlike a row's `itemCount`) — it's a "how many units of what I filtered for" KPI, not "how many line items". */
export interface SalesReportSummary {
  totalAmount: number;
  salesCount: number;
  unitsSold: number;
  averageTicket: number;
}

export interface SalesByProductRow {
  productId: string;
  productName: string;
  sku: string | null;
  quantitySold: number;
  totalRevenue: number;
}

export interface PaginatedReportResult<T> {
  items: T[];
  total: number;
}

export interface SalesReportRepository {
  findAll(
    filters: SalesReportFilters,
    page: number,
    limit: number,
    sortBy: ReportSortField,
    sortDirection: SortDirection,
  ): Promise<PaginatedReportResult<SalesReportRow>>;
  getSummary(filters: SalesReportFilters): Promise<SalesReportSummary>;
  getByProduct(
    filters: SalesReportFilters,
    page: number,
    limit: number,
  ): Promise<PaginatedReportResult<SalesByProductRow>>;
}
