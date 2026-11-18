import { Quotation } from '../entities/quotation.entity';

export const QUOTATION_REPOSITORY = Symbol('QUOTATION_REPOSITORY');

export interface CreateQuotationItemData {
  productId: string;
  quantity: number;
  discount: number;
}

/** Customer typed in on the quotation (no `clients` row is created). */
export interface QuotationCustomerData {
  name: string;
  phone: string;
  studentName: string | null;
  grade: string | null;
}

export interface CreateQuotationData {
  userId: string;
  /** Legacy: a registered client. New quotations send the typed-in `customer`. */
  clientId: string | null;
  customer: QuotationCustomerData | null;
  asDraft: boolean;
  expirationDate: string;
  observations: string | null;
  commercialTerms: string | null;
  items: CreateQuotationItemData[];
}

/** A filter value of `'VENCIDA'` is never a stored status — it resolves to `status = 'PENDIENTE' AND expiration_date < today`, the same derivation `toQuotationOutput` applies per-row. Filtering by `'PENDIENTE'` conversely excludes rows that have since expired (those are `'VENCIDA'` now, not `'PENDIENTE'`). */
export type QuotationStatusFilter =
  | 'BORRADOR'
  | 'COTIZADA'
  | 'ACEPTADA'
  | 'VENDIDA'
  | 'RECHAZADA'
  | 'CANCELADA'
  | 'VENCIDA';

/** Commercial actions (`change_quotation_status`). */
export type QuotationStatusAction =
  'CONFIRMAR' | 'ACEPTAR' | 'RECHAZAR' | 'CANCELAR';

/** One line of the "Confirmar venta" summary with the current Vitrina stock. */
export interface QuotationSalePreviewLine {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  total: number;
  available: number;
  isActive: boolean;
  sufficient: boolean;
}

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
  /** Commercial status change under a row lock (SQL `change_quotation_status`). */
  changeStatus(
    id: string,
    action: QuotationStatusAction,
    userId: string,
    reason: string | null,
  ): Promise<Quotation>;
  /** "Confirmar venta": creates the sale once (SQL `convert_quotation_to_sale`); returns the sale id. */
  convertToSale(id: string, userId: string): Promise<string>;
  salePreview(id: string): Promise<QuotationSalePreviewLine[]>;
}
