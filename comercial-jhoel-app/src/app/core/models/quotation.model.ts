/**
 * Commercial life cycle (migration 1760008200000). VENCIDA is derived by the
 * backend for a COTIZADA past its expiration date. Saving a quotation never
 * touches inventory; only "Confirmar venta" creates a real sale (VENDIDA).
 */
export type QuotationStatus = 'BORRADOR' | 'COTIZADA' | 'ACEPTADA' | 'VENDIDA' | 'RECHAZADA' | 'CANCELADA' | 'VENCIDA';

/** Actions any operator may run on their quotations (CANCELAR = "Anular", admin only, has its own route). */
export type QuotationStatusAction = 'CONFIRMAR' | 'ACEPTAR' | 'RECHAZAR';

/** "Confirmar venta" summary line with the current Vitrina stock. */
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

export interface QuotationSalePreview {
  quotation: Quotation;
  lines: QuotationSalePreviewLine[];
  canConfirm: boolean;
}

export interface QuotationItem {
  id: string;
  productId: string;
  productName: string;
  presentationName: string | null;
  quantity: number;
  unitPrice: number;
  discount: number;
  subtotal: number;
  total: number;
}

/**
 * A Cotización is explicitly NOT a sale — it never affects inventory,
 * reports, or the dashboard. See the backend's own `create_quotation`
 * function for the structural guarantee. Every line's price/discount is
 * historicized at creation time — a later change to the product's real price
 * never rewrites an existing quotation, verified end-to-end on the backend.
 * `convertedToSaleId` is a forward-compat hook for a future, explicit
 * "Convertir en Venta" action — always `null` today, nothing in this app
 * ever sets it.
 */
export interface Quotation {
  id: string;
  quotationNumber: string;
  /** Registered client (older quotations); null when the customer was typed in. */
  clientId: string | null;
  clientName: string;
  customerPhone: string | null;
  studentName: string | null;
  grade: string | null;
  userId: string;
  username: string;
  quotationDate: string;
  /** `yyyy-MM-dd` — a calendar date, not a timestamp. */
  expirationDate: string;
  subtotal: number;
  discount: number;
  total: number;
  observations: string | null;
  commercialTerms: string | null;
  status: QuotationStatus;
  voidedAt: string | null;
  voidedBy: string | null;
  voidedByUsername: string | null;
  voidReason: string | null;
  convertedToSaleId: string | null;
  acceptedAt: string | null;
  rejectedAt: string | null;
  rejectReason: string | null;
  soldAt: string | null;
  soldByUsername: string | null;
  items: QuotationItem[];
  createdAt: string;
  updatedAt: string;
}

/** `GET /quotations` list rows — no line items, mirrors `TicketSummary`'s own shape. */
export interface QuotationSummary {
  id: string;
  quotationNumber: string;
  clientId: string | null;
  clientName: string;
  customerPhone: string | null;
  studentName: string | null;
  grade: string | null;
  userId: string;
  username: string;
  expirationDate: string;
  total: number;
  status: QuotationStatus;
  createdAt: string;
}

export interface CreateQuotationItemInput {
  productId: string;
  quantity: number;
  discount?: number;
}

/** The customer is typed in by hand; no `clients` row is created. */
export interface CreateQuotationInput {
  customerName: string;
  customerPhone: string;
  studentName?: string;
  grade?: string;
  asDraft?: boolean;
  expirationDate: string;
  observations?: string;
  commercialTerms?: string;
  items: CreateQuotationItemInput[];
}

export interface ListQuotationsQuery {
  status?: QuotationStatus;
  startDate?: string;
  endDate?: string;
  /** Matches against client name OR quotationNumber. */
  search?: string;
  page?: number;
  limit?: number;
}

/**
 * A cart line while a quotation is still being built on-screen — never sent
 * to the backend as-is, only `{productId, quantity, discount}` is. Unlike
 * `TicketDraftItem`, this carries a per-line `discount` the user can edit
 * before saving.
 */
export interface QuotationDraftItem {
  productId: string;
  name: string;
  sku: string | null;
  unitPrice: number;
  quantity: number;
  discount: number;
}

/** Mirrors `create_quotation()`'s own math exactly, so the live cart preview always matches what gets saved. */
export function calculateQuotationDraftItemSubtotal(item: QuotationDraftItem): number {
  return item.unitPrice * item.quantity;
}

export function calculateQuotationDraftItemTotal(item: QuotationDraftItem): number {
  return calculateQuotationDraftItemSubtotal(item) - item.discount;
}

export function calculateQuotationDraftSubtotal(items: QuotationDraftItem[]): number {
  return items.reduce((sum, item) => sum + calculateQuotationDraftItemSubtotal(item), 0);
}

export function calculateQuotationDraftDiscount(items: QuotationDraftItem[]): number {
  return items.reduce((sum, item) => sum + item.discount, 0);
}

export function calculateQuotationDraftTotal(items: QuotationDraftItem[]): number {
  return calculateQuotationDraftSubtotal(items) - calculateQuotationDraftDiscount(items);
}

export const QUOTATION_STATUS_TONE: Record<
  QuotationStatus,
  'brand' | 'gold' | 'success' | 'danger' | 'neutral-dark' | 'neutral-light'
> = {
  BORRADOR: 'neutral-light',
  COTIZADA: 'gold',
  ACEPTADA: 'brand',
  VENDIDA: 'success',
  RECHAZADA: 'danger',
  CANCELADA: 'neutral-dark',
  VENCIDA: 'danger',
};

/** A quotation that can still become a sale. */
export function isQuotationSellable(status: QuotationStatus): boolean {
  return status === 'COTIZADA' || status === 'ACEPTADA';
}

export const QUOTATION_STATUS_LABEL: Record<QuotationStatus, string> = {
  BORRADOR: 'Borrador',
  COTIZADA: 'Cotizada',
  ACEPTADA: 'Aceptada',
  VENDIDA: 'Vendida',
  RECHAZADA: 'Rechazada',
  CANCELADA: 'Cancelada',
  VENCIDA: 'Vencida',
};

export const QUOTATION_STATUSES = Object.keys(QUOTATION_STATUS_LABEL) as QuotationStatus[];
