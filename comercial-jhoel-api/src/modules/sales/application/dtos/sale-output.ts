import {
  PriceListType,
  Sale,
  SaleStatus,
} from '../../domain/entities/sale.entity';

export interface SaleItemOutput {
  id: string;
  productId: string;
  productName: string;
  sku: string | null;
  quantity: number;
  unitPrice: number;
  total: number;
  presentationName: string;
}

/** Full shape — used for `GET /sales/:id` and the response of `POST /sales`. */
export interface SaleOutput {
  id: string;
  userId: string;
  username: string;
  saleDate: Date;
  total: number;
  status: SaleStatus;
  clientId: string | null;
  clientName: string | null;
  priceList: PriceListType;
  /** `null` for a `CONFIRMED` sale — only an `OPEN` receipt has a draft tab to identify. */
  draftKey: string | null;
  items: SaleItemOutput[];
  createdAt: Date;
  updatedAt: Date;
  invoiceNumber: string | null;
  isVoided: boolean;
  voidedAt: Date | null;
  voidedByUsername: string | null;
  voidReason: string | null;
}

/** Lighter shape for `GET /sales` — no line items, so listing sales never needs to load them. */
export interface SaleSummaryOutput {
  id: string;
  userId: string;
  username: string;
  saleDate: Date;
  total: number;
  clientId: string | null;
  clientName: string | null;
  priceList: PriceListType;
  createdAt: Date;
  invoiceNumber: string | null;
  isVoided: boolean;
  voidedAt: Date | null;
  voidedByUsername: string | null;
  voidReason: string | null;
}

export function toSaleOutput(sale: Sale): SaleOutput {
  return {
    id: sale.id,
    userId: sale.userId,
    username: sale.username,
    saleDate: sale.saleDate,
    total: sale.total,
    status: sale.status,
    clientId: sale.clientId,
    clientName: sale.clientName,
    priceList: sale.priceList,
    draftKey: sale.draftKey,
    items: sale.items.map((item) => ({
      id: item.id,
      productId: item.productId,
      productName: item.productName,
      sku: item.sku,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      total: item.total,
      presentationName: item.presentationName,
    })),
    createdAt: sale.createdAt,
    updatedAt: sale.updatedAt,
    invoiceNumber: sale.invoiceNumber,
    isVoided: sale.isVoided,
    voidedAt: sale.voidedAt,
    voidedByUsername: sale.voidedByUsername,
    voidReason: sale.voidReason,
  };
}

export function toSaleSummaryOutput(sale: Sale): SaleSummaryOutput {
  return {
    id: sale.id,
    userId: sale.userId,
    username: sale.username,
    saleDate: sale.saleDate,
    total: sale.total,
    clientId: sale.clientId,
    clientName: sale.clientName,
    priceList: sale.priceList,
    createdAt: sale.createdAt,
    invoiceNumber: sale.invoiceNumber,
    isVoided: sale.isVoided,
    voidedAt: sale.voidedAt,
    voidedByUsername: sale.voidedByUsername,
    voidReason: sale.voidReason,
  };
}
