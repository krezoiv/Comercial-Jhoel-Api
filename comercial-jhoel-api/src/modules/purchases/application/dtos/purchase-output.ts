import { Purchase } from '../../domain/entities/purchase.entity';

export interface PurchaseItemOutput {
  id: string;
  productId: string;
  productName: string;
  sku: string | null;
  quantity: number;
  costPrice: number;
  publicPrice: number;
  total: number;
}

/** Full shape — used for `GET /purchases/:id` and the response of `POST /purchases`. */
export interface PurchaseOutput {
  id: string;
  supplierId: string;
  supplierName: string;
  userId: string;
  username: string;
  purchaseDate: Date;
  total: number;
  items: PurchaseItemOutput[];
  createdAt: Date;
  updatedAt: Date;
  paymentType: 'CONTADO' | 'CREDITO';
  paymentDueDate: string | null;
  paymentStatus: 'PENDING' | 'PAID';
  paidAt: Date | null;
  paidBy: string | null;
  paidByUsername: string | null;
}

/** Lighter shape for `GET /purchases` — no line items, so listing purchases never needs to load them. */
export interface PurchaseSummaryOutput {
  id: string;
  supplierId: string;
  supplierName: string;
  userId: string;
  username: string;
  purchaseDate: Date;
  total: number;
  createdAt: Date;
  paymentType: 'CONTADO' | 'CREDITO';
  paymentDueDate: string | null;
  paymentStatus: 'PENDING' | 'PAID';
}

export function toPurchaseOutput(purchase: Purchase): PurchaseOutput {
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
      productId: item.productId,
      productName: item.productName,
      sku: item.sku,
      quantity: item.quantity,
      costPrice: item.costPrice,
      publicPrice: item.publicPrice,
      total: item.total,
    })),
    createdAt: purchase.createdAt,
    updatedAt: purchase.updatedAt,
    paymentType: purchase.paymentType,
    paymentDueDate: purchase.paymentDueDate,
    paymentStatus: purchase.paymentStatus,
    paidAt: purchase.paidAt,
    paidBy: purchase.paidBy,
    paidByUsername: purchase.paidByUsername,
  };
}

export function toPurchaseSummaryOutput(
  purchase: Purchase,
): PurchaseSummaryOutput {
  return {
    id: purchase.id,
    supplierId: purchase.supplierId,
    supplierName: purchase.supplierName,
    userId: purchase.userId,
    username: purchase.username,
    purchaseDate: purchase.purchaseDate,
    total: purchase.total,
    createdAt: purchase.createdAt,
    paymentType: purchase.paymentType,
    paymentDueDate: purchase.paymentDueDate,
    paymentStatus: purchase.paymentStatus,
  };
}
