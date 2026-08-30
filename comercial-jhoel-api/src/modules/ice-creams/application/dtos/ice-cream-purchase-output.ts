import { IceCreamPurchase } from '../../domain/entities/ice-cream-purchase.entity';

export interface IceCreamPurchaseItemOutput {
  id: string;
  iceCreamId: string;
  product: string;
  sku: string;
  quantity: number;
  costPrice: number;
  total: number;
}

/** Full shape — used for `GET /ice-cream-purchases/:id` and the response of `POST /ice-cream-purchases`. */
export interface IceCreamPurchaseOutput {
  id: string;
  supplierId: string;
  supplierName: string;
  userId: string;
  username: string;
  purchaseDate: Date;
  total: number;
  items: IceCreamPurchaseItemOutput[];
  createdAt: Date;
  updatedAt: Date;
}

/** Lighter shape for `GET /ice-cream-purchases` — no line items, so listing purchases never needs to load them. */
export interface IceCreamPurchaseSummaryOutput {
  id: string;
  supplierId: string;
  supplierName: string;
  userId: string;
  username: string;
  purchaseDate: Date;
  total: number;
  createdAt: Date;
}

export function toIceCreamPurchaseOutput(
  purchase: IceCreamPurchase,
): IceCreamPurchaseOutput {
  return {
    id: purchase.id,
    supplierId: purchase.supplierId,
    supplierName: purchase.supplierName,
    userId: purchase.userId,
    username: purchase.username,
    purchaseDate: purchase.purchaseDate,
    total: purchase.total,
    items: purchase.items.map((item) => ({
      id: item.id,
      iceCreamId: item.iceCreamId,
      product: item.product,
      sku: item.sku,
      quantity: item.quantity,
      costPrice: item.costPrice,
      total: item.total,
    })),
    createdAt: purchase.createdAt,
    updatedAt: purchase.updatedAt,
  };
}

export function toIceCreamPurchaseSummaryOutput(
  purchase: IceCreamPurchase,
): IceCreamPurchaseSummaryOutput {
  return {
    id: purchase.id,
    supplierId: purchase.supplierId,
    supplierName: purchase.supplierName,
    userId: purchase.userId,
    username: purchase.username,
    purchaseDate: purchase.purchaseDate,
    total: purchase.total,
    createdAt: purchase.createdAt,
  };
}
