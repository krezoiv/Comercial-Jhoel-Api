import { Quotation } from '../../domain/entities/quotation.entity';
import { todayIsoDate } from '../utils/today-iso-date';

export type QuotationDisplayStatus = 'PENDIENTE' | 'ACEPTADA' | 'ANULADA' | 'VENCIDA';

export interface QuotationItemOutput {
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

/** Full shape — used for `GET /quotations/:id`, the response of `POST /quotations`, and `POST /quotations/:id/void`. */
export interface QuotationOutput {
  id: string;
  quotationNumber: string;
  clientId: string;
  clientName: string;
  userId: string;
  username: string;
  quotationDate: Date;
  expirationDate: string;
  subtotal: number;
  discount: number;
  total: number;
  observations: string | null;
  commercialTerms: string | null;
  status: QuotationDisplayStatus;
  voidedAt: Date | null;
  voidedBy: string | null;
  voidedByUsername: string | null;
  voidReason: string | null;
  convertedToSaleId: string | null;
  items: QuotationItemOutput[];
  createdAt: Date;
  updatedAt: Date;
}

/** Lighter shape for `GET /quotations` — no line items, so listing quotations never needs to load them. */
export interface QuotationSummaryOutput {
  id: string;
  quotationNumber: string;
  clientId: string;
  clientName: string;
  userId: string;
  username: string;
  expirationDate: string;
  total: number;
  status: QuotationDisplayStatus;
  createdAt: Date;
}

/**
 * `'VENCIDA'` is never stored — a `'PENDIENTE'` row whose `expirationDate`
 * has already passed displays as `'VENCIDA'` here, same "derive, don't
 * store, an overdue/expired state" precedent this codebase already
 * established for `purchases.paymentStatus`. `'ACEPTADA'`/`'ANULADA'` are
 * terminal and never get overridden, even past their expiration date.
 */
function deriveDisplayStatus(
  status: Quotation['status'],
  expirationDate: string,
): QuotationDisplayStatus {
  if (status === 'PENDIENTE' && expirationDate < todayIsoDate()) {
    return 'VENCIDA';
  }
  return status;
}

export function toQuotationOutput(quotation: Quotation): QuotationOutput {
  return {
    id: quotation.id,
    quotationNumber: quotation.quotationNumber,
    clientId: quotation.clientId,
    clientName: quotation.clientName,
    userId: quotation.userId,
    username: quotation.username,
    quotationDate: quotation.quotationDate,
    expirationDate: quotation.expirationDate,
    subtotal: quotation.subtotal,
    discount: quotation.discount,
    total: quotation.total,
    observations: quotation.observations,
    commercialTerms: quotation.commercialTerms,
    status: deriveDisplayStatus(quotation.status, quotation.expirationDate),
    voidedAt: quotation.voidedAt,
    voidedBy: quotation.voidedBy,
    voidedByUsername: quotation.voidedByUsername,
    voidReason: quotation.voidReason,
    convertedToSaleId: quotation.convertedToSaleId,
    items: quotation.items.map((item) => ({
      id: item.id,
      productId: item.productId,
      productName: item.productName,
      presentationName: item.presentationName,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      discount: item.discount,
      subtotal: item.subtotal,
      total: item.total,
    })),
    createdAt: quotation.createdAt,
    updatedAt: quotation.updatedAt,
  };
}

export function toQuotationSummaryOutput(
  quotation: Quotation,
): QuotationSummaryOutput {
  return {
    id: quotation.id,
    quotationNumber: quotation.quotationNumber,
    clientId: quotation.clientId,
    clientName: quotation.clientName,
    userId: quotation.userId,
    username: quotation.username,
    expirationDate: quotation.expirationDate,
    total: quotation.total,
    status: deriveDisplayStatus(quotation.status, quotation.expirationDate),
    createdAt: quotation.createdAt,
  };
}
