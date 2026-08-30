import { IceCreamSale } from '../../domain/entities/ice-cream-sale.entity';

export interface IceCreamSaleItemOutput {
  id: string;
  iceCreamId: string;
  product: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

/** Full shape — used for `GET /ice-cream-sales/:id` and the response of `POST /ice-cream-sales`. */
export interface IceCreamSaleOutput {
  id: string;
  userId: string;
  username: string;
  saleDate: Date;
  total: number;
  items: IceCreamSaleItemOutput[];
  createdAt: Date;
  updatedAt: Date;
}

/** Lighter shape for `GET /ice-cream-sales` — no line items, so listing sales never needs to load them. */
export interface IceCreamSaleSummaryOutput {
  id: string;
  userId: string;
  username: string;
  saleDate: Date;
  total: number;
  createdAt: Date;
}

export function toIceCreamSaleOutput(sale: IceCreamSale): IceCreamSaleOutput {
  return {
    id: sale.id,
    userId: sale.userId,
    username: sale.username,
    saleDate: sale.saleDate,
    total: sale.total,
    items: sale.items.map((item) => ({
      id: item.id,
      iceCreamId: item.iceCreamId,
      product: item.product,
      sku: item.sku,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      total: item.total,
    })),
    createdAt: sale.createdAt,
    updatedAt: sale.updatedAt,
  };
}

export function toIceCreamSaleSummaryOutput(
  sale: IceCreamSale,
): IceCreamSaleSummaryOutput {
  return {
    id: sale.id,
    userId: sale.userId,
    username: sale.username,
    saleDate: sale.saleDate,
    total: sale.total,
    createdAt: sale.createdAt,
  };
}
