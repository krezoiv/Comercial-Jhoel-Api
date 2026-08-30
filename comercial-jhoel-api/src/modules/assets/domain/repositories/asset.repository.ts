import { Asset } from '../entities/asset.entity';

export const ASSET_REPOSITORY = Symbol('ASSET_REPOSITORY');

export type AssetSortField = 'date' | 'amount' | 'createdAt';
export type SortDirection = 'asc' | 'desc';

export interface FindAssetsOptions {
  /** undefined = both active and inactive; true/false = filtered to exactly one state. */
  isActive?: boolean;
  clientId?: string;
  dateFrom?: string;
  dateTo?: string;
  minAmount?: number;
  maxAmount?: number;
  search?: string;
  sortBy: AssetSortField;
  sortDirection: SortDirection;
  page: number;
  limit: number;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}

export interface FindAssetsReportSummaryOptions {
  isActive?: boolean;
  clientId?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}

export interface AssetsReportSummary {
  recordCount: number;
  totalAmount: number;
}

export interface CreateAssetData {
  clientId: string;
  date: string;
  amount: number;
  description: string | null;
  createdBy: string;
}

export interface UpdateAssetData {
  clientId?: string;
  date?: string;
  amount?: number;
  description?: string | null;
  updatedBy: string;
}

export interface AssetRepository {
  findAll(options: FindAssetsOptions): Promise<PaginatedResult<Asset>>;
  getReportSummary(
    options: FindAssetsReportSummaryOptions,
  ): Promise<AssetsReportSummary>;
  findById(id: string): Promise<Asset | null>;
  create(data: CreateAssetData): Promise<Asset>;
  update(id: string, data: UpdateAssetData): Promise<Asset>;
  deactivate(id: string): Promise<void>;
}
