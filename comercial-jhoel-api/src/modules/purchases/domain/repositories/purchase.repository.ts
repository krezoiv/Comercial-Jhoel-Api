import { Purchase } from '../entities/purchase.entity';

export const PURCHASE_REPOSITORY = Symbol('PURCHASE_REPOSITORY');

export interface PurchaseItemData {
  productId: string;
  /** Omit to resolve the product's base "Unidad" presentation server-side. */
  presentationId?: string;
  quantity: number;
  costPrice: number;
  publicPrice: number;
}

export interface ConfirmPurchaseData {
  supplierId: string;
  userId: string;
  purchaseDate: Date;
  items: PurchaseItemData[];
  paymentType: 'CONTADO' | 'CREDITO';
  /** `yyyy-MM-dd` — required when `paymentType` is `'CREDITO'`, always omitted for `'CONTADO'`. */
  paymentDueDate?: string;
  /** Free-text folio from the supplier's own invoice — optional, never enforced as unique. */
  invoiceNumber?: string;
}

export type PurchaseSortField = 'purchaseDate' | 'total' | 'createdAt';
export type SortDirection = 'asc' | 'desc';
export type PurchaseStatusFilter = 'ACTIVE' | 'VOIDED';

export interface FindPurchasesOptions {
  /** Restricts the listing to one user's own purchases (a USER role never sees anyone else's, same rule as Sales). */
  userId?: string;
  supplierId?: string;
  /** `startDate`/`endDate` are `yyyy-MM-dd` — compared against `purchaseDate`, inclusive on both ends. */
  startDate?: string;
  endDate?: string;
  /** Matches against the supplier's name OR the purchase's own `invoiceNumber`, case-insensitive. */
  search?: string;
  /** Omit to see both active and voided purchases — used by the "Administrar Facturas de Compras" listing, which must always show anuladas too, just clearly flagged. */
  status?: PurchaseStatusFilter;
  sortBy: PurchaseSortField;
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

export interface PurchaseRepository {
  /** Invokes the `confirm_purchase` Postgres function — the purchase, its details, the stock increase, and the product price update all happen atomically inside it. */
  confirmPurchase(data: ConfirmPurchaseData): Promise<Purchase>;
  findAll(options: FindPurchasesOptions): Promise<PaginatedResult<Purchase>>;
  /** Always includes `items` — unlike `findAll`, which never loads them (list rows use a lighter summary shape). */
  findById(id: string): Promise<Purchase | null>;
  /** Plain conditional `UPDATE` — no stored function needed, same "don't build a procedure where a plain statement is already correct and simpler" call already made for `TypeOrmBankDepositRepository.voidOperation`. The caller (`MarkPurchaseAsPaidUseCase`) has already checked the purchase exists and isn't already paid. */
  markAsPaid(id: string, paidBy: string): Promise<Purchase>;
  /** Every still-unpaid credit purchase, regardless of due date (próxima/vence-hoy/vencida is decided by the caller — the Alerts module — comparing `paymentDueDate` against today) — bounded by construction (only `CREDITO` + `PENDING` rows, never the full purchase history). `userId` scopes to one account's own purchases (a `USER` role never sees another account's pending payments, same ownership rule `findAll`/`findById` already enforce); omit for an admin caller, who sees every pending credit purchase. */
  findPendingCreditPurchases(options?: {
    userId?: string;
  }): Promise<Purchase[]>;
  /** Invokes the `void_purchase` Postgres function — reverses the exact inventory effect the original purchase applied and marks it `ANULADA`, atomically. Never a physical delete/edit. */
  voidPurchase(id: string, voidedBy: string, reason: string): Promise<Purchase>;
}
