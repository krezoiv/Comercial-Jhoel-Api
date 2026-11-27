import { Asset, AssetMovementType } from '../entities/asset.entity';
import type { TransactionContext } from '../../../../shared/application/ports/transaction-manager.port';
import type {
  PortfolioPaymentMethod,
  PortfolioRecordTrace,
  PortfolioStatement,
  PortfolioStatementMovement,
} from '../../../../shared/domain/portfolio-record';

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
  paymentMethod: PortfolioPaymentMethod;
  createdBy: string;
}

export interface UpdateAssetData {
  clientId?: string;
  date?: string;
  amount?: number;
  description?: string | null;
  paymentMethod?: PortfolioPaymentMethod;
  /** Mandatory (≥5) when amount or payment method change — enforced by the database. */
  reason?: string | null;
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
  /** Origen polimórfico — `null` para un movimiento registrado directo en Activos; `'BANK_DEPOSIT'` + id de la operación cuando lo genera Transaccionar. */
  referenceType?: string | null;
  referenceId?: string | null;
  /** null/undefined = EFECTIVO. */
  paymentMethod?: PortfolioPaymentMethod | null;
}

/** A statement row: voided rows included (balanceAfter null), each with its cash trace. */
export type StatementMovement = PortfolioStatementMovement;

export interface GetAssetStatementOptions {
  dateFrom?: string;
  dateTo?: string;
  includeVoided?: boolean;
}

export type AssetStatement = PortfolioStatement;

export interface AssetRepository {
  findAll(options: FindAssetsOptions): Promise<PaginatedResult<Asset>>;
  getReportSummary(
    options: FindAssetsReportSummaryOptions,
  ): Promise<AssetsReportSummary>;
  findById(id: string, context?: TransactionContext): Promise<Asset | null>;
  create(data: CreateAssetData): Promise<Asset>;
  update(id: string, data: UpdateAssetData): Promise<Asset>;
  /** Voids with a reason (≥5): reverses its Caja effect, keeps the row and its history. */
  deactivate(id: string, reason: string, userId: string): Promise<void>;
  /** Invokes the `register_asset_movement` Postgres function — validation, balance computation (for logging/return purposes only, never enforced here — see that function's own doc comment for why Activos allows a negative balance), and the insert all happen atomically, serialized per client via an advisory lock. */
  registerMovement(
    data: RegisterAssetMovementData,
    context?: TransactionContext,
  ): Promise<Asset>;
  /** The client's current signed balance — a single bounded aggregate, never a full-history fetch. */
  getCurrentBalance(clientId: string): Promise<number>;
  /** Payment method, Kardex movements and change history of one record (null when it does not exist). */
  getTrace(id: string): Promise<PortfolioRecordTrace | null>;
  getStatement(
    clientId: string,
    options: GetAssetStatementOptions,
  ): Promise<AssetStatement>;
}
