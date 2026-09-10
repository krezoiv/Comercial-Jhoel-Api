export const PURCHASES_REPORT_REPOSITORY = Symbol(
  'PURCHASES_REPORT_REPOSITORY',
);

export type ReportSortField = 'date' | 'total';
export type SortDirection = 'asc' | 'desc';

export interface PurchasesReportFilters {
  startDate?: Date;
  endDate?: Date;
  supplierId?: string;
  categoryId?: string;
  businessId?: string;
  productId?: string;
  userId?: string;
}

export interface PurchasesReportRow {
  id: string;
  /** Stable, display-only folio derived from the id (`C-XXXXXXXX`) — never persisted. */
  purchaseNumber: string;
  purchaseDate: Date;
  supplierId: string;
  supplierName: string;
  userId: string;
  username: string;
  itemCount: number;
  total: number;
  invoiceNumber: string | null;
  isVoided: boolean;
}

export interface PurchasesReportSummary {
  totalAmount: number;
  purchasesCount: number;
  unitsPurchased: number;
  averagePurchase: number;
}

export interface PurchasesByProductRow {
  productId: string;
  productName: string;
  sku: string | null;
  quantityPurchased: number;
  totalCost: number;
}

export interface PaginatedReportResult<T> {
  items: T[];
  total: number;
}

export interface PurchasesReportRepository {
  findAll(
    filters: PurchasesReportFilters,
    page: number,
    limit: number,
    sortBy: ReportSortField,
    sortDirection: SortDirection,
  ): Promise<PaginatedReportResult<PurchasesReportRow>>;
  getSummary(filters: PurchasesReportFilters): Promise<PurchasesReportSummary>;
  getByProduct(
    filters: PurchasesReportFilters,
    page: number,
    limit: number,
  ): Promise<PaginatedReportResult<PurchasesByProductRow>>;
}
