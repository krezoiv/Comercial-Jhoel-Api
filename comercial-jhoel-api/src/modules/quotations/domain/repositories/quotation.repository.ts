import { Quotation } from '../entities/quotation.entity';

export const QUOTATION_REPOSITORY = Symbol('QUOTATION_REPOSITORY');

export interface CreateQuotationItemData {
  productId: string;
  quantity: number;
  discount: number;
}

export interface CreateQuotationData {
  userId: string;
  clientId: string;
  expirationDate: string;
  observations: string | null;
  commercialTerms: string | null;
  items: CreateQuotationItemData[];
}

/** A filter value of `'VENCIDA'` is never a stored status — it resolves to `status = 'PENDIENTE' AND expiration_date < today`, the same derivation `toQuotationOutput` applies per-row. Filtering by `'PENDIENTE'` conversely excludes rows that have since expired (those are `'VENCIDA'` now, not `'PENDIENTE'`). */
export type QuotationStatusFilter = 'PENDIENTE' | 'ACEPTADA' | 'ANULADA' | 'VENCIDA';

export interface FindQuotationsOptions {
  /** Restricts the listing to one user's own quotations (a USER role never sees anyone else's, same rule as Sales/Purchases/Tickets). */
  userId?: string;
  status?: QuotationStatusFilter;
  /** `startDate`/`endDate` are `yyyy-MM-dd` — compared against `createdAt`, inclusive on both ends. */
  startDate?: string;
  endDate?: string;
  /** Matches against the client's name OR the quotation's own `quotationNumber`, case-insensitive. */
  search?: string;
  page: number;
  limit: number;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}

export interface QuotationRepository {
  /** Invokes the `create_quotation` Postgres function — the quotation and its details are inserted atomically inside it. Never touches inventory. */
  createQuotation(data: CreateQuotationData): Promise<Quotation>;
  findAll(options: FindQuotationsOptions): Promise<PaginatedResult<Quotation>>;
  /** Always includes `items` — unlike `findAll`, which never loads them (list rows use a lighter summary shape). */
  findById(id: string): Promise<Quotation | null>;
  /** Plain conditional `UPDATE` (`status = 'ANULADA'` + void columns) — no stored function needed, same "don't build a procedure where a plain statement is already correct" call as `TypeOrmBankDepositRepository.voidOperation`/`TypeOrmTicketRepository.voidTicket`. The caller (`VoidQuotationUseCase`) has already checked the quotation exists and isn't already voided. */
  voidQuotation(id: string, voidedBy: string, reason: string): Promise<Quotation>;
}
