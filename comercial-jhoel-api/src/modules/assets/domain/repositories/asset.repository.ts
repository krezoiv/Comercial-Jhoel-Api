import { Asset, AssetMovementType } from '../entities/asset.entity';

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

/** One Kardex movement, backing the "Registrar Cargo"/"Registrar Abono" flow — invokes `register_asset_movement`. */
export interface RegisterAssetMovementData {
  clientId: string;
  movementType: AssetMovementType;
  amount: number;
  date: string;
  description: string | null;
  createdBy: string;
}

export interface StatementMovement {
  id: string;
  date: string;
  movementType: AssetMovementType;
  description: string | null;
  amount: number;
  /** The running balance immediately after this movement — computed fresh on every read, never stored (see the migration's own doc comment for why). */
  balanceAfter: number;
  createdByUsername: string;
  createdAt: Date;
}

export interface GetAssetStatementOptions {
  /** Omit for "since the beginning" — `openingBalance` is then always 0. */
  dateFrom?: string;
  dateTo?: string;
}

export interface AssetStatement {
  clientId: string;
  clientName: string;
  /** The signed running balance immediately before `dateFrom` — 0 if `dateFrom` is omitted, never assumed zero when real prior activity exists. */
  openingBalance: number;
  movements: StatementMovement[];
  totalCargos: number;
  totalAbonos: number;
  closingBalance: number;
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
  /** Invokes the `register_asset_movement` Postgres function — validation, balance computation (for logging/return purposes only, never enforced here — see that function's own doc comment for why Activos allows a negative balance), and the insert all happen atomically, serialized per client via an advisory lock. */
  registerMovement(data: RegisterAssetMovementData): Promise<Asset>;
  /** The client's current signed balance — a single bounded aggregate, never a full-history fetch. */
  getCurrentBalance(clientId: string): Promise<number>;
  getStatement(
    clientId: string,
    options: GetAssetStatementOptions,
  ): Promise<AssetStatement>;
}
