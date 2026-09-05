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
    })),
    createdAt: sale.createdAt,
    updatedAt: sale.updatedAt,
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
  };
}
